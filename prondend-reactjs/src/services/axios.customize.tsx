
import axios from 'axios';
import Cookies from 'js-cookie';
import { getRefreshToken } from './api';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

const noAuthUrls = [
    '/auth/login',
    '/auth/register',
    '/database/category',
    '/books',
    '/confirm-email',
    '/books'

];

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    const shouldSkipAuth = noAuthUrls.some(url => config.url?.includes(url));

    if (token && !shouldSkipAuth) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
}, (error) => Promise.reject(error));

axiosInstance.interceptors.response.use((response) => response && response.data ? response.data : response

    , async (error) => {

        if (error.response.status === 401 && !error.config._retry) {
            error.config._retry = true;
            const refreshToken = Cookies.get('refreshToken');

            if (refreshToken) {
                const res = await getRefreshToken();
                if (res.data) {
                    const newAccessToken = res.data?.accessToken;
                    localStorage.setItem("access_token", newAccessToken);
                    error.config.headers.Authorization = `Bearer ${newAccessToken}`;
                    return axiosInstance(error.config);
                }
            } else {
                localStorage.removeItem("access_token");
                window.location.href = '/login';
            }
        }

        return error && error.response && error.response.data ? error.response.data : Promise.reject(error)
    }
);

export default axiosInstance;
