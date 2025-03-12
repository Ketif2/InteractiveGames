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
            const padding = 50; // Margen de seguridad para evitar que los objetos toquen los bordes
            const maxHeight = Math.min(window.innerHeight - 180, 800); // Altura máxima del área
            
            boundaries = {
                minX: padding,
                maxX: window.innerWidth - padding * 2,
                minY: padding,
                maxY: maxHeight - padding
            };
        } else {
            // Valores predeterminados si no hay ventana
            boundaries = {
                minX: 50,
                maxX: 950,
                minY: 50,
                maxY: 450
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
    
    // Intentar estrategia circular - buscar en círculos concéntricos
    const maxAttempts = 200;
    const angleStep = 2 * Math.PI / 16; // 16 direcciones por círculo
    
    // Probar diferentes distancias, aumentando progresivamente
    const distances = [];
    for (let d = minDistance; d <= minDistance * 3; d += minDistance / 4) {
        distances.push(d);
    }
    
    for (const distance of distances) {
        // Probar diferentes ángulos alrededor del punto base
        for (let angle = 0; angle < 2 * Math.PI; angle += angleStep) {
            const newX = baseX + distance * Math.cos(angle);
            const newY = baseY + distance * Math.sin(angle);
            
            // Verificar si esta posición evita el solapamiento y está dentro de los límites
            if (!isOverlapping(newX, newY, existingObjects, minDistance) && 
                isWithinBoundaries(newX, newY, boundaries)) {
                return { x: newX, y: newY };
            }
        }
    }
    
    // Si aún no encontramos posición, búsqueda espiral dentro de los límites
    let attempt = 0;
    let angle = 0;
    let radius = minDistance * 1.5;
    
    while (attempt < maxAttempts) {
        // Incrementar ángulo en proporción áurea para distribución uniforme
        angle += 2.4;
        // Incrementar radio gradualmente
        radius += minDistance / 20;
        
        const newX = baseX + radius * Math.cos(angle);
        const newY = baseY + radius * Math.sin(angle);
        
        // Ajustar para mantenerse dentro de los límites
        const adjustedX = Math.min(Math.max(newX, boundaries.minX), boundaries.maxX);
        const adjustedY = Math.min(Math.max(newY, boundaries.minY), boundaries.maxY);
        
        // Verificar si esta posición evita el solapamiento
        if (!isOverlapping(adjustedX, adjustedY, existingObjects, minDistance)) {
            return { x: adjustedX, y: adjustedY };
        }
        
        attempt++;
    }
    
    // Si después de todos los intentos no encontramos posición, colocar en el centro del área visible
    return {
        x: (boundaries.minX + boundaries.maxX) / 2,
        y: (boundaries.minY + boundaries.maxY) / 2
    };
}

/**
 * Aplica posicionamiento inteligente a todos los objetos para garantizar que no haya solapamiento
 * y que todos estén dentro de los límites del área
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
            const padding = 50; // Margen de seguridad
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
                minX: 50,
                maxX: 950,
                minY: 50,
                maxY: 450
            };
        }
    }
    
    // Crear copia profunda de los objetos para no modificar el original
    const result = JSON.parse(JSON.stringify(objects));
    
    // Primero, asegurar que todos los objetos estén dentro de los límites
    for (const obj of result) {
        obj.x = Math.min(Math.max(obj.x, boundaries.minX), boundaries.maxX);
        obj.y = Math.min(Math.max(obj.y, boundaries.minY), boundaries.maxY);
    }
    
    // Recorrer todos los objetos existentes y reubicar si hay solapamiento
    for (let i = 0; i < result.length; i++) {
        const obj = result[i];
        
        // Verificar si el objeto actual se solapa con alguno de los objetos previos
        const previousObjects = result.slice(0, i);
        
        if (isOverlapping(obj.x, obj.y, previousObjects, minDistance)) {
            // Encontrar una nueva posición que no se solape y esté dentro de los límites
            const newPosition = findNonOverlappingPosition(
                obj.x, obj.y, previousObjects, minDistance, boundaries
            );
            
            // Actualizar la posición del objeto
            obj.x = newPosition.x;
            obj.y = newPosition.y;
        }
    }
    
    return result;
}

export default {
    isOverlapping,
    isWithinBoundaries,
    findNonOverlappingPosition,
    ensureNoOverlap
};