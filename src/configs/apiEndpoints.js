export const API_ENDPOINTS = {
    DASHBOARD: {
        SUMMARY: '/api/dashboard/summary',
        TREND: '/api/dashboard/trend',
        ATTENDANCE: '/api/dashboard/attendance',
        VISITOR: '/api/dashboard/visitor',
        RECENT_TRANSACTIONS: '/api/dashboard/recent-transactions',
    },

    COMPANY: {
        LIST: '/api/v1/companies',
        DETAIL: (id) => `/api/v1/companies/${id}`,
        EXPORT_CSV: '/api/v1/companies/export-csv',
    },

    CONNECTOR: {
        LIST: '/api/v1/connectors',
        DETAIL: (id) => `/api/v1/connectors/${id}`,
        CREATE: '/api/v1/connectors',
        UPDATE: (id) => `/api/v1/connectors/${id}`,
        DELETE: (id) => `/api/v1/connectors/${id}`,
        EXPORT_CSV: '/api/v1/connectors/export-csv',
    },

};

export const COMPANY_ENDPOINTS = {
    LIST: "/api/v1/companies",
    DETAIL: (id) => `/api/v1/companies/${id}`,
};