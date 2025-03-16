import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { statsService } from '@/services/statsService';

const SessionStats = () => {
  const { id } = useParams();
  console.log("Parámetros de ruta completos:", useParams());
  console.log("ID de sesión extraído:", id);
  
  const [sessionDetails, setSessionDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSessionDetails = async () => {
      if (!id) {
        setError('ID de sesión no proporcionado');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        console.log(`Intentando obtener detalles para sesión ID: ${id}`);
        const data = await statsService.getSessionDetails(id);
        console.log("Datos recibidos:", data);
        setSessionDetails(data);
      } catch (err) {
        console.error('Error al obtener detalles:', err);
        setError(err.message || 'Error al cargar los detalles de la sesión');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSessionDetails();
  }, [id]);

  const formatTime = (seconds) => {
    if (!seconds && seconds !== 0) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
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
      <div className="container mx-auto px-4 py-6">
        <button onClick={() => navigate(-1)} className="text-[#00398A] mb-4">← Volver</button>
        <div className="bg-white rounded-lg shadow p-8 text-center text-red-500">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!sessionDetails) {
    return (
      <div className="container mx-auto px-4 py-6">
        <button onClick={() => navigate(-1)} className="text-[#00398A] mb-4">← Volver</button>
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          <p>No se encontraron detalles para esta sesión</p>
        </div>
      </div>
    );
  }

  const { session, statistics, configuration } = sessionDetails;
  
  // Función para renderizar la configuración según el tipo de juego
  const renderConfiguration = () => {
    if (!configuration) return <p>Sin configuración disponible</p>;
    
    switch (session.nombre_juego) {
      case 'Rompecabezas':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Tamaño</p>
              <p className="font-medium">{configuration.tamano_grid}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Cantidad de puzzles</p>
              <p className="font-medium">{configuration.cantidad_puzzles}</p>
            </div>
          </div>
        );
      case 'Secuencia Lógica':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Rango inicial</p>
              <p className="font-medium">{configuration.rango_inicial}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Rango final</p>
              <p className="font-medium">{configuration.rango_final}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Números a ocultar</p>
              <p className="font-medium">{configuration.numeros_ocultar}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Modo de juego</p>
              <p className="font-medium capitalize">{configuration.modo_juego}</p>
            </div>
          </div>
        );
      case 'Ordena':
      case 'Sendero del Bosque':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Dificultad</p>
              <p className="font-medium">{configuration.dificultad}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Categoría</p>
              <p className="font-medium">{configuration.categoria}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Número de rondas</p>
              <p className="font-medium">{configuration.numero_rondas}</p>
            </div>
          </div>
        );
      default:
        return <p>Sin configuración disponible</p>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Navegación y encabezado */}
        <div className="mb-6">
          <button 
            onClick={() => navigate(-1)} 
            className="inline-flex items-center text-[#00398A] hover:text-[#002A66] transition-colors font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Volver a sesiones
          </button>
        </div>
        
        {/* Cabecera de la sesión */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-6 border-t-4 border-[#00398A]">
          <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-[#00398A]">
                  {session.nombre_juego}
                </h1>
                <div className="flex items-center mt-2 text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm">{new Date(session.fecha_sesion).toLocaleDateString()} • {new Date(session.fecha_sesion).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
              </div>
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                ID Sesión: {session.id_sesion}
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-100 bg-gray-50 px-6 py-3">
            <div className="flex items-center">
              <div className="h-10 w-10 flex-shrink-0 mr-3 overflow-hidden rounded-full">
                {session.sexo === 'Masculino' ? (
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
                <p className="font-medium">{session.nombre_paciente}</p>
                <p className="text-sm text-gray-500">Paciente</p>
              </div>
            </div>
          </div>
        </div>
  
        {/* Grid principal con 3 tarjetas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Tarjeta 1: Estadísticas principales */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="border-b border-gray-100 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#00A8E3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Resultados
              </h2>
            </div>
            <div className="p-6">
              {statistics ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="text-gray-600">Tiempo total:</div>
                    <div className="font-semibold text-lg">{formatTime(statistics.tiempo_transcurrido)}</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-gray-600">Aciertos:</div>
                    <div className="font-semibold text-lg text-green-600">{statistics.num_aciertos}</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-gray-600">Errores:</div>
                    <div className="font-semibold text-lg text-red-600">{statistics.num_errores}</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-gray-600">Ratio de éxito:</div>
                    <div className="font-semibold text-lg">
                      {statistics.num_aciertos + statistics.num_errores > 0 ? 
                        `${Math.round((statistics.num_aciertos / (statistics.num_aciertos + statistics.num_errores)) * 100)}%` : 
                        'N/A'}
                    </div>
                  </div>
                  <div className="pt-3 border-t border-gray-100">
                    <div className="text-gray-600 mb-1">Precisión:</div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                      <div 
                        className="bg-green-600 h-2.5 rounded-full" 
                        style={{ width: `${statistics.num_aciertos + statistics.num_errores > 0 ? 
                          Math.round((statistics.num_aciertos / (statistics.num_aciertos + statistics.num_errores)) * 100) : 0}%` }}>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>0%</span>
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-gray-500 text-center py-4">No hay estadísticas disponibles</div>
              )}
            </div>
          </div>
  
          {/* Tarjeta 2: Detalles y métricas adicionales */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="border-b border-gray-100 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#00A8E3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Métricas Adicionales
              </h2>
            </div>
            <div className="p-6">
              {statistics ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <div className="text-blue-800 text-xl font-bold">{statistics.num_pausas}</div>
                    <div className="text-blue-600 text-sm">Pausas</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3 text-center">
                    <div className="text-purple-800 text-xl font-bold">{statistics.num_ayudas || 0}</div>
                    <div className="text-purple-600 text-sm">Ayudas</div>
                  </div>
                  <div className="col-span-2 mt-2">
                    <div className="text-gray-600 text-sm mb-1">Categoría cognitiva:</div>
                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {session.categoria_cognitiva}
                    </div>
                  </div>
                  <div className="col-span-2 border-t border-gray-100 pt-3 mt-2">
                    <div className="text-gray-600 text-sm mb-2">Rendimiento:</div>
                    <div className="flex items-center">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            statistics.num_aciertos > statistics.num_errores * 2 ? 'bg-green-500' :
                            statistics.num_aciertos > statistics.num_errores ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${statistics.num_aciertos + statistics.num_errores > 0 ? 
                            Math.min(Math.round((statistics.num_aciertos / (statistics.num_errores || 1)) * 50), 100) : 0}%` }}>
                        </div>
                      </div>
                      <span className="ml-2 text-sm font-medium text-gray-700">
                        {statistics.num_aciertos + statistics.num_errores > 0 ? 
                          statistics.num_aciertos > statistics.num_errores * 2 ? 'Excelente' :
                          statistics.num_aciertos > statistics.num_errores ? 'Bueno' : 'Necesita mejorar'
                          : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-gray-500 text-center py-4">No hay métricas adicionales disponibles</div>
              )}
            </div>
          </div>
  
          {/* Tarjeta 3: Configuración */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="border-b border-gray-100 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#00A8E3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Configuración
              </h2>
            </div>
            <div className="p-6">
              {configuration ? (
                <div className="space-y-4">
                  {renderConfiguration()}
                </div>
              ) : (
                <div className="text-gray-500 text-center py-4">No hay configuración disponible</div>
              )}
            </div>
          </div>
        </div>
  
        {/* Observaciones del terapeuta */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#00A8E3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Observaciones del terapeuta
            </h2>
          </div>
          <div className="p-6">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              {session.observaciones_terapeuta ? (
                <p className="text-gray-700">{session.observaciones_terapeuta}</p>
              ) : (
                <p className="text-gray-400 italic">No hay observaciones registradas para esta sesión</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionStats;