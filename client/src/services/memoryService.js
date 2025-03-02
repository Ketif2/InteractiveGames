import api from './api';

const API_URL = 'http://localhost:5000/api';

export const memoryService = {
    getMemoryConfig: async (id_sesion) => {
        try {
            const response = await api.get(`${API_URL}/games/memory/config/${id_sesion}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al obtener estadísticas');
        }
    },
    registerMemoryConfig: async (config) => {
        try {
            const response = await api.post(`${API_URL}/games/memory/save-config`, config);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al registrar estadísticas');
        }
    }
};