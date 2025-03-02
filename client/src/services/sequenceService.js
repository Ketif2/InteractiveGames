// src/services/sequenceService.js
import api from './api';

const API_URL = 'http://localhost:5000/api';

export const sequenceService = {
    getSequenceConfig: async (id_sesion) => {
        try {
            const response = await api.get(`${API_URL}/games/sequence/config/${id_sesion}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al obtener configuración de secuencia');
        }
    },
    registerSequenceConfig: async (config) => {
        try {
            const response = await api.post(`${API_URL}/games/sequence/save-config`, config);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al registrar configuración de secuencia');
        }
    }
};