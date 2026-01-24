import api from './api';

export const reportService = {
    getTodayReport: async () => {
        const response = await api.get('/report/today');
        return response.data;
    },
};

export default reportService;
