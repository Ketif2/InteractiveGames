// services/therapistService.js
import api from './api';

const therapistService = {
  getAllTherapists: async () => {
    try {
      return await api.get('/terapeutas/all');
    } catch (error) {
      throw error;
    }
  }
};

export default therapistService;