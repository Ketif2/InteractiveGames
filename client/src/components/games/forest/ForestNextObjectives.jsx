// src/components/games/forest/ForestNextObjectives.jsx
import React from 'react';

const ForestNextObjectives = ({ 
  show, 
  message,
  isNextRound = false
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-5 rounded-lg shadow-lg max-w-sm text-center">
        {isNextRound ? (
          <h3 className="text-lg font-bold text-blue-700 mb-2">
            Nueva ronda
          </h3>
        ) : (
          <h3 className="text-lg font-bold text-green-600 mb-2">
            Objetos encontrados
          </h3>
        )}
        
        <p className="mb-3">
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