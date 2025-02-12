// src/services/puzzleService.js
import axios from 'axios';

const BASE_URL = 'http://localhost:5173/api/games/puzzle';

// Almacenamiento temporal de configuraciones (hasta implementar BD)
let configCounter = 1;
const configStore = new Map();

export const puzzleService = {
    getImages: (difficulty) => {
        if (difficulty === 'random') {
            return Array(10).fill().map(() => 
                `https://picsum.photos/1200/1200?random=${Math.random()}`
            );
        }

        const path = `/src/assets/images/puzzle/${difficulty}`;
        const images = {
            medium: [
                'Alpacas.jpg', 'Cangrejos.jpg', 'Foca.jpg', 'Laguna.jpg',
                'MitadMund.jpg', 'Pajarito.jpg', 'Pajaritos.jpg', 'Signal.jpg',
                'Stop.jpg', 'Volcan.jpg'
            ],
            hard: [
                'BanderaECU.jpg', 'Birds.jpg', 'Capillas.jpg', 'Colibri.jpg',
                'FinAnio.jpg', 'Foca.jpg', 'Laguna.jpg', 'Panecillo.jpg',
                'QuitoCentro.jpg', 'QuitoCentroB.jpg'
            ]
        };

        return images[difficulty].map(img => `${path}/${img}`);
    },

    saveConfig: async (sessionId, configData) => {
        try {
            // Generamos un ID único para esta configuración
            const configId = configCounter++;
            
            // Guardamos la configuración en nuestro store temporal
            const config = {
                id: configId,
                sessionId,
                ...configData,
                timestamp: new Date().toISOString()
            };
            configStore.set(configId, config);

            // Cuando implementemos la BD, aquí irá el código para guardar en la base de datos
            /*
            const response = await axios.post(
                `${BASE_URL}/session/${sessionId}/config`,
                configData
            );
            return response.data;
            */

            return {
                success: true,
                configId,
                config, // Devolvemos la configuración completa
                message: 'Configuración guardada exitosamente'
            };
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al guardar configuración');
        }
    },

    getConfig: async (configId) => {
        try {
            // Obtenemos la configuración de nuestro store temporal
            const config = configStore.get(configId);
            if (!config) {
                throw new Error('Configuración no encontrada');
            }

            return {
                success: true,
                config
            };
        } catch (error) {
            throw new Error('Error al obtener la configuración');
        }
    },

    saveStats: async (configId, stats) => {
        try {
            // Obtenemos la configuración
            const config = configStore.get(configId);
            if (!config) {
                throw new Error('Configuración no encontrada');
            }

            // Actualizamos la configuración con las estadísticas
            config.stats = stats;
            configStore.set(configId, config);

            // Cuando implementemos la BD, aquí irá el código para guardar en la base de datos
            /*
            const response = await axios.post(
                `${BASE_URL}/config/${configId}/stats`,
                stats
            );
            return response.data;
            */

            return {
                success: true,
                message: 'Estadísticas guardadas exitosamente'
            };
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al guardar estadísticas');
        }
    }
};