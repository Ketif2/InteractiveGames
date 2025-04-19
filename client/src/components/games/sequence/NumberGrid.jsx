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
    const [animatingHelp, setAnimatingHelp] = useState(false);
    const [isTemporarilyHidden, setIsTemporarilyHidden] = useState(false);
    useEffect(() => {
        setDisplayNumbers([...numbers]);
    }, [numbers]);
    useEffect(() => {
        if (showHelp && currentHelpNumber) {
            setAnimatingHelp(true);
            const timer = setTimeout(() => {
                setAnimatingHelp(false);
            }, 2000);
            
            return () => clearTimeout(timer);
        } else {
            setAnimatingHelp(false);
        }
    }, [showHelp, currentHelpNumber]);
    
    useEffect(() => {
        let fadeTimer;
        let fadeRestoreTimer;
        
        if (gameMode === 'desvanecimiento' && !isPaused) {
            fadeTimer = setInterval(() => {
                setIsTemporarilyHidden(true);
                fadeRestoreTimer = setTimeout(() => {
                    setIsTemporarilyHidden(false);
                }, 2000);
            }, timeInterval * 1000); 
        } else {
            setIsTemporarilyHidden(false);
        }
        
        return () => {
            if (fadeTimer) clearInterval(fadeTimer);
            if (fadeRestoreTimer) clearTimeout(fadeRestoreTimer);
        };
    }, [gameMode, timeInterval, isPaused]);

    const renderNumber = (number) => {
        const isHidden = hiddenNumbers.includes(number);
        
        const isCorrectlyAnswered = correctAnswers.some(idx => {
            return userAnswers[idx] === number;
        });
        
        const isCurrentHelp = number === currentHelpNumber && showHelp;
        const shouldShow = !isHidden || showMemoryNumbers || isCorrectlyAnswered || isCurrentHelp;
        const shouldFade = gameMode === 'desvanecimiento' && 
                           isTemporarilyHidden && 
                           !isCorrectlyAnswered && 
                           !isCurrentHelp;

        let bgColorClass = 'bg-[#00398A] text-white';
        let animationClass = '';
        let opacityClass = shouldFade ? 'opacity-0' : 'opacity-100';

        if (isHidden && !shouldShow) {
            bgColorClass = 'bg-white border-4 border-[#00398A] text-[#00398A]';
        } else if (isCorrectlyAnswered) {
            bgColorClass = 'bg-green-500 text-white';
        } else if (isCurrentHelp) {
            bgColorClass = 'bg-green-500 text-white';
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