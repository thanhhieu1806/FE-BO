import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import { useOidcUserManager } from '../configs/keycloak';
import { performLogout } from '../utils/logout';
import { decodeJwt, getRefreshTokenSessionInfo } from '../utils/jwt';

const WARNING_BEFORE_MS = 5 * 60 * 1000;

/**
 * Đọc thời điểm hết hạn phiên từ refresh_token JWT (trường exp).
 * refresh_token quyết định thời gian sống của phiên đăng nhập OIDC.
 */
function readSessionExpMs(user) {
    const sessionInfo = getRefreshTokenSessionInfo(user);
    if (sessionInfo?.expMs) return sessionInfo.expMs;

    // Fallback khi refresh_token không phải JWT (hiếm gặp với Keycloak)
    if (!user) return null;
    const accessPayload = decodeJwt(user.access_token);
    if (accessPayload?.exp) return accessPayload.exp * 1000;
    return user.expires_at ? user.expires_at * 1000 : null;
}

async function notifyUserLoaded(userManager, updatedUser) {
    await userManager.storeUser(updatedUser);
    if (typeof userManager.events.load === 'function') {
        await userManager.events.load(updatedUser);
    } else {
        await userManager.events._userLoaded.raise(updatedUser);
    }
}

/**
 * Gia hạn phiên đăng nhập OIDC bằng signinSilent() của oidc-client-ts
 * hoặc fallback qua endpoint /api/biosense/v1/sso-login với grant_type=refresh_token.
 */
async function manualRefreshToken(userManager) {
    const user = await userManager.getUser();
    if (!user) throw new Error('Không có user trong oidc store');

    console.log('[SessionTimeout] Bắt đầu refresh token phiên OIDC...');

    // 1. Thử refresh bằng signinSilent() chuẩn của oidc-client-ts
    try {
        const updatedUser = await userManager.signinSilent();
        if (updatedUser) {
            console.log('[SessionTimeout] Refresh thành công qua signinSilent!');
            return updatedUser;
        }
    } catch (silentErr) {
        console.warn('[SessionTimeout] signinSilent không thành công, chuyển sang fallback endpoint:', silentErr);
    }

    // 2. Fallback: Gọi trực tiếp endpoint /api/biosense/v1/sso-login (nhận refresh_token)
    const refreshTokenToUse = user.refresh_token;
    if (!refreshTokenToUse) {
        throw new Error('Không tìm thấy refresh_token trong session');
    }

    const applicationBasePath = process.env.PUBLIC_URL || '';
    const ssoEndpoint = `${window.location.origin}${applicationBasePath}/api/biosense/v1/sso-login`;

    console.log('[SessionTimeout] Gọi sso-login refresh endpoint:', ssoEndpoint);

    const formData = new URLSearchParams();
    formData.append('grant_type', 'refresh_token');
    formData.append('refresh_token', refreshTokenToUse);
    formData.append('client_id', userManager.settings.client_id || 'backoffice-client');

    const response = await fetch(ssoEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Refresh sso-login thất bại [${response.status}]: ${text}`);
    }

    const tokenData = await response.json();
    const expiresIn = tokenData.expires_in || 300;
    const newExpiresAt = Math.floor(Date.now() / 1000) + expiresIn;

    const { User } = await import('oidc-client-ts');
    const updatedUser = new User({
        ...user,
        access_token: tokenData.access_token || user.access_token,
        refresh_token: tokenData.refresh_token || user.refresh_token,
        id_token: tokenData.id_token || user.id_token,
        token_type: tokenData.token_type || user.token_type,
        scope: tokenData.scope || user.scope,
        expires_in: expiresIn,
        expires_at: newExpiresAt,
        profile: user.profile,
        session_state: tokenData.session_state || user.session_state,
    });

    await notifyUserLoaded(userManager, updatedUser);
    console.log('[SessionTimeout] Fallback refresh token thành công — expires_at:', new Date(newExpiresAt * 1000).toLocaleTimeString('vi-VN'));
    return updatedUser;
}

export function useSessionTimeout() {
    const auth = useAuth();
    const userManager = useOidcUserManager();

    const [showWarning, setShowWarning] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(0);

    const expMsRef = useRef(null);
    const warningTimerRef = useRef(null);
    const expiredTimerRef = useRef(null);
    const countdownRef = useRef(null);
    const isRefreshingRef = useRef(false);
    const showWarningRef = useRef(false);
    const visDebounceRef = useRef(null);
    const authRef = useRef(auth);
    const userManagerRef = useRef(userManager);

    useEffect(() => { authRef.current = auth; }, [auth]);
    useEffect(() => { userManagerRef.current = userManager; }, [userManager]);
    useEffect(() => { showWarningRef.current = showWarning; }, [showWarning]);

    const clearAllTimers = useCallback(() => {
        clearTimeout(warningTimerRef.current);
        clearTimeout(expiredTimerRef.current);
        clearInterval(countdownRef.current);
        clearTimeout(visDebounceRef.current);
        warningTimerRef.current = null;
        expiredTimerRef.current = null;
        countdownRef.current = null;
        visDebounceRef.current = null;
    }, []);

    const forceLogout = useCallback(async () => {
        clearAllTimers();
        isRefreshingRef.current = false;
        showWarningRef.current = false;
        expMsRef.current = null;
        setShowWarning(false);
        setSecondsLeft(0);
        await performLogout(authRef.current);
    }, [clearAllTimers]);

    const startCountdown = useCallback((expMs) => {
        clearInterval(countdownRef.current);
        const update = () => {
            const remaining = Math.max(0, Math.floor((expMs - Date.now()) / 1000));
            setSecondsLeft(remaining);
        };
        update();
        countdownRef.current = setInterval(update, 1000);
    }, []);

    const scheduleTimers = useCallback((expMs) => {
        clearAllTimers();

        const now = Date.now();
        const msToWarn = expMs - WARNING_BEFORE_MS - now;
        const msToExp = expMs - now;

        if (msToExp <= 0) {
            console.warn('[SessionTimeout] refresh_token đã hết hạn → đăng xuất ngay');
            forceLogout();
            return;
        }

        if (msToWarn <= 0) {
            console.log('[SessionTimeout] Còn ≤ 5 phút → hiện modal');
            setShowWarning(true);
            showWarningRef.current = true;
            startCountdown(expMs);
            expiredTimerRef.current = setTimeout(() => {
                console.warn('[SessionTimeout] Hết hạn phiên → đăng xuất');
                forceLogout();
            }, msToExp);
            return;
        }

        console.log(
            `[SessionTimeout] Lên lịch — hiện modal sau ${Math.round(msToWarn / 1000)}s, ` +
            `logout sau ${Math.round(msToExp / 1000)}s (exp refresh_token)`
        );

        warningTimerRef.current = setTimeout(() => {
            console.log('[SessionTimeout] Còn 5 phút → hiện modal');
            setShowWarning(true);
            showWarningRef.current = true;
            startCountdown(expMs);
        }, msToWarn);

        expiredTimerRef.current = setTimeout(() => {
            console.warn('[SessionTimeout] Hết hạn phiên → đăng xuất');
            forceLogout();
        }, msToExp);

    }, [clearAllTimers, forceLogout, startCountdown]);

    const continueSession = useCallback(async () => {
        if (isRefreshingRef.current) return;
        isRefreshingRef.current = true;
        const currentExpMs = expMsRef.current;

        clearAllTimers();
        setShowWarning(false);
        showWarningRef.current = false;
        setSecondsLeft(0);

        try {
            console.log('[SessionTimeout] Bắt đầu refresh token...');

            const manager = userManagerRef.current;
            let updatedUser;

            if (manager) {
                updatedUser = await manualRefreshToken(manager);
            } else {
                throw new Error('UserManager chưa sẵn sàng');
            }

            isRefreshingRef.current = false;

            // Sau khi refresh thành công, tính lại expMs từ refresh_token mới
            // hoặc từ expires_at đã cập nhật trong updatedUser
            const newExpMs = readSessionExpMs(updatedUser)
                ?? (updatedUser.expires_at ? updatedUser.expires_at * 1000 : null);

            if (newExpMs && newExpMs > Date.now()) {
                expMsRef.current = newExpMs;
                console.log(
                    '[SessionTimeout] Gia hạn thành công — phiên mới hết hạn lúc:',
                    new Date(newExpMs).toLocaleTimeString('vi-VN')
                );
                scheduleTimers(newExpMs);
            } else {
                console.warn('[SessionTimeout] Không tính được expMs mới → đăng xuất');
                await forceLogout();
            }
        } catch (err) {
            console.error('[SessionTimeout] Refresh thất bại:', err?.message || err);
            isRefreshingRef.current = false;

            if (currentExpMs && currentExpMs > Date.now()) {
                expMsRef.current = currentExpMs;
                setShowWarning(true);
                showWarningRef.current = true;
                scheduleTimers(currentExpMs);
                return;
            }

            await forceLogout();
        }
    }, [clearAllTimers, scheduleTimers, forceLogout]);

    useEffect(() => {
        if (!auth.isAuthenticated || !auth.user) {
            clearAllTimers();
            expMsRef.current = null;
            return;
        }

        if (isRefreshingRef.current) return;

        const expMs = readSessionExpMs(auth.user);
        if (expMs) {
            expMsRef.current = expMs;
            const sessionInfo = getRefreshTokenSessionInfo(auth.user);
            console.log(
                '[SessionTimeout] Phiên đăng nhập — hết hạn lúc:',
                sessionInfo?.sessionExpiry?.toLocaleTimeString('vi-VN') ?? new Date(expMs).toLocaleTimeString('vi-VN'),
                '| Còn:', Math.round((expMs - Date.now()) / 1000), 'giây'
            );
            scheduleTimers(expMs);
        } else {
            expMsRef.current = null;
            console.warn('[SessionTimeout] Không đọc được exp từ refresh_token.');
        }

        return () => clearAllTimers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auth.user?.refresh_token, auth.isAuthenticated]);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState !== 'visible') return;

            if (visDebounceRef.current) return;
            visDebounceRef.current = setTimeout(() => {
                visDebounceRef.current = null;
            }, 200);

            const expMs = expMsRef.current;
            if (!expMs || isRefreshingRef.current) return;

            const remainingMs = expMs - Date.now();

            if (remainingMs <= 0) {
                console.warn('[SessionTimeout] Phiên hết hạn khi tab ẩn → đăng xuất');
                forceLogout();
                return;
            }

            console.log('[SessionTimeout] Tab focus lại — còn:', Math.round(remainingMs / 1000), 'giây');

            if (showWarningRef.current) {
                startCountdown(expMs);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            clearTimeout(visDebounceRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { showWarning, secondsLeft, continueSession, forceLogout };
}