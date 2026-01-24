import api from './api';

export const authService = {
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        if (response.data.success && response.data.data) {
            localStorage.setItem('token', response.data.data);
        }
        return response.data;
    },

    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        if (response.data.success && response.data.data) {
            localStorage.setItem('token', response.data.data);
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    forgotPassword: async (email) => {
        const response = await api.post('/auth/forgot-password', { email });
        return response.data;
    },

    resetPassword: async (token, newPassword) => {
        const response = await api.post('/auth/reset-password', { token, newPassword });
        return response.data;
    },

    getCurrentUser: () => {
        const token = localStorage.getItem('token');
        if (!token) return null;

        try {
            // Decode JWT token to get user info
            const payload = JSON.parse(atob(token.split('.')[1]));

            // If role is missing from token (older tokens), return null to force re-login
            if (!payload.role) {
                return null;
            }

            return {
                email: payload.sub,
                role: payload.role,
            };
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },
};

export default authService;
