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
    
    // Obtener la imagen adecuada según el tipo de objeto
    const getObjectImage = () => {
        switch(type) {
            case 'flower':
                if (color === 'blue') return '/src/assets/images/forest/blue-flower.svg';
                if (color === 'red') return '/src/assets/images/forest/red-flower.png';
                if (color === 'yellow') return '/src/assets/images/forest/yellow-flower.png';
                if (color === 'purple') return '/src/assets/images/forest/purple-flower.png';
                return '/src/assets/images/forest/pink-flower.png';
            case 'mushroom':
                if (color === 'red') return '/src/assets/images/forest/red-mushroom.png';
                if (color === 'brown') return '/src/assets/images/forest/brown-mushroom.png';
                if (color === 'yellow') return '/src/assets/images/forest/yellow-mushroom.png';
                return '/src/assets/images/forest/bee.png';
            case 'tree':
                return '/src/assets/images/forest/tree-icon.png';
            case 'animal':
                if (species === 'rabbit') return '/src/assets/images/forest/rabbit.png';
                if (species === 'fox') return '/src/assets/images/forest/fox.png';
                if (species === 'bird') return '/src/assets/images/forest/bird.png';
                return '/src/assets/images/forest/animal-track.png';
            default:
                return '/src/assets/images/forest/question.png';
        }
    };
    
    // Obtener la clase de estilo según el tipo y color
    const getStyleClass = () => {
        let baseClasses = 'w-full h-full rounded-full flex items-center justify-center transform transition-transform overflow-hidden';
        
        // Fondo transparente para todos los objetos (quitamos bg-white)
        
        if (found) {
            baseClasses += ' opacity-60 grayscale';
        }
        
        return baseClasses;
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
            {/* Objeto del bosque con fondo transparente */}
            <div className={getStyleClass()}>
                <img 
                    src={getObjectImage()} 
                    alt={`${color} ${type}`}
                    className="w-full h-full object-contain"
                />
            </div>
            
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