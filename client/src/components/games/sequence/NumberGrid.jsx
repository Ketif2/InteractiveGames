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
    const COLS = Math.ceil(numbers.length / ROWS);
    const grid = Array(ROWS).fill().map((_, rowIndex) => {
        const startIndex = rowIndex;
        const rowNumbers = [];
        for (let i = 0; i < COLS; i++) {
            const index = i * ROWS + startIndex;
            if (index < numbers.length) {
                rowNumbers.push(numbers[index]);
            }
        }
        return rowNumbers;
    });

    return (
        <div className="inline-block pt-8">
            <div className="grid grid-rows-4 gap-4">
                {grid.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex gap-4">
                        {row.map((number, colIndex) => (
                            <div key={`${rowIndex}-${colIndex}`}>
                                {renderNumber(number)}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NumberGrid;