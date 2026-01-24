import api from './api';

export const medicineService = {
    addMedicine: async (medicineData) => {
        const response = await api.post('/medicine/add', medicineData);
        return response.data;
    },

    getMyMedicines: async () => {
        const response = await api.get('/medicine/myMedicines');
        return response.data;
    },

    getMedicine: async (medicineId) => {
        const response = await api.get(`/medicine/${medicineId}`);
        return response.data;
    },

    deleteMedicine: async (medicineId) => {
        const response = await api.delete(`/medicine/delete/${medicineId}`);
        return response.data;
    },
};

export default medicineService;
