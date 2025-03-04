// src/pages/stats/SessionStats.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { statsService } from '@/services/statsService';

const SessionStats = () => {
  const { id } = useParams();
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSessionDetails();
  }, [id]);

  const fetchSessionDetails = async () => {
    try {
      setLoading(true);
      const data = await statsService.getSessionDetails(id);
      console.log("Datos de la sesión:", data);
      setSessionData(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al cargar detalles de la sesión');
      console.error('Error fetching session details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    // Si tenemos información del paciente, volvemos a su historial
    if (sessionData?.session?.id_paciente) {
      navigate(`/stats/patient/${sessionData.session.id_paciente}`);
    } else {
      // Si no, volvemos a la lista general de estadísticas
      navigate('/stats');
    }
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

  if (!sessionData) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mx-4 my-4">
        <p>No se encontraron datos para esta sesión</p>
      </div>
    );
  }

  const { session, stats, config } = sessionData;

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Título y botón volver */}
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
          Resultados del {session.nombre_juego}
        </h1>
      </div>

      {/* Contenido principal en dos columnas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Columna izquierda */}
        <div>
          {/* Configuración de la sesión */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="bg-[#00398A] text-white py-2 px-4 rounded-t-lg">
              <h2 className="font-medium">Configuración Sesión</h2>
            </div>
            <div className="p-4">
              {config && Object.entries(config).map(([key, value]) => {
                // Excluir campos técnicos
                if (!['id_configuracion', 'id_sesion', 'fecha_creacion'].includes(key)) {
                  // Formatear nombres de campos
                  const fieldName = key
                    .replace(/_/g, ' ')
                    .replace(/tamano grid/i, 'Número de piezas')
                    .replace(/cantidad puzzles/i, 'Rompecabezas')
                    .replace(/dificultad/i, 'Dificultad');
                  
                  // Formatear valores específicos
                  let displayValue = value;
                  if (key === 'tamano_grid' && value === '4x4') {
                    displayValue = '16 (4x4)';
                  }
                  
                  return (
                    <div key={key} className="flex justify-between items-center mb-2">
                      <span>{fieldName}:</span>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md">{displayValue}</span>
                    </div>
                  );
                }
                return null;
              })}
              
              {/* Si no hay configuración */}
              {!config && <p className="text-gray-500 italic">No hay datos de configuración disponibles</p>}
            </div>
          </div>

          {/* Observaciones */}
          <div className="bg-white rounded-lg shadow">
            <div className="bg-[#00398A] text-white py-2 px-4 rounded-t-lg">
              <h2 className="font-medium">Observaciones</h2>
            </div>
            <div className="p-4">
              <div className="border border-gray-300 rounded-lg p-4 min-h-[200px]">
                {session.observaciones_terapeuta || 'No hay observaciones registradas.'}
              </div>
            </div>
          </div>
        </div>

        {/* Columna derecha - Estadísticas */}
        <div className="bg-white rounded-lg shadow">
          <div className="bg-[#00398A] text-white py-2 px-4 rounded-t-lg">
            <h2 className="font-medium">Estadísticas</h2>
          </div>
          <div className="p-4">
            {stats ? (
              <div className="space-y-3">
                <StatItem 
                  label="Tiempo transcurrido" 
                  value={`${Math.floor(stats.tiempo_transcurrido / 60)}min ${stats.tiempo_transcurrido % 60}s`} 
                />
                <StatItem label="Número de errores" value={stats.num_errores} />
                <StatItem label="Número de aciertos" value={stats.num_aciertos} />
                <StatItem label="Número de pausas" value={stats.num_pausas} />
                <StatItem label="Número de ayudas" value={stats.num_ayudas} />
                
                {/* Cálculos adicionales */}
                <StatItem 
                  label="Aciertos por minuto" 
                  value={`${((stats.num_aciertos / (stats.tiempo_transcurrido / 60)) || 0).toFixed(1)} aciertos/min`} 
                  isCalculated
                />
                <StatItem 
                  label="Errores por minuto" 
                  value={`${((stats.num_errores / (stats.tiempo_transcurrido / 60)) || 0).toFixed(1)} errores/min`} 
                  isCalculated
                />
                <StatItem 
                  label="Completado" 
                  value={stats.completado ? 'Sí' : 'No'} 
                  isKeyMetric
                />
              </div>
            ) : (
              <p className="text-gray-500 italic">No hay datos de estadísticas disponibles</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente para mostrar cada estadística
const StatItem = ({ label, value, isCalculated, isKeyMetric }) => (
  <div className="flex justify-between items-center border-b border-gray-100 pb-2">
    <span className={`${isCalculated ? 'text-purple-600' : 'text-gray-700'}`}>{label}:</span>
    <span className={`font-medium ${isKeyMetric ? 'text-blue-600' : ''}`}>
      {value}
    </span>
  </div>
);

export default SessionStats;