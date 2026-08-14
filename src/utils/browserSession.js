import axiosInstance from '../configs/axiosInstance';

const applicationBasePath = process.env.PUBLIC_URL || '';

/**
 * Xóa cookie mà JS có thể đọc được (không phải HttpOnly).
 * Thử xóa theo mọi tổ hợp path + domain để chắc chắn không bỏ sót.
 */
const clearReadableCookies = () => {
  const expires = 'expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0';
  const hostname = window.location.hostname;

  document.cookie.split(';').forEach((cookie) => {
    const name = cookie.split('=')[0].trim();
    if (!name) return;

    document.cookie = `${name}=; ${expires}; path=/`;
    if (applicationBasePath) {
      document.cookie = `${name}=; ${expires}; path=${applicationBasePath}`;
    }
    document.cookie = `${name}=; ${expires}; path=/; domain=${hostname}`;
    document.cookie = `${name}=; ${expires}; path=/; domain=.${hostname}`;
  });
};

export const clearBrowserSession = async () => {
  try {
    await axiosInstance.post('/api/biosense/v1/clear-browser-data', null, {
      withCredentials: true,
    });
  } catch (error) {
    console.warn('Could not clear server-managed browser data.', error);
  } finally {
    // FIX: Chuyển từ khối catch sang finally để đảm bảo LUÔN chạy
    // kể cả khi backend thành công (trường hợp cũ chỉ clear khi lỗi)
    localStorage.clear();
    sessionStorage.clear();
    clearReadableCookies();
  }
};