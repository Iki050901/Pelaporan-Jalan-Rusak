import axios from "@/config/axios.config";
import {API_CONFIG, getApiUrl} from "@/config/api.config";
import {useUser} from "@/context/UserContext";
import {useRouter} from "next/navigation";

class AuthService {

    static getToken() {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('accessToken');
        }
        return null;
    }

    static async getRefreshToken() {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('refreshToken')
        }
        return null;
    }

    static setToken(token) {
        if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', token);
        }
    }

    static setRefreshToken(refreshToken) {
        if (typeof window !== 'undefined') {
            localStorage.setItem('refreshToken', refreshToken);
        }
    }

    static removeToken() {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
        }
    }

    static async updateUser(formData) {
        try {
            const response = await axios.putForm(getApiUrl(API_CONFIG.endpoints.user.profile), formData)

            return response.data.data;
        } catch (error) {
            throw error.response?.data.errors || {};
        }
    }

    static async getUser() {
        try {
            const response = await axios.get(getApiUrl(API_CONFIG.endpoints.user.profile))

            return response.data.data;
        } catch (error) {
            throw error.response?.data.errors || {};
        }
    }

    static async registerUser(formData) {
        try {
            const response = await axios.post(getApiUrl(API_CONFIG.endpoints.auth.register), formData)

            return response.data.data;
        } catch (error) {
            throw error.response?.data.errors || {};
        }
    }

    static async logout() {
        const token = AuthService.getToken();
        try {
            await axios.delete(getApiUrl(API_CONFIG.endpoints.auth.logout), {
                headers: {
                    Authorization: token
                }
            });
            AuthService.removeToken();
            window.location.href = '/login';
        } catch (error) {
            console.error("Logout Error: ", error);
            AuthService.removeToken();
            window.location.href = '/login';
        }
    }
}

export { AuthService }