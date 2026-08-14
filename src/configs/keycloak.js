import { useState, useEffect, useCallback, useContext, createContext } from 'react';
import { AuthProvider } from 'react-oidc-context';
import { UserManager, WebStorageStateStore } from 'oidc-client-ts';
import { useNavigate } from 'react-router-dom';
import axiosInstance from './axiosInstance';
import { ROUTES } from '../constants/routes';

const applicationBasePath = process.env.PUBLIC_URL || '';
const redirectUri = `${window.location.origin}${applicationBasePath}`;

// Context để share userManager ra ngoài KeycloakProvider
const OidcUserManagerContext = createContext(null);

/**
 * Hook lấy userManager instance — dùng trong useSessionTimeout để refresh token thủ công.
 */
export function useOidcUserManager() {
    return useContext(OidcUserManagerContext);
}

export const KeycloakProvider = ({ children }) => {
    const [userManager, setUserManager] = useState(null);
    const navigate = useNavigate();

    const onSigninCallback = useCallback(() => {
        window.history.replaceState({}, document.title, window.location.pathname);
        navigate(ROUTES.DASHBOARD, { replace: true });
    }, [navigate]);

    useEffect(() => {
        let isMounted = true;
        let manager = null;

        const init = async () => {
            try {
                // 1. Lấy config từ backend
                const { data } = await axiosInstance.get('/api/biosense/v1/configs-login');
                if (!isMounted) return;

                const config = typeof data === 'string' ? JSON.parse(data) : data;

                // 2. Lấy OIDC metadata từ Keycloak (nguồn thật)
                const metaRes = await fetch(
                    `${config.authority}/.well-known/openid-configuration`
                );
                const metadata = await metaRes.json();
                if (!isMounted) return;

                // 3. Lấy scope thực tế từ scopes_supported của Keycloak
                const supportedScopes = metadata.scopes_supported || [];
                const desiredScopes = ['openid', 'profile', 'email'];
                const scopeToUse = desiredScopes
                    .filter(s => supportedScopes.includes(s))
                    .join(' ');

                console.log('[Keycloak] Scopes supported:', supportedScopes);
                console.log('[Keycloak] Scopes to use:', scopeToUse);

                // 4. Override token_endpoint về backend proxy
                // Backend inject client_secret rồi forward sang Keycloak thật
                const tokenEndpoint = new URL(
                    `${applicationBasePath}/api/biosense/v1/sso-login`,
                    window.location.origin,
                ).toString();

                // 5. Khởi tạo UserManager
                manager = new UserManager({
                    authority: config.authority,
                    client_id: config.client_id,
                    redirect_uri: redirectUri,
                    post_logout_redirect_uri: `${redirectUri}/login`,
                    scope: scopeToUse,
                    automaticSilentRenew: false,
                    silentRequestTimeoutInSeconds: 10,
                    includeIdTokenInSilentRenew: true,
                    userStore: new WebStorageStateStore({ store: window.localStorage }),
                    metadata: {
                        ...metadata,
                        token_endpoint: tokenEndpoint,
                    },
                });

                manager.events.addSilentRenewError((err) => {
                    console.warn('[OIDC] Silent renew error:', err);
                });

                if (isMounted) {
                    setUserManager(manager);
                }
            } catch (err) {
                if (!isMounted) return;
                console.error(
                    '[Keycloak] Init error:',
                    err,
                    '\nEnsure the Spring backend is running at',
                    axiosInstance.defaults.baseURL,
                );
            }
        };

        init();

        return () => {
            isMounted = false;
            if (manager) {
                manager.events.removeSilentRenewError();
            }
        };
    }, []);

    if (!userManager) return <div>Đang khởi tạo...</div>;

    return (
        <OidcUserManagerContext.Provider value={userManager}>
            <AuthProvider
                userManager={userManager}
                onSigninCallback={onSigninCallback}
            >
                {children}
            </AuthProvider>
        </OidcUserManagerContext.Provider>
    );
};