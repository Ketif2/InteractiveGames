// src/components/games/forest/ForestBackground.jsx
import React from 'react';

const ForestBackground = () => {
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-green-50 to-green-100 overflow-hidden">
      {/* Gradiente en la parte inferior */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-green-200 to-transparent opacity-40"></div>
      
      {/* Elementos decorativos para el bosque */}
      <div className="absolute top-10 left-10 text-6xl opacity-10 transform rotate-3">🌲</div>
      <div className="absolute top-40 right-20 text-5xl opacity-10 transform -rotate-2">🌳</div>
      <div className="absolute bottom-20 left-40 text-6xl opacity-10 transform rotate-5">🌿</div>
      <div className="absolute top-80 left-80 text-5xl opacity-10 transform -rotate-3">🌲</div>
      <div className="absolute top-30 right-60 text-5xl opacity-10 transform rotate-2">🌿</div>
      <div className="absolute bottom-40 right-70 text-5xl opacity-10 transform rotate-6">🌳</div>
      
      {/* Nubes sutiles */}
      <div className="absolute top-5 left-1/4 w-24 h-8 bg-white rounded-full opacity-20"></div>
      <div className="absolute top-8 left-1/4 -ml-4 w-16 h-8 bg-white rounded-full opacity-20"></div>
      <div className="absolute top-7 left-1/4 ml-10 w-20 h-10 bg-white rounded-full opacity-20"></div>
      
      <div className="absolute top-20 right-1/4 w-28 h-10 bg-white rounded-full opacity-15"></div>
      <div className="absolute top-24 right-1/4 -mr-5 w-20 h-8 bg-white rounded-full opacity-15"></div>
      
      {/* Detalles ambientales sutiles */}
      <div className="absolute top-1/3 left-1/5 text-xl opacity-5">🦋</div>
      <div className="absolute top-2/3 right-1/4 text-xl opacity-5">🦋</div>
      <div className="absolute bottom-1/4 left-1/3 text-xl opacity-5">🐝</div>
      
      {/* Filtro de textura sutil */}
      <div className="absolute inset-0 bg-repeat opacity-5" 
           style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'6\' height=\'6\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M5 0h1L0 5v1H0V0h5z\' fill=\'%23000000\' fill-opacity=\'0.5\' fill-rule=\'evenodd\'/%3E%3C/svg%3E%0A")'}}></div>
    </div>
  );
};

export default ForestBackground;