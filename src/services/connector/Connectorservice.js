import axiosInstance from '../../configs/axiosInstance';
import { API_ENDPOINTS } from '../../constants/apiEndpoints';

const connectorService = {
    getConnectors: async (params = {}) => {
        const response = await axiosInstance.get(API_ENDPOINTS.CONNECTOR.LIST, { params });
        return response.data;
    },

    getConnectorById: async (id) => {
        const response = await axiosInstance.get(API_ENDPOINTS.CONNECTOR.DETAIL(id));
        return response.data;
    },

    createConnector: async (data) => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (key === 'logo' && value instanceof File) {
                formData.append('logo', value);
            } else if (value !== null && value !== undefined) {
                formData.append(key, typeof value === 'object' ? JSON.stringify(value) : value);
            }
        });
        const response = await axiosInstance.post(API_ENDPOINTS.CONNECTOR.CREATE, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    updateConnector: async (id, data) => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (key === 'logo' && value instanceof File) {
                formData.append('logo', value);
            } else if (value !== null && value !== undefined) {
                formData.append(key, typeof value === 'object' ? JSON.stringify(value) : value);
            }
        });
        const response = await axiosInstance.put(API_ENDPOINTS.CONNECTOR.UPDATE(id), formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    deleteConnector: async (id) => {
        const response = await axiosInstance.delete(API_ENDPOINTS.CONNECTOR.DELETE(id));
        return response.data;
    },

    exportCsv: async (params = {}) => {
        const response = await axiosInstance.get(API_ENDPOINTS.CONNECTOR.EXPORT_CSV, {
            params,
            responseType: 'blob',
        });
        return response.data;
    },
};

export default connectorService;