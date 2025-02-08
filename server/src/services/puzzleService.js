import axios from 'axios';
import { API_URL } from '../config/constants';

export const puzzleService = {
    saveConfig: async (sessionId, configData) => {
        try {
            const response = await axios.post(
                `${API_URL}/games/puzzle/session/${sessionId}/config`,
                configData
            );
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al guardar configuración');
        }
    },

    updateConfig: async (configId, updateData) => {
        try {
            const response = await axios.put(
                `${API_URL}/games/puzzle/config/${configId}`,
                updateData
            );
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al actualizar configuración');
        }
    },

    saveStats: async (configId, statsData) => {
        try {
            const response = await axios.post(
                `${API_URL}/games/puzzle/config/${configId}/stats`,
                statsData
            );
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al guardar estadísticas');
        }
    },

    getSessionStats: async (sessionId) => {
        try {
            const response = await axios.get(
                `${API_URL}/games/puzzle/session/${sessionId}/stats`
            );
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al obtener estadísticas');
        }
    }
};