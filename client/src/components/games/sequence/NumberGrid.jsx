import React, { useState, useEffect } from 'react';

const NumberGrid = ({ 
    numbers, 
    hiddenNumbers, 
    showHelp, 
    showMemoryNumbers, 
    gameMode,
    correctAnswers = [],
    userAnswers = {},
    currentHelpNumber = null,
    timeInterval = 10, // Valor predeterminado (en segundos)
    isPaused = false // Estado de pausa
}) => {
    // Estado para mantener los números actuales que se muestran
    const [displayNumbers, setDisplayNumbers] = useState([...numbers]);
    
    // Estado para controlar la animación de ayuda
    const [animatingHelp, setAnimatingHelp] = useState(false);
    
    // Estado para controlar la visibilidad en el modo desvanecimiento
    const [isTemporarilyHidden, setIsTemporarilyHidden] = useState(false);
    
    // Efecto para actualizar los números cuando cambian
    useEffect(() => {
        setDisplayNumbers([...numbers]);
    }, [numbers]);
    
    // Efecto para controlar la animación limitada cuando se muestra la ayuda
    useEffect(() => {
        if (showHelp && currentHelpNumber) {
            // Activar la animación
            setAnimatingHelp(true);
            
            // Desactivar la animación después de 2 segundos
            const timer = setTimeout(() => {
                setAnimatingHelp(false);
            }, 2000);
            
            return () => clearTimeout(timer);
        } else {
            setAnimatingHelp(false);
        }
    }, [showHelp, currentHelpNumber]);
    
    // Efecto para manejar el modo desvanecimiento
    useEffect(() => {
        let fadeTimer;
        let fadeRestoreTimer;
        
        if (gameMode === 'desvanecimiento' && !isPaused) {
            // Configuramos un intervalo para iniciar el desvanecimiento cada X segundos
            fadeTimer = setInterval(() => {
                // Activar el desvanecimiento
                setIsTemporarilyHidden(true);
                
                // Configurar un temporizador para restaurar la visibilidad después de 2 segundos
                fadeRestoreTimer = setTimeout(() => {
                    setIsTemporarilyHidden(false);
                }, 2000);
            }, timeInterval * 1000); // Intervalo completo en milisegundos
        } else {
            // Si el juego está pausado o no estamos en modo desvanecimiento,
            // aseguramos que los números sean visibles
            setIsTemporarilyHidden(false);
        }
        
        return () => {
            if (fadeTimer) clearInterval(fadeTimer);
            if (fadeRestoreTimer) clearTimeout(fadeRestoreTimer);
        };
    }, [gameMode, timeInterval, isPaused]);

    const renderNumber = (number) => {
        const isHidden = hiddenNumbers.includes(number);
        
        // Verificar si este número ya ha sido respondido correctamente
        const isCorrectlyAnswered = correctAnswers.some(idx => {
            return userAnswers[idx] === number;
        });
        
        // Verificar si es el número actual de ayuda
        const isCurrentHelp = number === currentHelpNumber && showHelp;
        
        // Determinar si se debe mostrar el número
        const shouldShow = !isHidden || showMemoryNumbers || isCorrectlyAnswered || isCurrentHelp;
        
        // Para el modo desvanecimiento, controlamos la visibilidad temporal
        // Solo los números correctamente respondidos y el número de ayuda actual no se desvanecen
        const shouldFade = gameMode === 'desvanecimiento' && 
                           isTemporarilyHidden && 
                           !isCorrectlyAnswered && 
                           !isCurrentHelp;

        // Determinar las clases CSS para diferentes estados
        let bgColorClass = 'bg-[#00398A] text-white';
        let animationClass = '';
        let opacityClass = shouldFade ? 'opacity-0' : 'opacity-100';

        if (isHidden && !shouldShow) {
            bgColorClass = 'bg-white border-4 border-[#00398A] text-[#00398A]';
        } else if (isCorrectlyAnswered) {
            // Las respuestas correctas ya no tienen animación permanente
            bgColorClass = 'bg-green-500 text-white';
        } else if (isCurrentHelp) {
            bgColorClass = 'bg-green-500 text-white';
            // Solo aplicamos animación si aún está en periodo de animación
            if (animatingHelp) {
                animationClass = 'animate-bounce';
            }
        }

        if (gameMode === 'memoria' && !showMemoryNumbers && !isCurrentHelp && !isCorrectlyAnswered) {
            opacityClass = 'opacity-0';
        }

        return (
            <div
                className={`
                    w-28 h-28 flex items-center justify-center text-3xl font-bold
                    ${bgColorClass}
                    rounded-xl transition-all duration-300 shadow-md
                    ${animationClass} ${opacityClass}
                `}
            >
                {isHidden && !shouldShow ? '?' : number}
            </div>
        );
    };

    const ROWS = 3;
    const NUMBERS_PER_ROW = Math.ceil(displayNumbers.length / ROWS);
    
    // Distribuir números en 3 filas
    const grid = Array(ROWS).fill().map((_, rowIndex) => {
        const startIndex = rowIndex * NUMBERS_PER_ROW;
        const endIndex = startIndex + NUMBERS_PER_ROW;
        return displayNumbers.slice(startIndex, endIndex);
    });

    const shouldCenter = displayNumbers.length <= 40;

    return (
        <div className={`grid grid-rows-4 gap-y-5 ${shouldCenter ? 'mx-auto' : ''}`}>
            {grid.map((row, rowIndex) => (
                <div key={rowIndex} className={`flex gap-3 ${shouldCenter ? 'justify-center' : 'min-w-max'}`}>
                    {row.map((number, colIndex) => (
                        <div 
                            key={`${number}-${colIndex}`} 
                            className="transition-all duration-300"
                        >
                            {renderNumber(number)}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default NumberGrid;