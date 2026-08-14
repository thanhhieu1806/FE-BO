import axiosInstance from '../configs/axiosInstance';

const applicationBasePath = process.env.PUBLIC_URL || '';

/**
 * Xóa tất cả cookie mà JS có thể đọc được (không phải HttpOnly).
 * Cookie HttpOnly (accessToken, refreshToken) chỉ backend mới xóa được,
 * hoặc thông qua header Clear-Site-Data từ /api/v1/auth/logout.
 */
const clearReadableCookies = () => {
    const expires = 'expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0';
    const hostname = window.location.hostname;

    document.cookie.split(';').forEach((cookie) => {
        const name = cookie.split('=')[0].trim();
        if (!name) return;

        // Xóa theo mọi path và domain có thể đã set
        document.cookie = `${name}=; ${expires}; path=/`;
        if (applicationBasePath) {
            document.cookie = `${name}=; ${expires}; path=${applicationBasePath}`;
        }
        document.cookie = `${name}=; ${expires}; path=/; domain=${hostname}`;
        document.cookie = `${name}=; ${expires}; path=/; domain=.${hostname}`;
    });
};

/**
 * Xóa toàn bộ dữ liệu phía client (localStorage, sessionStorage, cookie JS-readable, OIDC state).
 * Được gọi SAU KHI backend đã xử lý xong (để id_token còn dùng được trong lúc gọi backend).
 */
const clearClientStorage = async (auth) => {
    // Xóa tất cả OIDC keys trong localStorage
    Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('oidc.') || key.startsWith('oidc_')) {
            localStorage.removeItem(key);
        }
    });

    // Xóa các key khác liên quan đến session
    localStorage.removeItem('saved_accounts');
    localStorage.removeItem('access');
    localStorage.removeItem('type');
    localStorage.removeItem('last_activity_time'); // Dọn key của hook session cũ

    // Xóa sessionStorage
    sessionStorage.clear();

    // FIX: Xóa thêm cookie JS-readable (Keycloak session cookies không phải HttpOnly)
    clearReadableCookies();

    // Xóa OIDC user state trong react-oidc-context (không redirect Keycloak)
    try {
        await auth?.removeUser();
    } catch {
        // bỏ qua nếu lỗi
    }
};

/**
 * Thực hiện đăng xuất triệt để:
 *
 *  Bước 1 — Lấy id_token từ localStorage TRƯỚC KHI xóa bất kỳ thứ gì,
 *            vì backend cần id_token_hint để xác định đúng Keycloak session.
 *
 *  Bước 2 — Gọi POST /api/v1/auth/logout → backend thực hiện:
 *              a. CookieUtils.clearCookies()     → expire HttpOnly cookies (accessToken, refreshToken)
 *              b. keycloakLogoutService(idToken) → gọi Keycloak end_session endpoint,
 *                                                  hủy KEYCLOAK_SESSION, KEYCLOAK_IDENTITY, ...
 *              c. Trả header Clear-Site-Data: "cache","cookies","storage"
 *                 → browser tự xóa TOÀN BỘ cookies (kể cả HttpOnly) + localStorage + cache
 *
 *  Bước 3 — (finally) Dù backend có lỗi hay không, luôn xóa phía client:
 *              a. Xóa OIDC keys, saved_accounts, access, type trong localStorage
 *              b. Xóa sessionStorage
 *              c. Xóa cookie JS-readable theo mọi path/domain
 *              d. Gọi auth.removeUser() để react-oidc-context quên user
 *
 *  Bước 4 — Redirect về trang login.
 */
export const performLogout = async (auth) => {
    // Bước 1: Lấy id_token TRƯỚC KHI xóa localStorage
    let idToken = null;
    try {
        const oidcKey = Object.keys(localStorage).find((k) => k.startsWith('oidc.user:'));
        if (oidcKey) {
            const oidcUser = JSON.parse(localStorage.getItem(oidcKey));
            idToken = oidcUser?.id_token || null;
        }
    } catch {
        // bỏ qua nếu parse lỗi
    }

    try {
        // Bước 2: Gọi backend logout
        // Backend sẽ:
        //   - Expire HttpOnly cookies (accessToken, refreshToken) qua Set-Cookie
        //   - Gọi Keycloak end_session để hủy KC session
        //   - Trả Clear-Site-Data header để browser xóa toàn bộ
        await axiosInstance.post(
            '/api/biosense/v1/logout',
            { id_token: idToken },
            { withCredentials: true }, // bắt buộc để browser gửi & nhận cookies
        );
    } catch {
        // Bước 3 vẫn chạy dù backend lỗi (mất mạng, timeout...)
    } finally {
        // Bước 3: Dọn sạch phía client
        await clearClientStorage(auth);

        // Bước 4: Về trang login
        window.location.replace(`${applicationBasePath}/login`);
    }
};