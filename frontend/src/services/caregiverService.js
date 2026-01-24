import api from './api';

export const caregiverService = {
    addPatient: async (email) => {
        const response = await api.post('/caregiver/add', { email });
        return response.data;
    },

    getPatients: async () => {
        const response = await api.get('/caregiver/patients');
        return response.data;
    },

    getSummary: async () => {
        const response = await api.get('/caregiver/summary');
        return response.data;
    },

    triggerReminder: async (patientId, doseLogId) => {
        const response = await api.post(`/caregiver/trigger-reminder/${patientId}/${doseLogId}`);
        return response.data;
    },

    removePatient: async (patientId) => {
        const response = await api.delete(`/caregiver/remove-patient/${patientId}`);
        return response.data;
    }
};

export default caregiverService;
