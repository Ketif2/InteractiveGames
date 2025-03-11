// src/utils/forestAnimations.js

/**
 * Estilos globales para animaciones en el juego del bosque
 */
export const forestAnimations = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeOut {
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(-20px); }
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.1); opacity: 0.8; }
  100% { transform: scale(1); opacity: 0.3; }
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0px); }
}

@keyframes floatFast {
  0% { transform: translateY(0px) rotate(0deg); }
  25% { transform: translateY(-3px) rotate(1deg); }
  75% { transform: translateY(2px) rotate(-1deg); }
  100% { transform: translateY(0px) rotate(0deg); }
}

@keyframes sway {
  0% { transform: rotate(0deg); }
  25% { transform: rotate(2deg); }
  75% { transform: rotate(-2deg); }
  100% { transform: rotate(0deg); }
}

@keyframes glow {
  0% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.5); }
  50% { box-shadow: 0 0 15px rgba(59, 130, 246, 0.8); }
  100% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.5); }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out forwards;
}

.animate-fadeOut {
  animation: fadeOut 0.3s ease-out forwards;
}

.animate-pulse {
  animation: pulse 2s ease-in-out infinite;
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-float-fast {
  animation: floatFast 1.5s ease-in-out infinite;
}

.animate-sway {
  animation: sway 2s ease-in-out infinite;
}

.animate-glow {
  animation: glow 1.5s ease-in-out infinite;
}

.animate-shimmer {
  background: linear-gradient(90deg, 
    rgba(255,255,255,0) 0%, 
    rgba(255,255,255,0.2) 50%, 
    rgba(255,255,255,0) 100%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
}

.object-highlight {
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5);
  animation: glow 1.5s ease-in-out infinite;
}

/* Transiciones mejoradas */
.transition-bounce {
  transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* Efectos de hover mejorados */
.hover-grow {
  transition: transform 0.2s;
}

.hover-grow:hover {
  transform: scale(1.1);
}

/* Efectos para objetos encontrados */
.found-effect {
  position: relative;
  overflow: hidden;
}

.found-effect::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 75%);
  transform: translateX(-100%);
  animation: shimmer 1s forwards;
}
`;

/**
 * Aplica los estilos de animación al documento
 */
export const applyAnimationStyles = () => {
  // Verificar si ya existen los estilos para evitar duplicados
  if (!document.getElementById('forest-animations')) {
    const styleElement = document.createElement('style');
    styleElement.id = 'forest-animations';
    styleElement.innerHTML = forestAnimations;
    document.head.appendChild(styleElement);
    
    return () => {
      // Función para limpiar los estilos al desmontar
      const element = document.getElementById('forest-animations');
      if (element) {
        document.head.removeChild(element);
      }
    };
  }
  
  return () => {}; // No hay nada que limpiar si no se agregaron estilos
};

export default { forestAnimations, applyAnimationStyles };