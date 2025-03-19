// src/components/games/forest/ForestNextObjectives.jsx
import React from 'react';

const ForestNextObjectives = ({ 
  show, 
  message,
  isNextRound = false // Para diferenciar entre pantalla completada y siguiente ronda
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md text-center transform transition-all">
        {isNextRound ? (
          <h3 className="text-xl font-bold text-blue-700 mb-3">
            ¡Siguiente ronda!
          </h3>
        ) : (
          <h3 className="text-xl font-bold text-green-600 mb-3">
            ¡Pantalla completada!
          </h3>
        )}
        
        <p className="text-lg mb-4 font-medium">
          {message}
        </p>
        
        <div className="w-full h-2 bg-gray-200 rounded overflow-hidden">
          <div className="h-full bg-blue-600 rounded animate-timer"></div>
        </div>
      </div>
    </div>
  );
};

export default ForestNextObjectives;