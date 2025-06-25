import {API_CONFIG, getApiUrl} from "@/config/api.config";
import axios from "@/config/axios.config";

export const listComments = async (reportId, limit, page, latest) => {
    try {
        const response = await axios.get(getApiUrl(API_CONFIG.endpoints.comment.list(reportId)), {
            params: {
                limit: limit,
                page: page,
                latest: latest
            }
        })
        return response.data.data;
    } catch (error) {
        throw error.response?.data.errors || { message: 'Failed to get list comments.' };
    }
}

export const createComments = async (reportId, data) => {
    try {
        const response = await axios.post(
            getApiUrl(API_CONFIG.endpoints.comment.create(reportId)),
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache',
                }
            }
        );

        return response.data.data;
    } catch (error) {
        throw error.response?.data.errors || { message: 'Failed to create report.' };
    }
}

export const deleteComment = async (commentId) => {
    try {
        const response = await axios.delete(
            getApiUrl(API_CONFIG.endpoints.comment.remove(commentId)),
        );

        return response.data.data;
    } catch (error) {
        throw error.response?.data.errors || { message: 'Failed to delete report.' };
    }
}