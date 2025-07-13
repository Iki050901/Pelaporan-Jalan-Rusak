import 'dotenv/config';

if (!process.env.NEXT_PUBLIC_EXPRESS_API_URL) {
    throw new Error('NEXT_PUBLIC_EXPRESS_API_URL is not defined in environment variables');
}

export const API_CONFIG = {
    baseUrl: process.env.NEXT_PUBLIC_EXPRESS_API_URL,
    endpoints: {
        auth: {
            google: 'auth/google',
            login: 'api/users/login',
            register: 'api/users/register',
            logout: 'api/users/logout',
            refresh: 'api/users/refresh'
        },
        user: {
            profile: 'api/users/current',
        },
        report: {
            list: 'api/report',
            detail: (id) => `api/report/${id}`,
            create: 'api/users/report/create',
            update: (id) => `api/users/report/update/${id}`,
            delete: (id) => `api/users/report/remove/${id}`,
            dashboard: 'api/report/dashboard',
            dashboardByDamageLevel: 'api/report/dashboard/by-level',
            export: 'api/pupr/report/export',
        },
        comment: {
            create: (reportId) => `api/report/${reportId}/comments/create`,
            list: (reportId) => `api/report/${reportId}/comments/`,
            remove: (commentId) => `api/report/comments/remove/${commentId}`
        },
        validation: {
            pupr : (reportId, validateId) => `api/pupr/report/validate/${reportId}/${validateId}`,
            district : (reportId, validateId) => `api/district/report/validate/${reportId}/${validateId}`,
        },
        users: {
            list: 'api/pupr/users',
            create: 'api/pupr/users/create',
            update: (id) => `api/pupr/users/update/${id}`,
            detail: (id) => `api/pupr/users/${id}`,
            remove: (id) => `api/pupr/users/remove/${id}`,
        },
        location: {
            district: 'api/location-district',
        }
    }
};

export const getApiUrl = (endpoint) => {
    return `${API_CONFIG.baseUrl}${endpoint}`;
};
