import axios from 'axios';

const BASE_URL = 'http://localhost:5173/api/games/puzzle';

// Almacenamiento temporal de configuraciones (hasta implementar BD)
let configCounter = 1;
const configStore = new Map();

// Definición de imágenes como JSON
const PUZZLE_IMAGES = {
    medium: [
        { id: '1M', name: 'Alpacas', path: 'Alpacas.jpg' },
        { id: '2M', name: 'Cangrejos', path: 'Cangrejos.jpg' },
        { id: '3M', name: 'Foca', path: 'Foca.jpg' },
        { id: '4M', name: 'Laguna', path: 'Laguna.jpg' },
        { id: '5M', name: 'MitadMund', path: 'MitadMund.jpg' },
        { id: '6M', name: 'Pajarito', path: 'Pajarito.jpg' },
        { id: '7M', name: 'Pajaritos', path: 'Pajaritos.jpg' },
        { id: '8M', name: 'Signal', path: 'Signal.jpg' },
        { id: '9M', name: 'Stop', path: 'Stop.jpg' },
        { id: '10M', name: 'Volcan', path: 'Volcan.jpg' }
    ],
    hard: [
        { id: '1H', name: 'Bandera ECU', path: 'BanderaECU.jpg' },
        { id: '2H', name: 'Birds', path: 'Birds.jpg' },
        { id: '3H', name: 'Capillas', path: 'Capillas.jpg' },
        { id: '4H', name: 'Colibri', path: 'Colibri.jpg' },
        { id: '5H', name: 'Fin Año', path: 'FinAnio.jpg' },
        { id: '6H', name: 'Foca', path: 'Foca.jpg' },
        { id: '7H', name: 'Laguna', path: 'Laguna.jpg' },
        { id: '8H', name: 'Panecillo', path: 'Panecillo.jpg' },
        { id: '9H', name: 'Quito Centro', path: 'QuitoCentro.jpg' },
        { id: '10H', name: 'Quito Centro B', path: 'QuitoCentroB.jpg' }
    ]
};

export const puzzleService = {
    getImages: (difficulty) => {
        if (difficulty === 'random') {
            return Array(10).fill().map(() => 
                `https://picsum.photos/1200/1200?random=${Math.random()}`
            );
        }
        return PUZZLE_IMAGES[difficulty];
    },

    getImageUrlById: (imageId) => {
        const difficulty = imageId.endsWith('M') ? 'medium' : 'hard';
        const image = PUZZLE_IMAGES[difficulty].find(img => img.id === imageId);
        if (!image) return null;
        return `/src/assets/images/puzzle/${difficulty}/${image.path}`;
    },

    getPlayedImages: async (patientId) => {
        try {
            // Cuando implementemos la BD, esto traerá las imágenes ya jugadas
            const response = await axios.get(`${BASE_URL}/patient/${patientId}/images`);
            return response.data;
        } catch (error) {
            console.error('Error fetching played images:', error);
            return [];
        }
    },

    saveConfig: async (sessionId, configData) => {
        try {
            const configId = configCounter++;
            
            const config = {
                id: configId,
                sessionId,
                ...configData,
                timestamp: new Date().toISOString()
            };
            configStore.set(configId, config);

            // Cuando implementemos la BD:
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
                config,
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