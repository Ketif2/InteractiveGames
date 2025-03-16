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
  evaluacion_inicial: '',
  evaluacion_final: '',
  num_sesiones: '',
  documentos: null
};

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [therapists, setTherapists] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false); 
  const [patientToDelete, setPatientToDelete] = useState(null);
  
  // Estados para ordenamiento y búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: 'nombre',
    direction: 'ascending'
  });

  useEffect(() => {
    fetchPatients();
    fetchTherapists();
  }, []);

  // Filtrar pacientes cuando cambia la búsqueda o los datos
  useEffect(() => {
    if (patients) {
      const filtered = patients.filter(patient => {
        const fullName = `${patient.nombre} ${patient.apellido}`.toLowerCase();
        const id = patient.id_paciente.toString();
        return fullName.includes(searchTerm.toLowerCase()) || 
               id.includes(searchTerm);
      });
      
      // Ordenar pacientes
      const sortedPatients = [...filtered].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
      
      setFilteredPatients(sortedPatients);
    }
  }, [patients, searchTerm, sortConfig]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const data = await patientService.getAllPatients();
      setPatients(data);
      setFilteredPatients(data);
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

  // Función para ordenar
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Obtener el ícono de ordenamiento
  const getSortIcon = (columnName) => {
    if (sortConfig.key !== columnName) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 inline-block ml-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      );
    }
    
    return sortConfig.direction === 'ascending' ? (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600 inline-block ml-1" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600 inline-block ml-1" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Convertir campos numéricos a enteros
    const dataToSubmit = {
      ...formData,
      evaluacion_inicial: formData.evaluacion_inicial ? parseInt(formData.evaluacion_inicial) : null,
      evaluacion_final: formData.evaluacion_final ? parseInt(formData.evaluacion_final) : null,
      num_sesiones: formData.num_sesiones ? parseInt(formData.num_sesiones) : null
    };
    
    try {
      setLoading(true);
      if (isEditing) {
        await patientService.updatePatient(currentId, dataToSubmit);
      } else {
        await patientService.createPatient(dataToSubmit);
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

  const handleDelete = async () => {
    try {
      setLoading(true);
      await patientService.deletePatient(patientToDelete);
      fetchPatients();
      setShowDeleteModal(false);
      setPatientToDelete(null);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al eliminar paciente');
      console.error('Error deleting patient:', err);
    } finally {
      setLoading(false);
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
      {/* Encabezado - Primera fila: solo título */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-[#00398A]">Pacientes</h1>
      </div>

      {/* Segunda fila: búsqueda y botón */}
      <div className="flex justify-between items-center mb-6">
        {/* Barra de búsqueda - lado izquierdo */}
        <div className="relative w-auto" style={{ width: "300px" }}>
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
            </svg>
          </div>
          <input
            type="text"
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#00A8E3] focus:border-[#00A8E3] block w-full pl-10 p-2.5"
            placeholder="Buscar paciente"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Botón Añadir Paciente - lado derecho */}
        <button 
          onClick={() => {
            setIsEditing(false);
            setFormData(INITIAL_FORM);
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 bg-[#00A8E3] hover:bg-[#7EC3E2] text-white rounded-md whitespace-nowrap"
        >
          Añadir Paciente
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('id_paciente')}
                >
                  ID {getSortIcon('id_paciente')}
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('nombre')}
                >
                  NOMBRES {getSortIcon('nombre')}
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('evaluacion_inicial')}
                >
                  EVALUACIÓN {getSortIcon('evaluacion_inicial')}
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('num_sesiones')}
                >
                  SESIONES {getSortIcon('num_sesiones')}
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
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <tr key={patient.id_paciente}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {patient.id_paciente}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {patient.nombre + ' ' + patient.apellido}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {patient.evaluacion_inicial !== null && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-lg mr-1">
                          Inicial: {patient.evaluacion_inicial}/30
                        </span>
                      )}
                      {patient.evaluacion_final !== null && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-lg">
                          Final: {patient.evaluacion_final}/30
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {patient.num_sesiones || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => {
                          setCurrentId(patient.id_paciente);
                          setFormData({
                            nombre: patient.nombre || '',
                            apellido: patient.apellido || '',
                            fecha_nacimiento: patient.fecha_nacimiento ? new Date(patient.fecha_nacimiento).toISOString().split('T')[0] : '',
                            sexo: patient.sexo || '',
                            diagnostico: patient.diagnostico || '',
                            id_terapeuta: patient.id_terapeuta || '',
                            evaluacion_inicial: patient.evaluacion_inicial !== null ? patient.evaluacion_inicial.toString() : '',
                            evaluacion_final: patient.evaluacion_final !== null ? patient.evaluacion_final.toString() : '',
                            num_sesiones: patient.num_sesiones !== null ? patient.num_sesiones.toString() : '',
                          });
                          setIsEditing(true);
                          setIsModalOpen(true);
                        }}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#00A8E3] hover:bg-[#7EC3E2] mr-2"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => {
                          setPatientToDelete(patient.id_paciente);
                          setShowDeleteModal(true);
                        }}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      >
                        Eliminar
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        to={`/patients/${patient.id_paciente}`}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#00A8E3] hover:bg-[#7EC3E2]"
                      >
                        Ver
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    {searchTerm ? 'No se encontraron pacientes que coincidan con la búsqueda.' : 'No hay pacientes registrados.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md mx-auto shadow-lg">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-4">
                Confirmar Eliminación
              </h3>
              <p className="text-gray-600 mb-6">
                ¿Está seguro que desea eliminar este paciente? Esta acción no se puede deshacer.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setPatientToDelete(null);
                  }}
                  className="px-4 py-2 bg-gray-600 text-white border rounded hover:bg-gray-700"
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
        </div>
      )}
      
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-2xl mx-auto shadow-lg w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#00398A]">
                {isEditing ? 'Editar Paciente' : 'Nuevo Paciente'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Matriz 4x2 para datos del paciente */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                {/* Fila 1 */}
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
                
                {/* Fila 2 */}
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
                
                {/* Fila 3 */}
                <div>
                  <label className="block text-sm font-medium mb-1">Sexo:</label>
                  <select
                    className="w-full p-2 border rounded-md focus:ring-[#00A8E3] focus:border-[#00A8E3]"
                    value={formData.sexo}
                    onChange={(e) => setFormData({...formData, sexo: e.target.value})}
                    required
                  >
                    <option value="" disabled>Seleccione el sexo</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Número de Sesiones:</label>
                  <input
                    type="number"
                    min="0"
                    className="w-full p-2 border rounded-md focus:ring-[#00A8E3] focus:border-[#00A8E3]"
                    value={formData.num_sesiones}
                    onChange={(e) => setFormData({...formData, num_sesiones: e.target.value})}
                    placeholder="Número de sesiones"
                  />
                </div>
                
                {/* Fila 4 - Evaluaciones */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Evaluación Inicial (MMSE 0-30):
                    <span className="text-gray-500 text-xs ml-1">Mini-Mental State Examination</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    className="w-full p-2 border rounded-md focus:ring-[#00A8E3] focus:border-[#00A8E3]"
                    value={formData.evaluacion_inicial}
                    onChange={(e) => setFormData({...formData, evaluacion_inicial: e.target.value})}
                    placeholder="Puntaje de 0 a 30"
                  />
                </div>
                
                {/* Evaluación final solo visible en modo edición */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {isEditing ? 'Evaluación Final (MMSE 0-30):' : 'Evaluación Final (MMSE 0-30):'}
                    <span className="text-gray-500 text-xs ml-1">Mini-Mental State Examination</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    className="w-full p-2 border rounded-md focus:ring-[#00A8E3] focus:border-[#00A8E3]"
                    value={formData.evaluacion_final}
                    onChange={(e) => setFormData({...formData, evaluacion_final: e.target.value})}
                    placeholder={isEditing ? "Puntaje de 0 a 30" : "No disponible en pacientes nuevos"}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              {/* Campo de diagnóstico ampliado - Ocupa todo el ancho */}
              <div className="pt-1">
                <label className="block text-sm font-medium mb-1">Diagnóstico:</label>
                <textarea
                  className="w-full p-2 border rounded-md focus:ring-[#00A8E3] focus:border-[#00A8E3] min-h-[100px]"
                  value={formData.diagnostico}
                  onChange={(e) => setFormData({...formData, diagnostico: e.target.value})}
                  required
                  placeholder="Ingrese un diagnóstico detallado del paciente"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#00A8E3] hover:bg-[#7EC3E2] text-white rounded-md text-sm font-medium"
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