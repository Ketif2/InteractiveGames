// src/utils/forestPathGenerator.js

/**
 * Genera un camino aleatorio en forma de zigzag para el juego del bosque
 * @returns {Object} Objeto con el string del path SVG y los puntos individuales
 */
export function generatePath() {
  // Usar dimensiones responsivas
  const containerWidth = typeof window !== 'undefined' ? window.innerWidth - 80 : 1000;
  const containerHeight = typeof window !== 'undefined' ? 
    Math.min(Math.max(window.innerHeight - 200, 400), 700) : 500; // Basado en altura disponible
  
  // Segmentos para un camino detallado
  const segments = 12;  // Menos segmentos para un camino más fluido
  const segmentWidth = containerWidth / segments;
  
  // Array para almacenar todos los puntos del camino
  let allPathPoints = [];
  
  // Calcular altura relativa para el punto inicial (1/3 de la altura)
  const startY = containerHeight / 3 + (Math.random() * 30 - 15);
  let points = [`M 20,${startY}`]; 
  allPathPoints.push({ x: 20, y: startY });
  
  // Generar camino zigzag que se adapta al contenedor
  for (let i = 1; i <= segments; i++) {
    const x = 20 + (i * segmentWidth);
    
    // Variación suave para un camino natural
    // La amplitud de variación es proporcional a la altura del contenedor
    const amplitude = containerHeight / 10;
    const yVariation = Math.sin(i * 0.3) * amplitude + (Math.random() * 20 - 10);
    
    // Y relativa al centro del contenedor (ajustado para usar más espacio vertical)
    const y = containerHeight / 3 + yVariation;
    
    points.push(`L ${x},${y}`);
    allPathPoints.push({ x, y });
    
    // Agregar puntos intermedios para un muestreo más preciso del camino
    if (i < segments) {
      // Agregar 4 puntos intermedios entre cada segmento principal
      for (let j = 1; j <= 4; j++) {
        const subX = 20 + ((i + j/5) * segmentWidth);
        const subVariation = Math.sin((i + j/5) * 0.3) * amplitude + (Math.random() * 10 - 5);
        const subY = containerHeight / 3 + subVariation;
        allPathPoints.push({ x: subX, y: subY });
      }
    }
  }
  
  return {
    pathString: points.join(' '),
    pathPoints: allPathPoints,
    // Parámetros para el renderizado del camino
    pathWidth: Math.min(Math.max(containerWidth / 25, 30), 50) // Ancho responsive (min 30px, max 50px)
  };
}

export default generatePath;