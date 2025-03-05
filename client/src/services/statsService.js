import api from './api';

const API_URL = 'http://localhost:5000/api';

export const statsService = {

    getStatsPerSession: async (id_sesion) => {
        try {
            const response = await api.get(`${API_URL}/games/stats/${id_sesion}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al obtener estadísticas');
        }
    },
    
    registerStats: async (statsData) => {
        try {
            const response = await api.post(`${API_URL}/games/stats/register`, statsData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al registrar estadísticas');
        }
    },

    getSessionsByPatient: async (id_paciente) => {
        try {
            const numericId = parseInt(id_paciente, 10);
            const url = `${API_URL}/stats/patient/${numericId}/sessions`;
            const response = await api.get(url);
            
            // Verifica si la respuesta ya es un array (y no tiene una propiedad data)
            if (Array.isArray(response)) {
                console.log('La respuesta ya es un array:', response);
                return response;
            }
            
            // Si tiene una propiedad data, úsala
            if (response.data !== undefined) {
                console.log('Datos de la respuesta:', response.data);
                return response.data;
            }
            
            // Si no encontramos datos, devolver array vacío
            console.warn('No se encontraron datos en la respuesta');
            return [];
        } catch (error) {
            console.error(`Error completo:`, error);
            return []; // Devolver array vacío en vez de lanzar error
        }
    },
    
    getSessionDetails: async (id_sesion) => {
        if (!id_sesion) {
            console.error('ID de sesión vacío');
            throw new Error('ID de sesión no proporcionado');
        }
        
        try {
            console.log(`Llamando a API con sesión ID: ${id_sesion}`);
            // Eliminemos la conversión a número si no es necesaria
            // const numericId = parseInt(id_sesion, 10);
            const response = await api.get(`/stats/session/${id_sesion}/details`);
            console.log('Respuesta completa:', response);
            return response;
        } catch (error) {
            console.error('Error en getSessionDetails:', error);
            if (error.response) {
                console.error('Datos de error:', error.response);
            }
            throw new Error(error.message || 'Error al obtener detalles de la sesión');
        }
    }
    
};

export default statsService;