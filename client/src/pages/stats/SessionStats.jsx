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
    <div className="container mx-auto px-4 py-6">
      <button onClick={() => navigate(-1)} className="text-[#00398A] mb-4">← Volver</button>
      
      <h1 className="text-2xl font-bold text-[#00398A] mb-6">
        Detalles de la sesión: {session.nombre_juego}
      </h1>
      
      {/* Información básica de la sesión */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-[#00398A] mb-4">Información de la sesión</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600">ID Sesión</p>
            <p className="font-medium">{session.id_sesion}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Paciente</p>
            <p className="font-medium">{session.nombre_paciente}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Juego</p>
            <p className="font-medium">{session.nombre_juego}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Categoría cognitiva</p>
            <p className="font-medium">{session.categoria_cognitiva}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Fecha de la sesión</p>
            <p className="font-medium">{new Date(session.fecha_sesion).toLocaleString()}</p>
          </div>
        </div>
      </div>
      
      {/* Estadísticas del juego */}
      {statistics && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-[#00398A] mb-4">Estadísticas</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600">Tiempo transcurrido</p>
              <p className="font-medium text-xl">{formatTime(statistics.tiempo_transcurrido)}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600">Aciertos</p>
              <p className="font-medium text-xl text-green-600">{statistics.num_aciertos}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600">Errores</p>
              <p className="font-medium text-xl text-red-600">{statistics.num_errores}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600">Pausas</p>
              <p className="font-medium text-xl">{statistics.num_pausas}</p>
            </div>
            {statistics.num_ayudas > 0 && (
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">Ayudas utilizadas</p>
                <p className="font-medium text-xl">{statistics.num_ayudas}</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Configuración del juego */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-[#00398A] mb-4">Configuración del juego</h2>
        {renderConfiguration()}
      </div>
      
      {/* Observaciones del terapeuta */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-[#00398A] mb-4">Observaciones del terapeuta</h2>
        <div className="p-4 bg-gray-50 rounded-lg">
          {session.observaciones_terapeuta ? (
            <p>{session.observaciones_terapeuta}</p>
          ) : (
            <p className="text-gray-500 italic">No hay observaciones registradas</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionStats;