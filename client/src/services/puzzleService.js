import api from './api';
const BASE_URL = 'http://localhost:5000/api';

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

    getPuzzleConfig: async (id_sesion) => {
        try {
            const response = await api.get(`${BASE_URL}/games/puzzles/config/${id_sesion}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al obtener configuración del puzzle');
        }
    },
    registerPuzzleConfig: async (config) => {
        try {
            const response = await api.post(`${BASE_URL}/games/puzzle/save-config`, config);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al registrar configuración del puzzle');
        }
    }

};