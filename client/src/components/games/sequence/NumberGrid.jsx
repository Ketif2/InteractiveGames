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
    timeInterval = 10, 
    isPaused = false
}) => {
    const [displayNumbers, setDisplayNumbers] = useState([...numbers]);
    const [isTemporarilyHidden, setIsTemporarilyHidden] = useState(false);
    
    // Actualizar números cuando cambian
    useEffect(() => {
        setDisplayNumbers([...numbers]);
    }, [numbers]);
    
    // Configurar efecto de desvanecimiento para el modo correspondiente
    useEffect(() => {
        if (gameMode !== 'desvanecimiento' || isPaused) return;
        
        const fadeTimer = setInterval(() => {
            setIsTemporarilyHidden(true);
            setTimeout(() => setIsTemporarilyHidden(false), 2000);
        }, timeInterval * 1000);
        
        return () => clearInterval(fadeTimer);
    }, [gameMode, timeInterval, isPaused]);

    // Dividir la cuadrícula en filas
    const ROWS = 3;
    const NUMBERS_PER_ROW = Math.ceil(displayNumbers.length / ROWS);
    const grid = Array(ROWS).fill().map((_, rowIndex) => {
        const startIndex = rowIndex * NUMBERS_PER_ROW;
        return displayNumbers.slice(startIndex, startIndex + NUMBERS_PER_ROW);
    });

    return (
        <div className="grid grid-rows-4 gap-y-5 mx-auto">
            {grid.map((row, rowIndex) => (
                <div key={rowIndex} className="flex gap-3 justify-center min-w-max">
                    {row.map((number, colIndex) => {
                        // Determinar estado del número
                        const isHidden = hiddenNumbers.includes(number);
                        const isCorrectlyAnswered = correctAnswers.some(idx => userAnswers[idx] === number);
                        const isCurrentHelp = number === currentHelpNumber && showHelp;
                        
                        // Determinar clases de Tailwind según el estado
                        let classes = `
                            w-28 h-28 flex items-center justify-center text-3xl font-bold
                            rounded-xl shadow-md transition-all duration-300
                        `;
                        
                        // Aplicar estilos según el estado
                        if (isHidden) {
                            if (isCorrectlyAnswered) {
                                // Número completado correctamente: fondo verde, texto negro
                                classes += ' bg-green-500 text-black';
                            } else if (isCurrentHelp) {
                                // Número mostrado como ayuda: fondo amarillo, texto negro, animación
                                classes += ' bg-yellow-500 text-white animate-bounce';
                            } else if (gameMode === 'memoria' && !showMemoryNumbers) {
                                // Modo memoria, número oculto: cuadro blanco con borde azul
                                classes += ' bg-white border-4 border-[#00398A] text-transparent';
                            } else if (gameMode === 'desvanecimiento' && isTemporarilyHidden) {
                                // Modo desvanecimiento, temporalmente oculto
                                classes += ' bg-white border-4 border-[#00398A] text-transparent';
                            } else {
                                // Número oculto normal: signo de interrogación
                                classes += ' bg-white border-4 border-[#00398A] text-black]';
                            }
                        } else {
                            classes += ' bg-[#00398A] text-white';
                            
                            if (gameMode === 'desvanecimiento' && isTemporarilyHidden) {
                                classes += ' opacity-0';
                            }
                        }
                        
                        return (
                            <div 
                                key={`${number}-${colIndex}`} 
                                className={classes}
                                aria-label={isHidden && !isCorrectlyAnswered && !isCurrentHelp ? 'Número oculto' : `Número ${number}`}
                            >
                                {isHidden && !isCorrectlyAnswered && !isCurrentHelp && !showMemoryNumbers ? '?' : number}
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

export default NumberGrid;