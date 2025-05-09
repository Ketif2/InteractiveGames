// src/components/games/forest/ForestNextObjectives.jsx
import React from 'react';

const ForestNextObjectives = ({ 
  show, 
  message,
  isNextRound = false
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full mx-4 border-2 border-blue-500">
        {isNextRound ? (
          <h3 className="text-2xl font-bold text-blue-700 mb-3 text-center">
            Nueva ronda
          </h3>
        ) : (
          <h3 className="text-2xl font-bold text-green-600 mb-3 text-center">
            Objetos encontrados
          </h3>
        )}
        
        <p className="text-xl mb-4 text-center">
          {message}
        </p>
        
        <div className="w-full h-3 bg-gray-200 rounded overflow-hidden">
          <div className="h-full bg-blue-600 rounded animate-timer"></div>
        </div>
      </div>
    </div>
  );
};

export default ForestNextObjectives;