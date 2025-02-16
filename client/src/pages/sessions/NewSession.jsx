import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {sessionService} from '@/services/sessionService';
import patientService from '@/services/patientService'

const INITIAL_FORM = {
  id_paciente: '',
  id_juego: '',
  id_terapeuta: '',
  duracion: '',
  aciertos: 0,
  fallos: 0,
  observaciones_terapeuta: ''
};

const NewSession = () => {
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [weeklyPatientSessions, setWeeklyPatientSessions] = useState({});
  const [todaySessions, setTodaySessions] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPatientsAndSessions();
  }, []);

  const fetchPatientsAndSessions = async () => {
    try {
      setLoading(true);
      const patientsData = await patientService.getAllPatients();
      
      if (!patientsData || !Array.isArray(patientsData) || patientsData.length === 0) {
        throw new Error('No se encontraron pacientes');
      }

      console.log('Pacientes obtenidos:', patientsData);

      // Obtener sesiones para cada paciente
      const sessionsPromises = patientsData.map(async (patient) => {
        try {
          const [weeklySession, todaySession] = await Promise.all([
            sessionService.getSessionsPerWeek(patient.id_paciente),
            sessionService.getSessionToday(patient.id_paciente)
          ]);

          console.log(`Datos sesiones paciente ${patient.id_paciente}:`, {
            weekly: weeklySession,
            today: todaySession
          });

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

      setPatients(patientsData);
      setWeeklyPatientSessions(weeklyMap);
      setTodaySessions(todayMap);
      setError(null);
      
    } catch (err) {
      console.error('Error en fetchPatientsAndSessions:', err);
      setError(err.message || 'Error al cargar datos');
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
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombres
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
            {patients.map((patient) => {
              const patientId = patient.id_paciente;
              const weeklySession = weeklyPatientSessions[patientId] || 0;
              const hasToday = todaySessions[patientId] || false;

              return (
                <tr key={patientId}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {patientId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {`${patient.nombre} ${patient.apellido}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {`${weeklySession}/4`}
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
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NewSession;