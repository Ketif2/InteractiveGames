
import api from './api';

export const patientService = {
  getAllPatients: async () => {
    try {
      const response = await api.get('/patients');
      return response;
    } catch (error) {
      throw new Error(error.message || 'Error al obtener pacientes');
    }
  },

  getPatientById: async (id) => {
    try {
      const response = await api.get(`/patients/${id}`);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Error al obtener paciente');
    }
  },

  createPatient: async (patientData) => {
    try {
      const response = await api.post('/patients', {
        id_terapeuta: patientData.therapistId,
        nombre: patientData.firstName,
        apellido: patientData.lastName,
        fecha_nacimiento: patientData.birthDate,
        diagnostico: patientData.diagnosis
      });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Error al crear paciente');
    }
  },

  updatePatient: async (id, patientData) => {
    try {
      const response = await api.put(`/patients/${id}`, {
        id_terapeuta: patientData.therapistId,
        nombre: patientData.firstName,
        apellido: patientData.lastName,
        fecha_nacimiento: patientData.birthDate,
        diagnostico: patientData.diagnosis
      });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Error al actualizar paciente');
    }
  },

  deletePatient: async (id) => {
    try {
      const response = await api.delete(`/patients/${id}`);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Error al eliminar paciente');
    }
  }
};