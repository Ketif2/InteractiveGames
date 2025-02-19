import React from 'react';

const NumberGrid = ({ numbers, hiddenNumbers, showHelp, showMemoryNumbers, gameMode }) => {
    const renderNumber = (number) => {
        const isHidden = hiddenNumbers.includes(number);
        const shouldShow = !isHidden || showHelp || showMemoryNumbers;

        return (
            <div
                className={`
                    w-20 h-20 flex items-center justify-center text-3xl font-bold
                    ${isHidden && !shouldShow
                        ? 'bg-white border-4 border-[#00398A] text-[#00398A]'
                        : 'bg-[#00398A] text-white'}
                    rounded-xl transition-all duration-300 shadow-md
                    ${gameMode === 'desvanecimiento' ? 'animate-pulse' : ''}
                    ${gameMode === 'memoria' && !showMemoryNumbers ? 'opacity-0' : 'opacity-100'}
                `}
            >
                {isHidden && !shouldShow ? '?' : number}
            </div>
        );
    };

    const ROWS = 3;
    const NUMBERS_PER_ROW = Math.ceil(numbers.length / ROWS);
    
     // Distribuir números en 3 filas
     const grid = Array(ROWS).fill().map((_, rowIndex) => {
        const startIndex = rowIndex * NUMBERS_PER_ROW;
        const endIndex = startIndex + NUMBERS_PER_ROW;
        return numbers.slice(startIndex, endIndex);
    });

    const shouldCenter = numbers.length <= 40;

    return (
        <div className={`grid grid-rows-4 gap-y-3 ${shouldCenter ? 'mx-auto' : ''}`}>
            {grid.map((row, rowIndex) => (
                <div key={rowIndex} className={`flex gap-3 ${shouldCenter ? 'justify-center' : 'min-w-max'}`}>
                    {row.map((number, colIndex) => (
                        <div key={`${rowIndex}-${colIndex}`}>
                            {renderNumber(number)}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default NumberGrid;