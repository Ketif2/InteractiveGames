// src/utils/forestObjectGenerator.js
import { findNonOverlappingPosition, ensureNoOverlap } from './forestObjectPositioner';

/**
 * Genera objetos para colocar en el camino del bosque adaptándose al tamaño del contenedor
 * @param {Array} pathPoints - Puntos del camino
 * @param {Number} level - Nivel actual del juego
 * @param {String} difficulty - Dificultad ('fácil', 'medio', 'difícil')
 * @param {Object} config - Configuración adicional
 * @param {Array} forestPatterns - Patrones disponibles
 * @param {Object} forestObjects - Tipos de objetos disponibles
 * @returns {Object} Objetos generados y otra información relevante
 */
export function generateObjects(pathPoints, level, difficulty, config, forestPatterns, forestObjects) {
  // Calcular dimensiones del área de juego para distribución responsive
  const getContainerDimensions = () => {
    if (typeof window === 'undefined') return { width: 1000, height: 500 };
    
    const width = window.innerWidth - 80;
    const height = Math.min(Math.max(window.innerHeight - 200, 400), 700);
    
    return { width, height };
  };
  
  const { width: containerWidth, height: containerHeight } = getContainerDimensions();
  
  // Calcular los límites del área de juego con un margen de seguridad
  const getBoundaries = () => {
    const padding = Math.min(containerWidth, containerHeight) * 0.06; // Margen proporcional
    
    return {
      minX: padding,
      maxX: containerWidth - padding,
      minY: padding,
      maxY: containerHeight - padding
    };
  };
  
  const boundaries = getBoundaries();
  
  // Ajustar densidad y cantidad de objetos según tamaño del contenedor
  const getObjectCount = () => {
    // Calcular factor de área - cuánto espacio disponible hay
    const areaFactor = (containerWidth * containerHeight) / (1000 * 500); // Normalizado a un área de referencia
    
    // Base counts ajustadas por tamaño del área - reducir número para evitar saturación
    const baseCounts = {
      'fácil': { targets: Math.max(4, Math.floor(5 * areaFactor)), distractors: Math.max(8, Math.floor(10 * areaFactor)) },
      'medio': { targets: Math.max(5, Math.floor(6 * areaFactor)), distractors: Math.max(10, Math.floor(12 * areaFactor)) },
      'difícil': { targets: Math.max(6, Math.floor(8 * areaFactor)), distractors: Math.max(12, Math.floor(15 * areaFactor)) }
    };
    
    // Ajustar por densidad de objetos
    const densityMultiplier = {
      'baja': 0.7,
      'normal': 0.9, // Reducido para evitar saturación
      'alta': 1.1    // Reducido para evitar saturación
    };
    
    const baseCount = baseCounts[difficulty] || baseCounts['medio'];
    const multiplier = densityMultiplier[config?.objectDensity] || 0.9;
    
    return {
      targets: Math.round(baseCount.targets * multiplier),
      distractors: Math.round(baseCount.distractors * multiplier)
    };
  };
  
  const { targets, distractors } = getObjectCount();
  
  // Seleccionar un patrón, ya sea específico (si está en config) o aleatorio
  let selectedPattern;
  if (config?.patternId) {
    selectedPattern = forestPatterns.find(p => p.id === config.patternId);
  }
  
  if (!selectedPattern && Array.isArray(forestPatterns) && forestPatterns.length > 0) {
    const randomPatternIndex = Math.floor(Math.random() * forestPatterns.length);
    selectedPattern = forestPatterns[randomPatternIndex];
  }
  
  // Patrón por defecto en caso de que no haya patrones disponibles
  if (!selectedPattern) {
    // Generar un patrón por defecto con distribución mejorada
    const defaultPositions = [];
    
    // Calcular offsets basados en el tamaño del contenedor
    const offsetMultiplierX = containerWidth / 1000;
    const offsetMultiplierY = containerHeight / 500;
    
    // Crear posiciones objetivo a lo largo del camino - Más espaciadas
    for (let i = 0; i < 10; i++) { // Reducido de 15 a 10
      const relX = i / 9; // Distribuir uniformemente (0 a 1)
      defaultPositions.push({
        relX,
        offsetX: ((i % 3) - 1) * 30 * offsetMultiplierX, // Mayor espacio horizontal
        offsetY: -35 * offsetMultiplierY + (Math.random() * 15 - 7.5) * offsetMultiplierY, // Mayor espacio vertical
        forTarget: true
      });
    }
    
    // Crear posiciones distractoras alrededor del camino - Más espaciadas
    for (let i = 0; i < 15; i++) { // Reducido de 20 a 15
      const relX = (i + 0.5) / 15; // Posiciones intercaladas
      
      // Seleccionar ubicación con mayor separación
      const isUpper = i % 2 === 0;
      const yOffset = isUpper ? 
        -80 * offsetMultiplierY - (Math.random() * 60 * offsetMultiplierY) : // Más separación arriba
        70 * offsetMultiplierY + (Math.random() * 60 * offsetMultiplierY);   // Más separación abajo
      
      defaultPositions.push({
        relX,
        offsetX: -60 * offsetMultiplierX + (Math.random() * 120 * offsetMultiplierX), // Mayor amplitud horizontal
        offsetY: yOffset,
        forTarget: false
      });
    }
    
    selectedPattern = {
      id: 'default-pattern',
      positions: defaultPositions
    };
  }
  
  // Definir objetivos según nivel
  let targetObjectTypes = [];
  let patternSequence = [];
  
  switch(level) {
    case 1: // Reconocimiento simple
      targetObjectTypes = [{ type: 'flower', color: 'blue' }];
      break;
    case 2: // Reconocimiento múltiple
      targetObjectTypes = [
        { type: 'flower', color: 'blue' },
        { type: 'mushroom', color: 'red' }
      ];
      break;
    case 3: // Secuencias
      targetObjectTypes = [
        { type: 'flower', color: 'blue', sequence: 1 },
        { type: 'mushroom', color: 'red', sequence: 2 }
      ];
      break;
    case 4: // Patrones
      targetObjectTypes = [
        { type: 'flower', color: 'blue' },
        { type: 'mushroom', color: 'red' }
      ];
      patternSequence = ['flower-blue', 'flower-blue', 'mushroom-red'];
      break;
  }
  
  // Crear los objetos objetivo y distractores
  let allObjects = [];
  let targetObjects = [];
  
  // Calcular distancia mínima según tamaño del contenedor - Incrementada para evitar solapamiento
  const minDistanceBetweenObjects = Math.min(Math.max(80, 90 * (containerWidth / 1000)), 120);
  
  // Función para mapear posiciones relativas a posiciones reales en el camino
  const mapPositionToPath = (relX, offsetX, offsetY) => {
    // Validar y normalizar el valor relativo X
    const safeRelX = Math.min(0.99, Math.max(0.01, relX || 0.5));
    
    // Calcular el índice correspondiente en el array de pathPoints
    const pathLength = pathPoints.length;
    if (pathLength === 0) return { x: containerWidth / 10, y: containerHeight / 2 }; // Valores por defecto
    
    // Obtener el índice del punto en el camino basado en la posición relativa
    const index = Math.min(Math.floor(safeRelX * (pathLength - 1)), pathLength - 1);
    
    // Obtener el punto base del camino
    const point = pathPoints[index];
    if (!point) return { x: containerWidth / 10, y: containerHeight / 2 }; // Valores por defecto
    
    // Validar offset
    const safeOffsetX = isNaN(offsetX) ? 0 : Number(offsetX);
    const safeOffsetY = isNaN(offsetY) ? 0 : Number(offsetY);
    
    // Aplicar offsets
    const rawX = point.x + safeOffsetX;
    const rawY = point.y + safeOffsetY;
    
    // Asegurar que el punto está dentro de los límites
    return {
      x: Math.min(Math.max(rawX, boundaries.minX), boundaries.maxX),
      y: Math.min(Math.max(rawY, boundaries.minY), boundaries.maxY)
    };
  };
  
  // Extraer posiciones para objetivos y distractores del patrón
  const targetPositions = (selectedPattern.positions || []).filter(pos => pos.forTarget);
  const distractorPositions = (selectedPattern.positions || []).filter(pos => !pos.forTarget);
  
  // Asegurarse de que tenemos al menos algunas posiciones por defecto
  if (targetPositions.length === 0) {
    // Posiciones por defecto para objetivos
    [0.1, 0.3, 0.5, 0.7, 0.9].forEach(relX => {
      targetPositions.push({ 
        relX, 
        offsetX: Math.random() * 20 - 10, 
        offsetY: Math.random() * -30 - 10,
        forTarget: true 
      });
    });
  }
  
  if (distractorPositions.length === 0) {
    // Posiciones por defecto para distractores
    [0.2, 0.4, 0.6, 0.8].forEach(relX => {
      distractorPositions.push({ 
        relX, 
        offsetX: Math.random() * 60 - 30, 
        offsetY: Math.random() * 60 - 30,
        forTarget: false 
      });
    });
  }
  
  // Asegurarse de tener suficientes posiciones con mejor distribución
  const getPositions = (posArray, count) => {
    // Lógica de distribución más espaciada
    if (!posArray || posArray.length === 0) {
      const defaultPositions = [];
      for (let i = 0; i < count; i++) {
        defaultPositions.push({
          relX: i / (count - 1),  // Distribuir uniformemente a lo largo del camino
          offsetX: (Math.random() * 60 - 30) * (containerWidth / 1000),
          offsetY: (Math.random() * 60 - 30) * (containerHeight / 500),
          forTarget: true
        });
      }
      return defaultPositions;
    }
    
    // Si hay menos posiciones que las necesarias, distribuir uniformemente
    if (posArray.length < count) {
      // Primero ordenar por relX para mantener la distribución
      const sorted = [...posArray].sort((a, b) => a.relX - b.relX);
      
      const result = [];
      for (let i = 0; i < count; i++) {
        // Obtener posición relativa uniforme
        const relX = i / (count - 1);
        
        // Encontrar las posiciones base más cercanas
        const closestIndex = Math.min(
          Math.floor(relX * sorted.length),
          sorted.length - 1
        );
        
        const basePos = sorted[closestIndex];
        
        // Ajustes proporcionales al tamaño del contenedor
        const offsetMultiplierX = containerWidth / 1000;
        const offsetMultiplierY = containerHeight / 500;
        
        // Crear una nueva posición con mayor variación
        result.push({
          relX,
          offsetX: basePos.offsetX + (Math.random() * 40 - 20) * offsetMultiplierX,
          offsetY: basePos.offsetY + (Math.random() * 40 - 20) * offsetMultiplierY,
          forTarget: basePos.forTarget
        });
      }
      return result;
    }
    
    // Si hay suficientes posiciones, distribuirlas uniformemente
    if (posArray.length > count) {
      // Ordenar por relX para mantener la distribución a lo largo del camino
      const sorted = [...posArray].sort((a, b) => a.relX - b.relX);
      
      // Seleccionar posiciones distribuidas uniformemente
      const result = [];
      for (let i = 0; i < count; i++) {
        const index = Math.floor(i * (sorted.length - 1) / (count - 1));
        result.push(sorted[index]);
      }
      return result;
    }
    
    // Si el número es exacto, usar tal cual
    return posArray;
  };
  
  // Obtener las posiciones necesarias con mejor distribución
  const targetPositionsToUse = getPositions(targetPositions, targets);
  const distractorPositionsToUse = getPositions(distractorPositions, distractors);
  
  // Distribuir tipos de objetos objetivo entre las posiciones
  for (let i = 0; i < targetPositionsToUse.length; i++) {
    const position = targetPositionsToUse[i];
    const targetTypeIndex = i % targetObjectTypes.length;
    const targetType = targetObjectTypes[targetTypeIndex];
    
    // Seleccionar un objeto aleatorio del tipo objetivo
    const objectsOfThisType = forestObjects[`${targetType.type}s`]
      .filter(obj => obj.color === targetType.color);
        
    const randomObject = objectsOfThisType[Math.floor(Math.random() * objectsOfThisType.length)];
    
    // Calcular posición real en el camino (ya ajustada a los límites)
    const realPosition = mapPositionToPath(position.relX, position.offsetX, position.offsetY);
    
    // Ajustar posición para evitar solapamiento y respetar límites
    const adjustedPosition = findNonOverlappingPosition(
      realPosition.x, 
      realPosition.y, 
      allObjects, 
      minDistanceBetweenObjects,
      boundaries
    );
    
    // Crear nuevo objeto
    const newObject = {
      ...randomObject,
      uniqueId: `${randomObject.id}-${Date.now()}-${Math.random()}`,
      x: adjustedPosition.x,
      y: adjustedPosition.y,
      isTarget: true,
      found: false,
      sequence: targetType.sequence || null
    };
    
    allObjects.push(newObject);
    targetObjects.push(newObject);
  }
  
  // Distribuir objetos distractores
  for (let i = 0; i < distractorPositionsToUse.length; i++) {
    const position = distractorPositionsToUse[i];
    
    // Seleccionar un tipo aleatorio
    const allObjectTypes = Object.keys(forestObjects);
    const randomTypeKey = allObjectTypes[Math.floor(Math.random() * allObjectTypes.length)];
    const objectsOfThisType = forestObjects[randomTypeKey];
    
    // Seleccionar un objeto aleatorio de este tipo
    const randomObject = objectsOfThisType[Math.floor(Math.random() * objectsOfThisType.length)];
    
    // Verificar si es un objeto objetivo (para evitar añadir distractores idénticos a los objetivos)
    const isTargetType = targetObjectTypes.some(target => 
      target.type === randomObject.type && target.color === randomObject.color
    );
    
    if (isTargetType) {
      i--; // Intentar de nuevo
      continue;
    }
    
    // Calcular posición real en el camino (ya ajustada a los límites)
    const realPosition = mapPositionToPath(position.relX, position.offsetX, position.offsetY);
    
    // Ajustar posición para evitar solapamiento y respetar límites
    const adjustedPosition = findNonOverlappingPosition(
      realPosition.x, 
      realPosition.y, 
      allObjects,
      minDistanceBetweenObjects,
      boundaries
    );
    
    // Crear nuevo objeto
    const newObject = {
      ...randomObject,
      uniqueId: `${randomObject.id}-${Date.now()}-${Math.random()}`,
      x: adjustedPosition.x,
      y: adjustedPosition.y,
      isTarget: false,
      found: false
    };
    
    allObjects.push(newObject);
  }
  
  // Post-procesamiento final para garantizar que no haya superposiciones
  // y que todos los objetos estén dentro de los límites
  const finalPositionedObjects = ensureNoOverlap(allObjects, minDistanceBetweenObjects, boundaries);
  
  // Actualizar las referencias a los objetos objetivo
  const updatedTargetObjects = [];
  for (const targetObj of targetObjects) {
    // Encontrar el objeto correspondiente en la lista actualizada
    const updatedObj = finalPositionedObjects.find(
      obj => obj.uniqueId === targetObj.uniqueId
    );
    if (updatedObj) {
      updatedTargetObjects.push(updatedObj);
    }
  }
  
  return { 
    allObjects: finalPositionedObjects, 
    targetObjects: updatedTargetObjects, 
    patternSequence,
    selectedPatternId: selectedPattern.id 
  };
}

// Exportar como función predeterminada para mayor flexibilidad
export default generateObjects;