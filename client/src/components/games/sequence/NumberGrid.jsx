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

    // Calculamos cuántas filas mostrar según la cantidad de números
    const rows = 3;
    const numbersPerRow = Math.ceil(displayNumbers.length / rows);
    
    const grid = Array(rows).fill().map((_, rowIndex) => {
        const startIndex = rowIndex * numbersPerRow;
        return displayNumbers.slice(startIndex, startIndex + numbersPerRow);
    });

    return (
        <div className="grid grid-rows-3 gap-y-2 sm:gap-y-3 md:gap-y-4 mx-auto">
            {grid.map((row, rowIndex) => (
                <div key={rowIndex} className="flex gap-2 sm:gap-3 justify-center">
                    {row.map((number, colIndex) => {
                        const isHidden = hiddenNumbers.includes(number);
                        const isCorrectlyAnswered = correctAnswers.some(idx => userAnswers[idx] === number);
                        const isCurrentHelp = number === currentHelpNumber && showHelp;
                        
                        // Clases base responsivas con Tailwind
                        let classes = `
                            w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 
                            flex items-center justify-center 
                            text-xl sm:text-2xl md:text-3xl font-bold
                            rounded-lg sm:rounded-xl shadow-md 
                            transition-all duration-300
                        `;
                        
                        if (isHidden) {
                            if (isCorrectlyAnswered) {
                                classes += ' bg-green-500 text-black';
                            } else if (isCurrentHelp) {
                                classes += ' bg-yellow-500 text-black animate-bounce';
                            } else if (gameMode === 'memoria' && !showMemoryNumbers) {
                                classes += ' bg-white border-2 sm:border-4 border-[#00398A] text-transparent';
                            } else if (gameMode === 'desvanecimiento' && isTemporarilyHidden) {
                                classes += ' bg-white border-2 sm:border-4 border-[#00398A] text-transparent';
                            } else {
                                classes += ' bg-white border-2 sm:border-4 border-[#00398A] text-[#00398A]';
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