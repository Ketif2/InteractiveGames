import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
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
    image: puzzleImage,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
      </svg>
    ),
    description: 'Mejora la coordinación ojo-mano y las habilidades de asociación visual'
  },
  {
    id: 2,
    slug: 'memory',
    title: 'Ordena',
    category: 'Memoria y Concentración',
    image: orderImage,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
      </svg>
    ),
    description: 'Ejercita la memoria a corto plazo y las habilidades de categorización'
  },
  {
    id: 3,
    slug: 'sequence',
    title: 'Secuencia Lógica',
    category: 'Asociaciones Visuales y Resolución de Problemas',
    image: sequenceImage,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
      </svg>
    ),
    description: 'Desarrolla el pensamiento lógico y las habilidades matemáticas básicas'
  },
  {
    id: 4,
    slug: 'forest',
    title: 'Sendero del Bosque',
    category: 'Memoria y Concentración',
    image: forestImage,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    description: 'Entrena la atención selectiva y la orientación espacial'
  }
];

const GameDashboard = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-2 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Encabezado con navegación */}
        <div className="mb-8">
          <button 
            onClick={() => navigate(-1)} 
            className="inline-flex items-center text-[#00398A] hover:text-[#002A66] transition-colors font-medium mb-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Volver
          </button>
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-3xl font-bold text-[#00398A]">Seleccionar Juego</h1>
                <p className="text-gray-500 mt-2">Escoge un juego para comenzar la sesión de terapia</p>
              </div>
              <div className="mt-4 md:mt-0">
                <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg text-sm font-medium inline-flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  ID Paciente: {patientId}
                </div>
              </div>
          </div>
        </div>

        {/* Cuadrícula de juegos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {GAMES.map((game) => (
            <div
              key={game.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={game.image}
                  alt={game.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/src/assets/placeholder.jpg';
                  }}
                />
                <div className="absolute top-4 left-4 p-2 rounded-full bg-white shadow-md">
                  <div className="text-[#00398A]">
                    {game.icon}
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {game.title}
                    </h3>
                    <div className="flex items-center mt-1">
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {game.category}
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-6">
                  {game.description}
                </p>
                
                <Link
                  to={`/games/${game.slug}/config`}
                  state={{ patientId }}
                  className="inline-flex items-center justify-center w-full py-3 px-4 bg-[#00A8E3] text-white rounded-lg hover:bg-[#0085b3] transition-colors text-sm font-medium shadow-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Iniciar Juego
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameDashboard;