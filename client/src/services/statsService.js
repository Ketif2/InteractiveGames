import api from './api';

const API_URL = 'http://localhost:5000/api';

export const statsService = {
    getStatsPerSession: async (id_sesion) => {
        try {
            const response = await api.get(`${API_URL}/games/stats/${id_sesion}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al obtener estadísticas');
        }
    },
    
    registerStats: async (statsData) => {
        try {
            const response = await api.post(`${API_URL}/games/stats/register`, statsData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al registrar estadísticas');
        }
    },

    getPatientSessions: async (id_paciente) => {
        try {
            const response = await api.get(`${API_URL}/stats/patient/${id_paciente}/sessions`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al obtener sesiones del paciente');
        }
    },
    
    getSessionDetails: async (id_sesion) => {
        try {
            const response = await api.get(`${API_URL}/stats/session/${id_sesion}/details`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al obtener detalles de la sesión');
        }
    }
};

export default statsService;