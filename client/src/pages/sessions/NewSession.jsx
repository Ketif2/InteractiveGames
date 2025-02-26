import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { sessionService } from '@/services/sessionService';
import  therapistService  from '@/services/therapistService';
import { useAuth } from '@/context/AuthContext';

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
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatientsAndSessions();
  }, [user]);

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

      // Obtener sesiones para cada paciente
      const sessionsPromises = patientsArray.map(async (patient) => {
        try {
          const [weeklySession, todaySession] = await Promise.all([
            sessionService.getSessionsPerWeek(patient.id_paciente),
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
                <tr key={patientId} className="hover:bg-gray-50">
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
            })}
          </tbody>
        </table>
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-300 rounded-lg">
  <h3 className="text-lg font-semibold text-yellow-800 mb-2">Modo Desarrollo</h3>
  <p className="text-sm text-yellow-700 mb-4">
    Utilice los siguientes botones para acceder directamente a los juegos (solo para pruebas)
  </p>
  <div className="flex flex-wrap gap-3">
    <button
      onClick={() => navigate('/games/puzzle/game', {
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
      Rompecabezas (Directo)
    </button>
    <button
      onClick={() => navigate('/games/puzzle/config', {
        state: {
          patientId: 1
        }
      })}
      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
    >
      Configurar Rompecabezas
    </button>
    {/* Añade más botones para otros juegos si lo necesitas */}
  </div>
  <p className="text-xs text-red-500 mt-2">
    ⚠️ Eliminar este componente antes de pasar a producción
  </p>
</div>
        {patients.length === 0 && !loading && !error && (
          <div className="text-center py-8 text-gray-500">
            No hay pacientes asignados
          </div>
        )}
      </div>
    </div>
  );
};

export default NewSession;