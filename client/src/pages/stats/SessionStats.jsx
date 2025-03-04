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
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Usar el servicio para obtener los datos
        const data = await statsService.getSessionDetails(id);
        setSessionData(data);
        setError(null);
      } catch (err) {
        console.error('Error:', err);
        setError('Error de autenticación. Por favor inicie sesión nuevamente.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  const handleGoBack = () => {
    navigate('/stats');
  };

  if (loading) {
    return (
      <div className="h-[calc(100vh-10rem)] flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00398A]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[calc(100vh-10rem)] flex flex-col items-center justify-center bg-gray-50">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-16 h-16 text-yellow-500 mb-4" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Error de autenticación
        </h2>
        <p className="text-gray-600 mb-4">
          Por favor inicie sesión nuevamente
        </p>
        <button
          onClick={handleGoBack}
          className="px-6 py-2 bg-[#00398A] text-white rounded-lg hover:bg-[#002d6f] transition-colors"
        >
          Volver a Estadísticas
        </button>
      </div>
    );
  }

  // El resto de tu componente (renderizado cuando hay datos)
  const { session, stats, config } = sessionData || {};

  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-[#00398A] text-white py-2 px-6">
        <h1 className="text-xl font-semibold">Resultados del {session.nombre_juego}</h1>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 p-4 grid grid-cols-1 md:grid-cols-2 gap-4 min-h-0">
        {/* Columna izquierda */}
        <div className="flex flex-col gap-4 h-full">
          {/* Configuración */}
          <section className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold text-[#00398A] mb-2">
              Configuración Sesión
            </h2>
            <div className="space-y-2">
              {config ? (
                Object.entries(config).map(([key, value]) => {
                  // Excluir campos técnicos
                  if (!['id_configuracion', 'id_sesion', 'fecha_creacion'].includes(key)) {
                    // Formatear nombres de campos
                    const fieldName = key
                      .replace(/_/g, ' ')
                      .replace(/tamano grid/i, 'Número de piezas')
                      .replace(/cantidad puzzles/i, 'Rompecabezas')
                      .replace(/dificultad/i, 'Dificultad')
                      .replace(/numeros_ocultar/i, 'Números ocultos')
                      .replace(/modo_juego/i, 'Modo de juego')
                      .replace(/rango_inicial/i, 'Rango inicial')
                      .replace(/rango_final/i, 'Rango final')
                      .replace(/numero_rondas/i, 'Número de rondas')
                      .replace(/categoria/i, 'Categoría');
                    
                    // Formatear valores específicos
                    let displayValue = value;
                    if (key === 'tamano_grid' && value === '4x4') {
                      displayValue = '16 (4x4)';
                    } else if (key === 'tamano_grid' && value === '5x5') {
                      displayValue = '25 (5x5)';
                    } else if (key === 'tamano_grid' && value === '6x6') {
                      displayValue = '36 (6x6)';
                    }
                    
                    return (
                      <div key={key} className="flex justify-between items-center">
                        <span className="text-gray-600">{fieldName}:</span>
                        <span className="bg-blue-100 px-3 py-1 rounded">{displayValue}</span>
                      </div>
                    );
                  }
                  return null;
                })
              ) : (
                <div className="text-center text-gray-500">
                  No hay datos de configuración disponibles
                </div>
              )}
            </div>
          </section>

          {/* Información de la sesión */}
          <section className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold text-[#00398A] mb-2">
              Información de la Sesión
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">ID Sesión:</span>
                <span className="bg-gray-100 px-3 py-1 rounded">{session.id_sesion}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Fecha:</span>
                <span className="bg-gray-100 px-3 py-1 rounded">
                  {new Date(session.fecha_sesion).toLocaleDateString()} {new Date(session.fecha_sesion).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Paciente:</span>
                <span className="bg-gray-100 px-3 py-1 rounded">
                  {session.nombre_paciente} {session.apellido_paciente}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Terapeuta:</span>
                <span className="bg-gray-100 px-3 py-1 rounded">
                  {session.nombre_terapeuta} {session.apellido_terapeuta}
                </span>
              </div>
            </div>
          </section>

          {/* Observaciones */}
          <section className="bg-white rounded-lg shadow p-4 flex-1">
            <h2 className="text-lg font-semibold text-[#00398A] mb-2">
              Observaciones
            </h2>
            <div className="border border-gray-200 rounded-lg p-3 h-[calc(100%-2rem)] overflow-y-auto">
              {session.observaciones_terapeuta || 'No hay observaciones registradas.'}
            </div>
          </section>
        </div>

        {/* Columna derecha - Estadísticas */}
        <div className="bg-white rounded-lg shadow p-4 flex flex-col h-full">
          <h2 className="text-lg font-semibold text-[#00398A] mb-4">
            Estadísticas
          </h2>
          {stats ? (
            <div className="space-y-3 flex-1">
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
              />
              <StatItem 
                label="Errores por minuto" 
                value={`${((stats.num_errores / (stats.tiempo_transcurrido / 60)) || 0).toFixed(1)} errores/min`} 
              />
              <StatItem 
                label="Completado" 
                value={stats.completado ? 'Sí' : 'No'} 
                highlightPositive={stats.completado}
              />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              No hay datos de estadísticas disponibles
            </div>
          )}
        </div>
      </div>

      {/* Botones */}
      <div className="mt-2 bg-white flex justify-center gap-4 p-4">
        <button
          onClick={handleGoBack}
          className="px-6 py-2 bg-[#00398A] text-white rounded-lg hover:bg-[#002d6f] transition-colors"
        >
          Volver al Historial
        </button>
      </div>
    </div>
  );
};

// Componente para mostrar cada estadística
const StatItem = ({ label, value, highlightPositive, highlightNegative }) => (
  <div className="flex justify-between items-center py-1.5">
    <span className="text-gray-600">{label}:</span>
    <span className={`font-medium ${highlightPositive ? 'text-green-600' : ''} ${highlightNegative ? 'text-red-600' : ''}`}>
      {value}
    </span>
  </div>
);

export default SessionStats;