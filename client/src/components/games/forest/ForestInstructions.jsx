import React from 'react';

const ForestInstructions = ({ 
  currentLevel, 
  currentRound, 
  totalRounds, 
  showInstructions,
  instructionsText
}) => {
  // Función que devuelve un mensaje apropiado según el nivel
  const getLevelMessage = (level) => {
    const messages = {
      1: "Reconocimiento simple",
      2: "Reconocimiento múltiple",
      3: "Secuencias",
      4: "Patrones",
      5: "Avanzado"
    };
    
    return messages[level] || "Habilidades cognitivas";
  };
  
  return (
    <>
      <div className="flex justify-between items-center px-4 py-2 bg-[#00398A] text-white rounded-md shadow-md">
        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex h-8 w-8 rounded-full bg-white/10 items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Sendero del Bosque</h2>
          </div>
        </div>
        
        <div className="flex-1 mx-4 text-center">
          <div className="bg-white/10 px-4 py-1 rounded-md inline-block">
            <span className="font-medium">{getLevelMessage(currentLevel)}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex flex-col items-end sm:flex-row sm:items-center sm:space-x-2">
            <div className="flex items-center">
              <div className="w-16 sm:w-24 bg-white/20 rounded-full h-1.5 mr-2">
                <div className="bg-green-400 h-1.5 rounded-full" style={{ width: `${(currentRound / totalRounds) * 100}%` }}></div>
              </div>
              <span className="text-sm font-medium">{currentRound}/{totalRounds}</span>
            </div>
            <div className="bg-white/10 rounded px-2 py-0.5 text-sm flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="font-medium">Nivel {currentLevel}</span>
            </div>
          </div>
        </div>
      </div>

      {showInstructions && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-11/12 shadow-2xl animate-slideInUp">
            <div className="flex items-start">
              <div className="bg-[#00398A] text-white p-3 rounded-md mr-4 hidden sm:flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-[#00398A]">Nivel {currentLevel}</h3>
                    <p className="text-sm text-gray-500 mt-1">{getLevelMessage(currentLevel)}</p>
                  </div>
                  <div className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">
                    Ronda {currentRound}/{totalRounds}
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-700 mb-2">Instrucciones:</h4>
                  <p className="text-gray-700">{instructionsText || "Busca los objetos objetivo en el bosque."}</p>
                </div>
                
                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-sm text-gray-600">Iniciando en 5 segundos...</div>
                  </div>
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-2 h-2 rounded-full bg-[#00398A]/60"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ForestInstructions;