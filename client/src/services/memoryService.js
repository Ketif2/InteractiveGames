import api from './api';

export const memoryService = {
    getMemoryConfig: async (id_sesion) => {
        try {
            const response = await api.get(`/games/memory/config/${id_sesion}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al obtener configuración');
        }
    },
    registerMemoryConfig: async (config) => {
        try {
            const response = await api.post(`/games/memory/save-config`, config);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al registrar configuración');
        }
    }
};