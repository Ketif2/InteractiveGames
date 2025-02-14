// services/patientService.js
import api from './api';

const patientService = {
  // Obtener todos los pacientes
  getAllPatients: async () => {
    try {
      return await api.get('/patients/all');
    } catch (error) {
      throw error;
    }
  },

  // Obtener un paciente por ID
  getPatientById: async (id) => {
    try {
      return await api.get(`/patients/${id}`);
    } catch (error) {
      throw error;
    }
  },

  // Crear un nuevo paciente
  createPatient: async (patientData) => {
    try {
      return await api.post('/patients/new', {
        id_terapeuta: patientData.id_terapeuta,
        nombre: patientData.nombre,
        apellido: patientData.apellido,
        fecha_nacimiento: patientData.fecha_nacimiento,
        sexo: patientData.sexo,
        diagnostico: patientData.diagnostico,
        documentos: patientData.documentos
      });
    } catch (error) {
      throw error;
    }
  },

  // Actualizar un paciente
  updatePatient: async (id, patientData) => {
    try {
      return await api.put(`/patients/${id}`, {
        id_terapeuta: patientData.id_terapeuta,
        nombre: patientData.nombre,
        apellido: patientData.apellido,
        fecha_nacimiento: patientData.fecha_nacimiento,
        diagnostico: patientData.diagnostico
      });
    } catch (error) {
      throw error;
    }
  },

  // Eliminar un paciente
  deletePatient: async (id) => {
    try {
      return await api.delete(`/patients/${id}`);
    } catch (error) {
      throw error;
    }
  },

  // Asignar terapeuta a paciente
  assignTherapist: async (patientId, therapistId) => {
    try {
      return await api.put(`/patients/${patientId}/assign-therapist`, {
        id_terapeuta: therapistId
      });
    } catch (error) {
      throw error;
    }
  }
};

export default patientService;