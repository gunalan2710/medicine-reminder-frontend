import api from './api';

export const doseService = {
    markTaken: async (doseLogId) => {
        const response = await api.post(`/dose/taken/${doseLogId}`);
        return response.data;
    },

    markMissed: async (doseLogId) => {
        const response = await api.post(`/dose/missed/${doseLogId}`);
        return response.data;
    },

    snooze: async (doseLogId) => {
        const response = await api.post(`/dose/snooze/${doseLogId}`);
        return response.data;
    },
};

export default doseService;
