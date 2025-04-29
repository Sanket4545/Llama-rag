import axios from 'axios';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const access_token = 'access_token';

class AuthService {
    constructor() {
        this.refreshTokenTimeout = null;
    }

    startRefreshTokenTimer(expirationTime) {
        if (this.refreshTokenTimeout) {
            clearTimeout(this.refreshTokenTimeout);
        }

        const timeout = expirationTime - 60000;  
        this.refreshTokenTimeout = setTimeout(() => this.refreshAccessToken(), timeout);
    }

    stopRefreshTokenTimer() {
        if (this.refreshTokenTimeout) {
            clearTimeout(this.refreshTokenTimeout);
        }
    }

    async login(email, password) {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
                email,
                password
            }, {
                withCredentials: true
            });

            const { accessToken, expirationTime } = response.data;
            localStorage.setItem(access_token, accessToken);
            this.startRefreshTokenTimer(expirationTime);

            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async register(userData) {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/auth/register`, userData, {
                withCredentials: true
            });

            const { accessToken, expirationTime } = response.data;
            localStorage.setItem(access_token, accessToken);
            this.startRefreshTokenTimer(expirationTime);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async refreshAccessToken() {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/auth/refresh-token`, {}, {
                withCredentials: true
            });

            const { accessToken, expirationTime } = response.data;
            localStorage.setItem(access_token, accessToken);
            this.startRefreshTokenTimer(expirationTime);

            return accessToken;
        } catch (error) {
            this.logout();
            throw error;
        }
    }

    async logout() {
        try {
            await axios.post(`${API_BASE_URL}/api/auth/logout`, {}, {
                withCredentials: true
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            this.clearAuth();
        }
    }

    clearAuth() {
        localStorage.removeItem(access_token);
        this.stopRefreshTokenTimer();
    }

    isAuthenticated() {
        return !!localStorage.getItem(access_token);
    }

    setupAxiosInterceptors() {
        axios.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem(access_token);
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        axios.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;

                    try {
                        const newAccessToken = await this.refreshAccessToken();
                        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                        return axios(originalRequest);
                    } catch (refreshError) {
                        return Promise.reject(refreshError);
                    }
                }

                return Promise.reject(error);
            }
        );
    }
}

export const authService = new AuthService();
export default authService;
