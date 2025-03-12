// src/components/games/forest/ForestObjects.jsx
import React, { useEffect, useRef, useState } from 'react';

// Componente para renderizar un objeto del bosque con tamaño responsive
const ForestObject = ({ object, onClick }) => {
    const { uniqueId, x, y, type, color, species, isTarget, found } = object;
    const objectRef = useRef(null);
    const [objectSize, setObjectSize] = useState(58);
    
    // Calcular tamaño de objeto responsive al tamaño de la pantalla
    useEffect(() => {
        const calculateSize = () => {
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;
            
            // Calcular tamaño según la menor dimensión (ancho o alto)
            const baseSize = Math.min(screenWidth, screenHeight) / 14;
            
            // Limitar entre 42px y 70px
            const newSize = Math.min(Math.max(baseSize, 42), 70);
            
            setObjectSize(newSize);
        };
        
        // Calcular inicialmente
        calculateSize();
        
        // Recalcular cuando cambie el tamaño de la ventana
        window.addEventListener('resize', calculateSize);
        
        return () => window.removeEventListener('resize', calculateSize);
    }, []);
    
    // Validar coordenadas
    const validX = isNaN(x) ? 100 : Math.max(0, Number(x));
    const validY = isNaN(y) ? 200 : Math.max(0, Number(y));
    
    // Aplicar un movimiento sutil aleatorio al objeto cuando es un objetivo
    useEffect(() => {
        if (isTarget && !found && objectRef.current) {
            // Agregar un pequeño efecto de movimiento aleatorio para dar vida
            const randomDelay = Math.random() * 2; // Delay aleatorio entre 0-2s
            objectRef.current.style.animationDelay = `${randomDelay}s`;
        }
    }, [isTarget, found]);
    
    // Obtener el ícono adecuado según el tipo de objeto
    const getObjectIcon = () => {
        switch(type) {
            case 'flower':
                if (color === 'blue') return '🌸';
                if (color === 'red') return '🌹';
                if (color === 'yellow') return '🌻';
                if (color === 'purple') return '🌷';
                return '🌼';
            case 'mushroom':
                if (color === 'red') return '🍄';
                if (color === 'brown') return '🍄';
                if (color === 'white') return '🍄';
                return '🍄';
            case 'tree':
                return '🌲';
            case 'animal':
                if (species === 'rabbit') return '🐰';
                if (species === 'fox') return '🦊';
                if (species === 'bird') return '🐦';
                return '🐾';
            default:
                return '❓';
        }
    };
    
    // Obtener la clase de estilo según el tipo y color
    const getStyleClass = () => {
        let baseClasses = 'w-full h-full rounded-full shadow-md flex items-center justify-center transform transition-transform';
        
        // Fondo blanco para todos los objetos
        baseClasses += ' bg-white';
        
        // Borde colorido según el tipo de objeto
        if (found) {
            baseClasses += ' opacity-60 grayscale';
        }
        
        // Añadir solo un borde colorido según el tipo
        switch(type) {
            case 'flower':
                if (color === 'blue') return `${baseClasses} border-4 border-blue-400`;
                if (color === 'red') return `${baseClasses} border-4 border-red-400`;
                if (color === 'yellow') return `${baseClasses} border-4 border-yellow-400`;
                if (color === 'purple') return `${baseClasses} border-4 border-purple-400`;
                return `${baseClasses} border-4 border-pink-300`;
            case 'mushroom':
                if (color === 'red') return `${baseClasses} border-4 border-red-600`;
                if (color === 'brown') return `${baseClasses} border-4 border-amber-700`;
                if (color === 'white') return `${baseClasses} border-4 border-gray-300`;
                return `${baseClasses} border-4 border-red-400`;
            case 'tree':
                return `${baseClasses} border-4 border-green-700`;
            case 'animal':
                return `${baseClasses} border-4 border-amber-400`;
            default:
                return `${baseClasses} border-4 border-gray-400`;
        }
    };
    
    // Calcular animación basada en tipo de objeto
    const getAnimation = () => {
        if (found) return '';
        
        if (isTarget) {
            // Los animales se mueven más rápido que las plantas
            if (type === 'animal') return 'animate-float-fast';
            // Las flores se balancean suavemente
            if (type === 'flower') return 'animate-sway';
            // Otros objetos tienen animación estándar
            return 'animate-float';
        }
        
        return '';
    };
    
    // Calcular tamaño de texto responsive
    const getTextSize = () => {
        const relativeSize = objectSize / 58; // Normalizado al tamaño base de 58px
        
        if (relativeSize >= 1.1) return 'text-3xl';
        if (relativeSize >= 0.9) return 'text-2xl';
        if (relativeSize >= 0.7) return 'text-xl';
        return 'text-lg';
    };
    
    return (
        <div
            id={uniqueId}
            ref={objectRef}
            className={`absolute cursor-pointer transition-all duration-300 
                ${isTarget ? 'target-object' : ''} 
                ${found ? 'opacity-50' : 'hover:scale-110 hover:brightness-110'}
                ${getAnimation()}`}
            style={{
                left: `${validX}px`,
                top: `${validY}px`,
                width: `${objectSize}px`, // Tamaño responsive
                height: `${objectSize}px`, // Tamaño responsive
                transform: found ? 'scale(0.8)' : 'scale(1)',
                zIndex: isTarget ? 5 : 1,
                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}
            onClick={() => !found && onClick(uniqueId)}
        >
            {/* Objeto del bosque con estilo mejorado y fondo blanco */}
            <div className={getStyleClass()}>
                <span className={`text-center font-bold ${getTextSize()} select-none`}>
                    {getObjectIcon()}
                </span>
            </div>
            
            {/* Decoración visual para objetos target no encontrados */}
            {isTarget && !found && (
                <div className="absolute -inset-2 rounded-full animate-glow opacity-40"></div>
            )}
            
            {/* Efecto de sombra y click */}
            <div className="absolute inset-0 rounded-full bg-black opacity-0 transition-opacity duration-150 hover:opacity-10"></div>
        </div>
    );
};

// Componente para renderizar todos los objetos del bosque
const ForestObjects = ({ objects, onObjectClick }) => {
    return (
        <div className="absolute inset-0">
            {/* Renderizar primero los no-objetivo y luego los objetivos para que estén encima */}
            {objects
                .sort((a, b) => (a.isTarget ? 1 : -1)) // Ordenar para que los objetivos se rendericen al final (encima)
                .map((object) => (
                    <ForestObject 
                        key={object.uniqueId} 
                        object={object} 
                        onClick={onObjectClick} 
                    />
                ))
            }
        </div>
    );
};

export default ForestObjects;