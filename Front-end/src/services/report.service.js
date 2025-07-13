import axios from "@/config/axios.config";
import { getApiUrl, API_CONFIG} from "@/config/api.config";
import {useUser} from "@/context/UserContext";

export const createReport = async (formData) => {
    try {
        const response = await axios.post(
            getApiUrl(API_CONFIG.endpoints.report.create),
            formData
        );
        return response.data.data;
    } catch (error) {
        throw error.response?.data.errors || { message: 'Failed to create report.' };
    }
}

export const updateReport = async (formData, reportId) => {
    try {
        const response = await axios.putForm(
            getApiUrl(API_CONFIG.endpoints.report.update(reportId)),
            formData
        );
        return response.data.data;
    } catch (error) {
        throw error.response?.data.errors || { message: 'Failed to update report.' };
    }
}

export const deleteReport = async (reportId) => {
    try {
        const response = await axios.delete(
            getApiUrl(API_CONFIG.endpoints.report.delete(reportId))
        );
        return response.data.data;
    } catch (error) {
        throw error.response?.data.errors || { message: 'Failed to delete report.' };
    }
}

export const listReport = async (isTable, page, limit, status, district, level_damage, sort) => {

    try {
        const response = await axios.get(getApiUrl(API_CONFIG.endpoints.report.list), {
                params: {
                    page,
                    limit,
                    isTable,
                    status,
                    district,
                    level_damage,
                    sort
                }
            }
        );
        return response.data.data;
    } catch (error) {
        throw error.response?.data.errors || { message: 'Failed to list report.' };
    }
}

export const getReport = async (reportId) => {
    try {
        const response = await axios.get(getApiUrl(API_CONFIG.endpoints.report.detail(reportId)))
        return response.data.data;
    } catch (error) {
        throw error.response?.data.errors || { message: 'Failed to get report.' };
    }
}

export const validateDistrict = async (reportId) => {
    try {
        const response = await axios.put(getApiUrl(API_CONFIG.endpoints.validation.district(reportId, 3)))
        return response.data.data;
    } catch (error) {
        throw error.response?.data.errors || { message: 'Failed to get report.' };
    }
}

export const rejectDistrict = async (reportId, rejectReason) => {
    try {
        const response = await axios.put(getApiUrl(API_CONFIG.endpoints.validation.district(reportId, 2)), {
            note: rejectReason
        })
        return response.data.data;
    } catch (error) {
        throw error.response?.data.errors || { message: 'Failed to get report.' };
    }
}

export const validatePupr = async (reportId) => {
    try {
        const response = await axios.put(getApiUrl(API_CONFIG.endpoints.validation.pupr(reportId, 5)))
        return response.data.data;
    } catch (error) {
        throw error.response?.data.errors || { message: 'Failed to get report.' };
    }
}

export const validatePuprDone = async (reportId) => {
    try {
        const response = await axios.put(getApiUrl(API_CONFIG.endpoints.validation.pupr(reportId, 7)))
        return response.data.data;
    } catch (error) {
        throw error.response?.data.errors || { message: 'Failed to get report.' };
    }
}

export const rejectPupr = async (reportId, rejectReason) => {
    try {
        const response = await axios.put(getApiUrl(API_CONFIG.endpoints.validation.pupr(reportId, 6)),  {
            note: rejectReason
        })
        return response.data.data;
    } catch (error) {
        throw error.response?.data.errors || { message: 'Failed to get report.' };
    }
}

export const getDashboardReport = async () => {
    try {
        const response = await axios.get(getApiUrl(API_CONFIG.endpoints.report.dashboard))

        return response.data.data;
    } catch (error) {
        throw error.response?.data.errors || { message: 'Failed to get report.' };
    }
}

export const getDashboardReportByDamageLevel = async () => {
    try {
        const response = await axios.get(getApiUrl(API_CONFIG.endpoints.report.dashboardByDamageLevel))

        return response.data.data;
    } catch (error) {
        throw error.response?.data.errors || { message: 'Failed to get report.' };
    }
}

export const exportReport = async (year,month) => {
    try {
        const response = await axios.get(getApiUrl(API_CONFIG.endpoints.report.export), {
            responseType: 'blob',
            withCredentials: true,
            params: {
                year,
                month,
            }
        })

        return response;
    } catch (error) {
        throw error.response?.data.errors || { message: error };
    }
}

export const getLocationDistrict = async () => {
    try {
        const response = await axios.get(getApiUrl(API_CONFIG.endpoints.location.district))

        return response.data.data;
    } catch (error) {
        throw error.response?.data.errors || { message: 'Failed to get report.' };
    }
}