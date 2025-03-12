// src/components/games/forest/ForestHeader.jsx
import React from 'react';

const ForestHeader = ({
  currentLevel,
  currentRound,
  totalRounds,
  remainingTime,
  timerActive,
  onHelp,
  onTogglePause,
  isPaused,
  onExit
}) => {
  // Formato para el tiempo
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="sticky top-0 z-40 bg-[#00398A] text-white py-2 px-4 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <button 
          onClick={onHelp}
          className="flex items-center justify-center px-4 py-2 bg-white text-[#00398A] rounded-md hover:bg-blue-100 font-medium transition-colors"
        >
          <span className="mr-2">?</span>
          Ayuda
        </button>
        <button 
          onClick={onTogglePause}
          className="flex items-center justify-center px-4 py-2 bg-white text-[#00398A] rounded-md hover:bg-blue-100 font-medium transition-colors"
        >
          <span className="mr-2">{isPaused ? "▶" : "⏸"}</span>
          {isPaused ? 'Reanudar' : 'Pausar'}
        </button>
      </div>
      
      <div className="flex items-center">
        <div className="text-sm font-medium bg-blue-800 px-3 py-1 rounded-md">
          Nivel: {currentLevel}/4 · Ronda: {currentRound}/{totalRounds}
        </div>
        {timerActive && (
          <div className={`ml-2 px-3 py-1 rounded-md ${remainingTime < 10 ? 'bg-red-600 animate-pulse' : 'bg-blue-700'}`}>
            Tiempo: {formatTime(remainingTime)}
          </div>
        )}
      </div>
      
      <button 
        onClick={onExit}
        className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium transition-colors"
      >
        <span className="mr-1">⬅</span>
        Salir
      </button>
    </div>
  );
};

export default ForestHeader;