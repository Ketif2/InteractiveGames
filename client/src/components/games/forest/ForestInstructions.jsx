// src/components/games/forest/ForestInstructions.jsx
import React, { useState, useEffect } from 'react';

const ForestInstructions = ({ 
  currentLevel, 
  currentRound, 
  totalRounds, 
  showInstructions,
  instructionsText,
  onClose
}) => {
  const [countdown, setCountdown] = useState(6);
  
  // Títulos descriptivos según nivel
  const getLevelTitle = (level) => {
    const titles = {
      1: "Objetos individuales",
      2: "Varios objetos",
      3: "Secuencia ordenada",
      4: "Patrón repetido"
    };
    
    return titles[level] || "Ejercicio de atención";
  };

  // Manejar la cuenta regresiva
  useEffect(() => {
    if (showInstructions && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && onClose) {
      const closeTimer = setTimeout(() => {
        onClose();
      }, 1000);
      return () => clearTimeout(closeTimer);
    }
  }, [showInstructions, countdown, onClose]);

  if (!showInstructions) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-lg w-full overflow-hidden">
        {/* Cabecera simplificada */}
        <div className="bg-[#00398A] text-white p-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-white bg-opacity-20 h-12 w-12 rounded-full flex items-center justify-center mr-3">
              <span className="text-2xl font-bold">{currentLevel}</span>
            </div>
            <div>
              <h2 className="text-xl font-bold">{getLevelTitle(currentLevel)}</h2>
            </div>
          </div>
          <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            {currentRound}/{totalRounds}
          </div>
        </div>
        
        {/* Contenido minimalista */}
        <div className="p-6">
          {/* Instrucción principal destacada */}
          <h3 className="text-xl font-bold text-[#00398A] mb-3">
            ¿Qué debe hacer?
          </h3>
          
          <div className="bg-blue-50 p-5 rounded-lg border-2 border-blue-100 mb-6 text-center">
            <p className="text-xl font-medium text-gray-800">
              {instructionsText || "Toque con el dedo los objetos indicados."}
            </p>
          </div>
          
          {/* Recordatorios simplificados */}
          <div className="bg-yellow-50 p-4 rounded-lg mb-6 border border-yellow-100">
            <h4 className="text-lg font-bold text-yellow-800 mb-2">
              Recuerde:
            </h4>
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-yellow-600 rounded-full mr-2"></span>
                Use el botón "Ayuda" si necesita pistas.
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-yellow-600 rounded-full mr-2"></span>
                Pulse "Pausar" para descansar.
              </li>
            </ul>
          </div>
          
          {/* Cuenta regresiva simplificada */}
          <div className="flex items-center justify-between">
            <div className="text-lg text-gray-700">
              {countdown > 0 ? (
                <span>Comienza en <strong>{countdown}</strong></span>
              ) : (
                <span className="text-green-600 font-bold">¡Vamos!</span>
              )}
            </div>
            
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i} 
                  className={`w-3 h-3 rounded-full ${i < countdown ? 'bg-blue-500' : 'bg-gray-300'}`}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForestInstructions;