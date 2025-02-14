// pages/patients/Patients.jsx
import { useState, useEffect } from 'react';
import patientService from '@/services/patientService';
import therapistService from '@/services/therapistService';
import { Link } from 'react-router-dom';

const INITIAL_FORM = {
  nombre: '',
  apellido: '',
  fecha_nacimiento: '',
  sexo: '',
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
  
  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00398A]"></div>
    </div>
  );

  if (error) return (
    <div className="text-red-500 text-center p-4">
      Error: {error}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6">

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
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                NOMBRES
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                DIAGNÓSTICO
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ACCIONES
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                DETALLES
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {patients.map((patient) => (
              <tr key={patient.id_paciente}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {patient.id_paciente}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {patient.nombre + ' ' + patient.apellido}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {patient.diagnostico}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
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
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#00A8E3] hover:bg-[#7EC3E2] mr-2"
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
                <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                        to={`/patients/${patient.id_paciente}`}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#7EC3E2] hover:bg-[#00A8E3]"
                    >
                        Ver
                    </Link>
                    </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="absolute top-0 left-0 right-0 bottom-0">
          <div className="bg-white p-6 rounded-lg max-w-md mx-auto mt-10 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#00398A]">
                {isEditing ? 'Editar Paciente' : 'Nuevo Paciente'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre:</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md focus:ring-[#00A8E3] focus:border-[#00A8E3]"
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Apellido:</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md focus:ring-[#00A8E3] focus:border-[#00A8E3]"
                  value={formData.apellido}
                  onChange={(e) => setFormData({...formData, apellido: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Fecha Nacimiento:</label>
                <input
                  type="date"
                  className="w-full p-2 border rounded-md focus:ring-[#00A8E3] focus:border-[#00A8E3]"
                  value={formData.fecha_nacimiento}
                  onChange={(e) => setFormData({...formData, fecha_nacimiento: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Sexo:</label>
                <select
                  className="w-full p-2 border rounded-md focus:ring-[#00A8E3] focus:border-[#00A8E3]"
                  value={formData.sexo}
                  onChange={(e) => setFormData({...formData, sexo: e.target.value})}
                  required
                >
                  <option value="">Seleccione el sexo</option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Diagnóstico:</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md focus:ring-[#00A8E3] focus:border-[#00A8E3]"
                  value={formData.diagnostico}
                  onChange={(e) => setFormData({...formData, diagnostico: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Terapeuta:</label>
                <select
                  className="w-full p-2 border rounded-md focus:ring-[#00A8E3] focus:border-[#00A8E3]"
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
                  className="px-4 py-2 border rounded-md hover:bg-gray-50"
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