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
  return (
    <div className="sticky top-0 z-40 bg-blue-900 shadow-md text-[#00398A] py-2 px-4 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <button 
          onClick={onHelp}
          className="flex items-center justify-center px-4 py-2 bg-[#00398A] text-white rounded-md hover:bg-blue-800 font-medium transition-colors"
        >
          <span className="mr-2">?</span>
          Ayuda
        </button>
        <button 
          onClick={onTogglePause}
          className="flex items-center justify-center px-4 py-2 bg-[#00398A] text-white rounded-md hover:bg-blue-800 font-medium transition-colors"
        >
          <span className="mr-2">{isPaused ? "▶" : "⏸"}</span>
          {isPaused ? 'Reanudar' : 'Pausar'}
        </button>
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