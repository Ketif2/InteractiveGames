// services/patientService.js
import api from './api';

const patientService = {
  // Obtener todos los pacientes
  getAllPatients: async () => {
    try {
      const data = api.get('/patients/all');
      return data;
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
  },


  // Subir documento para un paciente
  uploadDocument: async (patientId, formData) => {
    try {
      return await api.post(`/patients/${patientId}/documents`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    } catch (error) {
      throw error;
    }
  },
  
  // Obtener documento de un paciente

  getDocument: async (patientId, documentId) => {
    try {
      // Incluir un parámetro para forzar una nueva solicitud y evitar caché
      const timestamp = new Date().getTime();
      
      // Configurar las opciones adecuadas para recibir archivos binarios
      return await api.get(`/patients/${patientId}/documents/${documentId}?t=${timestamp}`, {
        responseType: 'blob', // Importante para recibir archivos binarios
        headers: {
          'Accept': '*/*',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        // Asegurar que no se aplique transformación de respuesta automática
        transformResponse: [(data) => data]
      });
    } catch (error) {
      console.error('Error obteniendo documento:', error);
      throw error;
    }
  },
  
  // Eliminar documento de un paciente
  deleteDocument: async (patientId, documentId) => {
    try {
      return await api.delete(`/patients/${patientId}/documents/${documentId}`);
    } catch (error) {
      throw error;
    }
  },
  
  // Obtener la lista de documentos de un paciente
  getDocuments: async (patientId) => {
    try {
      return await api.get(`/patients/${patientId}/documents`);
    } catch (error) {
      throw error;
    }
  }
};

export default patientService;