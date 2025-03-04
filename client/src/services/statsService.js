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
            console.log(`Solicitando sesiones para paciente ID: ${numericId}`);
            
            const url = `${API_URL}/stats/patient/${numericId}/sessions`;
            console.log('URL completa:', url);
            
            const response = await api.get(url);
            console.log('Respuesta completa:', response);
            
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
        try {
            const response = await api.get(`${API_URL}/stats/session/${id_sesion}/details`);
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                throw new Error('Su sesión ha expirado. Por favor inicie sesión nuevamente.');
            }
            throw new Error(error.response?.data?.message || 'Error al obtener detalles de la sesión');
        }
    }
    
};

export default statsService;