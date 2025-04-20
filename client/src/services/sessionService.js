// Actualización de sessionService.js optimizada para trabajar con SQL Server
// a través de tu capa de compatibilidad

import api from './api';

export const sessionService = {
  getAllSessions: async () => {
    try {
      const response = await api.get('/sessions');
      console.log('getAllSessions respuesta:', response);
      
      // Manejar diferentes estructuras de respuesta posibles
      if (Array.isArray(response)) {
        return response;
      } else if (response && response.data && Array.isArray(response.data)) {
        return response.data;
      } else if (response && Array.isArray(response.rows)) {
        return response.rows;
      }
      
      console.warn('Formato de respuesta no reconocido en getAllSessions:', response);
      return [];
    } catch (error) {
      console.error('Error en getAllSessions:', error);
      return [];
    }
  },

  createSession: async (sessionData) => {
    try {
      const response = await api.post('/sessions', sessionData);
      console.log('createSession respuesta completa:', response);
      
      // Intentamos preservar la respuesta completa para acceder a más datos
      return response;
    } catch (error) {
      console.error('Error en createSession:', error);
      throw new Error(error.response?.data?.message || 'Error al crear sesión');
    }
  },

  updateSession: async (id, sessionData) => {
    try {
      const response = await api.put(`/sessions/${id}`, sessionData);
      return response;
    } catch (error) {
      console.error('Error en updateSession:', error);
      throw new Error(error.response?.data?.message || 'Error al actualizar sesión');
    }
  },

  getSessionById: async (id) => {
    try {
      const response = await api.get(`/sessions/${id}`);
      return response;
    } catch (error) {
      console.error(`Error en getSessionById para sesión ${id}:`, error);
      return null;
    }
  },

  getTotalSessions: async (id_paciente) => {
    try {
      if (!id_paciente) {
        console.warn('getTotalSessions llamado sin ID de paciente');
        return { total_sesiones: 0 };
      }
      
      const response = await api.get(`/sessions/patient/${id_paciente}`);
      console.log(`getTotalSessions respuesta para paciente ${id_paciente}:`, response);
      
      // Verificar si la respuesta tiene la estructura esperada
      if (response && typeof response === 'object') {
        if (response.total_sesiones !== undefined) {
          return { total_sesiones: response.total_sesiones };
        } else if (response.data && response.data.total_sesiones !== undefined) {
          return { total_sesiones: response.data.total_sesiones };
        } else if (response.success && response.total_sesiones !== undefined) {
          return { total_sesiones: response.total_sesiones };
        }
      }
      
      console.warn(`Respuesta no reconocida en getTotalSessions:`, response);
      return { total_sesiones: 0 };
    } catch (error) {
      console.error(`Error en getTotalSessions para paciente ${id_paciente}:`, error);
      return { total_sesiones: 0 };
    }
  },

  getSessionToday: async (id_paciente) => {
    try {
      if (!id_paciente) {
        console.warn('getSessionToday llamado sin ID de paciente');
        return { has_session: false };
      }
      
      const response = await api.get(`/sessions/patient-today/${id_paciente}`);
      console.log(`getSessionToday respuesta para paciente ${id_paciente}:`, response);
      
      // Manejar diferentes estructuras posibles
      if (response && typeof response === 'object') {
        if (response.has_session !== undefined) {
          return { has_session: Boolean(response.has_session) };
        } else if (response.data && response.data.has_session !== undefined) {
          return { has_session: Boolean(response.data.has_session) };
        } else if (response.success && response.has_session !== undefined) {
          return { has_session: Boolean(response.has_session) };
        }
      }
      
      console.warn(`Respuesta no reconocida en getSessionToday:`, response);
      return { has_session: false };
    } catch (error) {
      console.error(`Error en getSessionToday para paciente ${id_paciente}:`, error);
      return { has_session: false };
    }
  },

  getLastSession: async (id_paciente) => {
    try {
      if (!id_paciente) {
        console.warn('getLastSession llamado sin ID de paciente');
        return null;
      }
      
      console.log(`Obteniendo última sesión para paciente: ${id_paciente}`);
      
      try {
        // Notar que la consulta en el backend usa SQL Server, así que ahora debería usar TOP en lugar de LIMIT
        const response = await api.get(`/sessions/last-session/${id_paciente}`);
        console.log('getLastSession respuesta completa:', response);
        
        if (response && typeof response === 'object') {
          return response;
        } else if (response && response.data && typeof response.data === 'object') {
          return response.data;
        }
        
        console.warn('Formato de respuesta no reconocido en getLastSession:', response);
        return null;
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log(`No se encontraron sesiones para el paciente ${id_paciente}`);
          return null;
        }
        throw error;
      }
    } catch (error) {
      console.error(`Error en getLastSession para paciente ${id_paciente}:`, error);
      return null;
    }
  },
  
  // Método adicional para intentar obtener la última sesión creada por cualquier medio
  getLatestCreatedSession: async () => {
    try {
      const allSessions = await sessionService.getAllSessions();
      
      if (Array.isArray(allSessions) && allSessions.length > 0) {
        // Ordenar por fecha de creación, la más reciente primero
        const sortedSessions = [...allSessions].sort((a, b) => {
          const dateA = new Date(a.fecha_sesion || 0);
          const dateB = new Date(b.fecha_sesion || 0);
          return dateB - dateA;
        });
        
        return sortedSessions[0];
      }
      
      console.warn('No se encontraron sesiones para obtener la más reciente');
      return null;
    } catch (error) {
      console.error('Error en getLatestCreatedSession:', error);
      return null;
    }
  }
};