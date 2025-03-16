import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const sessionService = {
  getAllSessions: async () => {
    try {
      const response = await axios.get(`${API_URL}/sessions`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener sesiones');
    }
  },

  createSession: async (sessionData) => {
    try {
      const response = await axios.post(`${API_URL}/sessions`, sessionData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al crear sesión');
    }
  },

  updateSession: async (id, sessionData) => {
    try {
      const response = await axios.put(`${API_URL}/sessions/${id}`, sessionData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al actualizar sesión');
    }
  },

  getTotalSessions: async (id_paciente) => {
    try {
      const response = await axios.get(`${API_URL}/sessions/patient/${id_paciente}`);
      return response.data;
    }catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener sesiones');
    }
   },

   getSessionToday: async (id_paciente) => {
    try {
      const response = await axios.get(`${API_URL}/sessions/patient-today/${id_paciente}`);
      return response.data;
    } catch (error) {
      console.error('Error en getSessionToday:', error);
      throw error;
    }
  },

  getLastSession: async (id_paciente) => {
    try {
      const response = await axios.get(`${API_URL}/sessions/last-session/${id_paciente}`);
      return response.data;
    } catch (error) {
      console.error('Error en getLastSession:', error);
      throw error;
    }
  }
};