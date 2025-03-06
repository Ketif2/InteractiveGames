// pages/games/GameDashboard.jsx
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import puzzleImage from '../../assets/images/puzzleImage.png';
import sequenceImage from '../../assets/images/sequenceImage.png';
import forestImage from '../../assets/images/forestImage.png';
import orderImage from '../../assets/images/orderImage.png';

const GAMES = [
  {
    id: 1, 
    slug: 'puzzle',
    title: 'Rompecabezas',
    category: 'Asociaciones Visuales y Resolución de Problemas',
    image: puzzleImage
  },
  {
    id: 2,
    slug: 'memory',
    title: 'Ordena',
    category: 'Memoria y Concentración',
    image: orderImage
  },
  {
    id: 3,
    slug: 'sequence',
    title: 'Secuencia Lógica',
    category: 'Asociaciones Visuales y Resolución de Problemas',
    image: sequenceImage
  },
  {
    id: 4,
    slug: 'forest',
    title: 'Sendero del Bosque',
    category: 'Memoria y Concentración',
    image: forestImage
  }
];

const GameDashboard = () => {
  const { patientId } = useParams();

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
                <Link
                  to={`/games/${game.slug}/config`}
                  state={{ patientId }}
                  className="block w-full py-2 bg-[#00A8E3] text-white rounded hover:bg-[#7EC3E2] transition-colors text-center"
                >
                  Jugar
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameDashboard;