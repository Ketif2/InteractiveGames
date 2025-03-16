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
  const [sortConfig, setSortConfig] = useState({ key: 'apellido', direction: 'ascending' });
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
            status: weeklySession.total_sesiones > 0 ? 'Completado' : 'Pendiente'
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
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#00398A]">Estadísticas de Pacientes</h1>
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
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('id_paciente')}
              >
                ID
                {sortConfig.key === 'id_paciente' && (
                  <span className="ml-1">
                    {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('apellido')}
              >
                Nombres
                {sortConfig.key === 'apellido' && (
                  <span className="ml-1">
                    {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('total_sesiones')}
              >
                Sesiones
                {sortConfig.key === 'total_sesiones' && (
                  <span className="ml-1">
                    {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('status')}
              >
                Status
                {sortConfig.key === 'status' && (
                  <span className="ml-1">
                    {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('ultima_sesion')}
              >
                Última Sesión
                {sortConfig.key === 'ultima_sesion' && (
                  <span className="ml-1">
                    {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Historial
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => {
                const status = patient.status || getCompletionStatus(patient.sesiones_completadas, patient.total_sesiones);
                const statusClass = getStatusColor(status);
                
                return (
                  <tr key={patient.id_paciente}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {patient.id_paciente}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {patient.nombre} {patient.apellido}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {patient.sesiones_completadas}/{patient.num_sesiones}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}`}>
                        {status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {patient.ultima_sesion ? new Date(patient.ultima_sesion).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        to={`/stats/patient/${patient.id_paciente}/sessions`}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#00A8E3] hover:bg-[#7EC3E2]"
                      >
                        Ver historial
                      </Link>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                  {searchTerm ? 'No se encontraron pacientes que coincidan con la búsqueda.' : 'No hay pacientes registrados.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Stats;