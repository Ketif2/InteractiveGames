// src/pages/stats/PatientStats.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { statsService } from '@/services/statsService';
import patientService from '@/services/patientService';
import SessionCard from '@/components/sessions/SessionCard';

const PatientStats = () => {
  const { id } = useParams();
  const [sessions, setSessions] = useState([]);
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Obtener información del paciente
      const patientData = await patientService.getPatientById(id);
      setPatient(patientData);
      
      // Obtener sesiones del paciente
      const sessionsData = await statsService.getPatientSessions(id);
      setSessions(Array.isArray(sessionsData) ? sessionsData : []);
      
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al cargar datos del paciente');
      console.error('Error fetching patient data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate('/stats');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00398A]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mx-4 my-4">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <button 
          onClick={handleGoBack} 
          className="mr-4 text-[#00398A] hover:text-[#00A8E3]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold text-[#00398A]">
          Historial de {patient?.nombre} {patient?.apellido}
        </h1>
      </div>
      
      {/* Información del paciente */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600">ID del paciente</p>
            <p className="text-lg font-semibold">{patient?.id_paciente}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Nombre completo</p>
            <p className="text-lg font-semibold">{patient?.nombre} {patient?.apellido}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Diagnóstico</p>
            <p className="text-lg font-semibold">{patient?.diagnostico || 'No especificado'}</p>
          </div>
        </div>
      </div>
      
      {/* Título de sesiones */}
      <h2 className="text-xl font-semibold text-[#00398A] mb-4">Sesiones</h2>
      
      {/* Lista de sesiones */}
      {sessions.length > 0 ? (
        <div>
          {sessions.map(session => (
            <SessionCard key={session.id_sesion} session={session} />
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