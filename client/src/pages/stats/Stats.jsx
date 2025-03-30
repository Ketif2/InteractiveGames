// src/pages/stats/Stats.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import patientService from '@/services/patientService';
import { sessionService } from '@/services/sessionService';
import { useAuth } from '@/context/AuthContext';

const Stats = () => {
  const [patientsStats, setPatientsStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'nombre', direction: 'ascending' });
  const { user } = useAuth();

  useEffect(() => {
    fetchPatientsAndSessions();
  }, [user]);

  const fetchPatientsAndSessions = async () => {
    try {
      setLoading(true);
      
      // 1. Obtener los pacientes asignados al terapeuta actual
      let patientsArray;
      if (!user?.id) {
        throw new Error('No se pudo encontrar el ID del terapeuta. Por favor inicie sesión nuevamente.');
      }
      
      const patientsResponse = await patientService.getAllPatients();
      if (Array.isArray(patientsResponse)) {
        patientsArray = patientsResponse;
      } else if (patientsResponse?.data && Array.isArray(patientsResponse.data)) {
        patientsArray = patientsResponse.data;
      } else {
        throw new Error('No se recibieron datos de pacientes en el formato esperado');
      }
  
      // 2. Obtener sesiones para cada paciente
      const patientsWithStats = await Promise.all(patientsArray.map(async (patient) => {
        try {
          // Obtener datos de sesiones semanales y últimas sesiones
          const weeklySession = await sessionService.getTotalSessions(patient.id_paciente);
          
          // Intenta obtener la última sesión del paciente
          let lastSession = null;
          try {
            // Aquí asumimos que hay un endpoint específico para obtener la última sesión
            const lastSessionResponse = await sessionService.getLastSession(patient.id_paciente);
            lastSession = lastSessionResponse;
            console.log('Última sesión para paciente', patient.id_paciente, ':', lastSession);
          } catch (sessionError) {
            console.error('Error obteniendo última sesión:', sessionError);
          }
  
          return {
            ...patient,
            sesiones_completadas: weeklySession.total_sesiones || 0,
            ultima_sesion: lastSession ? lastSession.fecha_sesion : null,
            status: (() => {
              if (!patient.num_sesiones) return 'Sin sesiones';
              const percentage = (weeklySession.total_sesiones / patient.num_sesiones) * 100;
              if (percentage === 100) return 'Completado';
              if (percentage > 0) return 'En progreso';
              return 'Pendiente';
            })()
          };
        } catch (err) {
          console.error(`Error obteniendo datos para paciente ${patient.id_paciente}:`, err);
          return {
            ...patient,
            total_sesiones: 4,
            sesiones_completadas: 0,
            ultima_sesion: null,
            status: 'Sin sesiones'
          };
        }
      }));
  
      console.log('Pacientes con estadísticas completas:', patientsWithStats);
      setPatientsStats(patientsWithStats);
      setError(null);
    } catch (err) {
      console.error("Error al cargar pacientes y sesiones:", err);
      setError(err.message || 'Error al cargar datos');
      setPatientsStats([]);
    } finally {
      setLoading(false);
    }
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

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

  const sortedPatients = Array.isArray(patientsStats) 
    ? [...patientsStats].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      })
    : [];

  const filteredPatients = sortedPatients.filter(patient => {
    const fullName = `${patient.nombre} ${patient.apellido}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  const getCompletionStatus = (completed, total) => {
    if (!total) return 'Sin sesiones';
    
    const percentage = (completed / total) * 100;
    if (percentage === 100) return 'Completado';
    if (percentage > 0) return 'En progreso';
    return 'Pendiente';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completado': return 'bg-green-100 text-green-800';
      case 'En progreso': return 'bg-blue-100 text-blue-800';
      case 'Pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'Sin sesiones': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
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
        {/* Cabecera con título y descripción */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#00398A]">Estadísticas de Pacientes</h1>
          <p className="text-gray-500 mt-1">Monitoreo de progreso y sesiones completadas</p>
        </div>
  
        {/* Panel de KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-[#00A8E3]">
            <p className="text-gray-500 text-sm mb-1">Pacientes Totales</p>
            <p className="text-2xl font-bold">{patientsStats.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
            <p className="text-gray-500 text-sm mb-1">Completados</p>
            <p className="text-2xl font-bold">
              {patientsStats.filter(p => p.status === 'Completado' || 
                getCompletionStatus(p.sesiones_completadas, p.num_sesiones) === 'Completado').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
            <p className="text-gray-500 text-sm mb-1">En Progreso</p>
            <p className="text-2xl font-bold">
              {patientsStats.filter(p => p.status === 'En progreso' || 
                getCompletionStatus(p.sesiones_completadas, p.num_sesiones) === 'En progreso').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-yellow-500">
            <p className="text-gray-500 text-sm mb-1">Pendientes</p>
            <p className="text-2xl font-bold">
              {patientsStats.filter(p => p.status === 'Pendiente' || p.status === 'Sin sesiones' ||
                getCompletionStatus(p.sesiones_completadas, p.num_sesiones) === 'Pendiente' || 
                getCompletionStatus(p.sesiones_completadas, p.num_sesiones) === 'Sin sesiones').length}
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
                <span className="text-sm text-gray-600">Completado</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-blue-500 mr-2"></div>
                <span className="text-sm text-gray-600">En progreso</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
                <span className="text-sm text-gray-600">Pendiente</span>
              </div>
            </div>
          </div>
        </div>
  
        {/* Tabla de estadísticas */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
                        {sortConfig.key === 'id_paciente' && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d={sortConfig.direction === 'ascending' 
                              ? "M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" 
                              : "M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z"} 
                            clipRule="evenodd" />
                          </svg>
                        )}
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
                        {sortConfig.key === 'nombre' && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d={sortConfig.direction === 'ascending' 
                              ? "M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" 
                              : "M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z"} 
                            clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group hover:bg-gray-100"
                    onClick={() => requestSort('sesiones_completadas')}
                  >
                    <div className="flex items-center">
                      <span>Progreso</span>
                      <div className="ml-1 opacity-70 group-hover:opacity-100">
                        {sortConfig.key === 'sesiones_completadas' && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d={sortConfig.direction === 'ascending' 
                              ? "M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" 
                              : "M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z"} 
                            clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group hover:bg-gray-100"
                    onClick={() => requestSort('status')}
                  >
                    <div className="flex items-center">
                      <span>Estado</span>
                      <div className="ml-1 opacity-70 group-hover:opacity-100">
                        {sortConfig.key === 'status' && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d={sortConfig.direction === 'ascending' 
                              ? "M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" 
                              : "M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z"} 
                            clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group hover:bg-gray-100"
                    onClick={() => requestSort('ultima_sesion')}
                  >
                    <div className="flex items-center">
                      <span>Última Sesión</span>
                      <div className="ml-1 opacity-70 group-hover:opacity-100">
                        {sortConfig.key === 'ultima_sesion' && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d={sortConfig.direction === 'ascending' 
                              ? "M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" 
                              : "M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z"} 
                            clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </th>
                  <th scope="col" className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((patient) => {
                    const status = patient.status || getCompletionStatus(patient.sesiones_completadas, patient.num_sesiones);
                    const statusClass = getStatusColor(status);
                    const progressPercentage = patient.num_sesiones > 0 
                      ? Math.min(Math.round((patient.sesiones_completadas / patient.num_sesiones) * 100), 100) 
                      : 0;
                    
                    return (
                      <tr key={patient.id_paciente} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{patient.id_paciente}</div>
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
                            <span className="font-medium">{patient.sesiones_completadas}</span> de <span className="font-medium">{patient.num_sesiones}</span> sesiones
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className={`h-2.5 rounded-full ${
                                progressPercentage === 100 ? 'bg-green-600' : 
                                progressPercentage > 0 ? 'bg-blue-600' : 
                                'bg-yellow-500'
                              }`}
                              style={{ width: `${progressPercentage}%` }}>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClass}`}>
                            {status === 'Completado' && (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                            {status === 'En progreso' && (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                            )}
                            {(status === 'Pendiente' || status === 'Sin sesiones') && (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            )}
                            {status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {patient.ultima_sesion ? (
                            <div className="flex flex-col">
                              <span className="text-sm">{new Date(patient.ultima_sesion).toLocaleDateString()}</span>
                              <span className="text-xs text-gray-500">
                                Hora: {new Date(patient.ultima_sesion).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false})}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">Sin sesiones</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link
                            to={`/stats/patient/${patient.id_paciente}/sessions`}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#00A8E3] hover:bg-[#0085b3] transition-colors shadow-sm"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            Ver historial
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-10 text-center">
                      <div className="flex flex-col items-center">
                        <svg className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-gray-500 text-lg">
                          {searchTerm ? 'No se encontraron pacientes que coincidan con la búsqueda.' : 'No hay datos de pacientes disponibles.'}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Footer informativo */}
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Mostrando <span className="font-medium">{filteredPatients.length}</span> de <span className="font-medium">{patientsStats.length}</span> pacientes
            </div>
          </div>
        </div>
      </div>
  );

};

export default Stats;