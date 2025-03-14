import React, { useState, useEffect } from 'react';

const NumberGrid = ({ 
    numbers, 
    hiddenNumbers, 
    showHelp, 
    showMemoryNumbers, 
    gameMode,
    correctAnswers = [],
    userAnswers = {},
    currentHelpNumber = null
}) => {
    // Estado para mantener los números actuales que se muestran
    const [displayNumbers, setDisplayNumbers] = useState([...numbers]);
    
    // Estado para controlar la animación de ayuda
    const [animatingHelp, setAnimatingHelp] = useState(false);
    
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

        // Determinar las clases CSS para diferentes estados
        let bgColorClass = 'bg-[#00398A] text-white';
        let animationClass = '';

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

        if (gameMode === 'desvanecimiento') {
            animationClass = 'animate-pulse';
        }

        if (gameMode === 'memoria' && !showMemoryNumbers && !isCurrentHelp && !isCorrectlyAnswered) {
            animationClass += ' opacity-0';
        } else {
            animationClass += ' opacity-100';
        }

        return (
            <div
                className={`
                    w-28 h-28 flex items-center justify-center text-3xl font-bold
                    ${bgColorClass}
                    rounded-xl transition-all duration-300 shadow-md
                    ${animationClass}
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