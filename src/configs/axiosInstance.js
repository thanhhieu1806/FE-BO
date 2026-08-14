import axios from 'axios';

const applicationBasePath = process.env.PUBLIC_URL || '';

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || `${window.location.origin}${applicationBasePath}`,
    timeout: 15000,
    headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const oidcKey = Object.keys(localStorage).find((k) => k.startsWith('oidc.user:'));
        if (oidcKey) {
            try {
                const oidcUser = JSON.parse(localStorage.getItem(oidcKey));
                if (oidcUser?.access_token) {
                    config.headers.Authorization = `Bearer ${oidcUser.access_token}`;
                }
            } catch {

            }
        }
        return config;
    },
    (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            Object.keys(localStorage)
                .filter((k) => k.startsWith('oidc.'))
                .forEach((k) => localStorage.removeItem(k));
            window.location.href = `${applicationBasePath}/login`;
        }
        return Promise.reject(error);
    },
);

export default axiosInstance;