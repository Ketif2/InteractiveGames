import api from './api';

const API_URL = 'http://localhost:5000/api';

export const forestService = {
    getForestConfig: async (id_sesion) => {
        try {
            const response = await api.get(`${VITE_API_URL}/games/forest/config/${id_sesion}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al obtener configuracion');
        }
    },
    registerForestConfig: async (config) => {
        try {
            const response = await api.post(`${API_URL}/games/forest/save-config`, config);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al registrar configuración');
        }
    }
};