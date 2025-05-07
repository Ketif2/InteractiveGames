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
  
  // Referencias para prevenir llamadas duplicadas
  const isAdvancingRef = useRef(false);
  const timeoutHandlingRef = useRef(false);
  const isFinishingRef = useRef(false);
  
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
    instructionsText: "Busca los objetos objetivo", // texto de instrucciones
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

  // NUEVO: Estado para almacenar los tipos de objetivos actuales
  const [currentTargetTypes, setCurrentTargetTypes] = useState([]);
  
  // NUEVO: Estados para mensajes de cambio de objetivos
  const [showNextObjectivesMessage, setShowNextObjectivesMessage] = useState(false);
  const [nextObjectivesMessage, setNextObjectivesMessage] = useState("");

  // Nuevos estados para el sistema de puntos (internos, no visibles)
  const [totalScore, setTotalScore] = useState(0);
  const [screenRefreshes, setScreenRefreshes] = useState(0); // Pantallas completadas (refrescos) - DIFERENTE de las rondas
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
    const targetObjects = objects.filter(obj => obj.isTarget).length;
    const targetObjectsFound = objects.filter(obj => obj.isTarget && obj.found).length;
    
    console.log(`--- OBJETOS EN EL JUEGO ---`);
    console.log(`Objetivos: ${targetObjectsFound} encontrados de ${targetObjects} totales`);
    console.log(`Todos los objetos: ${objects.length}`);
    console.log(`Objetos encontrados: ${objects.filter(obj => obj.found).length}`);
    console.log(`------------------------`);
  }, []);

  // NUEVO: Funciones para formateo de texto en instrucciones
  const formatColor = useCallback((color) => {
    switch (color) {
      case 'blue': return 'azul';
      case 'red': return 'rojo';
      case 'yellow': return 'amarillo';
      case 'purple': return 'morado';
      case 'pink': return 'rosa';
      case 'brown': return 'café';
      case 'green': return 'verde';
      default: return color;
    }
  }, []);
  
  
  const formatAnimalType = useCallback((species) => {
    switch (species) {
      case 'rabbit': return 'conejos';
      case 'fox': return 'zorros';
      case 'bird': return 'pájaros';
      default: return 'animales';
    }
  }, []);

  const getObjectInfo = useCallback((type) => {
    switch (type) {
      case 'flower': 
        return { 
          singular: 'flor', 
          plural: 'flores', 
          gender: 'f',
          article: { definite: 'la', definite_plural: 'las', indefinite: 'una' }
        };
      case 'mushroom': 
        return { 
          singular: 'hongo', 
          plural: 'hongos', 
          gender: 'm',
          article: { definite: 'el', definite_plural: 'los', indefinite: 'un' }
        };
      case 'tree': 
        return { 
          singular: 'árbol', 
          plural: 'árboles', 
          gender: 'm',
          article: { definite: 'el', definite_plural: 'los', indefinite: 'un' }
        };
      default: 
        return { 
          singular: 'objeto', 
          plural: 'objetos', 
          gender: 'm',
          article: { definite: 'el', definite_plural: 'los', indefinite: 'un' }
        };
    }
  }, []);
  
  // Función para obtener información gramatical de animales
  const getAnimalInfo = useCallback((species) => {
    switch (species) {
      case 'rabbit': 
        return { 
          singular: 'conejo', 
          plural: 'conejos', 
          gender: 'm',
          article: { definite: 'el', definite_plural: 'los', indefinite: 'un' }
        };
      case 'fox': 
        return { 
          singular: 'zorro', 
          plural: 'zorros', 
          gender: 'm',
          article: { definite: 'el', definite_plural: 'los', indefinite: 'un' }
        };
      case 'bird': 
        return { 
          singular: 'pájaro', 
          plural: 'pájaros', 
          gender: 'm',
          article: { definite: 'el', definite_plural: 'los', indefinite: 'un' }
        };
      default: 
        return { 
          singular: 'animal', 
          plural: 'animales', 
          gender: 'm',
          article: { definite: 'el', definite_plural: 'los', indefinite: 'un' }
        };
    }
  }, []);

  // NUEVO: Función para generar instrucciones dinámicas
  const generateDynamicInstructions = useCallback((level, targetTypes, patternSequence) => {
    if (!targetTypes || targetTypes.length === 0) {
      return "Toque con el dedo los objetos marcados.";
    }
  
    let instructions = "";
    
    switch (level) {
      case 1: // Un solo tipo de objeto
        const targetType = targetTypes[0];
        
        if (targetType.type === 'animal') {
          const animalInfo = getAnimalInfo(targetType.species);
          // Para animales: "Toque con el dedo todos los conejos."
          instructions = `Toque con el dedo todos ${animalInfo.article.definite_plural} ${animalInfo.plural}.`;
        } else {
          const objectInfo = getObjectInfo(targetType.type);
          // Para objetos: "Toque con el dedo todos los hongos de color rojo."
          // O: "Toque con el dedo todas las flores de color azul."
          if (objectInfo.gender === 'f') {
            instructions = `Toque con el dedo todas ${objectInfo.article.definite_plural} ${objectInfo.plural} de color ${formatColor(targetType.color)}.`;
          } else {
            instructions = `Toque con el dedo todos ${objectInfo.article.definite_plural} ${objectInfo.plural} de color ${formatColor(targetType.color)}.`;
          }
        }
        break;
      
      case 2: // Múltiples tipos de objetos
        const type1 = targetTypes[0];
        const type2 = targetTypes[1] || type1;
        
        if (targetTypes.length === 1 || !type2) {
          // Si solo hay un tipo, usar caso de nivel 1
          if (type1.type === 'animal') {
            const animalInfo = getAnimalInfo(type1.species);
            instructions = `Toque con el dedo todos ${animalInfo.article.definite_plural} ${animalInfo.plural}.`;
          } else {
            const objectInfo = getObjectInfo(type1.type);
            if (objectInfo.gender === 'f') {
              instructions = `Toque con el dedo todas ${objectInfo.article.definite_plural} ${objectInfo.plural} de color ${formatColor(type1.color)}.`;
            } else {
              instructions = `Toque con el dedo todos ${objectInfo.article.definite_plural} ${objectInfo.plural} de color ${formatColor(type1.color)}.`;
            }
          }
        } else {
          // Formatear instrucción para dos tipos
          let part1 = "";
          let part2 = "";
          
          if (type1.type === 'animal') {
            const animalInfo = getAnimalInfo(type1.species);
            part1 = `todos ${animalInfo.article.definite_plural} ${animalInfo.plural}`;
          } else {
            const objectInfo = getObjectInfo(type1.type);
            if (objectInfo.gender === 'f') {
              part1 = `todas ${objectInfo.article.definite_plural} ${objectInfo.plural} de color ${formatColor(type1.color)}`;
            } else {
              part1 = `todos ${objectInfo.article.definite_plural} ${objectInfo.plural} de color ${formatColor(type1.color)}`;
            }
          }
          
          if (type2.type === 'animal') {
            const animalInfo = getAnimalInfo(type2.species);
            part2 = `${animalInfo.article.definite_plural} ${animalInfo.plural}`;
          } else {
            const objectInfo = getObjectInfo(type2.type);
            part2 = `${objectInfo.article.definite_plural} ${objectInfo.plural} de color ${formatColor(type2.color)}`;
          }
          
          instructions = `Toque con el dedo ${part1} y ${part2}.`;
        }
        break;
      
      case 3: // Secuencias
        instructions = "Toque en este orden: ";
        
        targetTypes.forEach((type, index) => {
          if (index > 0) {
            instructions += ", ";
          }
          
          if (type.type === 'animal') {
            const animalInfo = getAnimalInfo(type.species);
            instructions += `${animalInfo.article.definite} ${animalInfo.singular}`;
          } else {
            const objectInfo = getObjectInfo(type.type);
            instructions += `${objectInfo.article.definite} ${objectInfo.singular} ${formatColor(type.color)}`;
          }
        });
        
        instructions += ".";
        break;
      
      case 4: // Patrones
        if (patternSequence && patternSequence.length > 0) {
          instructions = "Toque siguiendo este patrón: ";
          
          patternSequence.forEach((patternPart, index) => {
            if (index > 0) {
              instructions += ", ";
            }
            
            const [type, colorOrSpecies] = patternPart.split('-');
            
            if (type === 'animal') {
              const animalInfo = getAnimalInfo(colorOrSpecies);
              instructions += `${animalInfo.article.definite} ${animalInfo.singular}`;
            } else {
              const objectInfo = getObjectInfo(type);
              instructions += `${objectInfo.article.definite} ${objectInfo.singular} ${formatColor(colorOrSpecies)}`;
            }
          });
          
          instructions += " (repitiendo).";
        } else {
          instructions = "Toque los objetos siguiendo el patrón.";
        }
        break;
      
      default:
        instructions = "Toque con el dedo los objetos marcados.";
    }
    
    return instructions;
  }, [getAnimalInfo, getObjectInfo, formatColor]);

  // IMPORTANTE: Declaramos handleFinishGame antes de usarlo en otras funciones
  const handleFinishGame = useCallback((completed = false) => {
    console.log("EJECUTANDO FINALIZACIÓN DEL JUEGO - Estado completado:", completed);
    
    // Verificar si ya se está finalizando el juego
    if (isFinishingRef.current) {
      console.log("Ya se está finalizando el juego, ignorando llamada duplicada");
      return;
    }
    
    // Marcar que estamos finalizando el juego
    isFinishingRef.current = true;
    
    // Limpiamos cualquier temporizador activo
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
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
      roundsCompleted: currentState.currentRound, // Usar currentRound como el número real de rondas completadas
      screenRefreshes: screenRefreshes, // Incluir el contador de refrescos de pantalla como dato adicional
      maxLevel: config?.startingLevel || 1,
      totalScore: totalScore + currentState.roundScore, // Incluir puntos de la ronda actual
      patternId: currentState.selectedPatternId
    };

    console.log("Navegando a resultados con estadísticas:", stats);

    // Navigate to results page con un breve retraso para asegurar que todo se complete
    setTimeout(() => {
      navigate('/games/forest/end', { 
        state: { 
          stats,
          config,
          patientId
        } 
      });
    }, 500);
  }, [config, navigate, patientId, totalScore, screenRefreshes]);

  // Función para avanzar a la siguiente ronda - SOLO SE LLAMA CUANDO ACABA EL TIEMPO
  const advanceToNextRound = useCallback(() => {
    console.log("Avanzando a la siguiente ronda...");
    
    // Usar una referencia para verificar si ya se está procesando el avance
    if (isAdvancingRef.current) {
      console.log("Ya se está procesando un avance de ronda, ignorando llamada duplicada");
      return;
    }
    
    isAdvancingRef.current = true;
    
    // Guardar la puntuación de la ronda actual antes de avanzar
    setTotalScore(prev => prev + stateRef.current.roundScore);
    
    setGameState(prev => {
      const nextRound = prev.currentRound + 1;
      // Verificar si la siguiente ronda excede el total
      if (nextRound > prev.totalRounds) {
        console.log("Se alcanzó el máximo de rondas durante el avance - Preparando para finalizar");
        
        // Programar finalización del juego después de mostrar mensaje
        setTimeout(() => {
          handleFinishGame(true);
        }, 2000);
        
        return {
          ...prev,
          currentRound: prev.totalRounds, // Mantener en la última ronda visualmente
          roundScore: 0 // Resetear puntuación para la nueva ronda
        };
      }
      
      return {
        ...prev,
        currentRound: nextRound,
        roundScore: 0 // Resetear puntuación para la nueva ronda
      };
    });
    
    // Mostrar mensaje de siguiente ronda
    setShowNextRoundMessage(true);
    setTimeout(() => {
      setShowNextRoundMessage(false);
      
      // Inicializar el nivel para la nueva ronda
      initializeLevel(true, false); // preserveStats=true, sameRound=false
      
      // Resetear la bandera de procesamiento
      isAdvancingRef.current = false;
    }, 2000);
  }, [handleFinishGame]);

  // MODIFICADO: Inicialización del nivel (genera nuevo camino y objetos)
  // Este método se usa TANTO para iniciar una nueva ronda como para refrescar la pantalla
  const initializeLevel = useCallback((preserveStats = false, sameRound = true) => {
    console.log("Inicializando nivel, preserveStats:", preserveStats, "sameRound:", sameRound);
    
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
    
    // NUEVO: Capturar los tipos de objetivos generados
    setCurrentTargetTypes(objectsResult.targetObjectTypes || []);
    
    // NUEVO: Generar instrucciones dinámicas basadas en los objetivos
    const dynamicInstructions = generateDynamicInstructions(
      config?.startingLevel || 1,
      objectsResult.targetObjectTypes,
      patternSequence
    );
    
    // NUEVO: Si estamos refrescando la pantalla o avanzando de ronda, mostrar mensaje
    if (preserveStats) {
      setNextObjectivesMessage(dynamicInstructions);
      setShowNextObjectivesMessage(true);
      
      // Ocultar después de 2 segundos
      setTimeout(() => {
        setShowNextObjectivesMessage(false);
      }, 4000);
    }
    
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
        instructionsText: dynamicInstructions // NUEVO: Instrucciones dinámicas
      };
      
      // Siempre reiniciar el temporizador cuando cambiamos de ronda
      if (!sameRound || !preserveStats) {
        newState.remainingTime = config?.timeLimit || 0;
        newState.timerActive = config?.timeLimit > 0;
      }
      
      // Si es una nueva ronda o si estamos comenzando de nuevo, resetear la puntuación
      if (!sameRound || !preserveStats) {
        newState.roundScore = 0;
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
  }, [config, forestPatterns, forestObjects, logObjectCounts, generateDynamicInstructions]);

  // Maneja el tiempo agotado - ESTE ES EL PUNTO DONDE SE AVANZA DE RONDA
  const handleTimeOut = useCallback(() => {
    // Verificar si ya se está manejando un timeout
    if (timeoutHandlingRef.current) {
      console.log("Ya se está manejando un timeout, ignorando llamada duplicada");
      return;
    }
    
    // Marcar que estamos procesando un timeout
    timeoutHandlingRef.current = true;
    
    setShowTimeoutFeedback(true);
    
    setTimeout(() => {
      setShowTimeoutFeedback(false);
      
      // Verificar si hemos completado todas las rondas
      if (stateRef.current.currentRound >= stateRef.current.totalRounds) {
        console.log("Tiempo agotado y todas las rondas completadas - Finalizando juego");
        // Si completamos todas las rondas, terminar el juego
        handleFinishGame(true);
      } else {
        console.log("Tiempo agotado pero hay más rondas - Avanzando a siguiente ronda");
        // Si no, avanzar a la siguiente ronda manteniendo el mismo nivel
        advanceToNextRound(); // Esto incrementa currentRound y resetea roundScore
      }
      
      // Resetear la bandera de procesamiento de timeout después de un tiempo
      setTimeout(() => {
        timeoutHandlingRef.current = false;
      }, 1000);
    }, 3000);
  }, [advanceToNextRound, handleFinishGame]);

  // MODIFICADO: Verificar si se han completado todos los objetivos
  const checkCompletionAndProceed = useCallback((objectId) => {
    const currentLevel = config?.startingLevel || 1;
    // Usar objectsRef para obtener el estado más actualizado
    const currentObjects = [...objectsRef.current];
    
    // Marcar el objeto actual como encontrado 
    const indexClicked = currentObjects.findIndex(obj => obj.uniqueId === objectId);
    if (indexClicked !== -1) {
      currentObjects[indexClicked] = {...currentObjects[indexClicked], found: true};
    }
    
    let allObjectivesComplete = false;
    
    if (currentLevel === 1) {
      // Nivel 1: Buscar todos los objetos del tipo objetivo actual
      // Por ejemplo, si el objetivo es "árboles verdes", buscar todos los árboles verdes
      const targetType = currentTargetTypes[0]; // En nivel 1 solo hay un tipo de objetivo
      
      if (!targetType) {
        console.error("Error: No hay tipo objetivo definido para nivel 1");
        return false;
      }
      
      let targetObjects;
      if (targetType.type === 'animal') {
        // Para animales, buscar por especie
        targetObjects = currentObjects.filter(obj => 
          obj.type === targetType.type && obj.species === targetType.species
        );
      } else {
        // Para otros objetos, buscar por color
        targetObjects = currentObjects.filter(obj => 
          obj.type === targetType.type && obj.color === targetType.color
        );
      }
      
      // Contar objetos encontrados (incluido el actual)
      const foundObjects = targetObjects.filter(obj => 
        obj.found || obj.uniqueId === objectId
      );
      
      // Log detallado para depuración
      console.log(`=== VERIFICACIÓN DE OBJETIVOS (${targetType.type}-${targetType.color || targetType.species}) ===`);
      console.log(`Total objetivos: ${targetObjects.length}`);
      console.log(`Objetivos encontrados: ${foundObjects.length}`);
      
      // Verificar si se encontraron todos
      allObjectivesComplete = (foundObjects.length === targetObjects.length && targetObjects.length > 0);
    } 
    else if (currentLevel === 2) {
      // Nivel 2: Múltiples tipos de objetivos
      const targetTypes = currentTargetTypes; // En nivel 2 hay dos tipos
      
      if (!targetTypes || targetTypes.length === 0) {
        console.error("Error: No hay tipos objetivo definidos para nivel 2");
        return false;
      }
      
      let completedObjectives = 0;
      let totalObjectives = 0;
      
      // Verificar cada tipo de objetivo
      for (const targetType of targetTypes) {
        let typeObjects;
        
        if (targetType.type === 'animal') {
          typeObjects = currentObjects.filter(obj => 
            obj.type === targetType.type && obj.species === targetType.species
          );
        } else {
          typeObjects = currentObjects.filter(obj => 
            obj.type === targetType.type && obj.color === targetType.color
          );
        }
        
        const foundTypeObjects = typeObjects.filter(obj => obj.found || obj.uniqueId === objectId);
        
        console.log(`Objetivos ${targetType.type}-${targetType.color || targetType.species} encontrados: 
          ${foundTypeObjects.length} de ${typeObjects.length}`);
        
        // Contar objetivos completados y total
        completedObjectives += foundTypeObjects.length;
        totalObjectives += typeObjects.length;
      }
      
      // Verificar si se encontraron todos los objetivos
      allObjectivesComplete = (completedObjectives === totalObjectives && totalObjectives > 0);
    } 
    else if (currentLevel === 3 || currentLevel === 4) {
      // Nivel 3 y 4: Objetos marcados como objetivo
      const targets = currentObjects.filter(obj => obj.isTarget);
      const foundTargets = targets.filter(obj => obj.found || obj.uniqueId === objectId);
      
      console.log(`Objetivos encontrados: ${foundTargets.length} de ${targets.length}`);
      
      // Verificar si se encontraron todos los objetivos
      allObjectivesComplete = (targets.length === foundTargets.length && targets.length > 0);
    }
    
    // Si se completaron todos los objetivos
    if (allObjectivesComplete) {
      console.log("¡Todos los objetivos encontrados!");
      
      // Mostrar mensaje de completado
      setShowCompletedMessage(true);
      playSound('level-complete');
      
      // Incrementar el contador de refrescos de pantalla (que es diferente de las rondas)
      setScreenRefreshes(prev => prev + 1);
      
      // Programar la recarga del nivel SIN AVANZAR DE RONDA
      setTimeout(() => {
        console.log("Objetivos completados - Refrescando pantalla");
        setShowCompletedMessage(false);
        
        // DIFERENTE de advanceToNextRound - Solo refresca la pantalla sin cambiar ronda
        // IMPORTANTE: preserveStats=true para mantener las estadísticas y puntuación
        // IMPORTANTE: sameRound=true para NO resetear la puntuación de la ronda
        initializeLevel(true, true);
      }, 4000);
      
      return true;
    }
    
    return false;
  }, [config?.startingLevel, playSound, initializeLevel, currentTargetTypes]);

  // MODIFICADO: Manejar clic en objeto
  const handleObjectClick = useCallback((objectId) => {
    // Si hay pausas o instrucciones activas, ignorar clics
    if (stateRef.current.isPaused || stateRef.current.showInstructions || showCompletedMessage) return;
    
    // Encontrar el objeto clickeado
    const clickedObject = objectsRef.current.find(obj => obj.uniqueId === objectId);
    if (!clickedObject || clickedObject.found) return;
    
    // Incrementar contador de intentos
    setGameState(prev => ({
      ...prev,
      attempts: prev.attempts + 1
    }));
    
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
      case 1: // Reconocimiento simple - un tipo de objeto
        const targetType = currentTargetTypes[0];
        
        if (!targetType) {
          console.error("Error: No hay tipo objetivo definido para nivel 1");
          break;
        }
        
        if (targetType.type === 'animal') {
          isCorrect = clickedObject.type === targetType.type && 
                      clickedObject.species === targetType.species;
        } else {
          isCorrect = clickedObject.type === targetType.type && 
                      clickedObject.color === targetType.color;
        }
        
        console.log('Objeto clickeado:', 
          clickedObject.type, clickedObject.color || clickedObject.species, 
          isCorrect ? '(correcto)' : '(incorrecto)',
          `ID: ${clickedObject.uniqueId}`
        );
        break;
      case 2: // Reconocimiento múltiple - múltiples tipos de objetos
        isCorrect = currentTargetTypes.some(targetType => {
          if (targetType.type === 'animal') {
            return clickedObject.type === targetType.type && 
                   clickedObject.species === targetType.species;
          } else {
            return clickedObject.type === targetType.type && 
                   clickedObject.color === targetType.color;
          }
        });
        break;
      case 3: // Secuencias
        const pendingSequence = stateRef.current.targetObjects
          .filter(obj => !obj.found)
          .sort((a, b) => a.sequence - b.sequence);
        
        if (pendingSequence.length > 0) {
          const nextInSequence = pendingSequence[0];
          isCorrect = clickedObject.type === nextInSequence.type && 
                     (clickedObject.color === nextInSequence.color || 
                      clickedObject.species === nextInSequence.species);
        }
        break;
      case 4: // Patrones
        if (stateRef.current.patternSequence && stateRef.current.patternSequence.length > 0) {
          const patternPart = stateRef.current.patternSequence[stateRef.current.currentPatternIndex];
          const [type, colorOrSpecies] = patternPart.split('-');
          
          if (type === 'animal') {
            isCorrect = clickedObject.type === type && clickedObject.species === colorOrSpecies;
          } else {
            isCorrect = clickedObject.type === type && clickedObject.color === colorOrSpecies;
          }
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
}, [config?.startingLevel, showCompletedMessage, playSound, checkCompletionAndProceed, currentTargetTypes]);

// Función para verificación manual (depuración)
const forceVerification = useCallback(() => {
console.log("=== FORZANDO VERIFICACIÓN MANUAL ===");
const currentObjects = objectsRef.current;

// Buscar cualquier objeto objetivo no encontrado
const targets = currentObjects.filter(obj => obj.isTarget);
const foundTargets = targets.filter(obj => obj.found);

console.log(`Total objetivos: ${targets.length}`);
console.log(`Objetivos encontrados: ${foundTargets.length}`);

// Enumerar cada objetivo
targets.forEach((target, idx) => {
console.log(`Objetivo #${idx + 1} (${target.uniqueId}): ${target.found ? 'Encontrado' : 'No encontrado'}`);
});

// Forzar completado si necesario
if (foundTargets.length === targets.length - 1) {
console.log("FORZANDO COMPLETADO - Marcando último objetivo");

// Encontrar el objetivo no encontrado
const missingTarget = targets.find(target => !target.found);

// Marcarlo como encontrado
if (missingTarget) {
  handleObjectClick(missingTarget.uniqueId);
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

// Temporizador - PUNTO CRUCIAL PARA AVANZAR DE RONDA
useEffect(() => {
if (gameState.timerActive && !gameState.isPaused && gameState.remainingTime > 0 && !showCompletedMessage) {
timerRef.current = setInterval(() => {
  setGameState(prev => {
    const newTime = prev.remainingTime - 1;
    if (newTime <= 0) {
      console.log("Temporizador llegó a cero - Deteniendo y manejando tiempo agotado");
      clearInterval(timerRef.current);
      
      // Programar handleTimeOut con un pequeño retraso para evitar condiciones de carrera
      // Solo si no se está manejando un timeout ya
      if (!timeoutHandlingRef.current) {
        setTimeout(() => {
          handleTimeOut();
        }, 100);
      }
      
      return { ...prev, remainingTime: 0 };
    }
    return { ...prev, remainingTime: newTime };
  });
}, 1000);
} else if (!gameState.timerActive || gameState.isPaused || showCompletedMessage) {
clearInterval(timerRef.current);
}

return () => {
if (timerRef.current) {
  clearInterval(timerRef.current);
}
};
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

// Modificar el handleExitClick para que guarde las estadísticas y vaya a ForestEnd
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
showNextObjectivesMessage, // NUEVO
nextObjectivesMessage,     // NUEVO
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
rounds: screenRefreshes // Para mantener compatibilidad con el código anterior
};
};

export default useForestGame;