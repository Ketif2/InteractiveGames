import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { statsService } from '@/services/statsService';
import patientService from '@/services/patientService';
import therapistService from '../../services/therapistService';

const PatientStats = () => {
  const { id } = useParams();
  const [sessions, setSessions] = useState([]);
  const [patient, setPatient] = useState(null);
  const [therapist, setTherapist] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 1. Obtener información del paciente
        const patientData = await patientService.getPatientById(id);
        setPatient(patientData?.data || patientData);
        
        if ((patientData?.data?.id_terapeuta || patientData?.id_terapeuta)) {
          try {
            const therapistId = patientData?.data?.id_terapeuta || patientData?.id_terapeuta;
            const therapistData = await therapistService.getTherapistById(therapistId);
            setTherapist(therapistData?.data || therapistData);
          } catch (err) {
            console.error('Error obteniendo datos del terapeuta:', err);
            setTherapist(null);
          }
        } else {
          setTherapist(null);
        }
        
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
  
  if (loading) {
    return <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00398A] mx-auto mt-12"></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Navegación y encabezado */}
        <div className="mb-6">
          <button 
            onClick={() => navigate('/stats')} 
            className="inline-flex items-center text-[#00398A] hover:text-[#002A66] transition-colors font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Volver a estadísticas
          </button>
        </div>
        
        {/* Tarjeta de perfil del paciente */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8 border-t-4 border-[#00398A]">
          <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="h-10 w-10 flex-shrink-0 mr-3 overflow-hidden rounded-full">
                  {patient?.sexo === 'Masculino' ? (
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
                  <h1 className="text-2xl font-bold text-gray-900">{patient?.nombre} {patient?.apellido}</h1>
                  <p className="text-gray-500 mt-1">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                      ID: {patient?.id_paciente}
                    </span>
                    <span>{calculateAge(patient?.fecha_nacimiento)} años</span>
                  </p>
                </div>
              </div>
              
              <div>
                <div className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 inline-flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {sessions.length} sesiones
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tarjetas de estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Total Sesiones</h3>
              <span className="text-3xl font-bold text-[#00398A]">{sessions.length}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-[#00A8E3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {sessions.length > 0 ? `Última: ${new Date(sessions[0].fecha_sesion).toLocaleDateString()}` : 'No hay sesiones'}
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Completadas</h3>
              <span className="text-3xl font-bold text-green-600">
                {sessions.filter(s => s.estado === 'Completada').length}
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {Math.round((sessions.filter(s => s.estado === 'Completada').length / (sessions.length || 1)) * 100)}% de sesiones completadas
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Tipo de Juegos</h3>
              <span className="text-3xl font-bold text-blue-600">
                {new Set(sessions.map(s => s.nombre_juego)).size}
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Diferentes juegos utilizados
            </div>
          </div>
        </div>
        
        {/* Información del paciente */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#00A8E3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Información del paciente
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">ID del paciente</p>
                <p className="font-medium text-gray-900">{patient?.id_paciente}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Terapeuta asignado</p>
                <p className="font-medium text-gray-900">{therapist?.nombre+' '+therapist?.apellido || 'No asignado'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Fecha de nacimiento</p>
                <p className="font-medium text-gray-900">{patient?.fecha_nacimiento ? new Date(patient.fecha_nacimiento).toLocaleDateString() : 'No disponible'}</p>
              </div>
            </div>
            
            <div className="mt-6">
              <p className="text-sm text-gray-500 mb-1">Diagnóstico</p>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-gray-900">{patient?.diagnostico || 'No se ha registrado un diagnóstico para este paciente.'}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Lista de sesiones */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#00A8E3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              Historial de sesiones
            </h2>
          </div>
          
          {sessions.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {sessions.map((session, index) => (
                <div key={session.id_sesion} className={`p-4 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <div className="flex items-start mb-3 md:mb-0">
                      <div className={`flex-shrink-0 h-12 w-12 rounded-lg flex items-center justify-center mr-4 ${
                        session.nombre_juego === 'Rompecabezas' ? 'bg-indigo-100 text-indigo-600' :
                        session.nombre_juego === 'Secuencia Lógica' ? 'bg-green-100 text-green-600' :
                        session.nombre_juego === 'Sendero del Bosque' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {session.nombre_juego === 'Rompecabezas' ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                          </svg>
                        ) : session.nombre_juego === 'Secuencia Lógica' ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                          </svg>
                        ) : session.nombre_juego === 'Sendero del Bosque' ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <h3 className="text-base font-medium text-gray-900">{session.nombre_juego}</h3>
                        <div className="mt-1 text-sm text-gray-500">
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {new Date(session.fecha_sesion).toLocaleDateString()} • {new Date(session.fecha_sesion).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </div>
                          <div className="flex items-center mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                            </svg>
                            ID: {session.id_sesion}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        session.estado === 'Completada' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {session.estado === 'Completada' ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                        {session.estado}
                      </span>
                      
                      <button
                        onClick={() => {
                          navigate(`/stats/session/${session.id_sesion}/details`);
                        }}
                        className={`inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm ${
                          session.estado === 'Completada' 
                            ? 'text-white bg-[#00A8E3] hover:bg-[#0085b3]' 
                            : 'text-gray-500 bg-gray-100 cursor-not-allowed'
                        } transition-colors`}
                        disabled={session.estado !== 'Completada'}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Ver detalles
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No hay sesiones registradas</h3>
              <p className="text-gray-500">Este paciente aún no tiene sesiones de juego registradas.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientStats;