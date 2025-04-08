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
    { id: 'flower-yellow-1', type: 'flower', color: 'yellow', src: '/images/forest/flower-yellow-1.svg' },
    { id: 'flower-purple-1', type: 'flower', color: 'purple', src: '/images/forest/flower-purple-1.svg' },
  ],
  mushrooms: [
    { id: 'mushroom-red-1', type: 'mushroom', color: 'red', src: '/images/forest/mushroom-red-1.svg' },
    { id: 'mushroom-red-2', type: 'mushroom', color: 'red', src: '/images/forest/mushroom-red-2.svg' },
    { id: 'mushroom-brown-1', type: 'mushroom', color: 'brown', src: '/images/forest/mushroom-brown-1.svg' },
    { id: 'mushroom-white-1', type: 'mushroom', color: 'white', src: '/images/forest/mushroom-white-1.svg' },
  ],
  trees: [
    { id: 'tree-green-1', type: 'tree', color: 'green', src: '/images/forest/tree-green-1.svg' },
    { id: 'tree-green-2', type: 'tree', color: 'green', src: '/images/forest/tree-green-2.svg' },
    { id: 'tree-autumn-1', type: 'tree', color: 'autumn', src: '/images/forest/tree-autumn-1.svg' },
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
              {/* Control de audio */}
              <ForestAudio
                audioEnabled={audioEnabled}
                onToggleAudio={toggleAudio}
              />
              
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
    </div>
  );
};

export default ForestGame;