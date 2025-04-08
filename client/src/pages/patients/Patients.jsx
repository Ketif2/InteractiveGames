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

  // Función para calcular la edad a partir de la fecha de nacimiento
  const calculateAge = (birthDateStr) => {
    const birthDate = new Date(birthDateStr);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
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
    <div className="container mx-auto px-4 py-3">
      {/* Header con título */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#00398A]">Gestión de Pacientes</h1>
        <p className="text-gray-500 mt-2">Administración de pacientes en terapia</p>
      </div>
      
      {/* Barra de acciones con búsqueda y botón */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-auto flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5 focus:ring-[#00A8E3] focus:border-[#00A8E3] transition-all"
              placeholder="Buscar por nombre o ID de paciente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button 
            onClick={() => {
              setIsEditing(false);
              setFormData(INITIAL_FORM);
              setIsModalOpen(true);
            }}
            className="px-5 py-2.5 bg-[#00A8E3] hover:bg-[#0088b3] transition-colors text-white rounded-lg flex items-center space-x-2 whitespace-nowrap shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <span>Añadir Paciente</span>
          </button>
        </div>
      </div>
  
      {/* Tabla mejorada */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group hover:bg-gray-100"
                  onClick={() => requestSort('id_paciente')}
                >
                  <div className="flex items-center">
                    <span>ID</span>
                    <div className="ml-1 opacity-70 group-hover:opacity-100">
                      {getSortIcon('id_paciente')}
                    </div>
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group hover:bg-gray-100"
                  onClick={() => requestSort('nombre')}
                >
                  <div className="flex items-center">
                    <span>Paciente</span>
                    <div className="ml-1 opacity-70 group-hover:opacity-100">
                      {getSortIcon('nombre')}
                    </div>
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group hover:bg-gray-100"
                  onClick={() => requestSort('evaluacion_inicial')}
                >
                  <div className="flex items-center">
                    <span>Evaluación MMSE</span>
                    <div className="ml-1 opacity-70 group-hover:opacity-100">
                      {getSortIcon('evaluacion_inicial')}
                    </div>
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group hover:bg-gray-100"
                  onClick={() => requestSort('num_sesiones')}
                >
                  <div className="flex items-center">
                    <span>Sesiones</span>
                    <div className="ml-1 opacity-70 group-hover:opacity-100">
                      {getSortIcon('num_sesiones')}
                    </div>
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <tr key={patient.id_paciente} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{patient.id_paciente}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 mr-3 overflow-hidden rounded-full">
                          {patient.sexo === 'Masculino' ? (
                            <img 
                              src="/icons/old-man.png" 
                              alt="Avatar masculino" 
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <img 
                              src="/icons/old-woman.png" 
                              alt="Avatar femenino" 
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{patient.nombre} {patient.apellido}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            {patient.fecha_nacimiento && (
                              <span>
                                {calculateAge(patient.fecha_nacimiento)} años
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-2">
                        {patient.evaluacion_inicial !== null && (
                          <div className="flex items-center">
                            <span className="mr-2 text-xs font-medium text-gray-500">Inicial:</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-2.5 w-24">
                              <div 
                                className="bg-blue-600 h-2.5 rounded-full" 
                                style={{ width: `${(patient.evaluacion_inicial / 30) * 100}%` }}>
                              </div>
                            </div>
                            <span className="ml-2 text-sm font-medium text-gray-900">{patient.evaluacion_inicial}/30</span>
                          </div>
                        )}
                        {patient.evaluacion_final !== null && (
                          <div className="flex items-center">
                            <span className="mr-2 text-xs font-medium text-gray-500">Final:</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-2.5 w-24">
                              <div 
                                className="bg-green-600 h-2.5 rounded-full" 
                                style={{ width: `${(patient.evaluacion_final / 30) * 100}%` }}>
                              </div>
                            </div>
                            <span className="ml-2 text-sm font-medium text-gray-900">{patient.evaluacion_final}/30</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-gray-400 mr-1.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path>
                        </svg>
                        <span className="text-sm font-medium">
                          {patient.num_sesiones || '0'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <div className="flex space-x-2">
                        <Link
                          to={`/patients/${patient.id_paciente}`}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Ver
                        </Link>
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
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-yellow-700 bg-yellow-100 hover:bg-yellow-200 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                          Editar
                        </button>
                        <button
                          onClick={() => {
                            setPatientToDelete(patient.id_paciente);
                            setShowDeleteModal(true);
                          }}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center">
                    <div className="flex flex-col items-center">
                      <svg className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-gray-500 text-lg">
                        {searchTerm ? 'No se encontraron pacientes que coincidan con la búsqueda.' : 'No hay pacientes registrados.'}
                      </p>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setFormData(INITIAL_FORM);
                          setIsModalOpen(true);
                        }}
                        className="mt-4 px-4 py-2 bg-[#00A8E3] hover:bg-[#0088b3] text-white rounded-md text-sm transition-colors"
                      >
                        Registrar paciente
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Información de la tabla */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="hidden sm:block">
            <p className="text-sm text-gray-700">
              Mostrando <span className="font-medium">{filteredPatients.length}</span> {filteredPatients.length === 1 ? 'paciente' : 'pacientes'} 
              {searchTerm && ' para la búsqueda actual'}
            </p>
          </div>
        </div>
      </div>
  
      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md mx-auto shadow-xl">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <svg className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
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
                  className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal para crear/editar paciente */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center overflow-y-auto py-10">
          <div className="bg-white p-6 rounded-lg max-w-2xl mx-auto shadow-xl w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#00398A] flex items-center">
                {isEditing ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Editar Paciente
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Nuevo Paciente
                  </>
                )}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Matriz para datos del paciente */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                {/* Fila 1 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre:</label>
                  <input
                    type="text"
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#00A8E3] focus:border-[#00A8E3] transition-colors"
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Apellido:</label>
                  <input
                    type="text"
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#00A8E3] focus:border-[#00A8E3] transition-colors"
                    value={formData.apellido}
                    onChange={(e) => setFormData({...formData, apellido: e.target.value})}
                    required
                  />
                </div>
                
                {/* Fila 2 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Psicorehabilitador:</label>
                  <select
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#00A8E3] focus:border-[#00A8E3] transition-colors"
                    value={formData.id_terapeuta}
                    onChange={(e) => setFormData({...formData, id_terapeuta: e.target.value})}
                    required
                  >
                    <option value="">Seleccione un psicorehabilitador</option>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Nacimiento:</label>
                  <input
                    type="date"
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#00A8E3] focus:border-[#00A8E3] transition-colors"
                    value={formData.fecha_nacimiento}
                    onChange={(e) => setFormData({...formData, fecha_nacimiento: e.target.value})}
                    required
                  />
                </div>
                
                {/* Fila 3 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sexo:</label>
                  <select
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#00A8E3] focus:border-[#00A8E3] transition-colors"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Número de Sesiones:</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      className="w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#00A8E3] focus:border-[#00A8E3] pl-10 transition-colors"
                      value={formData.num_sesiones}
                      onChange={(e) => setFormData({...formData, num_sesiones: e.target.value})}
                      placeholder="0"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                  {/* Fila 4 - Evaluaciones */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Evaluación Inicial (MMSE):
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <input
                        type="number"
                        min="0"
                        max="30"
                        className="w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#00A8E3] focus:border-[#00A8E3] pl-10 transition-colors"
                        value={formData.evaluacion_inicial}
                        onChange={(e) => setFormData({...formData, evaluacion_inicial: e.target.value})}
                        placeholder="0-30"
                      />
                    </div>
                    <span className="text-xs text-gray-500 mt-1 block">Mini-Mental State Examination (0-30 puntos)</span>
                  </div>

                  {/* Evaluación final solo visible en modo edición */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {isEditing ? 'Evaluación Final (MMSE):' : 'Evaluación Final (MMSE):'}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <input
                        type="number"
                        min="0"
                        max="30"
                        className={`w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#00A8E3] focus:border-[#00A8E3] pl-10 transition-colors ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                        value={formData.evaluacion_final}
                        onChange={(e) => setFormData({...formData, evaluacion_final: e.target.value})}
                        placeholder={isEditing ? "0-30" : "No disponible en pacientes nuevos"}
                        disabled={!isEditing}
                      />
                    </div>
                    <span className="text-xs text-gray-500 mt-1 block">Mini-Mental State Examination (0-30 puntos)</span>
                  </div>
                </div>
    
                {/* Campo de diagnóstico ampliado - Ocupa todo el ancho */}
                <div className="pt-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Diagnóstico:</label>
                  <textarea
                    className="w-full p-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#00A8E3] focus:border-[#00A8E3] min-h-[120px] transition-colors"
                    value={formData.diagnostico}
                    onChange={(e) => setFormData({...formData, diagnostico: e.target.value})}
                    required
                    placeholder="Ingrese un diagnóstico detallado del paciente"
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-5">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#00A8E3] hover:bg-[#0088b3] text-white rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00A8E3] shadow-sm transition-colors"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Procesando...
                      </span>
                    ) : (
                      isEditing ? 'Actualizar Paciente' : 'Guardar Paciente'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {/* Indicador de carga */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00A8E3]"></div>
                <p className="text-[#00398A] font-medium">Procesando...</p>
              </div>
            </div>
          </div>
        )}
      </div>
    )

};

export default Patients;