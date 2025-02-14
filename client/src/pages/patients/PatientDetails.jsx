// pages/patients/PatientDetails.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import patientService from '@/services/patientService';
import therapistService from '@/services/therapistService';

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [therapist, setTherapist] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPatientDetails = async () => {
    try {
      const data = await patientService.getPatientById(id);
      setPatient(data);
      
      // Si el paciente tiene terapeuta asignado, obtener sus datos
      if (data.id_terapeuta) {
        const therapistData = await therapistService. getTherapistById(data.id_terapeuta);
        setTherapist(therapistData);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPatientDetails();
  }, [id]);

    const handleDelete = async (id) => {
      if (window.confirm('¿Está seguro de eliminar este paciente?')) {
        try {
          setLoading(true);
          await patientService.deletePatient(id);
          fetchPatients(); // Recargar la lista después de eliminar
          setError(null);
        } catch (err) {
          setError(err.message || 'Error al eliminar paciente');
          console.error('Error deleting patient:', err);
        } finally {
          setLoading(false);
        }
      }
    };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00398A]"></div>
      </div>
    );
  }

  if (!patient) return null;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Encabezado con datos básicos */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-[#00398A] mb-2">
              {patient.nombre} {patient.apellido}
            </h2>
            <p className="text-gray-600">
              ID: {patient.id_paciente} | Status: <span className="text-red-500">Pendiente</span>
            </p>
          </div>
          <td className="px-6 py-4 whitespace-nowrap flex space-x-2">
            <button
              onClick={() => {
                setCurrentId(patient.id_paciente);
                setFormData({
                  nombre: patient.nombre,
                  apellido: patient.apellido,
                  fecha_nacimiento: new Date(patient.fecha_nacimiento).toISOString().split('T')[0],
                  diagnostico: patient.diagnostico,
                  id_terapeuta: patient.id_terapeuta,
                });
                setIsEditing(true);
                setIsModalOpen(true);
              }}
              className="bg-[#00A8E3] text-white px-4 py-2 rounded hover:bg-[#7EC3E2]"
            >
              Editar
            </button>
            <button
              onClick={() => handleDelete(patient.id_paciente)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600"
            >
              Eliminar
            </button>
          </td>
        </div>

        {/* Detalles del paciente */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Información Personal</h3>
            <div className="space-y-3">
              <div>
                <label className="font-medium block">Paciente:</label>
                <span>{patient.nombre} {patient.apellido}</span>
              </div>
              <div>
                <label className="font-medium block">Fecha Nacimiento:</label>
                <span>{new Date(patient.fecha_nacimiento).toLocaleDateString()}</span>
              </div>
              <div>
                <label className="font-medium block">Sexo:</label>
                <span>{patient.genero}</span>
              </div>
              <div>
                <label className="font-medium block">Diagnóstico:</label>
                <span>{patient.diagnostico}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Terapeuta Asignado</h3>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600">Nombre: {therapist.nombre} {therapist.apellido}</p>
            </div>
          </div>
        </div>

        {/* Sección de documentos */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Documentos</h3>
          <div className="grid grid-cols-3 gap-4">
            {patient.documentos ? (
              patient.documentos.map((doc, index) => (
                <div key={index} className="p-4 bg-gray-100 rounded-lg">
                  {/* Aquí iría la vista previa o ícono del documento */}
                  <p className="text-center mt-2">{doc.nombre}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No hay documentos disponibles</p>
            )}
          </div>
        </div>

        {/* Botón Regresar */}
        <div className="mt-8">
          <button
            onClick={() => navigate('/patients')}
            className="px-4 py-2 bg-[#00A8E3] hover:bg-[#7EC3E2] text-white rounded-md"
          >
            Regresar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;