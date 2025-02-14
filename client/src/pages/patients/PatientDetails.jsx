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
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    fecha_nacimiento: '',
    sexo: '',
    diagnostico: '',
    id_terapeuta: ''
  });

  const fetchPatientDetails = async () => {
    try {
      const data = await patientService.getPatientById(id);
      setPatient(data);
      
      if (data.id_terapeuta) {
        const therapistData = await therapistService.getTherapistById(data.id_terapeuta);
        setTherapist(therapistData);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error al cargar los detalles del paciente');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientDetails();
  }, [id]);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await patientService.deletePatient(patientToDelete);
      setShowDeleteModal(false);
      setPatientToDelete(null);
      setError(null);
      // Navegar de vuelta a la lista después de eliminar
      navigate('/patients');
    } catch (err) {
      setError(err.message || 'Error al eliminar paciente');
      console.error('Error deleting patient:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await patientService.updatePatient(currentId, formData);
      setIsModalOpen(false);
      fetchPatientDetails();
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al actualizar paciente');
      console.error('Error updating patient:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      try {
        const formData = new FormData();
        formData.append('document', file);
        await patientService.uploadDocument(patient.id_paciente, formData);
        fetchPatientDetails();
      } catch (error) {
        console.error('Error uploading document:', error);
        setError('Error al subir el documento');
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

  if (error) return <div className="text-red-500 text-center p-4">Error: {error}</div>;
  if (!patient) return null;

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="bg-white rounded-lg shadow-lg p-4 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <div>
            <h2 className="text-xl font-bold text-[#00398A]">{patient.nombre} {patient.apellido}</h2>
            <p className="text-sm text-gray-600">ID: {patient.id_paciente} | Status: <span className="text-red-500">Pendiente</span></p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setCurrentId(patient.id_paciente);
                setFormData({
                  ...patient,
                  fecha_nacimiento: new Date(patient.fecha_nacimiento).toISOString().split('T')[0]
                });
                setIsEditing(true);
                setIsModalOpen(true);
              }}
              className="bg-[#00A8E3] text-white px-3 py-1 rounded text-sm hover:bg-[#7EC3E2]"
            >
              Editar
            </button>
            <button
              onClick={() => {
                setPatientToDelete(patient.id_paciente);
                setShowDeleteModal(true);
              }}
              className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
            >
              Eliminar
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-2 gap-6">
          {/* Información Personal */}
          <div className="space-y-2">
            <h3 className="font-semibold mb-2">Información Personal</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <label className="font-medium block text-gray-600">Fecha Nacimiento:</label>
                <span>{new Date(patient.fecha_nacimiento).toLocaleDateString()}</span>
              </div>
              <div>
                <label className="font-medium block text-gray-600">Sexo:</label>
                <span>{patient.sexo}</span>
              </div>
              <div className="col-span-2">
                <label className="font-medium block text-gray-600">Diagnóstico:</label>
                <span>{patient.diagnostico}</span>
              </div>
            </div>
          </div>

          {/* Terapeuta */}
          <div>
            <h3 className="font-semibold mb-2">Terapeuta Asignado</h3>
            <div className="bg-gray-50 p-3 rounded text-sm">
              {therapist ? (
                <p>Nombre: {therapist.nombre} {therapist.apellido}</p>
              ) : (
                <p className="text-gray-500">No hay terapeuta asignado</p>
              )}
            </div>
          </div>
        </div>

        {/* Documentos */}
        <div className="mt-4 border-t pt-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Documentos</h3>
            <div className="relative">
              <input
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                id="fileInput"
              />
              <label
                htmlFor="fileInput"
                className="bg-[#00A8E3] text-white px-3 py-1 rounded text-sm hover:bg-[#7EC3E2] cursor-pointer"
              >
                Subir Documento
              </label>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {patient.documentos && patient.documentos.length > 0 ? (
              patient.documentos.map((doc, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded text-sm">
                  <p className="truncate">{doc.nombre}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm col-span-3">No hay documentos disponibles</p>
            )}
          </div>
        </div>

        {/* Botón Regresar */}
        <div className="mt-4 pt-4 border-t">
          <button
            onClick={() => navigate('/patients')}
            className="text-sm bg-[#00A8E3] hover:bg-[#7EC3E2] text-white px-3 py-1 rounded"
          >
            Regresar
          </button>
        </div>
      </div>

      {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl">Editar Paciente</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block mb-1">Nombre:</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label className="block mb-1">Apellido:</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={formData.apellido}
                    onChange={(e) => setFormData({...formData, apellido: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label className="block mb-1">Fecha Nacimiento:</label>
                  <input
                    type="date"
                    className="w-full p-2 border rounded"
                    value={formData.fecha_nacimiento}
                    onChange={(e) => setFormData({...formData, fecha_nacimiento: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1">Sexo:</label>
                  <select
                    className="w-full p-2 border rounded"
                    value={formData.sexo}
                    onChange={(e) => setFormData({...formData, sexo: e.target.value})}
                    required
                  >
                    <option value="">Seleccione el sexo</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                  </select>
                </div>
                
                <div>
                  <label className="block mb-1">Diagnóstico:</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={formData.diagnostico}
                    onChange={(e) => setFormData({...formData, diagnostico: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1">Terapeuta:</label>
                  <select
                    className="w-full p-2 border rounded"
                    value={formData.id_terapeuta}
                    onChange={(e) => setFormData({...formData, id_terapeuta: e.target.value})}
                    required
                  >
                    <option value="">Seleccione un terapeuta</option>
                    {therapists.map((therapist) => (
                      <option 
                        key={therapist.id_terapeuta} 
                        value={therapist.id_terapeuta}
                      >
                        {`${therapist.nombre} ${therapist.apellido}`}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex justify-end space-x-2 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border rounded hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#00A8E3] text-white rounded hover:bg-[#7EC3E2]"
                  >
                    Actualizar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal de Eliminación */}
        {showDeleteModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
              <h3 className="text-xl mb-4">Confirmar Eliminación</h3>
              <p className="text-gray-600 mb-6">
                ¿Está seguro que desea eliminar este paciente? Esta acción no se puede deshacer.
              </p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setPatientToDelete(null);
                  }}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default PatientDetails;