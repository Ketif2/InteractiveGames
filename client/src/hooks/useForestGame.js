// src/hooks/useForestGame.js
import { useState, useEffect, useCallback, useRef } from 'react';
import generatePath from '../utils/forestPathGenerator';
import generateObjects from '../utils/forestObjectGenerator';
import useForestAudio from './useForestAudio';

const useForestGame = (config, forestPatterns, forestObjects, onGameComplete, navigate, patientId) => {
  const { 
    audioEnabled, 
    playSound, 
    toggleAudio 
  } = useForestAudio();
  
  const pathRef = useRef(null);
  
  // Estado del juego
  const [gameState, setGameState] = useState({
    currentLevel: config?.startingLevel || 1,
    currentRound: 1,
    totalRounds: config?.rounds || 3,
    objects: [],           // objetos en el camino
    pathPoints: [],        // puntos para el camino
    pathString: '',        // string SVG del camino
    targetObjects: [],     // objetos objetivo a encontrar
    patternSequence: [],   // secuencia del patrón a seguir (nivel 4)
    currentPatternIndex: 0, // índice actual en el patrón
    selectedPatternId: null, // patrón seleccionado
    showInstructions: true, // mostrar instrucciones
    isPaused: false,
    startTime: Date.now(),
    totalPauseTime: 0,
    lastPauseTime: null,
    helpCount: 0,
    attempts: 0,
    totalPauses: 0,
    num_errores: 0,        // contador de errores
    num_aciertos: 0,       // contador de aciertos
    remainingTime: config?.timeLimit || 0, // tiempo restante
    timerActive: config?.timeLimit > 0,    // si hay temporizador activo
    completado: false,
    roundScore: 0          // Puntuación de la ronda actual (interna, no visible)
  });

  // Nuevos estados para el sistema de puntos (internos, no visibles)
  const [totalScore, setTotalScore] = useState(0);
  const [rounds, setRounds] = useState(1); // Pantallas completadas en un nivel
  const [showCompletedMessage, setShowCompletedMessage] = useState(false);

  // Estado para feedback
  const [showCorrectFeedback, setShowCorrectFeedback] = useState(false);
  const [showWrongFeedback, setShowWrongFeedback] = useState(false);
  const [showTimeoutFeedback, setShowTimeoutFeedback] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showNextRoundMessage, setShowNextRoundMessage] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  
  // Referencias para temporizadores
  const timerRef = useRef(null);
  // Referencias adicionales para evitar loops
  const objectsRef = useRef([]);
  const stateRef = useRef({});
  
  // Actualizar la referencia cuando cambie gameState
  useEffect(() => {
    objectsRef.current = gameState.objects;
    stateRef.current = gameState;
  }, [gameState]);

  // Función para contar objetos (para depuración)
  const logObjectCounts = useCallback((objects) => {
    if (!objects || objects.length === 0) return;
    
    // Contar por tipo y color
    const flowerBlue = objects.filter(obj => obj.type === 'flower' && obj.color === 'blue').length;
    const flowerBlueFound = objects.filter(obj => obj.type === 'flower' && obj.color === 'blue' && obj.found).length;
    
    console.log(`--- OBJETOS EN EL JUEGO ---`);
    console.log(`Flores azules: ${flowerBlueFound} encontradas de ${flowerBlue} totales`);
    console.log(`Todos los objetos: ${objects.length}`);
    console.log(`Objetos encontrados: ${objects.filter(obj => obj.found).length}`);
    console.log(`------------------------`);
  }, []);

  // IMPORTANTE: Declaramos handleFinishGame antes de usarlo en otras funciones
  const handleFinishGame = useCallback((completed = false) => {
    const endTime = Date.now();
    const currentState = stateRef.current;
    
    let totalTimeSeconds = Math.floor(
      (endTime - currentState.startTime - currentState.totalPauseTime) / 1000
    );
    
    // Ensure time is at least 1 second
    totalTimeSeconds = Math.max(1, totalTimeSeconds);

    // Prepare stats for results page
    const stats = {
      attempts: currentState.attempts,
      helpCount: currentState.helpCount,
      totalTime: totalTimeSeconds,
      totalPauses: currentState.totalPauses,
      num_errores: currentState.num_errores,
      num_aciertos: currentState.num_aciertos,
      completado: completed,
      totalRounds: currentState.currentRound,
      roundsCompleted: rounds,
      maxLevel: config?.startingLevel || 1,
      totalScore: totalScore + currentState.roundScore, // Incluir puntos de la ronda actual
      patternId: currentState.selectedPatternId
    };

    // Navigate to results page
    navigate('/games/forest/end', { 
      state: { 
        stats,
        config,
        patientId
      } 
    });
  }, [config, navigate, patientId, totalScore, rounds]);

  // Función para avanzar a la siguiente ronda
  const advanceToNextRound = useCallback(() => {
    console.log("Avanzando a la siguiente ronda...");
    setGameState(prev => ({
      ...prev,
      currentRound: prev.currentRound + 1
    }));
    
    // También actualiza directamente el contador de rondas visual
    setRounds(prev => prev + 1);
  }, []);

  // Inicialización del nivel (genera nuevo camino y objetos)
  const initializeLevel = useCallback((preserveStats = false, sameLevel = true) => {
    console.log("Inicializando nivel, preserveStats:", preserveStats, "sameLevel:", sameLevel);
    
    // Generar nuevo camino
    const pathResult = generatePath();
    const pathString = pathResult.pathString;
    const pathPoints = pathResult.pathPoints;
    
    // Generar objetos para este nivel (siempre usando el mismo nivel configurado)
    const objectsResult = generateObjects(
      pathPoints, 
      config?.startingLevel || 1, // Siempre usar el nivel configurado
      config?.difficulty || 'medio',
      config,
      forestPatterns,
      forestObjects
    );
    
    const allObjects = objectsResult.allObjects;
    const targetObjects = objectsResult.targetObjects;
    const patternSequence = objectsResult.patternSequence;
    const selectedPatternId = objectsResult.selectedPatternId;
    
    // Actualizar estado del juego
    setGameState(prev => {
      // Si preserveStats es true, mantener estadísticas acumuladas
      const newState = {
        ...prev,
        pathString,
        pathPoints,
        objects: allObjects,
        targetObjects,
        patternSequence: patternSequence.length > 0 ? patternSequence : prev.patternSequence,
        currentPatternIndex: 0,
        showInstructions: !preserveStats, // Solo mostrar instrucciones al inicio
        selectedPatternId,
        // IMPORTANTE: NO MODIFICAR currentRound aquí
        // Si es una nueva ronda, resetear la puntuación
        roundScore: preserveStats && sameLevel ? prev.roundScore : 0
      };
      
      // Actualizar el temporizador
      if (!preserveStats) {
        newState.remainingTime = config?.timeLimit || 0;
        newState.timerActive = config?.timeLimit > 0;
      }
      
      if (!preserveStats) {
        return {
          ...newState,
          startTime: Date.now(),
          totalPauseTime: 0,
          lastPauseTime: null,
          helpCount: 0,
          attempts: 0,
          totalPauses: 0,
          num_errores: 0,
          num_aciertos: 0,
          // Si estamos comenzando de nuevo (no preservando stats), establecer la ronda en 1
          currentRound: 1
        };
      }
      
      return newState;
    });
    
    // Mostrar instrucciones por 5 segundos antes de iniciar (solo si no preservamos estadísticas)
    if (!preserveStats) {
      setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          showInstructions: false
        }));
      }, 5000);
    }
    
    // Registrar objetos para depuración - USAR OBJETOS DIRECTOS PARA ROMPER DEPENDENCIA CIRCULAR
    setTimeout(() => {
      logObjectCounts(allObjects);
    }, 500);
  }, [config, forestPatterns, forestObjects, logObjectCounts]);

  // Maneja el tiempo agotado - Inicia la siguiente ronda
  const handleTimeOut = useCallback(() => {
    setShowTimeoutFeedback(true);
    // Añadir la puntuación de la ronda actual al total
    setTotalScore(prev => prev + stateRef.current.roundScore);
    
    setTimeout(() => {
      setShowTimeoutFeedback(false);
      
      // Verificar si hemos completado todas las rondas - usar stateRef para evitar dependencias circulares
      if (stateRef.current.currentRound >= stateRef.current.totalRounds) {
        // Si completamos todas las rondas, terminar el juego
        handleFinishGame(true);
      } else {
        // Si no, avanzar a la siguiente ronda manteniendo el mismo nivel
        advanceToNextRound(); // Usar la función centralizada para avanzar rondas
        
        // Inicializar el mismo nivel para la nueva ronda
        initializeLevel(true, true);
      }
    }, 3000);
  }, [advanceToNextRound, handleFinishGame, initializeLevel]);

  // Verificar si se han completado todos los objetivos
  const checkCompletionAndProceed = useCallback((objectId) => {
    const currentLevel = config?.startingLevel || 1;
    // Usar objectsRef para obtener el estado más actualizado
    const currentObjects = [...objectsRef.current];
    
    // Marcar el objeto actual como encontrado 
    const indexClicked = currentObjects.findIndex(obj => obj.uniqueId === objectId);
    if (indexClicked !== -1) {
      currentObjects[indexClicked] = {...currentObjects[indexClicked], found: true};
    }
    
    // NIVEL 1: Contar flores azules con precisión
    if (currentLevel === 1) {
      // Buscar todas las flores azules
      const blueFlowers = currentObjects.filter(obj => 
        obj.type === 'flower' && obj.color === 'blue'
      );
      
      // Contar flores encontradas (incluida la actual)
      const foundBlueFlowers = blueFlowers.filter(obj => 
        obj.found || obj.uniqueId === objectId
      );
      
      // Log detallado para depuración
      console.log("=== VERIFICACIÓN DE FLORES AZULES ===");
      console.log(`Total flores azules: ${blueFlowers.length}`);
      console.log(`Flores encontradas: ${foundBlueFlowers.length}`);
      
      // Enumerar cada flor y su estado
      blueFlowers.forEach((flower, idx) => {
        console.log(`Flor #${idx + 1} (${flower.uniqueId}): ${(flower.found || flower.uniqueId === objectId) ? 'Encontrada' : 'No encontrada'}`);
      });
      
      // Verificar si se encontraron todas
      if (foundBlueFlowers.length === blueFlowers.length && blueFlowers.length > 0) {
        console.log("¡TODAS LAS FLORES AZULES ENCONTRADAS!");
        
        // Mostrar mensaje de completado
        setShowCompletedMessage(true);
        playSound('level-complete');
        
        // Programar la recarga nivel
        setTimeout(() => {
          console.log("Recargando nivel para la siguiente ronda...");
          setShowCompletedMessage(false);
          
          // Avanzar a la siguiente ronda
          advanceToNextRound();
          
          // Inicializar el mismo nivel manteniendo estadísticas
          initializeLevel(true, true);
        }, 2000);
        
        return true;
      }
    } 
    else if (currentLevel === 2) {
      // NIVEL 2: Flores azules Y hongos rojos
      const blueFlowers = currentObjects.filter(obj => 
        obj.type === 'flower' && obj.color === 'blue'
      );
      const redMushrooms = currentObjects.filter(obj => 
        obj.type === 'mushroom' && obj.color === 'red'
      );
      
      const foundBlueFlowers = blueFlowers.filter(obj => obj.found || obj.uniqueId === objectId);
      const foundRedMushrooms = redMushrooms.filter(obj => obj.found || obj.uniqueId === objectId);
      
      console.log(`Flores azules encontradas: ${foundBlueFlowers.length} de ${blueFlowers.length}`);
      console.log(`Hongos rojos encontrados: ${foundRedMushrooms.length} de ${redMushrooms.length}`);
      
      // Verificar si se encontraron todos los objetivos
      if (blueFlowers.length === foundBlueFlowers.length && 
          redMushrooms.length === foundRedMushrooms.length &&
          (blueFlowers.length > 0 || redMushrooms.length > 0)) {
        console.log("¡Todos los objetivos encontrados!");
        
        // Mostrar mensaje de completado
        setShowCompletedMessage(true);
        playSound('level-complete');
        
        // Programar la recarga del nivel
        setTimeout(() => {
          console.log("Recargando nivel para la siguiente ronda...");
          setShowCompletedMessage(false);
          
          // Avanzar a la siguiente ronda
          advanceToNextRound();
          
          // Inicializar el mismo nivel manteniendo estadísticas
          initializeLevel(true, true);
        }, 2000);
        
        return true;
      }
    } 
    else if (currentLevel === 3 || currentLevel === 4) {
      // Nivel 3 y 4: Objetos marcados como objetivo
      const targets = currentObjects.filter(obj => obj.isTarget);
      const foundTargets = targets.filter(obj => obj.found || obj.uniqueId === objectId);
      
      console.log(`Objetivos encontrados: ${foundTargets.length} de ${targets.length}`);
      
      // Verificar si se encontraron todos los objetivos
      if (targets.length === foundTargets.length && targets.length > 0) {
        console.log("¡Todos los objetivos encontrados!");
        
        // Mostrar mensaje de completado
        setShowCompletedMessage(true);
        playSound('level-complete');
        
        // Programar la recarga del nivel
        setTimeout(() => {
          console.log("Recargando nivel para la siguiente ronda...");
          setShowCompletedMessage(false);
          
          // Avanzar a la siguiente ronda
          advanceToNextRound();
          
          // Inicializar el mismo nivel manteniendo estadísticas
          initializeLevel(true, true);
        }, 2000);
        
        return true;
      }
    }
    
    return false;
  }, [config?.startingLevel, advanceToNextRound, initializeLevel, playSound]);

  // Manejar clic en objeto
  const handleObjectClick = useCallback((objectId) => {
    // Si hay pausas o instrucciones activas, ignorar clics
    if (stateRef.current.isPaused || stateRef.current.showInstructions || showCompletedMessage) return;
    
    // Encontrar el objeto clickeado
    const clickedObject = objectsRef.current.find(obj => obj.uniqueId === objectId);
    if (!clickedObject || clickedObject.found) return;
    
    // Capturar el nivel actual para validación
    const currentLevel = config?.startingLevel || 1;
    let isCorrect = false;
    
    // Efecto visual de click
    const element = document.getElementById(objectId);
    if (element) {
      element.classList.add('scale-110', 'transition-transform');
      setTimeout(() => {
        if (element) element.classList.remove('scale-110', 'transition-transform');
      }, 200);
    }
    
    // Verificar si el clic es correcto según el nivel
    switch (currentLevel) {
      case 1: // Reconocimiento simple - SOLO flores azules
        isCorrect = clickedObject.type === 'flower' && clickedObject.color === 'blue';
        console.log('Objeto clickeado:', 
          clickedObject.type, clickedObject.color, 
          isCorrect ? '(correcto)' : '(incorrecto)',
          `ID: ${clickedObject.uniqueId}`
        );
        break;
      case 2: // Reconocimiento múltiple - flores azules Y hongos rojos
        isCorrect = (clickedObject.type === 'flower' && clickedObject.color === 'blue') || 
                    (clickedObject.type === 'mushroom' && clickedObject.color === 'red');
        break;
      case 3: // Secuencias
        const pendingSequence = stateRef.current.targetObjects
          .filter(obj => !obj.found)
          .sort((a, b) => a.sequence - b.sequence);
        
        if (pendingSequence.length > 0) {
          const nextInSequence = pendingSequence[0];
          isCorrect = clickedObject.type === nextInSequence.type && 
                      clickedObject.color === nextInSequence.color;
        }
        break;
      case 4: // Patrones
        if (stateRef.current.patternSequence && stateRef.current.patternSequence.length > 0) {
          const patternPart = stateRef.current.patternSequence[stateRef.current.currentPatternIndex];
          const [type, color] = patternPart.split('-');
          
          isCorrect = clickedObject.type === type && clickedObject.color === color;
        }
        break;
    }
    
    // Actualizar el estado según el resultado
    if (isCorrect) {
      setGameState(prev => {
        const objects = [...prev.objects];
        const clickedIdx = objects.findIndex(obj => obj.uniqueId === objectId);
        
        // Marcar como encontrado
        objects[clickedIdx] = { ...objects[clickedIdx], found: true };
        
        // Actualizar índice del patrón para nivel 4
        let newPatternIndex = prev.currentPatternIndex;
        if (currentLevel === 4) {
          newPatternIndex = (prev.currentPatternIndex + 1) % prev.patternSequence.length;
        }
        
        // Calcular puntos según el nivel
        let pointsEarned = 1; // Puntos base
        switch (currentLevel) {
          case 1: pointsEarned = 1; break;
          case 2: pointsEarned = 2; break;
          case 3: pointsEarned = 3; break;
          case 4: pointsEarned = 4; break;
        }
        
        return {
          ...prev,
          objects,
          currentPatternIndex: newPatternIndex,
          num_aciertos: prev.num_aciertos + 1,
          roundScore: prev.roundScore + pointsEarned
        };
      });
      
      // Mostrar feedback positivo
      setShowCorrectFeedback(true);
      playSound('correct');
      setTimeout(() => setShowCorrectFeedback(false), 500);
      
      // Verificar si se han completado todos los objetivos después de un breve retraso
      setTimeout(() => {
        checkCompletionAndProceed(objectId);
      }, 100);
    } else {
      // Feedback negativo y contar error
      setShowWrongFeedback(true);
      playSound('error');
      
      setGameState(prev => ({
        ...prev,
        num_errores: prev.num_errores + 1,
        roundScore: Math.max(0, prev.roundScore - 1) // Restar 1 punto por error, mínimo 0
      }));
      
      setTimeout(() => setShowWrongFeedback(false), 500);
    }
  }, [config?.startingLevel, showCompletedMessage, playSound, checkCompletionAndProceed]);

  // Función para verificación manual (depuración)
  const forceVerification = useCallback(() => {
    console.log("=== FORZANDO VERIFICACIÓN MANUAL ===");
    const currentObjects = objectsRef.current;
    
    const blueFlowers = currentObjects.filter(obj => 
      obj.type === 'flower' && obj.color === 'blue'
    );
    
    const foundBlueFlowers = blueFlowers.filter(obj => obj.found);
    
    console.log(`Total flores azules: ${blueFlowers.length}`);
    console.log(`Flores encontradas: ${foundBlueFlowers.length}`);
    
    // Enumerar cada flor
    blueFlowers.forEach((flower, idx) => {
      console.log(`Flor #${idx + 1} (${flower.uniqueId}): ${flower.found ? 'Encontrada' : 'No encontrada'}`);
    });
    
    // Forzar completado si necesario
    if (foundBlueFlowers.length === blueFlowers.length - 1) {
      console.log("FORZANDO COMPLETADO - Marcando última flor");
      
      // Encontrar la flor no encontrada
      const missingFlower = blueFlowers.find(flower => !flower.found);
      
      // Marcarla como encontrada
      if (missingFlower) {
        handleObjectClick(missingFlower.uniqueId);
      }
    }
  }, [handleObjectClick]);
  
  // Inicialización del juego
  useEffect(() => {
    // Inicializar juego
    initializeLevel();
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [initializeLevel]);
  
  // Añadir atajo de teclado para verificación manual
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Presionar F3 para verificar
      if (e.key === 'F3') {
        forceVerification();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [forceVerification]);
  
  // Temporizador
  useEffect(() => {
    if (gameState.timerActive && !gameState.isPaused && gameState.remainingTime > 0 && !showCompletedMessage) {
      timerRef.current = setInterval(() => {
        setGameState(prev => {
          const newTime = prev.remainingTime - 1;
          if (newTime <= 0) {
            clearInterval(timerRef.current);
            handleTimeOut();
            return { ...prev, remainingTime: 0 };
          }
          return { ...prev, remainingTime: newTime };
        });
      }, 1000);
    } else if (!gameState.timerActive || gameState.isPaused || showCompletedMessage) {
      clearInterval(timerRef.current);
    }
    
    return () => clearInterval(timerRef.current);
  }, [gameState.timerActive, gameState.isPaused, gameState.remainingTime, showCompletedMessage, handleTimeOut]);
  
  // Funciones para control del juego
  const handleHelp = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      helpCount: prev.helpCount + 1
    }));
    
    // Reproducir sonido de ayuda
    playSound('help');
    
    // Dar pista visual sobre los objetivos
    const highlightedElements = document.querySelectorAll('.object-highlight');
    highlightedElements.forEach(el => el.classList.remove('object-highlight'));
    
    // Añadir clase de animación a los objetivos
    const targetElements = document.querySelectorAll('.target-object');
    targetElements.forEach(el => {
      el.classList.add('object-highlight');
      setTimeout(() => el.classList.remove('object-highlight'), 3000);
    });
  }, [playSound]);

  const handleTogglePause = useCallback(() => {
    setGameState(prev => {
      const now = Date.now();
      if (prev.isPaused) {
        // Resuming game
        return {
          ...prev,
          isPaused: false,
          totalPauseTime: prev.totalPauseTime + (now - (prev.lastPauseTime || now)),
          lastPauseTime: null
        };
      }
      // Pausing game
      return {
        ...prev,
        isPaused: true,
        lastPauseTime: now,
        totalPauses: prev.totalPauses + 1
      };
    });
  }, []);

  const handleExitClick = useCallback(() => {
    setShowExitConfirm(true);
  }, []);

  const handleExitCancel = useCallback(() => {
    setShowExitConfirm(false);
  }, []);

  return {
    gameState,
    showCorrectFeedback,
    showWrongFeedback,
    showTimeoutFeedback,
    showExitConfirm,
    showNextRoundMessage,
    gameCompleted,
    showCompletedMessage,
    audioEnabled,
    handleObjectClick,
    handleHelp,
    handleTogglePause,
    handleExitClick,
    handleExitCancel,
    handleFinishGame,
    toggleAudio,
    pathRef,
    totalScore,
    rounds
  };
};

export default useForestGame;