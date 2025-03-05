import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { statsService } from '@/services/statsService';
import patientService from '@/services/patientService';

const PatientStats = () => {
  const { id } = useParams();
  const [sessions, setSessions] = useState([]);
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 1. Obtener información del paciente
        const patientData = await patientService.getPatientById(id);
        setPatient(patientData?.data || patientData);
        
        // 2. Obtener sesiones directamente
        const sessionsData = await statsService.getSessionsByPatient(id);
        setSessions(Array.isArray(sessionsData) ? sessionsData : []);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  if (loading) {
    return <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00398A] mx-auto mt-12"></div>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <button onClick={() => navigate('/stats')} className="text-[#00398A] mb-4">← Volver</button>
      
      <h1 className="text-2xl font-bold text-[#00398A] mb-6">
        Historial de {patient?.nombre} {patient?.apellido}
      </h1>
      
      {/* Información del paciente */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600">ID del paciente</p>
            <p className="font-medium">{patient?.id_paciente}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Nombre completo</p>
            <p className="font-medium">{patient?.nombre} {patient?.apellido}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Diagnóstico</p>
            <p className="font-medium">{patient?.diagnostico || 'No especificado'}</p>
          </div>
        </div>
      </div>
      
      <h2 className="text-xl font-semibold text-[#00398A] mb-4">Sesiones</h2>
      
      {sessions.length > 0 ? (
        <div className="space-y-4">
          {sessions.map(session => (
            <div key={session.id_sesion} className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">ID Sesión: {session.id_sesion}</p>
                  <p className="text-sm text-gray-600">Fecha: {new Date(session.fecha_sesion).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-600">Juego: {session.nombre_juego}</p>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    session.estado === 'Completada' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {session.estado}
                  </span>
                </div>
                <button
                  onClick={() => {
                    console.log("ID Sesión:", session.id_sesion); // Para depuración
                    navigate(`/stats/session/${session.id_sesion}/details`);
                  }}
                  className="px-4 py-2 bg-[#00A8E3] text-white rounded-md"
                  disabled={session.estado !== 'Completada'}
                >
                  Ver
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          <p>No hay sesiones registradas para este paciente</p>
        </div>
      )}
    </div>
  );
};

export default PatientStats;