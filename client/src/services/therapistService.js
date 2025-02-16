import api from './api';

const therapistService = {
  getAllTherapists: async () => {
    try {
      return await api.get('/therapist/all');
    } catch (error) {
      throw error;
    }
  },

  getTherapistById: async (therapistId) => {
    try {
      return await api.get(`/therapist/${therapistId}`);
    } catch (error) {
      throw error;
    }
  },
  getTherapistPatients: async (therapistId) => {
    try {
      return await api.get(`/therapist/${therapistId}/patients`);
    } catch (error) {
      throw error;
    }
  },
};
export default therapistService;