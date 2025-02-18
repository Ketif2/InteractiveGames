// src/services/sequenceService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const sequenceService = {
  saveConfig: async (configData) => {
    try {
      const response = await axios.post(`${API_URL}/sequence/config`, configData);
      return response.data;
    } catch (error) {
      throw new Error('Error al guardar la configuración');
    }
  },

  saveStats: async (statsData) => {
    try {
      const response = await axios.post(`${API_URL}/sequence/stats`, statsData);
      return response.data;
    } catch (error) {
      throw new Error('Error al guardar las estadísticas');
    }
  },

  getSessionStats: async (sessionId) => {
    try {
      const response = await axios.get(`${API_URL}/sequence/stats/${sessionId}`);
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener las estadísticas');
    }
  }
};

export default sequenceService;