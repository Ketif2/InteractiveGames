import React from 'react';

const ForestAudio = ({ audioEnabled, onToggleAudio }) => {
  return (
    <div className="absolute top-2 right-2 z-10">
      <button 
        onClick={onToggleAudio} 
        className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
        title={audioEnabled ? "Silenciar audio" : "Activar audio"}
      >
        {audioEnabled ? "🔊" : "🔇"}
      </button>
    </div>
  );
};

export default ForestAudio;