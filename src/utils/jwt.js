// ─────────────────────────────────────────────────────────────────────────────
// jwt.js
// Tiện ích decode JWT và tính thông tin session.
//
// NGUYÊN TẮC:
//  - Decode chỉ để ĐỌC thông tin (iat, exp). KHÔNG dùng để xác thực token.
//  - Xác thực token do backend / Keycloak thực hiện.
//  - KHÔNG hard-code thời gian session.
//  - Tất cả thời gian lấy trực tiếp từ payload của JWT.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Decode JWT payload (base64url → JSON object).
 * Trả về null nếu token không phải JWT hoặc không decode được.
 */
export function decodeJwt(token) {
    if (!token || typeof token !== 'string') return null;
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const json = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
                .join('')
        );
        return JSON.parse(json);
    } catch {
        return null;
    }
}

/**
 * Kiểm tra token có hết hạn chưa dựa theo trường exp trong payload.
 * Nếu token là opaque (không phải JWT) → decodeJwt trả null → KHÔNG coi là hết hạn.
 */
export function isTokenExpired(token) {
    const payload = decodeJwt(token);
    if (!payload?.exp) return false;
    return payload.exp <= Math.floor(Date.now() / 1000);
}

/**
 * Lấy thông tin session từ access_token của OIDC user.
 *
 * Đọc iat và exp trực tiếp từ JWT payload.
 * Convert sang milliseconds (iat * 1000, exp * 1000).
 *
 * @param {object} user - OIDC user object (auth.user)
 * @returns {{ iat, exp, iatMs, expMs, durationMs, sessionStart: Date, sessionExpiry: Date } | null}
 */
export function getJwtSessionInfo(user) {
    const token = user?.access_token;
    if (!token) return null;

    const payload = decodeJwt(token);
    if (!payload?.exp || !payload?.iat) return null;

    const iat = payload.iat;
    const exp = payload.exp;
    const iatMs = iat * 1000;
    const expMs = exp * 1000;
    const durationMs = expMs - iatMs;

    return {
        iat,
        exp,
        iatMs,
        expMs,
        durationMs,
        sessionStart: new Date(iatMs),
        sessionExpiry: new Date(expMs),
    };
}

/**
 * Lấy thông tin phiên đăng nhập từ refresh_token (iat, exp).
 * Session timeout dựa trên refresh_token — thời gian sống thực của phiên OIDC.
 */
export function getRefreshTokenSessionInfo(user) {
    const token = user?.refresh_token;
    if (!token) return null;

    const payload = decodeJwt(token);
    if (!payload?.exp || !payload?.iat) return null;

    const iat = payload.iat;
    const exp = payload.exp;
    const iatMs = iat * 1000;
    const expMs = exp * 1000;

    return {
        iat,
        exp,
        iatMs,
        expMs,
        durationMs: expMs - iatMs,
        sessionStart: new Date(iatMs),
        sessionExpiry: new Date(expMs),
    };
}

/**
 * Tính số ms và giây còn lại của session dựa theo expiresAt (exp * 1000) và Date.now().
 *
 *   remainingTimeMs = exp * 1000 - Date.now()
 *
 * @param {object} user - OIDC user object (auth.user)
 * @returns {{ remainingMs, remainingSeconds, expMs, iatMs, durationMs } | null}
 */
export function getSessionRemainingTimeFromJwt(user) {
    const info = getJwtSessionInfo(user);
    if (!info) return null;

    const remainingMs = info.expMs - Date.now();
    const remainingSeconds = Math.max(0, Math.floor(remainingMs / 1000));
    return {
        remainingMs,
        remainingSeconds,
        expMs: info.expMs,
        iatMs: info.iatMs,
        durationMs: info.durationMs,
    };
}

export function formatUnixTimestamp(unixSeconds) {
    if (!unixSeconds) return '—';
    return new Date(unixSeconds * 1000).toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    });
}