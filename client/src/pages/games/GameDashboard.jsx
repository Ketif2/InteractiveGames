// pages/games/GameDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import { sessionService } from '@/services/sessionService';
import { useAuth } from '@/context/AuthContext';
import { AlertTriangle } from 'lucide-react';

const GAMES = [
  {
    id: 1, // ID numérico para la base de datos
    slug: 'puzzle',
    title: 'Rompecabezas',
    category: 'Asociaciones Visuales y Resolución de Problemas',
    image: '/src/assets/games/puzzle.png'
  },
  {
    id: 2,
    slug: 'memory',
    title: 'Ordena',
    category: 'Memoria y Concentración',
    image: '/src/assets/games/memory.png'
  },
  {
    id: 3,
    slug: 'sequence',
    title: 'Secuencia Lógica',
    category: 'Asociaciones Visuales y Resolución de Problemas',
    image: '/src/assets/games/sequence.png'
  },
  {
    id: 4,
    slug: 'forest',
    title: 'Sendero del Bosque',
    category: 'Memoria y Concentración',
    image: '/src/assets/games/forest.png'
  }
];

const GameDashboard = () => {
  const { patientId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Usar el patientId del estado si está disponible, o del parámetro de ruta
  const patient = location.state?.patientId || patientId;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    if (patient) {
      createInitialSession();
    }
  }, [patient]);

  const createInitialSession = async () => {
    setLoading(true);
    try {
      if (!user?.id) {
        throw new Error('No se pudo encontrar el ID del terapeuta. Por favor inicie sesión nuevamente.');
      }

      const sessionData = {
        id_paciente: patient,
        id_terapeuta: user.id
      };

      const response = await sessionService.createSession(sessionData);
      setSessionId(response.id);
      setError(null);
    } catch (error) {
      console.error('Error al crear sesión:', error);
      setError(error.message || 'Error al crear la sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectGame = async (gameId, gameSlug) => {
    setLoading(true);
    try {
      // Verificar que la sesión se haya creado
      if (!sessionId) {
        throw new Error('No se pudo crear una sesión');
      }

      // Actualizar la sesión con el juego seleccionado
      await sessionService.updateSession(sessionId, { id_juego: gameId });

      // Navegar a la configuración del juego seleccionado
      navigate(`/games/${gameSlug}/config`, { 
        state: { 
          sessionId,
          patientId: patient 
        } 
      });
    } catch (error) {
      console.error('Error al seleccionar juego:', error);
      setError(error.message || 'Error al seleccionar el juego');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !sessionId) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00398A]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Error</h2>
        <p className="text-gray-600 mb-6 text-center">{error}</p>
        <button
          onClick={() => navigate('/new-session')}
          className="px-6 py-2 bg-[#00398A] text-white rounded-lg hover:bg-[#002d6f] transition-colors"
        >
          Volver a Sesiones
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-[#00398A] mb-6">Seleccionar Juego</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {GAMES.map((game) => (
          <div
            key={game.id}
            className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
          >
            <div className="relative">
              <img
                src={game.image}
                alt={game.title}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/src/assets/placeholder.jpg';
                }}
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-[#00398A]">
                  {game.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {game.category}
                </p>
                <button
                  onClick={() => handleSelectGame(game.id, game.slug)}
                  disabled={loading}
                  className="w-full py-2 bg-[#00A8E3] text-white rounded hover:bg-[#7EC3E2] disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Cargando...' : 'Jugar'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameDashboard;