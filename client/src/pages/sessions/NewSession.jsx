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
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-bold text-[#00398A] mb-4 sm:mb-0">Sesiones</h1>
      </div>
      <div className="flex justify-between items-center mb-6">
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
                  Nombres {getSortIcon('nombre')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sesiones
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Juego
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => {
                  const patientId = patient.id_paciente;
                  const weeklySession = weeklyPatientSessions[patientId] || 0;
                  const hasToday = todaySessions[patientId] || false;

                  return (
                    <tr key={patientId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {patientId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {`${patient.nombre} ${patient.apellido}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {`${weeklySession}/${patient.num_sesiones}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          hasToday ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>
                          {hasToday ? "Completado" : "Pendiente"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {!hasToday ? (
                          <Link
                            to={`/games/${patientId}`}
                            state={{ patientId }}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#00A8E3] hover:bg-[#7EC3E2] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00398A]"
                          >
                            Jugar
                          </Link>
                        ) : (
                          <Link
                            to={`/sessions/${patientId}/stats`}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#7EC3E2] hover:bg-[#00A8E3] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00398A]"
                          >
                            Estadísticas
                          </Link>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    {searchTerm ? 'No se encontraron pacientes que coincidan con la búsqueda.' : 'No hay pacientes asignados'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-300 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">PRUEBAS</h3>
          <p className="text-sm text-yellow-700 mb-4">
            Utilice los siguientes botones para acceder directamente a los juegos
          </p>
          <div className="flex flex-wrap gap-3">
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
              className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
            >
              Rompecabezas
            </button>
            {/* Añade más botones para otros juegos si lo necesitas */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewSession;