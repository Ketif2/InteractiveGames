// pages/patients/Patients.jsx
import { useState, useEffect } from 'react';
import patientService from '@/services/patientService';
import therapistService from '@/services/therapistService';

const INITIAL_FORM = {
  nombre: '',
  apellido: '',
  fecha_nacimiento: '',
  diagnostico: '',
  id_terapeuta: '',
  documentos: null
};

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [therapists, setTherapists] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPatients();
    fetchTherapists();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const data = await patientService.getAllPatients();
      setPatients(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al cargar pacientes');
      console.error('Error fetching patients:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTherapists = async () => {
    try {
      const data = await therapistService.getAllTherapists();
      setTherapists(data);
    } catch (err) {
      console.error('Error fetching therapists:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (isEditing) {
        await patientService.updatePatient(currentId, formData);
      } else {
        await patientService.createPatient(formData);
      }
      setIsModalOpen(false);
      setFormData(INITIAL_FORM);
      fetchPatients();
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al guardar paciente');
      console.error('Error saving patient:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este paciente?')) {
      try {
        setLoading(true);
        await patientService.deletePatient(id);
        fetchPatients();
        setError(null);
      } catch (err) {
        setError(err.message || 'Error al eliminar paciente');
        console.error('Error deleting patient:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = async (id) => {
    try {
      setLoading(true);
      const patient = await patientService.getPatientById(id);
      setCurrentId(id);
      setFormData({
        nombre: patient.nombre,
        apellido: patient.apellido,
        fecha_nacimiento: patient.fecha_nacimiento,
        diagnostico: patient.diagnostico,
        id_terapeuta: patient.id_terapeuta,
      });
      setIsEditing(true);
      setIsModalOpen(true);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al cargar paciente');
      console.error('Error loading patient:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00398A]"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#00398A]">Pacientes</h1>
        <button 
          onClick={() => {
            setIsEditing(false);
            setFormData(INITIAL_FORM);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-[#00A8E3] hover:bg-[#7EC3E2] text-white rounded-md"
        >
          Añadir Paciente
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombres</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Apellidos</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Diagnóstico</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {patients.map((patient) => (
              <tr key={patient.id_paciente}>
                <td className="px-6 py-4 whitespace-nowrap">{patient.id_paciente}</td>
                <td className="px-6 py-4 whitespace-nowrap">{patient.nombre}</td>
                <td className="px-6 py-4 whitespace-nowrap">{patient.apellido}</td>
                <td className="px-6 py-4 whitespace-nowrap">{patient.diagnostico}</td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                  <button
                    onClick={() => handleEdit(patient.id_paciente)}
                    className="px-3 py-1 text-[#00A8E3] hover:text-[#7EC3E2] border border-[#00A8E3] rounded-md mr-2"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(patient.id_paciente)}
                    className="px-3 py-1 text-red-600 hover:text-red-800 border border-red-600 rounded-md"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {isEditing ? 'Editar Paciente' : 'Nuevo Paciente'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre:</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Apellido:</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={formData.apellido}
                  onChange={(e) => setFormData({...formData, apellido: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Fecha Nacimiento:</label>
                <input
                  type="date"
                  className="w-full p-2 border rounded-md"
                  value={formData.fecha_nacimiento}
                  onChange={(e) => setFormData({...formData, fecha_nacimiento: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Diagnóstico:</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={formData.diagnostico}
                  onChange={(e) => setFormData({...formData, diagnostico: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">ID Terapeuta:</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded-md"
                  value={formData.id_terapeuta}
                  onChange={(e) => setFormData({...formData, id_terapeuta: e.target.value})}
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-md"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#00A8E3] hover:bg-[#7EC3E2] text-white rounded-md"
                  disabled={loading}
                >
                  {isEditing ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Patients;