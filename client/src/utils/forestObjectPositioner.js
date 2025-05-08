// src/utils/forestObjectPositioner.js

/**
 * Verifica si un objeto está demasiado cerca de otros objetos existentes
 * @param {Number} x - Coordenada X del nuevo objeto
 * @param {Number} y - Coordenada Y del nuevo objeto
 * @param {Array} objects - Array de objetos existentes
 * @param {Number} minDistance - Distancia mínima permitida entre objetos
 * @returns {Boolean} true si está demasiado cerca, false si no
 */
export function isOverlapping(x, y, objects, minDistance = 80) {
    // Si no hay objetos, no puede haber solapamiento
    if (!objects || objects.length === 0) return false;
    
    for (const obj of objects) {
      // Verificar que las coordenadas son números válidos
      const objX = isNaN(obj.x) ? 0 : Number(obj.x);
      const objY = isNaN(obj.y) ? 0 : Number(obj.y);
      
      // Calcular distancia entre el nuevo objeto y el objeto existente
      const dx = x - objX;
      const dy = y - objY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Si la distancia es menor que la mínima, hay solapamiento
      if (distance < minDistance) {
        return true;
      }
    }
    
    return false;
}

/**
 * Verifica si una posición está dentro de los límites del área de juego
 * @param {Number} x - Coordenada X a verificar
 * @param {Number} y - Coordenada Y a verificar
 * @param {Object} boundaries - Límites del área {minX, maxX, minY, maxY}
 * @returns {Boolean} true si está dentro de los límites, false si no
 */
export function isWithinBoundaries(x, y, boundaries) {
    return (
        x >= boundaries.minX &&
        x <= boundaries.maxX &&
        y >= boundaries.minY &&
        y <= boundaries.maxY
    );
}

/**
 * Ajusta la posición de un objeto para evitar solapamiento y mantenerlo dentro de los límites
 * VERSIÓN MEJORADA: Usa una espiral áurea para mejor distribución
 * @param {Number} baseX - Coordenada X original
 * @param {Number} baseY - Coordenada Y original
 * @param {Array} existingObjects - Array de objetos existentes
 * @param {Number} minDistance - Distancia mínima entre objetos
 * @param {Object} boundaries - Límites del área {minX, maxX, minY, maxY}
 * @returns {Object} Posición ajustada { x, y }
 */
export function findNonOverlappingPosition(baseX, baseY, existingObjects, minDistance = 80, boundaries = null) {
    // Convertir a números y validar
    baseX = Number(baseX) || 0;
    baseY = Number(baseY) || 0;
    
    // Si no se proporcionan límites, usar valores predeterminados
    if (!boundaries) {
        // Usar dimensiones de ventana si está disponible
        if (typeof window !== 'undefined') {
            const padding = 100; // Margen aumentado
            const maxHeight = Math.min(window.innerHeight - 200, 800); // Altura máxima del área
            
            boundaries = {
                minX: padding,
                maxX: window.innerWidth - padding * 2,
                minY: padding,
                maxY: maxHeight - padding
            };
        } else {
            // Valores predeterminados si no hay ventana
            boundaries = {
                minX: 80,
                maxX: 920,
                minY: 80,
                maxY: 420
            };
        }
    }
    
    // Asegurar que la posición base esté dentro de los límites
    baseX = Math.min(Math.max(baseX, boundaries.minX), boundaries.maxX);
    baseY = Math.min(Math.max(baseY, boundaries.minY), boundaries.maxY);
    
    // Si no hay solapamiento y está dentro de los límites, usar la posición original
    if (!isOverlapping(baseX, baseY, existingObjects, minDistance) && 
        isWithinBoundaries(baseX, baseY, boundaries)) {
        return { x: baseX, y: baseY };
    }
    
    // MEJORADO: Usar distribución por cuadrantes para mejor esparcimiento
    // Dividir el área en cuadrantes
    const centerX = (boundaries.minX + boundaries.maxX) / 2;
    const centerY = (boundaries.minY + boundaries.maxY) / 2;
    
    // Determinar en qué cuadrante estamos para buscar en el opuesto
    const isRightSide = baseX >= centerX;
    const isBottomSide = baseY >= centerY;
    
    // Intentar primero en un cuadrante opuesto para mejor distribución
    const preferredX = isRightSide ? 
        boundaries.minX + Math.random() * (centerX - boundaries.minX) : 
        centerX + Math.random() * (boundaries.maxX - centerX);
        
    const preferredY = isBottomSide ? 
        boundaries.minY + Math.random() * (centerY - boundaries.minY) : 
        centerY + Math.random() * (boundaries.maxY - centerY);
        
    if (!isOverlapping(preferredX, preferredY, existingObjects, minDistance)) {
        return { x: preferredX, y: preferredY };
    }
    
    // Si el cuadrante opuesto no funciona, intentar estrategia de espiral áurea
    const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // Ángulo áureo ~137.5 grados
    const maxAttempts = 300; // Aumentar número de intentos
    
    let attempt = 0;
    let angle = 0;
    let radius = minDistance;
    
    while (attempt < maxAttempts) {
        // Usar ángulo áureo para distribución uniforme
        angle += goldenAngle;
        radius += minDistance / 8; // Incremento más gradual
        
        // Variar el punto de origen para evitar patrones evidentes
        // Probar distribución desde diferentes puntos de origen
        const origins = [
            { x: baseX, y: baseY },                  // Punto original
            { x: centerX, y: centerY },              // Centro del área
            { x: boundaries.minX, y: boundaries.minY }, // Esquina superior izquierda
            { x: boundaries.maxX, y: boundaries.minY }, // Esquina superior derecha
            { x: boundaries.minX, y: boundaries.maxY }, // Esquina inferior izquierda
            { x: boundaries.maxX, y: boundaries.maxY }  // Esquina inferior derecha
        ];
        
        // Alternar entre diferentes puntos de origen
        const origin = origins[attempt % origins.length];
        
        const newX = origin.x + radius * Math.cos(angle);
        const newY = origin.y + radius * Math.sin(angle);
        
        // Mantener dentro de los límites
        const adjustedX = Math.min(Math.max(newX, boundaries.minX), boundaries.maxX);
        const adjustedY = Math.min(Math.max(newY, boundaries.minY), boundaries.maxY);
        
        // Verificar solapamiento
        if (!isOverlapping(adjustedX, adjustedY, existingObjects, minDistance)) {
            return { x: adjustedX, y: adjustedY };
        }
        
        attempt++;
    }
    
    // Si después de todos los intentos no encontramos posición, intentar con distancia mínima reducida
    const reducedMinDistance = minDistance * 0.7;
    
    // Intentar posiciones aleatorias dentro de los límites
    for (let i = 0; i < 50; i++) {
        const randX = boundaries.minX + Math.random() * (boundaries.maxX - boundaries.minX);
        const randY = boundaries.minY + Math.random() * (boundaries.maxY - boundaries.minY);
        
        if (!isOverlapping(randX, randY, existingObjects, reducedMinDistance)) {
            return { x: randX, y: randY };
        }
    }
    
    // Como último recurso, forzar una posición aleatoria
    return {
        x: boundaries.minX + Math.random() * (boundaries.maxX - boundaries.minX),
        y: boundaries.minY + Math.random() * (boundaries.maxY - boundaries.minY)
    };
}

/**
 * Aplica posicionamiento inteligente a todos los objetos para garantizar que no haya solapamiento
 * y que todos estén dentro de los límites del área - VERSIÓN MEJORADA con distribución uniforme
 * @param {Array} objects - Array de objetos a posicionar
 * @param {Number} minDistance - Distancia mínima entre objetos
 * @param {Object} boundaries - Límites del área {minX, maxX, minY, maxY}
 * @returns {Array} Array de objetos con posiciones ajustadas
 */
export function ensureNoOverlap(objects, minDistance = 80, boundaries = null) {
    if (!objects || objects.length === 0) return [];
    
    // Si no se proporcionan límites, usar valores predeterminados
    if (!boundaries) {
        // Usar dimensiones de ventana si está disponible
        if (typeof window !== 'undefined') {
            const padding = 100; // Aumentar padding
            const maxHeight = Math.min(window.innerHeight - 180, 800);
            
            boundaries = {
                minX: padding,
                maxX: window.innerWidth - padding * 2,
                minY: padding,
                maxY: maxHeight - padding
            };
        } else {
            // Valores predeterminados si no hay ventana
            boundaries = {
                minX: 80,
                maxX: 920,
                minY: 80,
                maxY: 420
            };
        }
    }
    
    // Crear copia profunda de los objetos para no modificar el original
    const result = JSON.parse(JSON.stringify(objects));
    
    // NUEVO: Separar los objetos objetivo de los distractores
    const targetObjects = result.filter(obj => obj.isTarget);
    const distractorObjects = result.filter(obj => !obj.isTarget);
    
    // NUEVO: Posicionar primero los objetivos en una distribución más espaciada
    // Distribuir objetivos en una cuadrícula uniforme
    positionObjectsInGrid(targetObjects, boundaries, minDistance * 1.5);
    
    // NUEVO: Posicionar los distractores alrededor, evitando los objetivos
    const allPositionedObjects = [...targetObjects];
    
    // Reposicionar cada distractor
    for (const obj of distractorObjects) {
        // Asegurar que está dentro de los límites
        obj.x = Math.min(Math.max(obj.x, boundaries.minX), boundaries.maxX);
        obj.y = Math.min(Math.max(obj.y, boundaries.minY), boundaries.maxY);
        
        // Si se solapa con algún objeto ya posicionado, encontrar nueva posición
        if (isOverlapping(obj.x, obj.y, allPositionedObjects, minDistance)) {
            const newPosition = findNonOverlappingPosition(
                obj.x, obj.y, allPositionedObjects, minDistance, boundaries
            );
            
            obj.x = newPosition.x;
            obj.y = newPosition.y;
        }
        
        // Añadir a la lista de objetos posicionados
        allPositionedObjects.push(obj);
    }
    
    return allPositionedObjects;
}

/**
 * NUEVA FUNCIÓN: Distribuye un grupo de objetos en una cuadrícula uniforme
 * @param {Array} objects - Objetos a posicionar en cuadrícula
 * @param {Object} boundaries - Límites del área
 * @param {Number} spacing - Espacio entre objetos en la cuadrícula
 */
function positionObjectsInGrid(objects, boundaries, spacing) {
    if (!objects || objects.length === 0) return;
    
    // Calcular dimensiones disponibles
    const width = boundaries.maxX - boundaries.minX;
    const height = boundaries.maxY - boundaries.minY;
    
    // Determinar el número óptimo de filas y columnas para una distribución uniforme
    const aspectRatio = width / height;
    let columns = Math.ceil(Math.sqrt(objects.length * aspectRatio));
    let rows = Math.ceil(objects.length / columns);
    
    // Verificar si necesitamos más columnas
    if (columns * rows < objects.length) {
        columns++;
    }
    
    // Calcular espaciado horizontal y vertical
    const cellWidth = width / columns;
    const cellHeight = height / rows;
    
    // Añadir variación aleatoria para romper la apariencia de cuadrícula perfecta
    const randomVariation = Math.min(cellWidth, cellHeight) * 0.3;
    
    // Posicionar cada objeto en una celda de la cuadrícula
    for (let i = 0; i < objects.length; i++) {
        const row = Math.floor(i / columns);
        const col = i % columns;
        
        // Calcular posición base en la cuadrícula
        const baseX = boundaries.minX + (col + 0.5) * cellWidth; 
        const baseY = boundaries.minY + (row + 0.5) * cellHeight;
        
        // Añadir variación aleatoria para evitar apariencia de cuadrícula perfecta
        const varX = (Math.random() * 2 - 1) * randomVariation;
        const varY = (Math.random() * 2 - 1) * randomVariation;
        
        // Asignar posición con variación, asegurando que esté dentro de los límites
        objects[i].x = Math.min(Math.max(baseX + varX, boundaries.minX), boundaries.maxX);
        objects[i].y = Math.min(Math.max(baseY + varY, boundaries.minY), boundaries.maxY);
    }
}

export default {
    isOverlapping,
    isWithinBoundaries,
    findNonOverlappingPosition,
    ensureNoOverlap
};