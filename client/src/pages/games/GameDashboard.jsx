// pages/games/GameDashboard.jsx
import { Link, useParams } from 'react-router-dom';

const GAMES = [
  {
    id: 'puzzle',
    title: 'Rompecabezas',
    category: 'Asociaciones Visuales y Resolución de Problemas',
    image: '/src/assets/games/puzzle.png'
  },
  {
    id: 'memory',
    title: 'Ordena',
    category: 'Memoria y Concentración',
    image: '/src/assets/games/memory.png'
  },
  {
    id: 'sequence',
    title: 'Secuencia Lógica',
    category: 'Asociaciones Visuales y Resolución de Problemas',
    image: '/src/assets/games/sequence.png'
  },
  {
    id: 'forest',
    title: 'Sendero del Bosque',
    category: 'Memoria y Concentración',
    image: '/src/assets/games/forest.png'
  }
];

const GameDashboard = () => {
  const { patientId } = useParams();

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {GAMES.map((game) => (
          <Link
            key={game.id}
            to={`/games/${game.id}/config`} // Quitamos el query parameter
            state={{ patientId }} // Pasamos el patientId en el state
            className="block bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="p-4">
              <img
                src={game.image}
                alt={game.title}
                className="w-full h-48 object-cover rounded-lg"
              />
              <h3 className="mt-4 text-lg font-semibold text-[#00398A]">
                {game.title}
              </h3>
              <p className="text-sm text-gray-600">
                {game.category}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default GameDashboard;