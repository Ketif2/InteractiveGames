import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/games/puzzle';

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
        { id: '10H', name: 'Quito Centro B', path: 'QuitoCentroD.jpg' }
    ]
};

export const puzzleService = {
    // Obtener imágenes según dificultad
    getImages: (difficulty) => {
        if (difficulty === 'random') {
            return Array(10).fill().map(() => 
                `https://picsum.photos/1200/1200?random=${Math.random()}`
            );
        }
        return PUZZLE_IMAGES[difficulty];
    },

    // Obtener URL de imagen por ID
    getImageUrlById: (imageId) => {
        const difficulty = imageId.endsWith('M') ? 'medium' : 'hard';
        const image = PUZZLE_IMAGES[difficulty].find(img => img.id === imageId);
        if (!image) return null;
        return `/src/assets/images/puzzle/${difficulty}/${image.path}`;
    },

    // Obtener imágenes ya jugadas por un paciente
    getPlayedImages: async (patientId) => {
        try {
            const response = await axios.get(`${BASE_URL}/patient/${patientId}/images`);
            return response.data?.playedImages || [];
        } catch (error) {
            console.log('Advertencia: No se pudieron cargar imágenes jugadas.', error);
            return []; // Retornar array vacío para no interrumpir el flujo
        }
    },

    // Guardar configuración del juego
    saveConfig: async (sessionId, configData) => {
        try {
            const response = await axios.post(
                `${BASE_URL}/session/${sessionId}/config`,
                configData
            );
            return response.data;
        } catch (error) {
            console.error('Error al guardar configuración:', error);
            throw new Error(error.response?.data?.message || 'Error al guardar configuración');
        }
    },

    // Obtener configuración por ID
    getConfig: async (configId) => {
        try {
            const response = await axios.get(`${BASE_URL}/config/${configId}`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener configuración:', error);
            throw new Error('Error al obtener la configuración');
        }
    },

    // Guardar estadísticas del juego
    saveStats: async (configId, stats) => {
        try {
            const response = await axios.post(
                `${BASE_URL}/config/${configId}/stats`,
                stats
            );
            return response.data;
        } catch (error) {
            console.error('Error al guardar estadísticas:', error);
            throw new Error(error.response?.data?.message || 'Error al guardar estadísticas');
        }
    },

    // Guardar sesión completa (configuración, estadísticas y observaciones)
    savePuzzleSessionComplete: async (sessionId, configData, statsData, observations) => {
        try {
            const response = await axios.post(
                `${BASE_URL}/session/${sessionId}/complete`,
                {
                    config: configData,
                    stats: statsData,
                    observations
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error al guardar los datos de la sesión:', error);
            throw new Error(error.response?.data?.message || 'Error al guardar los datos de la sesión');
        }
    },

    // Obtener estadísticas de una sesión
    getSessionStats: async (sessionId) => {
        try {
            const response = await axios.get(`${BASE_URL}/session/${sessionId}/stats`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener estadísticas de la sesión:', error);
            throw new Error('Error al obtener estadísticas de la sesión');
        }
    },

    // Actualizar configuración
    updateConfig: async (configId, configData) => {
        try {
            const response = await axios.put(
                `${BASE_URL}/config/${configId}`,
                configData
            );
            return response.data;
        } catch (error) {
            console.error('Error al actualizar configuración:', error);
            throw new Error(error.response?.data?.message || 'Error al actualizar configuración');
        }
    },

    // Obtener imágenes recomendadas según el historial del paciente
    getRecommendedImages: async (patientId, difficulty) => {
        try {
            const response = await axios.get(
                `${BASE_URL}/patient/${patientId}/recommended?difficulty=${difficulty}`
            );
            return response.data;
        } catch (error) {
            console.error('Error al obtener imágenes recomendadas:', error);
            // Si falla, devolver todas las imágenes de esa dificultad
            return puzzleService.getImages(difficulty);
        }
    }
};