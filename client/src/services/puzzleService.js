import api from './api';

// Definición de imágenes como JSON
const PUZZLE_IMAGES = {
    medium: [
        { id: '1M', name: 'Alpacas', path: 'Alpacas.WebP' },
        { id: '2M', name: 'Cangrejos', path: 'Cangrejos.WebP' },
        { id: '3M', name: 'FocaM', path: 'FocaM.WebP' },
        { id: '4M', name: 'LagunaM', path: 'LagunaM.WebP' },
        { id: '5M', name: 'MitadMund', path: 'MitadMund.WebP' },
        { id: '6M', name: 'Pajarito', path: 'Pajarito.WebP' },
        { id: '7M', name: 'Pajaritos', path: 'Pajaritos.WebP' },
        { id: '8M', name: 'Signal', path: 'Signal.WebP' },
        { id: '9M', name: 'Stop', path: 'Stop.WebP' },
        { id: '10M', name: 'Volcan', path: 'Volcan.WebP' }
    ],
    hard: [
        { id: '1H', name: 'BanderaECU', path: 'BanderaECU.WebP' },
        { id: '2H', name: 'Birds', path: 'Birds.WebP' },
        { id: '3H', name: 'Capillas', path: 'Capillas.WebP' },
        { id: '4H', name: 'Colibri', path: 'Colibri.WebP' },
        { id: '5H', name: 'Fin de Año', path: 'FinAnio.WebP' },
        { id: '6H', name: 'FocaH', path: 'FocaH.WebP' },
        { id: '7H', name: 'LagunaH', path: 'LagunaH.WebP' },
        { id: '8H', name: 'Panecillo', path: 'Panecillo.WebP' },
        { id: '9H', name: 'QuitoCentro', path: 'QuitoCentro.WebP' },
        { id: '10H', name: 'QuitoCentroD', path: 'QuitoCentroD.WebP' }
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
            const response = await api.get(`/games/puzzles/config/${id_sesion}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al obtener configuración del puzzle');
        }
    },
    registerPuzzleConfig: async (config) => {
        try {
            const response = await api.post(`/games/puzzle/save-config`, config);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al registrar configuración del puzzle');
        }
    }

};