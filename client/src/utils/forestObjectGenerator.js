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
  
  // AJUSTE: Establecer un número fijo y mínimo de objetivos
  const getObjectCount = () => {
    // Calcular factor de área - cuánto espacio disponible hay
    const areaFactor = (containerWidth * containerHeight) / (1000 * 500); // Normalizado a un área de referencia
    
    // Número FIJO y mínimo de objetivos según el nivel
    let fixedTargets = 3; // Por defecto

    switch(level) {
      case 1: // Para el nivel 1 (flores azules)
        fixedTargets = 3; // REDUCIDO A SÓLO 3
        break;
      case 2: // Para nivel 2 (flores azules y hongos rojos)
        fixedTargets = 4; // Idealmente 2 de cada tipo
        break;
      case 3: // Para secuencias
        fixedTargets = 4; // 2 pares de secuencia
        break;
      case 4: // Para patrones
        fixedTargets = 6; // Al menos 2 iteraciones completas del patrón
        break;
    }
    
    // Muchos más distractores en función del área disponible
    const distractorsBase = Math.max(20, Math.floor(25 * areaFactor));
    
    // Ajustar por dificultad - esto afectará solo a los distractores
    const difficultyMultiplier = {
      'fácil': 0.8,
      'medio': 1.0,
      'difícil': 1.2
    };
    
    const densityMultiplier = {
      'baja': 0.7,
      'normal': 1.0,
      'alta': 1.2
    };

    const multiplier = (difficultyMultiplier[difficulty] || 1.0) * 
                      (densityMultiplier[config?.objectDensity] || 1.0);
    
    return {
      targets: fixedTargets, // Número fijo y mínimo
      distractors: Math.round(distractorsBase * multiplier)
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
    
    // Crear posiciones objetivo con distribución MÁS ALEATORIA (ya no en línea recta)
    // AJUSTE: Crear solo las posiciones mínimas necesarias
    for (let i = 0; i < targets; i++) {
      // Distribuir los puntos relativos X de manera menos uniforme
      // Añadir variación significativa a la posición relativa en X
      const relX = Math.random(); // Completamente aleatorio
      
      // Variar el lado donde aparecen los objetivos (arriba/abajo del camino)
      const side = Math.random() > 0.5 ? 1 : -1;
      
      // Variar mucho más las distancias al camino para que no estén alineados
      const distanceFromPath = 20 + Math.random() * 60;
      
      defaultPositions.push({
        relX,
        // Mayor variabilidad horizontal
        offsetX: ((Math.random() * 2 - 1) * 70) * offsetMultiplierX,
        // Mayor variabilidad vertical y en ambos lados del camino
        offsetY: (side * distanceFromPath) * offsetMultiplierY,
        forTarget: true
      });
    }
    
    // AJUSTE: Crear más posiciones para distractores (30-35)
    for (let i = 0; i < 35; i++) {
      // Posiciones completamente aleatorias
      const relX = Math.random();
      
      // Más variabilidad en la distribución
      const distanceFromPath = 30 + Math.random() * 90;
      const angle = Math.random() * Math.PI * 2; // Ángulo aleatorio completo
      
      defaultPositions.push({
        relX,
        // Posición en X usando distribución radial
        offsetX: Math.cos(angle) * distanceFromPath * offsetMultiplierX,
        // Posición en Y usando distribución radial
        offsetY: Math.sin(angle) * distanceFromPath * offsetMultiplierY,
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
  // Añadir variabilidad a la distancia entre objetos para romper patrones
  const baseMinDistance = Math.min(Math.max(80, 90 * (containerWidth / 1000)), 120);
  const minDistanceBetweenObjects = baseMinDistance + (Math.random() * 20 - 10);
  
  // Función para mapear posiciones relativas a posiciones reales en el camino
  const mapPositionToPath = (relX, offsetX, offsetY) => {
    try {
      // Validar y normalizar el valor relativo X (protección contra valores undefined)
      const safeRelX = Math.min(0.99, Math.max(0.01, relX || Math.random()));
      
      // Calcular el índice correspondiente en el array de pathPoints
      const pathLength = pathPoints?.length || 0;
      if (pathLength === 0) return { x: containerWidth / 10, y: containerHeight / 2 }; // Valores por defecto
      
      // Obtener el índice del punto en el camino basado en la posición relativa
      const index = Math.min(Math.floor(safeRelX * (pathLength - 1)), pathLength - 1);
      
      // Obtener el punto base del camino
      const point = pathPoints[index];
      if (!point) return { x: containerWidth / 10, y: containerHeight / 2 }; // Valores por defecto
      
      // Validar offset (protección contra undefined)
      const safeOffsetX = isNaN(offsetX) ? (Math.random() * 60 - 30) : Number(offsetX);
      const safeOffsetY = isNaN(offsetY) ? (Math.random() * 60 - 30) : Number(offsetY);
      
      // Aplicar offsets con ligera variación para romper patrones
      const randomVariation = Math.random() * 10 - 5; // ±5px de variación aleatoria
      const rawX = point.x + safeOffsetX + randomVariation;
      const rawY = point.y + safeOffsetY + randomVariation;
      
      // Asegurar que el punto está dentro de los límites
      return {
        x: Math.min(Math.max(rawX, boundaries.minX), boundaries.maxX),
        y: Math.min(Math.max(rawY, boundaries.minY), boundaries.maxY)
      };
    } catch (error) {
      console.error("Error en mapPositionToPath:", error);
      // Retornar posición aleatoria dentro de los límites como fallback
      return {
        x: boundaries.minX + Math.random() * (boundaries.maxX - boundaries.minX),
        y: boundaries.minY + Math.random() * (boundaries.maxY - boundaries.minY)
      };
    }
  };
  
  // Extraer posiciones para objetivos y distractores del patrón
  let targetPositions = [];
  let distractorPositions = [];
  
  try {
    targetPositions = (selectedPattern?.positions || []).filter(pos => pos.forTarget);
    distractorPositions = (selectedPattern?.positions || []).filter(pos => !pos.forTarget);
  } catch (error) {
    console.error("Error al extraer posiciones del patrón:", error);
    // En caso de error, crear arreglos vacíos para que se generen posiciones por defecto
    targetPositions = [];
    distractorPositions = [];
  }
  
  // MEJORA PARA FLORES AZULES: Modificar posiciones de objetivos para mayor aleatoriedad
  // Y GARANTIZAR SEPARACIÓN POR CUADRANTES
  const modifyTargetPositions = (positions) => {
    // Distribuir objetivos por cuadrantes específicos para garantizar separación
    const quadrants = [
      { relXMin: 0.05, relXMax: 0.30, offsetYFactor: -1 }, // Arriba-Izquierda
      { relXMin: 0.35, relXMax: 0.60, offsetYFactor: 1 },  // Abajo-Centro
      { relXMin: 0.70, relXMax: 0.95, offsetYFactor: -1 }  // Arriba-Derecha
    ];
    
    const modifiedPositions = [];
    
    // Distribuir objetivos por cuadrantes para asegurar separación
    for (let i = 0; i < targets; i++) {
      const quadrant = quadrants[i % quadrants.length];
      
      modifiedPositions.push({
        relX: quadrant.relXMin + Math.random() * (quadrant.relXMax - quadrant.relXMin),
        offsetX: (Math.random() * 2 - 1) * 50,
        offsetY: quadrant.offsetYFactor * (30 + Math.random() * 70),
        forTarget: true
      });
    }
    
    return modifiedPositions;
  };
  
  // Aplicar modificación especial a las posiciones objetivo
  targetPositions = modifyTargetPositions(targetPositions);
  
  // Asegurarse de tener al menos algunas posiciones por defecto
  if (targetPositions.length === 0) {
    // Posiciones por defecto para objetivos - MÁS ALEATORIAS y solo las mínimas necesarias
    for (let i = 0; i < targets; i++) {
      // Distribuir completamente al azar
      targetPositions.push({ 
        relX: Math.random(), 
        offsetX: (Math.random() * 2 - 1) * 100, 
        offsetY: (Math.random() * 2 - 1) * 100,
        forTarget: true 
      });
    }
  }
  
  if (distractorPositions.length === 0) {
    // AJUSTE: Muchas más posiciones para distractores
    for (let i = 0; i < 20; i++) {
      distractorPositions.push({ 
        relX: Math.random(), 
        offsetX: (Math.random() * 2 - 1) * 100, 
        offsetY: (Math.random() * 2 - 1) * 100,
        forTarget: false 
      });
    }
  }
  
  // Asegurarse de tener suficientes posiciones con mejor distribución
  const getPositions = (posArray, count) => {
    try {
      // Lógica de distribución más espaciada
      if (!posArray || posArray.length === 0) {
        const defaultPositions = [];
        for (let i = 0; i < count; i++) {
          defaultPositions.push({
            relX: Math.random(),  // Totalmente aleatorio
            offsetX: (Math.random() * 2 - 1) * 100, // Más variabilidad
            offsetY: (Math.random() * 2 - 1) * 100, // Más variabilidad
            forTarget: posArray === targetPositions
          });
        }
        return defaultPositions;
      }
      
      // Si hay menos posiciones que las necesarias, generar adicionales con mayor aleatoriedad
      if (posArray.length < count) {
        // Copiar las posiciones existentes
        const result = [...posArray];
        
        // Añadir posiciones adicionales con mayor aleatoriedad
        for (let i = posArray.length; i < count; i++) {
          result.push({
            relX: Math.random(),
            offsetX: (Math.random() * 2 - 1) * 100,
            offsetY: (Math.random() * 2 - 1) * 100,
            forTarget: posArray === targetPositions
          });
        }
        
        return result;
      }
      
      // AJUSTE: Si hay demasiadas posiciones objetivo, reducir al mínimo necesario
      if (posArray.length > count && posArray === targetPositions) {
        // Crear una copia y mezclarla aleatoriamente
        const shuffled = [...posArray].sort(() => Math.random() - 0.5);
        
        // Tomar solo las necesarias según el nivel
        return shuffled.slice(0, count);
      }
      
      // Si hay suficientes posiciones, seleccionar aleatoriamente
      if (posArray.length > count) {
        // Crear una copia y mezclarla aleatoriamente
        const shuffled = [...posArray].sort(() => Math.random() - 0.5);
        
        // Tomar los primeros 'count' elementos
        return shuffled.slice(0, count);
      }
      
      // Si el número es exacto, usar tal cual pero añadir variación aleatoria
      return posArray.map(pos => {
        // Protección contra null/undefined
        if (!pos) {
          return {
            relX: Math.random(),
            offsetX: (Math.random() * 2 - 1) * 100,
            offsetY: (Math.random() * 2 - 1) * 100,
            forTarget: posArray === targetPositions
          };
        }
        
        return {
          ...pos,
          relX: Math.min(0.95, Math.max(0.05, (pos.relX || 0.5) + (Math.random() * 0.3 - 0.15))),
          offsetX: (pos.offsetX || 0) + (Math.random() * 60 - 30),
          offsetY: (pos.offsetY || 0) + (Math.random() * 60 - 30)
        };
      });
    } catch (error) {
      console.error("Error en getPositions:", error);
      // En caso de error, generar posiciones aleatorias
      const defaultPositions = [];
      for (let i = 0; i < count; i++) {
        defaultPositions.push({
          relX: Math.random(),
          offsetX: (Math.random() * 2 - 1) * 100,
          offsetY: (Math.random() * 2 - 1) * 100,
          forTarget: posArray === targetPositions
        });
      }
      return defaultPositions;
    }
  };
  
  // Obtener las posiciones necesarias con mejor distribución
  const targetPositionsToUse = getPositions(targetPositions, targets);
  const distractorPositionsToUse = getPositions(distractorPositions, distractors);
  
  // Distribuir tipos de objetos objetivo entre las posiciones
  for (let i = 0; i < targetPositionsToUse.length; i++) {
    try {
      const position = targetPositionsToUse[i] || {
        relX: Math.random(),
        offsetX: (Math.random() * 2 - 1) * 100,
        offsetY: (Math.random() * 2 - 1) * 100
      };
      
      const targetTypeIndex = i % targetObjectTypes.length;
      const targetType = targetObjectTypes[targetTypeIndex] || { type: 'flower', color: 'blue' };
      
      // Seleccionar un objeto aleatorio del tipo objetivo con protección contra errores
      let objectsOfThisType = [];
      
      try {
        objectsOfThisType = (forestObjects[`${targetType.type}s`] || [])
          .filter(obj => obj.color === targetType.color);
      } catch (error) {
        console.error("Error al acceder a objetos por tipo:", error);
      }
      
      // Si no hay objetos de este tipo, usar un objeto por defecto
      if (!objectsOfThisType || objectsOfThisType.length === 0) {
        objectsOfThisType = [{ type: 'flower', color: 'blue' }];
      }
      
      const randomObject = objectsOfThisType[Math.floor(Math.random() * objectsOfThisType.length)] || 
        { type: 'flower', color: 'blue' };
      
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
        uniqueId: `obj-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        x: adjustedPosition.x,
        y: adjustedPosition.y,
        isTarget: true,
        found: false,
        sequence: targetType.sequence || null
      };
      
      allObjects.push(newObject);
      targetObjects.push(newObject);
    } catch (error) {
      console.error("Error al crear objeto objetivo:", error);
    }
  }
  
  // AJUSTE: Función para priorizar distractores que NO sean flores azules
  // Implementar mayor variedad de tipos y colores para distractores
  const getRandomDistractorType = (typeCount) => {
    // Priorizar tipos distintos de flores azules para los distractores
    const types = ['flower', 'mushroom', 'animal', 'tree'];
    const colors = {
      flower: ['red', 'yellow', 'purple', 'pink'], // No incluimos 'blue' intencionalmente
      mushroom: ['brown', 'yellow', 'red'],
      animal: ['rabbit', 'fox', 'bird'],
      tree: ['green']
    };
    
    // Asegurarnos de que los primeros distractores sean muy variados
    const typeIndex = (typeCount + Math.floor(Math.random() * 2)) % types.length;
    const type = types[typeIndex];
    
    // Seleccionar color, excluyendo azul para las flores
    const colorOptions = colors[type] || ['red'];
    const color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
    
    // Para animales, usar la especie como color
    if (type === 'animal') {
      return { type, species: color };
    }
    
    return { type, color };
  };
  
  // Distribuir objetos distractores con mayor variedad
  for (let i = 0; i < distractorPositionsToUse.length; i++) {
    try {
      const position = distractorPositionsToUse[i] || {
        relX: Math.random(),
        offsetX: (Math.random() * 2 - 1) * 100,
        offsetY: (Math.random() * 2 - 1) * 100
      };
      
      // AJUSTE: Utilizar la función modificada para mayor variedad
      const randomTypeInfo = getRandomDistractorType(i);
      
      // Verificar si es un objeto objetivo (para evitar añadir distractores idénticos a los objetivos)
      const isTargetType = targetObjectTypes.some(target => {
        if (randomTypeInfo.type === 'animal') {
          return target.type === randomTypeInfo.type && target.species === randomTypeInfo.species;
        }
        return target.type === randomTypeInfo.type && target.color === randomTypeInfo.color;
      });
      
      // Si es un tipo objetivo, ajustar para que sea diferente
      if (isTargetType) {
        // Intentar hasta 3 veces obtener un tipo no objetivo
        let attempts = 0;
        let alternativeType;
        
        while (attempts < 3) {
          alternativeType = getRandomDistractorType(i + 10 + attempts);
          
          const isStillTargetType = targetObjectTypes.some(target => {
            if (alternativeType.type === 'animal') {
              return target.type === alternativeType.type && target.species === alternativeType.species;
            }
            return target.type === alternativeType.type && target.color === alternativeType.color;
          });
          
          if (!isStillTargetType) {
            randomTypeInfo.type = alternativeType.type;
            randomTypeInfo.color = alternativeType.color;
            randomTypeInfo.species = alternativeType.species;
            break;
          }
          
          attempts++;
        }
        
        // Si después de los intentos sigue siendo objetivo, continuamos con el siguiente
        if (isTargetType && attempts >= 3) {
          continue;
        }
      }
      
      // Calcular posición real en el camino
      const realPosition = mapPositionToPath(position.relX, position.offsetX, position.offsetY);
      
      // Ajustar posición para evitar solapamiento
      const adjustedPosition = findNonOverlappingPosition(
        realPosition.x, 
        realPosition.y, 
        allObjects,
        minDistanceBetweenObjects,
        boundaries
      );
      
      // Crear nuevo objeto distractor
      const newObject = {
        type: randomTypeInfo.type,
        color: randomTypeInfo.color,
        species: randomTypeInfo.species,
        uniqueId: `distractor-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        x: adjustedPosition.x,
        y: adjustedPosition.y,
        isTarget: false,
        found: false
      };
      
      allObjects.push(newObject);
    } catch (error) {
      console.error("Error al crear objeto distractor:", error);
    }
  }
  
  // Función para asegurar que las flores azules estén separadas entre sí
  const ensureTargetSeparation = (objects, minSeparation) => {
    try {
      // Obtener solo las flores azules
      const blueFlowers = objects.filter(obj => 
        obj.isTarget && obj.type === 'flower' && obj.color === 'blue'
      );
      
      if (blueFlowers.length <= 1) return objects; // No hay suficientes para separar
      
      // Verificar distancias entre cada par de flores azules
      for (let i = 0; i < blueFlowers.length; i++) {
        for (let j = i + 1; j < blueFlowers.length; j++) {
          const flower1 = blueFlowers[i];
          const flower2 = blueFlowers[j];
          
          // Calcular distancia euclidiana
          const dx = flower1.x - flower2.x;
          const dy = flower1.y - flower2.y;
          const distance = Math.sqrt(dx*dx + dy*dy);
          
          // Si están demasiado cerca, reposicionar una de ellas a un área lejana
          if (distance < minSeparation) {
            console.log("Separando flores azules que están demasiado cerca");
            
            // Posicionar la segunda flor en un cuadrante opuesto del área de juego
            const oppositeX = flower1.x > boundaries.maxX/2 ? 
              boundaries.minX + Math.random() * (boundaries.maxX/2 - boundaries.minX) :
              boundaries.maxX/2 + Math.random() * (boundaries.maxX - boundaries.maxX/2);
              
            const oppositeY = flower1.y > boundaries.maxY/2 ? 
              boundaries.minY + Math.random() * (boundaries.maxY/2 - boundaries.minY) :
              boundaries.maxY/2 + Math.random() * (boundaries.maxY - boundaries.maxY/2);
            
            flower2.x = oppositeX;
            flower2.y = oppositeY;
          }
        }
      }
      
      return objects;
    } catch (error) {
      console.error("Error en ensureTargetSeparation:", error);
      return objects;
    }
  };
  
  // Aplicar separación adicional a las flores azules
  allObjects = ensureTargetSeparation(allObjects, containerWidth * 0.4); // Separar al menos un 40% del ancho
  
  // Post-procesamiento final para garantizar que no haya superposiciones
  // y que todos los objetos estén dentro de los límites
  let finalPositionedObjects = [];
  try {
    finalPositionedObjects = ensureNoOverlap(allObjects, minDistanceBetweenObjects, boundaries);
    
    // Aplicar una segunda vez la separación de flores azules después del noOverlap
    finalPositionedObjects = ensureTargetSeparation(finalPositionedObjects, containerWidth * 0.3);
  } catch (error) {
    console.error("Error en ensureNoOverlap:", error);
    finalPositionedObjects = allObjects; // Usar objetos sin procesar como fallback
  }
  
  // Mezclar las posiciones de los objetos para evitar patrones obvios
  // pero mantener la distinción entre objetivos y distractores
  const shuffleObjectsPositions = (objects) => {
    try {
      // Separar objetivos y distractores
      const targets = objects.filter(obj => obj.isTarget);
      const distractors = objects.filter(obj => !obj.isTarget);
      
      // Mezclar cada grupo
      for (let i = targets.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        // Intercambiar posiciones entre objetos
        [targets[i].x, targets[j].x] = [targets[j].x, targets[i].x];
        [targets[i].y, targets[j].y] = [targets[j].y, targets[i].y];
      }
      
      for (let i = distractors.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        // Intercambiar posiciones entre objetos
        [distractors[i].x, distractors[j].x] = [distractors[j].x, distractors[i].x];
        [distractors[i].y, distractors[j].y] = [distractors[j].y, distractors[i].y];
      }
      
    // Volver a aplicar ensureNoOverlap para evitar solapamientos tras la mezcla
    const shuffledObjects = [...targets, ...distractors];
        
    // Volver a aplicar la separación de flores azules
    const separatedObjects = ensureTargetSeparation(shuffledObjects, containerWidth * 0.35);

    return ensureNoOverlap(separatedObjects, minDistanceBetweenObjects, boundaries);
    } catch (error) {
    console.error("Error en shuffleObjectsPositions:", error);
    return objects; // Devolver objetos originales como fallback
    }
    };

    // Aplicar la mezcla adicional
    let randomizedObjects = [];
    try {
    randomizedObjects = shuffleObjectsPositions(finalPositionedObjects);

    // Una última verificación de separación para las flores azules
    randomizedObjects = ensureTargetSeparation(randomizedObjects, containerWidth * 0.3);
    } catch (error) {
    console.error("Error al mezclar posiciones:", error);
    randomizedObjects = finalPositionedObjects;
    }

    // Actualizar las referencias a los objetos objetivo
    const updatedTargetObjects = [];
    try {
    for (const targetObj of targetObjects) {
    // Encontrar el objeto correspondiente en la lista actualizada
    const updatedObj = randomizedObjects.find(
      obj => obj.uniqueId === targetObj.uniqueId
    );
    if (updatedObj) {
      updatedTargetObjects.push(updatedObj);
    }
    }
    } catch (error) {
    console.error("Error al actualizar objetos objetivo:", error);
    }

    return { 
    allObjects: randomizedObjects, 
    targetObjects: updatedTargetObjects.length > 0 ? updatedTargetObjects : targetObjects, 
    patternSequence,
    selectedPatternId: selectedPattern?.id || 'default-pattern'
    };
}

// Exportar como función predeterminada para mayor flexibilidad
export default generateObjects;