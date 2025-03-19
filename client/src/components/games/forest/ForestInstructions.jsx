// src/components/games/forest/ForestInstructions.jsx
import React from 'react';

const ForestInstructions = ({ 
  currentLevel, 
  currentRound, 
  totalRounds, 
  showInstructions,
  instructionsText // NUEVO: Recibir el texto de instrucciones dinámicas
}) => {
  return (
    <>
      {/* Instrucciones siempre visibles */}
      <div className="mb-4 text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-1">
          Sendero del Bosque
        </h2>
        <p className="text-green-600 font-medium mt-1">
          Ronda {currentRound} de {totalRounds}
        </p>
      </div>

      {/* Instrucciones iniciales (overlay) */}
      {showInstructions && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-10">
          <div className="bg-white p-6 rounded-lg max-w-md text-center animate-fadeIn">
            <h3 className="text-xl font-bold text-[#00398A] mb-4">Nivel {currentLevel}</h3>
            <p className="text-lg mb-4">{instructionsText || "Busca los objetos objetivo en el bosque."}</p>
            <p className="text-sm text-gray-600">Iniciando en 5 segundos...</p>
          </div>
        </div>
      )}
    </>
  );
};

export default ForestInstructions;