import axios from "@/config/axios.config";
import {API_CONFIG, getApiUrl} from "@/config/api.config";

export const createUsers = async (formData) => {
    try {
        const response = await axios.post(
            getApiUrl(API_CONFIG.endpoints.users.create),
            formData
        );
        return response.data.data;
    } catch (error) {
        throw error.response?.data.errors || { message: "Failed to create users" };
    }
}

export const listUsers = async (limit, page, latest) => {
    try {
        const response = await axios.get(getApiUrl(API_CONFIG.endpoints.users.list), {
            params: {
                limit,
                page,
                latest
            }
        })
        return response.data.data;
    } catch (error) {
        throw error.response?.data.errors || { message: "Failed to list users" };
    }
}

export const updateUsers = async (userId, formData) => {
    try {
        const response = await axios.put(
            getApiUrl(API_CONFIG.endpoints.users.update(userId)),
            formData
        );
        return response.data.data;
    } catch (error) {
        throw error.response?.data.errors || { message: "Failed to update users" };
    }
}

export const deleteUser = async (userId) => {
    try {
        const response = await axios.delete(
            getApiUrl(API_CONFIG.endpoints.users.remove(userId))
        )
        return response.data.data;
    } catch (error) {
        console.log("delete user", error);
        throw error.response?.data.errors || { message: "Failed to delete user" };
    }
}

export const getUser = async (userId, form) => {
    try {
        const response = await axios.get(
            getApiUrl(API_CONFIG.endpoints.users.detail(userId)), form
        )
        return response.data.data;
    } catch (error) {
        throw error.response?.data.errors || { message: "Failed to get user" };
    }
}