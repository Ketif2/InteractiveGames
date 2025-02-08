import axios from 'axios';

const BASE_URL = 'http://localhost:5173/api/games/puzzle';

export const puzzleService = {
    saveConfig: async (sessionId, configData) => {
        try {
            // Por ahora, solo simulamos una respuesta exitosa
            return {
                success: true,
                configId: 1, // ID temporal
                message: 'Configuración guardada exitosamente'
            };
            
            // Código para cuando se implemente la BD:
            /*
            const response = await axios.post(
                `${BASE_URL}/session/${sessionId}/config`,
                configData
            );
            return response.data;
            */
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al guardar configuración');
        }
    },

    // Los demás métodos los mantenemos comentados hasta que se necesiten
    /*
    updateConfig: async (configId, updateData) => {
        try {
            const response = await axios.put(
                `${BASE_URL}/config/${configId}`,
                updateData
            );
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al actualizar configuración');
        }
    },

    saveStats: async (configId, statsData) => {...},

    getSessionStats: async (sessionId) => {...}
    */
};