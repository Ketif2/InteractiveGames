import React, { useEffect, useRef, useState } from 'react';

const ForestObject = ({ object, onClick }) => {
    const { uniqueId, x, y, type, color, species, isTarget, found } = object;
    const objectRef = useRef(null);
    const [objectSize, setObjectSize] = useState(58);
    
    useEffect(() => {
        const calculateSize = () => {
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;
            
            const baseSize = Math.min(screenWidth, screenHeight) / 14;
            
            const newSize = Math.min(Math.max(baseSize, 42), 70);
            
            setObjectSize(newSize);
        };
        
        calculateSize();
        
        window.addEventListener('resize', calculateSize);
        
        return () => window.removeEventListener('resize', calculateSize);
    }, []);
    
    const validX = isNaN(x) ? 100 : Math.max(0, Number(x));
    const validY = isNaN(y) ? 200 : Math.max(0, Number(y));
    
    useEffect(() => {
        if (isTarget && !found && objectRef.current) {
            const randomDelay = Math.random() * 2; // Delay aleatorio entre 0-2s
            objectRef.current.style.animationDelay = `${randomDelay}s`;
        }
    }, [isTarget, found]);
    
    const getObjectImage = () => {
        switch(type) {
            case 'flower':
                if (color === 'blue') return '/images/forest/blue-flower.svg';
                if (color === 'red') return '/images/forest/red-flower.png';
                if (color === 'yellow') return '/images/forest/yellow-flower.png';
                if (color === 'purple') return '/images/forest/purple-flower.png';
                return '/images/forest/pink-flower.png';
            case 'mushroom':
                if (color === 'red') return '/images/forest/red-mushroom.png';
                if (color === 'brown') return '/images/forest/brown-mushroom.png';
                if (color === 'yellow') return '/images/forest/yellow-mushroom.png';
                return '/images/forest/bee.png';
            case 'tree':
                return '/images/forest/tree-icon.png';
            case 'animal':
                if (species === 'rabbit') return '/images/forest/rabbit.png';
                if (species === 'fox') return '/images/forest/fox.png';
                if (species === 'bird') return '/images/forest/bird.png';
                return '/images/forest/animal-track.png';
            default:
                return '/images/forest/question.png';
        }
    };
    
    const getStyleClass = () => {
        let baseClasses = 'w-full h-full rounded-full flex items-center justify-center transform transition-transform overflow-hidden';
        
        if (found) {
            baseClasses += ' opacity-60 grayscale';
        }
        
        return baseClasses;
    };
    
    const getAnimation = () => {
        if (found) return '';
        
        if (isTarget) {
            if (type === 'animal') return 'animate-float-fast';
            if (type === 'flower') return 'animate-sway';
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
                `}
            style={{
                left: `${validX}px`,
                top: `${validY}px`,
                width: `${objectSize}px`,
                height: `${objectSize}px`, 
                transform: found ? 'scale(0.8)' : 'scale(1)',
                zIndex: isTarget ? 5 : 1,
                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}
            onClick={() => !found && onClick(uniqueId)}
        >
            <div className={getStyleClass()}>
                <img 
                    src={getObjectImage()} 
                    alt={`${color} ${type}`}
                    className="w-full h-full object-contain"
                />
            </div>
            <div className="absolute inset-0 rounded-full bg-black opacity-0 transition-opacity duration-150 hover:opacity-10"></div>
        </div>
    );
};

const ForestObjects = ({ objects, onObjectClick }) => {
    return (
        <div className="absolute inset-0">
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