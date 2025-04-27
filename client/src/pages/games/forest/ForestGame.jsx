// src/pages/games/forest/ForestGame.jsx
import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Componentes modulares
import ForestHeader from '../../../components/games/forest/ForestHeader';
import ForestObjects from '../../../components/games/forest/ForestObjects';
import ForestFeedback from '../../../components/games/forest/ForestFeedback';
import ForestPath from '../../../components/games/forest/ForestPath';
import ForestInstructions from '../../../components/games/forest/ForestInstructions';
import ForestAudio from '../../../components/games/forest/ForestAudio';
import ForestBackground from '../../../components/games/forest/ForestBackground';
import GameFeedback from '../../../components/games/puzzle/GameFeedback';
// NUEVO: Importar el componente para mensajes de objetivos
import ForestNextObjectives from '../../../components/games/forest/ForestNextObjectives';

// Hooks y utilidades
import useForestGame from '../../../hooks/useForestGame';
import { applyAnimationStyles } from '../../../utils/forestAnimations';
import { forestPatterns } from '../../../data/forestPatterns';

// Tipos de objetos disponibles en el bosque
const forestObjects = {
  flowers: [
    { id: 'flower-blue-1', type: 'flower', color: 'blue', src: 'images/forest/flower-blue-1.svg' },
    { id: 'flower-blue-2', type: 'flower', color: 'blue', src: 'images/forest/flower-blue-2.svg' },
    { id: 'flower-red-1', type: 'flower', color: 'red', src: 'images/forest/flower-red-1.svg' },
    { id: 'flower-red-2', type: 'flower', color: 'red', src: 'images/forest/flower-red-2.svg' },
    { id: 'flower-yellow-1', type: 'flower', color: 'yellow', src: 'images/forest/flower-yellow-1.svg' },
    { id: 'flower-purple-1', type: 'flower', color: 'purple', src: 'images/forest/flower-purple-1.svg' },
  ],
  mushrooms: [
    { id: 'mushroom-red-1', type: 'mushroom', color: 'red', src: 'images/forest/mushroom-red-1.svg' },
    { id: 'mushroom-red-2', type: 'mushroom', color: 'red', src: 'images/forest/mushroom-red-2.svg' },
    { id: 'mushroom-brown-1', type: 'mushroom', color: 'brown', src: 'images/forest/mushroom-brown-1.svg' },
    { id: 'mushroom-white-1', type: 'mushroom', color: 'white', src: 'images/forest/mushroom-white-1.svg' },
  ],
  trees: [
    { id: 'tree-green-1', type: 'tree', color: 'green', src: 'images/forest/tree-green-1.svg' },
    { id: 'tree-green-2', type: 'tree', color: 'green', src: 'images/forest/tree-green-2.svg' },
    { id: 'tree-autumn-1', type: 'tree', color: 'autumn', src: 'images/forest/tree-autumn-1.svg' },
  ],
  animals: [
    { id: 'animal-rabbit-1', type: 'animal', species: 'rabbit', src: '/images/forest/animal-rabbit-1.svg' },
    { id: 'animal-fox-1', type: 'animal', species: 'fox', src: '/images/forest/animal-fox-1.svg' },
    { id: 'animal-bird-1', type: 'animal', species: 'bird', src: '/images/forest/animal-bird-1.svg' },
  ]
};

// Componente principal del juego
const ForestGame = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { config, patientId } = location.state || {};
  
  // Referencia para rastrear si el componente está montado
  const isMounted = useRef(true);
  
  // Aplicar estilos de animación al montar el componente
  useEffect(() => {
    const cleanupStyles = applyAnimationStyles();
    
    // Limpiar al desmontar
    return () => {
      isMounted.current = false;
      cleanupStyles();
    };
  }, []);
  
  // Usar el hook principal que maneja toda la lógica del juego
  const {
    gameState,
    showCorrectFeedback,
    showWrongFeedback,
    showTimeoutFeedback,
    showLevelComplete,
    showExitConfirm,
    showNextRoundMessage,
    gameCompleted,
    showCompletedMessage,
    showNextObjectivesMessage, // NUEVO: Estado para mensajes de objetivos
    nextObjectivesMessage,     // NUEVO: Mensaje de objetivos
    audioEnabled,
    handleObjectClick,
    handleHelp,
    handleTogglePause,
    handleExitClick,
    handleExitCancel,
    handleFinishGame,
    toggleAudio,
    pathRef
  } = useForestGame(config, forestPatterns, forestObjects, null, navigate, patientId);

  // Efecto para verificar automáticamente la finalización del juego
  // cuando se completan todas las rondas
  useEffect(() => {
    if (gameState.currentRound > gameState.totalRounds && isMounted.current) {
      console.log("Efecto de verificación detecta que se completaron todas las rondas");
      // Programar la transición al final del juego
      const timer = setTimeout(() => {
        if (isMounted.current) {
          handleFinishGame(true);
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [gameState.currentRound, gameState.totalRounds, handleFinishGame]);
  
  // Efecto para finalizar el juego cuando se acaba el tiempo
  useEffect(() => {
    if (gameState.timerActive && gameState.remainingTime <= 0 && isMounted.current) {
      console.log("Efecto de verificación detecta que se agotó el tiempo");
      // Programar la finalización después de un breve retardo
      const timer = setTimeout(() => {
        if (isMounted.current) {
          // Si ya estamos en la última ronda, finalizar el juego
          if (gameState.currentRound >= gameState.totalRounds) {
            handleFinishGame(true);
          }
          // No hacemos nada si no es la última ronda, porque handleTimeOut 
          // en useForestGame se encargará de ello
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [gameState.timerActive, gameState.remainingTime, gameState.currentRound, gameState.totalRounds, handleFinishGame]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Barra de control */}
      <ForestHeader
        currentLevel={gameState.currentLevel}
        currentRound={gameState.currentRound}
        totalRounds={gameState.totalRounds}
        remainingTime={gameState.remainingTime}
        timerActive={gameState.timerActive}
        onHelp={handleHelp}
        onTogglePause={handleTogglePause}
        isPaused={gameState.isPaused}
        onExit={handleExitClick}
      />

      {/* Área principal del juego */}
      <div 
        className="p-4" 
        style={{
          opacity: gameState.isPaused ? 0.5 : 1, 
          pointerEvents: gameState.isPaused ? 'none' : 'auto'
        }}
      >
        {/* MODIFICADO: Instrucciones - Ahora pasa las instrucciones dinámicas */}
        <ForestInstructions
          currentLevel={gameState.currentLevel}
          currentRound={gameState.currentRound}
          totalRounds={gameState.totalRounds}
          showInstructions={gameState.showInstructions}
          instructionsText={gameState.instructionsText} // NUEVO: Pasar instrucciones dinámicas
        />
        
        {/* Área del juego con límites claros */}
        <div className="px-4 py-2">
          <div 
            className="bg-white rounded-lg shadow-lg p-4 relative overflow-hidden" 
            style={{
              height: 'calc(100vh - 180px)', // Altura responsive basada en la altura de la ventana
              minHeight: '500px', // Altura mínima para asegurar visibilidad en pantallas pequeñas
              maxHeight: '800px', // Altura máxima para evitar exceso en pantallas muy grandes
              width: '100%', // Ancho completo del contenedor
              border: '3px solid #e0e0e0', // Borde más visible para definir claramente los límites
              boxSizing: 'border-box', // Asegurar que los bordes no afecten las dimensiones
              marginBottom: '20px'
            }}
          >
            {/* Capa de clip para asegurar que nada salga del área */}
            <div className="absolute inset-0 overflow-hidden">              
              {/* Fondo del bosque mejorado */}
              <ForestBackground />
              
              {/* Camino - Ahora responsive */}
              <ForestPath
                pathString={gameState.pathString}
                pathWidth={40} // Pasar el ancho del camino desde el estado
                ref={pathRef}
              />
              
              {/* Objetos en el camino - Ahora más grandes y dentro de los límites */}
              <ForestObjects 
                objects={gameState.objects} 
                onObjectClick={handleObjectClick} 
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Feedback y modales */}
      <ForestFeedback 
        showCorrect={showCorrectFeedback}
        showWrong={showWrongFeedback}
        showPause={gameState.isPaused}
        showExit={showExitConfirm}
        showTimeout={showTimeoutFeedback}
        showLevelComplete={showLevelComplete}
        showNextRound={showNextRoundMessage}
        showGameCompleted={gameCompleted}
        showCompleted={showCompletedMessage}
        currentRound={gameState.currentRound}
        totalRounds={gameState.totalRounds}
        onResumeGame={handleTogglePause}
        onExitConfirm={() => handleFinishGame(false)}
        onExitCancel={handleExitCancel}
        onGameComplete={() => handleFinishGame(true)}
      />
      
      {/* NUEVO: Mensajes para mostrar cambios de objetivos */}
      <ForestNextObjectives 
        show={showNextObjectivesMessage} 
        message={nextObjectivesMessage}
        isNextRound={false}
      />
      
      {/* NUEVO: Mostrar mensaje cuando hay cambio de ronda */}
      {showNextRoundMessage && (
        <ForestNextObjectives 
          show={true} 
          message={gameState.instructionsText}
          isNextRound={true}
        />
      )}

      {/* Feedback para visualización de resultados finales */}
      <GameFeedback 
        isCorrect={showCorrectFeedback}
        isWrong={showWrongFeedback}
        gameCompleted={gameCompleted}
        onFinish={() => handleFinishGame(true)}
        stats={{
          successMoves: gameState.correctMoves || gameState.objectivesCompleted || 0,
          failedMoves: gameState.incorrectMoves || gameState.objectivesFailed || 0,
          helpCount: gameState.helpCount || 0,
          totalTime: Math.floor((Date.now() - gameState.startTime - (gameState.totalPauseTime || 0)) / 1000),
          pauseCount: gameState.totalPauses || 0
        }}
      />

      
      {/* Feedback final con confetti */}
      {gameCompleted && (
        <>
          {/* Usar un div con z-index extremadamente alto */}
          <div className="fixed inset-0 flex items-center justify-center z-[9999]" style={{pointerEvents: 'auto'}}>
            {/* Confetti - Si tienes react-confetti importado */}
            {typeof Confetti !== 'undefined' && (
              <Confetti
                width={window.innerWidth}
                height={window.innerHeight}
                recycle={true}
                numberOfPieces={200}
              />
            )}
            
            {/* Modal de felicitación */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 text-center" style={{position: 'relative', zIndex: 10000}}>
              <div className="w-20 h-20 mx-auto bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-yellow-500 text-5xl">🏆</span>
              </div>
              <h2 className="text-3xl font-bold text-blue-700 mb-4">
                ¡Felicidades!
              </h2>
              <p className="text-gray-600 mb-6">
                Has completado el juego. ¡Tu recorrido por el bosque ha sido un éxito!
              </p>
              
              {/* Estrellas */}
              <div className="flex justify-center mb-6">
                <span className="text-5xl text-yellow-400 mx-1">⭐</span>
                <span className="text-5xl text-yellow-400 mx-1">⭐</span>
                <span className="text-5xl text-yellow-400 mx-1">⭐</span>
              </div>
              
              {/* Estadísticas */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Objetivos completados</p>
                  <p className="text-xl font-bold text-blue-800">{gameState.correctMoves || gameState.objectivesCompleted || 0}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Tiempo total</p>
                  <p className="text-xl font-bold text-blue-800">
                    {Math.floor((Date.now() - gameState.startTime - (gameState.totalPauseTime || 0)) / 1000 / 60)}:
                    {(Math.floor((Date.now() - gameState.startTime - (gameState.totalPauseTime || 0)) / 1000) % 60).toString().padStart(2, '0')}
                  </p>
                </div>
              </div>
              
              {/* Botón de continuar */}
              <button
                onClick={() => {
                  // Navegar a la página de resultados después de un breve retraso
                  setTimeout(() => handleFinishGame(true), 300);
                }}
                className="bg-blue-700 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-800 transition-colors shadow-md hover:shadow-lg"
              >
                Continuar
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ForestGame;