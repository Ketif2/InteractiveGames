import axios from 'axios';

const BASE_URL = 'http://localhost:5173/api/games/sequence';

// Datos de ejemplo (temporales hasta que se implemente la BD)
const TEMP_SEQUENCES = {
    cadenasMedias: [
        {
            texto: "Realizar las compras en el supermercado",
            imagenes: [
                { src: "/src/assets/games/sequence/medium/img1.jpg", orden: 1, ayuda: "Tomar el carrito de compras" },
                { src: "/src/assets/games/sequence/medium/img2.jpg", orden: 2, ayuda: "Recorrer los pasillos" },
                { src: "/src/assets/games/sequence/medium/img3.jpg", orden: 3, ayuda: "Seleccionar productos" },
                { src: "/src/assets/games/sequence/medium/img4.jpg", orden: 4, ayuda: "Ir a la caja" },
                { src: "/src/assets/games/sequence/medium/img5.jpg", orden: 5, ayuda: "Pagar los productos" },
                { src: "/src/assets/games/sequence/medium/img6.jpg", orden: 6, ayuda: "Guardar las compras" }
            ]
        }
    ],
    cadenasComplejas: [
        {
            texto: "Organizar una fiesta de cumpleaños",
            imagenes: [
                { src: "/src/assets/games/sequence/complex/img1.jpg", orden: 1, ayuda: "Hacer la lista de invitados" },
                { src: "/src/assets/games/sequence/complex/img2.jpg", orden: 2, ayuda: "Enviar invitaciones" },
                { src: "/src/assets/games/sequence/complex/img3.jpg", orden: 3, ayuda: "Comprar decoraciones" },
                { src: "/src/assets/games/sequence/complex/img4.jpg", orden: 4, ayuda: "Ordenar el pastel" },
                { src: "/src/assets/games/sequence/complex/img5.jpg", orden: 5, ayuda: "Decorar el lugar" },
                { src: "/src/assets/games/sequence/complex/img6.jpg", orden: 6, ayuda: "Recibir a los invitados" },
                { src: "/src/assets/games/sequence/complex/img7.jpg", orden: 7, ayuda: "Cantar cumpleaños" },
                { src: "/src/assets/games/sequence/complex/img8.jpg", orden: 8, ayuda: "Repartir el pastel" }
            ]
        }
    ]
};

export const sequenceService = {
    saveConfig: async (sessionId, configData) => {
        try {
            // Por ahora retornamos una respuesta simulada
            return {
                success: true,
                configId: 1,
                message: 'Configuración guardada exitosamente'
            };
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al guardar configuración');
        }
    },

    getSequences: async (difficulty) => {
        try {
            // Por ahora retornamos los datos de ejemplo
            return difficulty === 'medium' ? TEMP_SEQUENCES.cadenasMedias : TEMP_SEQUENCES.cadenasComplejas;
        } catch (error) {
            throw new Error('Error al obtener las secuencias');
        }
    },

    saveStats: async (configId, statsData) => {
        try {
            // Por ahora retornamos una respuesta simulada
            return {
                success: true,
                message: 'Estadísticas guardadas exitosamente'
            };
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al guardar estadísticas');
        }
    }
};