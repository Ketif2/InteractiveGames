// src/components/games/forest/ForestInstructions.jsx
import React from 'react';

const ForestInstructions = ({ 
  currentLevel, 
  currentRound, 
  totalRounds, 
  showInstructions 
}) => {
  // Renderizar instrucciones según el nivel
  const getLevelInstructions = (level) => {
    switch(level) {
      case 1:
        return "Encuentra todas las flores azules en el camino.";
      case 2:
        return "Encuentra todas las flores azules Y hongos rojos en el camino.";
      case 3:
        return "Encuentra primero todas las flores azules y luego todos los hongos rojos.";
      case 4:
        return "Encuentra 2 flores azules, luego 1 hongo rojo, y repite el patrón.";
      default:
        return "Sigue las instrucciones y encuentra los objetos indicados.";
    }
  };

  return (
    <>
      {/* Instrucciones siempre visibles */}
      <div className="mb-4 text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-1">
          Sendero del Bosque - Nivel {currentLevel}
        </h2>
        <p className="text-gray-700">
          {getLevelInstructions(currentLevel)}
        </p>
        <p className="text-green-600 font-medium mt-1">
          Ronda {currentRound} de {totalRounds}
        </p>
      </div>

      {/* Instrucciones iniciales (overlay) */}
      {showInstructions && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-10">
          <div className="bg-white p-6 rounded-lg max-w-md text-center animate-fadeIn">
            <h3 className="text-xl font-bold text-[#00398A] mb-4">Nivel {currentLevel}</h3>
            <p className="text-lg mb-4">{getLevelInstructions(currentLevel)}</p>
            <p className="text-sm text-gray-600">Iniciando en 5 segundos...</p>
          </div>
        </div>
      )}
    </>
  );
};

export default ForestInstructions;