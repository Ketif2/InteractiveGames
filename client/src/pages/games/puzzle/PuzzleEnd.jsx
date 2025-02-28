// src/pages/games/puzzle/PuzzleEnd.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { puzzleService } from '../../../services/puzzleService';
import { sessionService } from '../../../services/sessionService'; // Añadido
import { statsService } from '../../../services/statsService';
import { useAuth } from '@/context/AuthContext';
import { AlertTriangle } from 'lucide-react';

const PuzzleEnd = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { stats, config, sessionId, patientId } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [observations, setObservations] = useState('');
  const [error, setError] = useState(null);
  const { user } = useAuth();

  console.log('Estado recibido en PuzzleEnd:', location.state);

  const handleFinishSession = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Verificar si tenemos patientId
      if (!patientId) {
        throw new Error('No se pudo encontrar el ID del paciente');
      }

      if (!user?.id) {
        throw new Error('No se pudo encontrar el ID del terapeuta. Por favor inicie sesión nuevamente.');
      }

      await sessionService.createSession({
        id_paciente: patientId,
        id_juego: 1, // ID del juego de rompecabezas
        id_terapeuta: user.id,
        observaciones_terapeuta: observations
      });

      const id_sesion = await sessionService.getLastSession(patientId);
      await statsService.registerStats({
        id_sesion: id_sesion.id_sesion,
        tiempo_transcurrido: stats.totalTime,
        num_errores: stats.failedMoves,
        num_aciertos: stats.successMoves,
        num_pausas: stats.pauseCount || 0,
        num_ayudas: stats.helpCount || 0,
        completado: stats.completed
      });

      // Navegar a la página de sesiones
      navigate('/new-session', { 
        state: { 
          success: true,
          message: 'Sesión completada y guardada correctamente'
        }
      });
    } catch (error) {
      console.error('Error al guardar resultados:', error);
      setError(error.message || 'Error al guardar los resultados');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayAgain = () => {
    if (!patientId) {
      console.error("PuzzleEnd - No se encontró el ID del paciente.");
      setError("No se pudo encontrar el ID del paciente.");
      return;
    }

    console.log(`PuzzleEnd - Redirigiendo a /games/${patientId}`);
    navigate(`/games/${patientId}`);
  };

  // Si no hay estadísticas o configuración, mostrar error
  if (!stats || !config) {
    return (
      <div className="h-[calc(100vh-10rem)] flex flex-col items-center justify-center bg-gray-50">
        <AlertTriangle className="w-16 h-16 text-yellow-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No se encontraron datos del juego</h2>
            <p className="text-gray-600 mb-6">No se pudieron cargar las estadísticas o la configuración del juego.</p>
              <button
                onClick={() => navigate('/games')}
                className="px-6 py-2 bg-[#00398A] text-white rounded-lg hover:bg-[#002d6f] transition-colors"
              >
            Volver a Juegos
        </button>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-[#00398A] text-white py-2 px-6">
        <h1 className="text-xl font-semibold">Resultados del Rompecabezas</h1>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 p-4 grid grid-cols-2 gap-4 min-h-0">
        {/* Columna izquierda */}
        <div className="flex flex-col gap-4 h-full">
          {/* Configuración */}
          <section className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold text-[#00398A] mb-2">
              Configuración Sesión
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Dificultad:</span>
                <span className="bg-blue-100 px-3 py-1 rounded">{config.difficulty}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Número de piezas:</span>
                <span className="bg-blue-100 px-3 py-1 rounded">
                  {config.gridSize === '4' ? '16 (4x4)' : 
                   config.gridSize === '5' ? '25 (5x5)' : '36 (6x6)'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Rompecabezas:</span>
                <span className="bg-blue-100 px-3 py-1 rounded">
                  {config.selectedPuzzles.length}
                </span>
              </div>
            </div>
          </section>

          {/* Observaciones */}
          <section className="bg-white rounded-lg shadow p-4 flex-1">
            <h2 className="text-lg font-semibold text-[#00398A] mb-2">
              Observaciones
            </h2>
            <textarea
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              className="resize-none w-full h-[calc(100%-2rem)] p-3 border rounded-lg overflow-y-auto"
              placeholder="Ingrese sus observaciones aquí..."
            />
          </section>
        </div>

        {/* Columna derecha - Estadísticas */}
        <div className="bg-white rounded-lg shadow p-4 flex flex-col h-full">
          <h2 className="text-lg font-semibold text-[#00398A] mb-4">
            Estadísticas
          </h2>
          <div className="space-y-3 flex-1">
            <StatItem 
              label="Tiempo transcurrido" 
              value={`${Math.floor(stats.totalTime / 60)}min ${stats.totalTime % 60}s`} 
            />
            <StatItem label="Número de errores" value={stats.failedMoves} />
            <StatItem label="Número de aciertos" value={stats.successMoves} />
            <StatItem label="Número de pausas" value={stats.pauseCount || 0} />
            <StatItem label="Número de ayudas" value={stats.helpCount || 0} />
            <StatItem 
              label="Aciertos por minuto" 
              value={`${((stats.successMoves / (stats.totalTime / 60)) || 0).toFixed(1)} aciertos/min`} 
            />
            <StatItem 
              label="Errores por minuto" 
              value={`${((stats.failedMoves / (stats.totalTime / 60)) || 0).toFixed(1)} errores/min`} 
            />
          </div>
        </div>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="p-4 bg-red-100 border border-red-200 text-red-700 text-center rounded mx-4 mb-4">
          {error}
        </div>
      )}

      {/* Botones */}
      <div className="mt-2 bg-white flex justify-center gap-4">
        <button
          onClick={handleFinishSession}
          disabled={loading}
          className="px-6 py-2 bg-[#00398A] text-white rounded-lg hover:bg-[#002d6f] transition-colors disabled:opacity-50"
        >
          {loading ? 'Guardando...' : 'Terminar Sesión'}
        </button>
        <button
          onClick={handlePlayAgain}
          disabled={loading}
          className="px-6 py-2 bg-[#00A8E3] text-white rounded-lg hover:bg-[#0096cc] transition-colors disabled:opacity-50"
        >
          Repetir Sesión
        </button>
      </div>
    </div>
  );
};

const StatItem = ({ label, value }) => (
  <div className="flex justify-between items-center py-1.5">
    <span className="text-gray-600">{label}:</span>
    <span className="font-medium">{value}</span>
  </div>
);

export default PuzzleEnd;