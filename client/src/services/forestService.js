import api from './api';

export const forestService = {
    getForestConfig: async (id_sesion) => {
        try {
            const response = await api.get(`/games/forest/config/${id_sesion}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al obtener configuracion');
        }
    },
    registerForestConfig: async (config) => {
        try {
            const response = await api.post(`/games/forest/save-config`, config);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al registrar configuración');
        }
    }
};