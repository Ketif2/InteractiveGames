// src/data/forestPatterns.js
// Archivo con 15 patrones predefinidos de ubicaciones para objetos a lo largo del camino del bosque

// Cada patrón contiene un array de objetos con coordenadas relativas
// Estas coordenadas representan posiciones a lo largo del camino
// relX: Valor entre 0 y 1 que representa la posición a lo largo del camino (0 = inicio, 1 = final)
// offsetX, offsetY: Desplazamiento desde el punto del camino (en píxeles)
// forTarget: Indica si la posición es para un objeto objetivo o un distractor

export const forestPatterns = [
    // Patrón 1: Distribución uniforme
    {
      id: 'uniform-distribution',
      name: 'Distribución Uniforme',
      positions: [
        // Objetivos distribuidos uniformemente a lo largo del camino
        { relX: 0.05, offsetX: -10, offsetY: -15, forTarget: true },
        { relX: 0.15, offsetX: 15, offsetY: -10, forTarget: true },
        { relX: 0.25, offsetX: -15, offsetY: 10, forTarget: true },
        { relX: 0.35, offsetX: 10, offsetY: 15, forTarget: true },
        { relX: 0.45, offsetX: -10, offsetY: -15, forTarget: true },
        { relX: 0.55, offsetX: 15, offsetY: -10, forTarget: true },
        { relX: 0.65, offsetX: -15, offsetY: 10, forTarget: true },
        { relX: 0.75, offsetX: 10, offsetY: 15, forTarget: true },
        { relX: 0.85, offsetX: -10, offsetY: -15, forTarget: true },
        { relX: 0.95, offsetX: 15, offsetY: -10, forTarget: true },
        
        // Distractores distribuidos entre los objetivos
        { relX: 0.02, offsetX: 30, offsetY: 25, forTarget: false },
        { relX: 0.08, offsetX: -25, offsetY: 30, forTarget: false },
        { relX: 0.12, offsetX: 35, offsetY: -30, forTarget: false },
        { relX: 0.18, offsetX: -30, offsetY: -35, forTarget: false },
        { relX: 0.22, offsetX: 40, offsetY: 20, forTarget: false },
        { relX: 0.28, offsetX: -20, offsetY: 40, forTarget: false },
        { relX: 0.32, offsetX: 25, offsetY: -35, forTarget: false },
        { relX: 0.38, offsetX: -35, offsetY: -25, forTarget: false },
        { relX: 0.42, offsetX: 30, offsetY: 30, forTarget: false },
        { relX: 0.48, offsetX: -30, offsetY: 30, forTarget: false },
        { relX: 0.52, offsetX: 35, offsetY: -25, forTarget: false },
        { relX: 0.58, offsetX: -25, offsetY: -35, forTarget: false },
        { relX: 0.62, offsetX: 40, offsetY: 30, forTarget: false },
        { relX: 0.68, offsetX: -30, offsetY: 40, forTarget: false },
        { relX: 0.72, offsetX: 25, offsetY: -40, forTarget: false },
        { relX: 0.78, offsetX: -40, offsetY: -25, forTarget: false },
        { relX: 0.82, offsetX: 30, offsetY: 35, forTarget: false },
        { relX: 0.88, offsetX: -35, offsetY: 30, forTarget: false },
        { relX: 0.92, offsetX: 25, offsetY: -30, forTarget: false },
        { relX: 0.98, offsetX: -30, offsetY: -25, forTarget: false },
      ]
    },
    
    // Patrón 13: Distancia uniforme
    {
      id: 'uniform-distance',
      name: 'Distancia Uniforme',
      positions: [
        // Objetivos todos a la misma distancia
        { relX: 0.05, offsetX: 15, offsetY: 0, forTarget: true },
        { relX: 0.15, offsetX: 0, offsetY: 15, forTarget: true },
        { relX: 0.25, offsetX: -15, offsetY: 0, forTarget: true },
        { relX: 0.35, offsetX: 0, offsetY: -15, forTarget: true },
        { relX: 0.45, offsetX: 15, offsetY: 0, forTarget: true },
        { relX: 0.55, offsetX: 0, offsetY: 15, forTarget: true },
        { relX: 0.65, offsetX: -15, offsetY: 0, forTarget: true },
        { relX: 0.75, offsetX: 0, offsetY: -15, forTarget: true },
        { relX: 0.85, offsetX: 15, offsetY: 0, forTarget: true },
        { relX: 0.95, offsetX: 0, offsetY: 15, forTarget: true },
        
        // Distractores a mayor distancia pero uniforme
        { relX: 0.02, offsetX: 30, offsetY: 0, forTarget: false },
        { relX: 0.07, offsetX: 0, offsetY: 30, forTarget: false },
        { relX: 0.12, offsetX: -30, offsetY: 0, forTarget: false },
        { relX: 0.17, offsetX: 0, offsetY: -30, forTarget: false },
        { relX: 0.22, offsetX: 30, offsetY: 0, forTarget: false },
        { relX: 0.27, offsetX: 0, offsetY: 30, forTarget: false },
        { relX: 0.32, offsetX: -30, offsetY: 0, forTarget: false },
        { relX: 0.37, offsetX: 0, offsetY: -30, forTarget: false },
        { relX: 0.42, offsetX: 30, offsetY: 0, forTarget: false },
        { relX: 0.47, offsetX: 0, offsetY: 30, forTarget: false },
        { relX: 0.52, offsetX: -30, offsetY: 0, forTarget: false },
        { relX: 0.57, offsetX: 0, offsetY: -30, forTarget: false },
        { relX: 0.62, offsetX: 30, offsetY: 0, forTarget: false },
        { relX: 0.67, offsetX: 0, offsetY: 30, forTarget: false },
        { relX: 0.72, offsetX: -30, offsetY: 0, forTarget: false },
        { relX: 0.77, offsetX: 0, offsetY: -30, forTarget: false },
        { relX: 0.82, offsetX: 30, offsetY: 0, forTarget: false },
        { relX: 0.87, offsetX: 0, offsetY: 30, forTarget: false },
        { relX: 0.92, offsetX: -30, offsetY: 0, forTarget: false },
        { relX: 0.97, offsetX: 0, offsetY: -30, forTarget: false },
      ]
    },
    
    // Patrón 14: Distancias aleatorias fijas
    {
      id: 'fixed-random',
      name: 'Aleatorio Fijo',
      positions: [
        // Objetivos con posiciones aparentemente aleatorias pero fijas
        { relX: 0.07, offsetX: 12, offsetY: -8, forTarget: true },
        { relX: 0.16, offsetX: -14, offsetY: 10, forTarget: true },
        { relX: 0.24, offsetX: 8, offsetY: 15, forTarget: true },
        { relX: 0.31, offsetX: -10, offsetY: -12, forTarget: true },
        { relX: 0.42, offsetX: 15, offsetY: 5, forTarget: true },
        { relX: 0.58, offsetX: -8, offsetY: -15, forTarget: true },
        { relX: 0.67, offsetX: 10, offsetY: 12, forTarget: true },
        { relX: 0.79, offsetX: -15, offsetY: -5, forTarget: true },
        { relX: 0.88, offsetX: 14, offsetY: -10, forTarget: true },
        { relX: 0.96, offsetX: -12, offsetY: 8, forTarget: true },
        
        // Distractores también con posiciones aparentemente aleatorias
        { relX: 0.03, offsetX: -28, offsetY: -25, forTarget: false },
        { relX: 0.11, offsetX: 32, offsetY: 18, forTarget: false },
        { relX: 0.19, offsetX: -22, offsetY: 35, forTarget: false },
        { relX: 0.27, offsetX: 38, offsetY: -30, forTarget: false },
        { relX: 0.34, offsetX: -33, offsetY: 22, forTarget: false },
        { relX: 0.39, offsetX: 25, offsetY: -38, forTarget: false },
        { relX: 0.46, offsetX: -35, offsetY: -20, forTarget: false },
        { relX: 0.53, offsetX: 30, offsetY: 33, forTarget: false },
        { relX: 0.61, offsetX: -18, offsetY: -32, forTarget: false },
        { relX: 0.69, offsetX: 35, offsetY: 22, forTarget: false },
        { relX: 0.74, offsetX: -25, offsetY: 38, forTarget: false },
        { relX: 0.82, offsetX: 33, offsetY: -22, forTarget: false },
        { relX: 0.86, offsetX: -30, offsetY: -33, forTarget: false },
        { relX: 0.91, offsetX: 20, offsetY: 35, forTarget: false },
        { relX: 0.94, offsetX: -22, offsetY: -35, forTarget: false },
        { relX: 0.98, offsetX: 28, offsetY: 25, forTarget: false },
      ]
    },
    
    // Patrón 15: Distancia variable en patrón
    {
      id: 'varied-pattern',
      name: 'Patrón Variable',
      positions: [
        // Objetivos con un patrón de distancias que se repite
        { relX: 0.05, offsetX: 5, offsetY: -5, forTarget: true },
        { relX: 0.15, offsetX: 10, offsetY: -10, forTarget: true },
        { relX: 0.25, offsetX: 15, offsetY: -15, forTarget: true },
        { relX: 0.35, offsetX: 5, offsetY: -5, forTarget: true },
        { relX: 0.45, offsetX: 10, offsetY: -10, forTarget: true },
        { relX: 0.55, offsetX: 15, offsetY: -15, forTarget: true },
        { relX: 0.65, offsetX: 5, offsetY: -5, forTarget: true },
        { relX: 0.75, offsetX: 10, offsetY: -10, forTarget: true },
        { relX: 0.85, offsetX: 15, offsetY: -15, forTarget: true },
        { relX: 0.95, offsetX: 5, offsetY: -5, forTarget: true },
        
        // Distractores con un patrón opuesto
        { relX: 0.10, offsetX: -15, offsetY: 15, forTarget: false },
        { relX: 0.20, offsetX: -10, offsetY: 10, forTarget: false },
        { relX: 0.30, offsetX: -5, offsetY: 5, forTarget: false },
        { relX: 0.40, offsetX: -15, offsetY: 15, forTarget: false },
        { relX: 0.50, offsetX: -10, offsetY: 10, forTarget: false },
        { relX: 0.60, offsetX: -5, offsetY: 5, forTarget: false },
        { relX: 0.70, offsetX: -15, offsetY: 15, forTarget: false },
        { relX: 0.80, offsetX: -10, offsetY: 10, forTarget: false },
        { relX: 0.90, offsetX: -5, offsetY: 5, forTarget: false },
        
        // Distractores adicionales a mayor distancia
        { relX: 0.08, offsetX: 25, offsetY: 30, forTarget: false },
        { relX: 0.18, offsetX: 30, offsetY: 25, forTarget: false },
        { relX: 0.28, offsetX: 35, offsetY: 20, forTarget: false },
        { relX: 0.38, offsetX: 25, offsetY: 30, forTarget: false },
        { relX: 0.48, offsetX: 30, offsetY: 25, forTarget: false },
        { relX: 0.58, offsetX: 35, offsetY: 20, forTarget: false },
        { relX: 0.68, offsetX: 25, offsetY: 30, forTarget: false },
        { relX: 0.78, offsetX: 30, offsetY: 25, forTarget: false },
        { relX: 0.88, offsetX: 35, offsetY: 20, forTarget: false },
        { relX: 0.98, offsetX: 25, offsetY: 30, forTarget: false },
      ]
    },
    // Patrón 2: Concentrado en secciones
    {
      id: 'sectioned-path',
      name: 'Camino por Secciones',
      positions: [
        // Sección 1: Inicio del camino (concentración de objetivos)
        { relX: 0.05, offsetX: -5, offsetY: 10, forTarget: true },
        { relX: 0.08, offsetX: 10, offsetY: -15, forTarget: true },
        { relX: 0.12, offsetX: -15, offsetY: -10, forTarget: true },
        { relX: 0.15, offsetX: 5, offsetY: 15, forTarget: true },
        
        // Sección 2: Mitad del camino (algunos objetivos)
        { relX: 0.45, offsetX: -10, offsetY: 5, forTarget: true },
        { relX: 0.50, offsetX: 15, offsetY: -5, forTarget: true },
        { relX: 0.55, offsetX: -5, offsetY: -15, forTarget: true },
        
        // Sección 3: Final del camino (concentración de objetivos)
        { relX: 0.85, offsetX: 10, offsetY: 10, forTarget: true },
        { relX: 0.88, offsetX: -15, offsetY: -5, forTarget: true },
        { relX: 0.92, offsetX: 5, offsetY: -15, forTarget: true },
        { relX: 0.95, offsetX: -10, offsetY: 10, forTarget: true },
        
        // Distractores distribuidos por todo el camino
        { relX: 0.02, offsetX: 25, offsetY: 30, forTarget: false },
        { relX: 0.10, offsetX: -30, offsetY: -25, forTarget: false },
        { relX: 0.18, offsetX: 35, offsetY: -30, forTarget: false },
        { relX: 0.22, offsetX: -25, offsetY: 35, forTarget: false },
        { relX: 0.28, offsetX: 40, offsetY: 25, forTarget: false },
        { relX: 0.32, offsetX: -35, offsetY: -40, forTarget: false },
        { relX: 0.38, offsetX: 30, offsetY: -35, forTarget: false },
        { relX: 0.42, offsetX: -40, offsetY: 30, forTarget: false },
        { relX: 0.48, offsetX: 25, offsetY: 40, forTarget: false },
        { relX: 0.52, offsetX: -30, offsetY: -25, forTarget: false },
        { relX: 0.58, offsetX: 35, offsetY: -30, forTarget: false },
        { relX: 0.62, offsetX: -25, offsetY: 35, forTarget: false },
        { relX: 0.68, offsetX: 40, offsetY: 25, forTarget: false },
        { relX: 0.72, offsetX: -35, offsetY: -40, forTarget: false },
        { relX: 0.78, offsetX: 30, offsetY: -35, forTarget: false },
        { relX: 0.82, offsetX: -40, offsetY: 30, forTarget: false },
        { relX: 0.90, offsetX: 25, offsetY: 40, forTarget: false },
        { relX: 0.94, offsetX: -30, offsetY: -25, forTarget: false },
        { relX: 0.98, offsetX: 35, offsetY: -30, forTarget: false },
      ]
    },
    
    // Patrón 3: Zigzag a lo largo del camino
    {
      id: 'zigzag-path',
      name: 'Zigzag en el Camino',
      positions: [
        // Objetivos en zigzag (alternando lados)
        { relX: 0.05, offsetX: 15, offsetY: -10, forTarget: true },
        { relX: 0.15, offsetX: -15, offsetY: 10, forTarget: true },
        { relX: 0.25, offsetX: 15, offsetY: -10, forTarget: true },
        { relX: 0.35, offsetX: -15, offsetY: 10, forTarget: true },
        { relX: 0.45, offsetX: 15, offsetY: -10, forTarget: true },
        { relX: 0.55, offsetX: -15, offsetY: 10, forTarget: true },
        { relX: 0.65, offsetX: 15, offsetY: -10, forTarget: true },
        { relX: 0.75, offsetX: -15, offsetY: 10, forTarget: true },
        { relX: 0.85, offsetX: 15, offsetY: -10, forTarget: true },
        { relX: 0.95, offsetX: -15, offsetY: 10, forTarget: true },
        
        // Distractores más alejados pero también en patrón zigzag
        { relX: 0.08, offsetX: -30, offsetY: -25, forTarget: false },
        { relX: 0.12, offsetX: 35, offsetY: 20, forTarget: false },
        { relX: 0.18, offsetX: -25, offsetY: -35, forTarget: false },
        { relX: 0.22, offsetX: 30, offsetY: 30, forTarget: false },
        { relX: 0.28, offsetX: -35, offsetY: -20, forTarget: false },
        { relX: 0.32, offsetX: 25, offsetY: 35, forTarget: false },
        { relX: 0.38, offsetX: -30, offsetY: -30, forTarget: false },
        { relX: 0.42, offsetX: 35, offsetY: 20, forTarget: false },
        { relX: 0.48, offsetX: -25, offsetY: -35, forTarget: false },
        { relX: 0.52, offsetX: 30, offsetY: 30, forTarget: false },
        { relX: 0.58, offsetX: -35, offsetY: -20, forTarget: false },
        { relX: 0.62, offsetX: 25, offsetY: 35, forTarget: false },
        { relX: 0.68, offsetX: -30, offsetY: -30, forTarget: false },
        { relX: 0.72, offsetX: 35, offsetY: 20, forTarget: false },
        { relX: 0.78, offsetX: -25, offsetY: -35, forTarget: false },
        { relX: 0.82, offsetX: 30, offsetY: 30, forTarget: false },
        { relX: 0.88, offsetX: -35, offsetY: -20, forTarget: false },
        { relX: 0.92, offsetX: 25, offsetY: 35, forTarget: false },
        { relX: 0.98, offsetX: -30, offsetY: -30, forTarget: false },
      ]
    },
    
    // Patrón 4: Lado a lado
    {
      id: 'side-by-side',
      name: 'Lado a Lado',
      positions: [
        // Objetivos siempre al lado derecho del camino
        { relX: 0.05, offsetX: 10, offsetY: -5, forTarget: true },
        { relX: 0.15, offsetX: 15, offsetY: -10, forTarget: true },
        { relX: 0.25, offsetX: 10, offsetY: -15, forTarget: true },
        { relX: 0.35, offsetX: 15, offsetY: -5, forTarget: true },
        { relX: 0.45, offsetX: 10, offsetY: -10, forTarget: true },
        { relX: 0.55, offsetX: 15, offsetY: -15, forTarget: true },
        { relX: 0.65, offsetX: 10, offsetY: -5, forTarget: true },
        { relX: 0.75, offsetX: 15, offsetY: -10, forTarget: true },
        { relX: 0.85, offsetX: 10, offsetY: -15, forTarget: true },
        { relX: 0.95, offsetX: 15, offsetY: -5, forTarget: true },
        
        // Distractores principalmente al lado izquierdo
        { relX: 0.03, offsetX: -25, offsetY: 20, forTarget: false },
        { relX: 0.08, offsetX: -30, offsetY: 25, forTarget: false },
        { relX: 0.13, offsetX: -20, offsetY: 30, forTarget: false },
        { relX: 0.18, offsetX: -25, offsetY: 25, forTarget: false },
        { relX: 0.23, offsetX: -30, offsetY: 20, forTarget: false },
        { relX: 0.28, offsetX: -20, offsetY: 25, forTarget: false },
        { relX: 0.33, offsetX: -25, offsetY: 30, forTarget: false },
        { relX: 0.38, offsetX: -30, offsetY: 25, forTarget: false },
        { relX: 0.43, offsetX: -20, offsetY: 20, forTarget: false },
        { relX: 0.48, offsetX: -25, offsetY: 25, forTarget: false },
        { relX: 0.53, offsetX: -30, offsetY: 30, forTarget: false },
        { relX: 0.58, offsetX: -20, offsetY: 25, forTarget: false },
        { relX: 0.63, offsetX: -25, offsetY: 20, forTarget: false },
        { relX: 0.68, offsetX: -30, offsetY: 25, forTarget: false },
        { relX: 0.73, offsetX: -20, offsetY: 30, forTarget: false },
        { relX: 0.78, offsetX: -25, offsetY: 25, forTarget: false },
        { relX: 0.83, offsetX: -30, offsetY: 20, forTarget: false },
        { relX: 0.88, offsetX: -20, offsetY: 25, forTarget: false },
        { relX: 0.93, offsetX: -25, offsetY: 30, forTarget: false },
        { relX: 0.98, offsetX: -30, offsetY: 25, forTarget: false },
      ]
    },
    
    // Patrón 5: Densidad variable
    {
      id: 'variable-density',
      name: 'Densidad Variable',
      positions: [
        // Objetivos: densidad alta al inicio, baja en medio, alta al final
        { relX: 0.05, offsetX: -10, offsetY: 10, forTarget: true },
        { relX: 0.10, offsetX: 15, offsetY: -10, forTarget: true },
        { relX: 0.15, offsetX: -15, offsetY: -15, forTarget: true },
        { relX: 0.20, offsetX: 10, offsetY: 15, forTarget: true },
        { relX: 0.40, offsetX: -10, offsetY: -10, forTarget: true },
        { relX: 0.60, offsetX: 15, offsetY: 15, forTarget: true },
        { relX: 0.80, offsetX: -15, offsetY: 10, forTarget: true },
        { relX: 0.85, offsetX: 10, offsetY: -15, forTarget: true },
        { relX: 0.90, offsetX: -10, offsetY: -10, forTarget: true },
        { relX: 0.95, offsetX: 15, offsetY: 10, forTarget: true },
        
        // Distractores con densidad variable inversa (menos al inicio y final, más en medio)
        { relX: 0.02, offsetX: 30, offsetY: 25, forTarget: false },
        { relX: 0.12, offsetX: -25, offsetY: 30, forTarget: false },
        { relX: 0.22, offsetX: 35, offsetY: -30, forTarget: false },
        { relX: 0.27, offsetX: -30, offsetY: -35, forTarget: false },
        { relX: 0.32, offsetX: 40, offsetY: 20, forTarget: false },
        { relX: 0.37, offsetX: -20, offsetY: 40, forTarget: false },
        { relX: 0.42, offsetX: 25, offsetY: -35, forTarget: false },
        { relX: 0.47, offsetX: -35, offsetY: -25, forTarget: false },
        { relX: 0.52, offsetX: 30, offsetY: 30, forTarget: false },
        { relX: 0.57, offsetX: -30, offsetY: 30, forTarget: false },
        { relX: 0.62, offsetX: 35, offsetY: -25, forTarget: false },
        { relX: 0.67, offsetX: -25, offsetY: -35, forTarget: false },
        { relX: 0.72, offsetX: 40, offsetY: 30, forTarget: false },
        { relX: 0.77, offsetX: -30, offsetY: 40, forTarget: false },
        { relX: 0.87, offsetX: 25, offsetY: -40, forTarget: false },
        { relX: 0.97, offsetX: -40, offsetY: -25, forTarget: false },
      ]
    },
    
    // Patrón 6: Un lado, luego el otro
    {
      id: 'alternating-sides',
      name: 'Lados Alternados',
      positions: [
        // Primera mitad: objetivos al lado derecho
        { relX: 0.05, offsetX: 15, offsetY: -10, forTarget: true },
        { relX: 0.15, offsetX: 10, offsetY: -15, forTarget: true },
        { relX: 0.25, offsetX: 15, offsetY: -5, forTarget: true },
        { relX: 0.35, offsetX: 10, offsetY: -10, forTarget: true },
        { relX: 0.45, offsetX: 15, offsetY: -15, forTarget: true },
        
        // Segunda mitad: objetivos al lado izquierdo
        { relX: 0.55, offsetX: -15, offsetY: 10, forTarget: true },
        { relX: 0.65, offsetX: -10, offsetY: 15, forTarget: true },
        { relX: 0.75, offsetX: -15, offsetY: 5, forTarget: true },
        { relX: 0.85, offsetX: -10, offsetY: 10, forTarget: true },
        { relX: 0.95, offsetX: -15, offsetY: 15, forTarget: true },
        
        // Distractores: patrón inverso
        { relX: 0.03, offsetX: -25, offsetY: 20, forTarget: false },
        { relX: 0.08, offsetX: -30, offsetY: 25, forTarget: false },
        { relX: 0.13, offsetX: -20, offsetY: 30, forTarget: false },
        { relX: 0.18, offsetX: -25, offsetY: 25, forTarget: false },
        { relX: 0.23, offsetX: -30, offsetY: 20, forTarget: false },
        { relX: 0.28, offsetX: -20, offsetY: 25, forTarget: false },
        { relX: 0.33, offsetX: -25, offsetY: 30, forTarget: false },
        { relX: 0.38, offsetX: -30, offsetY: 25, forTarget: false },
        { relX: 0.43, offsetX: -20, offsetY: 20, forTarget: false },
        { relX: 0.48, offsetX: -25, offsetY: 25, forTarget: false },
        { relX: 0.53, offsetX: 30, offsetY: -30, forTarget: false },
        { relX: 0.58, offsetX: 20, offsetY: -25, forTarget: false },
        { relX: 0.63, offsetX: 25, offsetY: -20, forTarget: false },
        { relX: 0.68, offsetX: 30, offsetY: -25, forTarget: false },
        { relX: 0.73, offsetX: 20, offsetY: -30, forTarget: false },
        { relX: 0.78, offsetX: 25, offsetY: -25, forTarget: false },
        { relX: 0.83, offsetX: 30, offsetY: -20, forTarget: false },
        { relX: 0.88, offsetX: 20, offsetY: -25, forTarget: false },
        { relX: 0.93, offsetX: 25, offsetY: -30, forTarget: false },
        { relX: 0.98, offsetX: 30, offsetY: -25, forTarget: false },
      ]
    },
    
    // Patrón 7: Progresivamente más lejos
    {
      id: 'increasing-distance',
      name: 'Distancia Progresiva',
      positions: [
        // Objetivos cada vez más alejados del camino
        { relX: 0.05, offsetX: 5, offsetY: -5, forTarget: true },
        { relX: 0.15, offsetX: 10, offsetY: -10, forTarget: true },
        { relX: 0.25, offsetX: 15, offsetY: -15, forTarget: true },
        { relX: 0.35, offsetX: 20, offsetY: -20, forTarget: true },
        { relX: 0.45, offsetX: 25, offsetY: -25, forTarget: true },
        { relX: 0.55, offsetX: -5, offsetY: 5, forTarget: true },
        { relX: 0.65, offsetX: -10, offsetY: 10, forTarget: true },
        { relX: 0.75, offsetX: -15, offsetY: 15, forTarget: true },
        { relX: 0.85, offsetX: -20, offsetY: 20, forTarget: true },
        { relX: 0.95, offsetX: -25, offsetY: 25, forTarget: true },
        
        // Distractores con patrón inverso
        { relX: 0.03, offsetX: -30, offsetY: -30, forTarget: false },
        { relX: 0.08, offsetX: -25, offsetY: -25, forTarget: false },
        { relX: 0.13, offsetX: -20, offsetY: -20, forTarget: false },
        { relX: 0.18, offsetX: -15, offsetY: -15, forTarget: false },
        { relX: 0.23, offsetX: -10, offsetY: -10, forTarget: false },
        { relX: 0.28, offsetX: -5, offsetY: -5, forTarget: false },
        { relX: 0.33, offsetX: 5, offsetY: 5, forTarget: false },
        { relX: 0.38, offsetX: 10, offsetY: 10, forTarget: false },
        { relX: 0.43, offsetX: 15, offsetY: 15, forTarget: false },
        { relX: 0.48, offsetX: 20, offsetY: 20, forTarget: false },
        { relX: 0.53, offsetX: 25, offsetY: 25, forTarget: false },
        { relX: 0.58, offsetX: 30, offsetY: 30, forTarget: false },
        { relX: 0.63, offsetX: 30, offsetY: 30, forTarget: false },
        { relX: 0.68, offsetX: 25, offsetY: 25, forTarget: false },
        { relX: 0.73, offsetX: 20, offsetY: 20, forTarget: false },
        { relX: 0.78, offsetX: 15, offsetY: 15, forTarget: false },
        { relX: 0.83, offsetX: 10, offsetY: 10, forTarget: false },
        { relX: 0.88, offsetX: 5, offsetY: 5, forTarget: false },
        { relX: 0.93, offsetX: -5, offsetY: -5, forTarget: false },
        { relX: 0.98, offsetX: -10, offsetY: -10, forTarget: false },
      ]
    },
    
    // Patrón 8: Grupos lineales
    {
      id: 'linear-groups',
      name: 'Grupos Lineales',
      positions: [
        // Primer grupo de objetivos (inicio)
        { relX: 0.05, offsetX: -10, offsetY: 10, forTarget: true },
        { relX: 0.10, offsetX: -5, offsetY: 5, forTarget: true },
        { relX: 0.15, offsetX: 5, offsetY: -5, forTarget: true },
        
        // Segundo grupo de objetivos (medio)
        { relX: 0.45, offsetX: 10, offsetY: -10, forTarget: true },
        { relX: 0.50, offsetX: 5, offsetY: -5, forTarget: true },
        { relX: 0.55, offsetX: -5, offsetY: 5, forTarget: true },
        
        // Tercer grupo de objetivos (final)
        { relX: 0.85, offsetX: -10, offsetY: 10, forTarget: true },
        { relX: 0.90, offsetX: -5, offsetY: 5, forTarget: true },
        { relX: 0.95, offsetX: 5, offsetY: -5, forTarget: true },
        
        // Distractores intercalados entre grupos
        { relX: 0.02, offsetX: 30, offsetY: -30, forTarget: false },
        { relX: 0.20, offsetX: -25, offsetY: 25, forTarget: false },
        { relX: 0.25, offsetX: 20, offsetY: -20, forTarget: false },
        { relX: 0.30, offsetX: -30, offsetY: 30, forTarget: false },
        { relX: 0.35, offsetX: 25, offsetY: -25, forTarget: false },
        { relX: 0.40, offsetX: -20, offsetY: 20, forTarget: false },
        { relX: 0.60, offsetX: 30, offsetY: -30, forTarget: false },
        { relX: 0.65, offsetX: -25, offsetY: 25, forTarget: false },
        { relX: 0.70, offsetX: 20, offsetY: -20, forTarget: false },
        { relX: 0.75, offsetX: -30, offsetY: 30, forTarget: false },
        { relX: 0.80, offsetX: 25, offsetY: -25, forTarget: false },
        { relX: 0.98, offsetX: -20, offsetY: 20, forTarget: false },
      ]
    },
    
    // Patrón 9: Intervalos regulares alternando lados
    {
      id: 'regular-alternating',
      name: 'Alternancia Regular',
      positions: [
        // Objetivos a intervalos regulares alternando lados
        { relX: 0.10, offsetX: 15, offsetY: -10, forTarget: true },
        { relX: 0.20, offsetX: -15, offsetY: 10, forTarget: true },
        { relX: 0.30, offsetX: 15, offsetY: -10, forTarget: true },
        { relX: 0.40, offsetX: -15, offsetY: 10, forTarget: true },
        { relX: 0.50, offsetX: 15, offsetY: -10, forTarget: true },
        { relX: 0.60, offsetX: -15, offsetY: 10, forTarget: true },
        { relX: 0.70, offsetX: 15, offsetY: -10, forTarget: true },
        { relX: 0.80, offsetX: -15, offsetY: 10, forTarget: true },
        { relX: 0.90, offsetX: 15, offsetY: -10, forTarget: true },
        
        // Distractores también a intervalos regulares pero en posiciones intermedias
        { relX: 0.05, offsetX: -35, offsetY: -20, forTarget: false },
        { relX: 0.15, offsetX: 30, offsetY: 25, forTarget: false },
        { relX: 0.25, offsetX: -25, offsetY: -30, forTarget: false },
        { relX: 0.35, offsetX: 20, offsetY: 35, forTarget: false },
        { relX: 0.45, offsetX: -35, offsetY: -20, forTarget: false },
        { relX: 0.55, offsetX: 30, offsetY: 25, forTarget: false },
        { relX: 0.65, offsetX: -25, offsetY: -30, forTarget: false },
        { relX: 0.75, offsetX: 20, offsetY: 35, forTarget: false },
        { relX: 0.85, offsetX: -35, offsetY: -20, forTarget: false },
        { relX: 0.95, offsetX: 30, offsetY: 25, forTarget: false },
        
        // Distractores adicionales a mayor distancia
        { relX: 0.07, offsetX: 40, offsetY: 40, forTarget: false },
        { relX: 0.17, offsetX: -40, offsetY: -40, forTarget: false },
        { relX: 0.27, offsetX: 40, offsetY: -40, forTarget: false },
        { relX: 0.37, offsetX: -40, offsetY: 40, forTarget: false },
        { relX: 0.47, offsetX: 40, offsetY: 40, forTarget: false },
        { relX: 0.57, offsetX: -40, offsetY: -40, forTarget: false },
        { relX: 0.67, offsetX: 40, offsetY: -40, forTarget: false },
        { relX: 0.77, offsetX: -40, offsetY: 40, forTarget: false },
        { relX: 0.87, offsetX: 40, offsetY: 40, forTarget: false },
        { relX: 0.97, offsetX: -40, offsetY: -40, forTarget: false },
      ]
    },
    
    // Patrón 10: Distancia creciente-decreciente
    {
      id: 'wave-distance',
      name: 'Onda de Distancia',
      positions: [
        // Objetivos con distancia variable en forma de onda (cerca-lejos-cerca)
        { relX: 0.05, offsetX: 5, offsetY: -5, forTarget: true },
        { relX: 0.15, offsetX: 15, offsetY: -15, forTarget: true },
        { relX: 0.25, offsetX: 25, offsetY: -25, forTarget: true },
        { relX: 0.35, offsetX: 15, offsetY: -15, forTarget: true },
        { relX: 0.45, offsetX: 5, offsetY: -5, forTarget: true },
        { relX: 0.55, offsetX: 5, offsetY: -5, forTarget: true },
        { relX: 0.65, offsetX: 15, offsetY: -15, forTarget: true },
        { relX: 0.75, offsetX: 25, offsetY: -25, forTarget: true },
        { relX: 0.85, offsetX: 15, offsetY: -15, forTarget: true },
        { relX: 0.95, offsetX: 5, offsetY: -5, forTarget: true },
        
        // Distractores con patrón inverso
        { relX: 0.10, offsetX: -25, offsetY: 25, forTarget: false },
        { relX: 0.20, offsetX: -15, offsetY: 15, forTarget: false },
        { relX: 0.30, offsetX: -5, offsetY: 5, forTarget: false },
        { relX: 0.40, offsetX: -15, offsetY: 15, forTarget: false },
        { relX: 0.50, offsetX: -25, offsetY: 25, forTarget: false },
        { relX: 0.60, offsetX: -25, offsetY: 25, forTarget: false },
        { relX: 0.70, offsetX: -15, offsetY: 15, forTarget: false },
        { relX: 0.80, offsetX: -5, offsetY: 5, forTarget: false },
        { relX: 0.90, offsetX: -15, offsetY: 15, forTarget: false },
        
        // Distractores adicionales más alejados
        { relX: 0.08, offsetX: 35, offsetY: 35, forTarget: false },
        { relX: 0.18, offsetX: 30, offsetY: 40, forTarget: false },
        { relX: 0.28, offsetX: 40, offsetY: 30, forTarget: false },
        { relX: 0.38, offsetX: 35, offsetY: 35, forTarget: false },
        { relX: 0.48, offsetX: 30, offsetY: 40, forTarget: false },
        { relX: 0.58, offsetX: 40, offsetY: 30, forTarget: false },
        { relX: 0.68, offsetX: 35, offsetY: 35, forTarget: false },
        { relX: 0.78, offsetX: 30, offsetY: 40, forTarget: false },
        { relX: 0.88, offsetX: 40, offsetY: 30, forTarget: false },
        { relX: 0.98, offsetX: 35, offsetY: 35, forTarget: false },
      ]
    },
    
    // Patrón 11: Cercanos al camino
    {
      id: 'path-proximity',
      name: 'Proximidad al Camino',
      positions: [
        // Objetivos muy cercanos al camino
        { relX: 0.05, offsetX: 3, offsetY: -3, forTarget: true },
        { relX: 0.15, offsetX: -3, offsetY: 3, forTarget: true },
        { relX: 0.25, offsetX: 3, offsetY: -3, forTarget: true },
        { relX: 0.35, offsetX: -3, offsetY: 3, forTarget: true },
        { relX: 0.45, offsetX: 3, offsetY: -3, forTarget: true },
        { relX: 0.55, offsetX: -3, offsetY: 3, forTarget: true },
        { relX: 0.65, offsetX: 3, offsetY: -3, forTarget: true },
        { relX: 0.75, offsetX: -3, offsetY: 3, forTarget: true },
        { relX: 0.85, offsetX: 3, offsetY: -3, forTarget: true },
        { relX: 0.95, offsetX: -3, offsetY: 3, forTarget: true },
        
        // Distractores a media distancia
        { relX: 0.08, offsetX: 20, offsetY: -20, forTarget: false },
        { relX: 0.18, offsetX: -20, offsetY: 20, forTarget: false },
        { relX: 0.28, offsetX: 20, offsetY: -20, forTarget: false },
        { relX: 0.38, offsetX: -20, offsetY: 20, forTarget: false },
        { relX: 0.48, offsetX: 20, offsetY: -20, forTarget: false },
        { relX: 0.58, offsetX: -20, offsetY: 20, forTarget: false },
        { relX: 0.68, offsetX: 20, offsetY: -20, forTarget: false },
        { relX: 0.78, offsetX: -20, offsetY: 20, forTarget: false },
        { relX: 0.88, offsetX: 20, offsetY: -20, forTarget: false },
        { relX: 0.98, offsetX: -20, offsetY: 20, forTarget: false },
        
        // Distractores adicionales más lejos
        { relX: 0.03, offsetX: -40, offsetY: -40, forTarget: false },
        { relX: 0.13, offsetX: 40, offsetY: 40, forTarget: false },
        { relX: 0.23, offsetX: -40, offsetY: -40, forTarget: false },
        { relX: 0.33, offsetX: 40, offsetY: 40, forTarget: false },
        { relX: 0.43, offsetX: -40, offsetY: -40, forTarget: false },
        { relX: 0.53, offsetX: 40, offsetY: 40, forTarget: false },
        { relX: 0.63, offsetX: -40, offsetY: -40, forTarget: false },
        { relX: 0.73, offsetX: 40, offsetY: 40, forTarget: false },
        { relX: 0.83, offsetX: -40, offsetY: -40, forTarget: false },
        { relX: 0.93, offsetX: 40, offsetY: 40, forTarget: false },
      ]
    },
    
    // Patrón 12: Agrupación por segmentos
    {
      id: 'segmented-groups',
      name: 'Grupos por Segmentos',
      positions: [
        // Grupo 1: Segmento inicial (0-20%)
        { relX: 0.05, offsetX: 5, offsetY: -10, forTarget: true },
        { relX: 0.10, offsetX: -5, offsetY: 15, forTarget: true },
        { relX: 0.15, offsetX: 10, offsetY: -5, forTarget: true },
        
        // Grupo 2: Segmento medio-inicial (20-40%)
        { relX: 0.25, offsetX: -10, offsetY: -10, forTarget: true },
        { relX: 0.30, offsetX: 15, offsetY: 5, forTarget: true },
        { relX: 0.35, offsetX: -5, offsetY: -15, forTarget: true },
        
        // Grupo 3: Segmento medio-final (60-80%)
        { relX: 0.65, offsetX: 10, offsetY: 10, forTarget: true },
        { relX: 0.70, offsetX: -15, offsetY: -5, forTarget: true },
        { relX: 0.75, offsetX: 5, offsetY: 15, forTarget: true },
        
        // Grupo 4: Segmento final (80-100%)
        { relX: 0.85, offsetX: -5, offsetY: 10, forTarget: true },
        { relX: 0.90, offsetX: 10, offsetY: -15, forTarget: true },
        { relX: 0.95, offsetX: -15, offsetY: 5, forTarget: true },
        
        // Distractores uniformemente distribuidos
        { relX: 0.03, offsetX: 25, offsetY: 30, forTarget: false },
        { relX: 0.08, offsetX: -30, offsetY: -25, forTarget: false },
        { relX: 0.13, offsetX: 35, offsetY: -30, forTarget: false },
        { relX: 0.18, offsetX: -25, offsetY: 35, forTarget: false },
        { relX: 0.23, offsetX: 30, offsetY: 25, forTarget: false },
        { relX: 0.28, offsetX: -35, offsetY: -30, forTarget: false },
        { relX: 0.33, offsetX: 25, offsetY: -35, forTarget: false },
        { relX: 0.38, offsetX: -30, offsetY: 25, forTarget: false },
        { relX: 0.43, offsetX: 35, offsetY: 30, forTarget: false },
        { relX: 0.48, offsetX: -25, offsetY: -35, forTarget: false },
        { relX: 0.53, offsetX: 30, offsetY: -25, forTarget: false },
        { relX: 0.58, offsetX: -35, offsetY: 30, forTarget: false },
        { relX: 0.63, offsetX: 25, offsetY: 35, forTarget: false },
        { relX: 0.68, offsetX: -30, offsetY: -25, forTarget: false },
        { relX: 0.73, offsetX: 35, offsetY: -30, forTarget: false },
        { relX: 0.78, offsetX: -25, offsetY: 35, forTarget: false },
        { relX: 0.83, offsetX: 30, offsetY: 25, forTarget: false },
        { relX: 0.88, offsetX: -35, offsetY: -30, forTarget: false },
        { relX: 0.93, offsetX: 25, offsetY: -35, forTarget: false },
        { relX: 0.98, offsetX: -30, offsetY: 25, forTarget: false },
      ]
    }
];