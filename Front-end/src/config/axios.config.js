import axios from 'axios';
import { AuthService } from '@/services/auth.service';
import {API_CONFIG, getApiUrl} from "@/config/api.config";
import {useUser} from "@/context/UserContext";

const axiosInstance = axios.create();

let isRefreshing = false;
let failedRequestsQueue = [];

const processQueue = (error, token = null) => {
    failedRequestsQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedRequestsQueue = [];
}

axiosInstance.interceptors.request.use(
    async (config) => {
        const token = AuthService.getToken();
        if (token) {
            config.headers.Authorization = token;
        }
        return config;
    },
    (error) => {
        console.error("Interceptors Request Error:", error);
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedRequestsQueue.push({ resolve, reject });
                })
                    .then(token => {
                        originalRequest.headers.Authorization = token;
                        return axiosInstance(originalRequest);
                    })
                    .catch(err => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = await AuthService.getRefreshToken();
                // fix the endpoint to get refresh token in request from front end
                const response = await axios.put(getApiUrl(API_CONFIG.endpoints.auth.refresh))

                const { token } = response.data.data.token;
                const { refresh_token } = response.data.data.refresh_token;
                AuthService.setToken(token);
                if (refresh_token) {
                    AuthService.setRefreshToken(refresh_token);
                }

                originalRequest.headers.Authorization = token;

                // Update headers for future requests
                axiosInstance.defaults.headers.common['Authorization'] = token;

                processQueue(null, token);
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                await AuthService.removeToken();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
            return Promise.reject(error);
        }
        console.error("Interceptors Response Error:", error);
        return Promise.reject(error);
    }
);

export default axiosInstance;
