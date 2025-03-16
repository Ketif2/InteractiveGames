import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { sessionService } from '@/services/sessionService';
import therapistService from '@/services/therapistService';
import { useAuth } from '@/context/AuthContext';

const NewSession = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [weeklyPatientSessions, setWeeklyPatientSessions] = useState({});
  const [todaySessions, setTodaySessions] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: 'nombre',
    direction: 'ascending'
  });
  
  useEffect(() => {
    fetchPatientsAndSessions();
  }, [user]);

  // Filtrar y ordenar pacientes cuando cambia la búsqueda o los datos
  useEffect(() => {
    if (patients) {
      const filtered = patients.filter(patient => {
        const fullName = `${patient.nombre} ${patient.apellido}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase());
      });
      
      // Ordenar pacientes solo por ID o nombre
      const sortedPatients = [...filtered].sort((a, b) => {
        if (sortConfig.key === 'id_paciente') {
          return sortConfig.direction === 'ascending' 
            ? a.id_paciente - b.id_paciente 
            : b.id_paciente - a.id_paciente;
        } else if (sortConfig.key === 'nombre') {
          const nameA = `${a.nombre} ${a.apellido}`.toLowerCase();
          const nameB = `${b.nombre} ${b.apellido}`.toLowerCase();
          return sortConfig.direction === 'ascending'
            ? nameA.localeCompare(nameB)
            : nameB.localeCompare(nameA);
        }
        return 0;
      });
      
      setFilteredPatients(sortedPatients);
    }
  }, [patients, searchTerm, sortConfig]);

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

  const fetchPatientsAndSessions = async () => {
    try {
      setLoading(true);
      let patientsArray;
      if (!user?.id) {
        throw new Error('No se pudo encontrar el ID del terapeuta. Por favor inicie sesión nuevamente.');
      }
      
      const patientsResponse = await therapistService.getTherapistPatients(user.id);
      if (Array.isArray(patientsResponse)) {
        patientsArray = patientsResponse;
      } else if (patientsResponse?.data && Array.isArray(patientsResponse.data)) {
        patientsArray = patientsResponse.data;
      } else {
        throw new Error('No se recibieron datos de pacientes en el formato esperado');
      }
      setPatients(patientsArray);
      setFilteredPatients(patientsArray);

      // Obtener sesiones para cada paciente
      const sessionsPromises = patientsArray.map(async (patient) => {
        try {
          const [weeklySession, todaySession] = await Promise.all([
            sessionService.getTotalSessions(patient.id_paciente),
            sessionService.getSessionToday(patient.id_paciente)
          ]);

          return {
            patientId: patient.id_paciente,
            weeklyCount: weeklySession.total_sesiones || 0,
            hasToday: todaySession.has_session || false
          };
        } catch (err) {
          console.error(`Error obteniendo sesiones para paciente ${patient.id_paciente}:`, err);
          return {
            patientId: patient.id_paciente,
            weeklyCount: 0,
            hasToday: false
          };
        }
      });

      const sessionsData = await Promise.all(sessionsPromises);
      
      // Crear mapeos de sesiones
      const weeklyMap = {};
      const todayMap = {};
      
      sessionsData.forEach(({ patientId, weeklyCount, hasToday }) => {
        weeklyMap[patientId] = weeklyCount;
        todayMap[patientId] = hasToday;
      });

      setWeeklyPatientSessions(weeklyMap);
      setTodaySessions(todayMap);
      setError(null);

    } catch (error) {
      console.error('Error detallado en fetchPatientsAndSessions:', error);
      setError(error.message || 'Error al cargar los datos');
      if (error.message.includes('No se pudo encontrar el ID del terapeuta')) {
        navigate('/login');
      }
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

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Cabecera con título y estadísticas */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#00398A]">Sesiones de Terapia</h1>
          <p className="text-gray-500 mt-1">Gestiona las sesiones de tus pacientes</p>
        </div>
        
        {/* Panel de métricas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-[#00A8E3]">
            <p className="text-gray-500 text-sm mb-1">Total Pacientes</p>
            <p className="text-2xl font-bold">{filteredPatients.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
            <p className="text-gray-500 text-sm mb-1">Sesiones Completadas Hoy</p>
            <p className="text-2xl font-bold">
              {Object.values(todaySessions).filter(hasSession => hasSession).length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-yellow-500">
            <p className="text-gray-500 text-sm mb-1">Sesiones Pendientes</p>
            <p className="text-2xl font-bold">
              {filteredPatients.length - Object.values(todaySessions).filter(hasSession => hasSession).length}
            </p>
          </div>
        </div>
        
        {/* Barra de búsqueda y filtros */}
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
                placeholder="Buscar paciente por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-sm text-gray-600">Completada</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                <span className="text-sm text-gray-600">Pendiente</span>
              </div>
            </div>
          </div>
        </div>
  
        {/* Tabla de pacientes */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    scope="col" 
                    className="w-16 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group hover:bg-gray-100"
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
                    className="w-1/3 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group hover:bg-gray-100"
                    onClick={() => requestSort('nombre')}
                  >
                    <div className="flex items-center">
                      <span>Paciente</span>
                      <div className="ml-1 opacity-70 group-hover:opacity-100">
                        {getSortIcon('nombre')}
                      </div>
                    </div>
                  </th>
                  <th scope="col" className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progreso
                  </th>
                  <th scope="col" className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado Hoy
                  </th>
                  <th scope="col" className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((patient) => {
                    const patientId = patient.id_paciente;
                    const weeklySession = weeklyPatientSessions[patientId] || 0;
                    const hasToday = todaySessions[patientId] || false;
                    const progress = patient.num_sesiones > 0 
                      ? Math.min(Math.round((weeklySession / patient.num_sesiones) * 100), 100) 
                      : 0;
  
                    return (
                      <tr key={patientId} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{patientId}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 mr-3 overflow-hidden rounded-full">
                              {patient.sexo === 'Masculino' ? (
                                <img 
                                  src="/src/assets/icons/old-man.png" 
                                  alt="Avatar masculino" 
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <img 
                                  src="/src/assets/icons/old-woman.png" 
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
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm mb-1">
                            <span className="font-medium">{weeklySession}</span> de <span className="font-medium">{patient.num_sesiones || 0}</span> sesiones
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className={`h-2.5 rounded-full ${progress >= 100 ? 'bg-green-600' : 'bg-blue-600'}`}
                              style={{ width: `${progress}%` }}>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {hasToday ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              Completada
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                              </svg>
                              Pendiente
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {!hasToday ? (
                            <Link
                              to={`/games/${patientId}`}
                              state={{ patientId }}
                              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#00A8E3] hover:bg-[#0085b3] transition-colors shadow-sm"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Iniciar Juego
                            </Link>
                          ) : (
                            <Link
                              to={`/sessions/${patientId}/stats`}
                              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#00398A] hover:bg-[#002a63] transition-colors shadow-sm"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                              </svg>
                              Ver Estadísticas
                            </Link>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center">
                      <div className="flex flex-col items-center">
                        <svg className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-gray-500 text-lg">
                          {searchTerm ? 'No se encontraron pacientes que coincidan con la búsqueda.' : 'No tienes pacientes asignados.'}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
  
        {/* Sección de pruebas */}
        <div className="bg-white shadow-md rounded-lg border border-yellow-200 overflow-hidden mb-8">
          <div className="bg-yellow-50 px-6 py-4 border-b border-yellow-200">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-lg font-semibold text-yellow-800">Modo Pruebas</h3>
            </div>
            <p className="text-sm text-yellow-700 mt-2">
              Acceso directo a los juegos para pruebas y desarrollo. Estas opciones no estarán disponibles en producción.
            </p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={() => navigate('/games/puzzle/play', {
                  state: {
                    config: {
                      difficulty: 'medium',
                      gridSize: '4',
                      selectedPuzzles: [{
                        id: '1M',
                        name: 'Alpacas',
                        url: '/src/assets/images/puzzle/medium/Alpacas.jpg',
                        difficulty: 'medium'
                      }]
                    },
                    patientId: 1
                  }
                })}
                className="bg-white border border-yellow-300 rounded-lg p-4 flex flex-col items-center justify-center hover:bg-yellow-50 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                </svg>
                <span className="text-sm font-medium text-yellow-800">Rompecabezas</span>
              </button>
              {/* Puedes añadir más botones para otros juegos aquí */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default NewSession;