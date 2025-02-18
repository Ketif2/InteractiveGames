import React from 'react';

const NumberGrid = ({ numbers, hiddenNumbers, showHelp, showMemoryNumbers, gameMode }) => {
    const renderNumber = (number) => {
        const isHidden = hiddenNumbers.includes(number);
        const shouldShow = !isHidden || showHelp || showMemoryNumbers;

        return (
            <div
                className={`
                    w-24 h-24 flex items-center justify-center text-3xl font-bold
                    ${isHidden && !shouldShow
                        ? 'bg-white border-4 border-[#00398A] text-[#00398A]'
                        : 'bg-[#00398A] text-white'}
                    rounded-lg transition-all duration-300 shadow-md
                    ${gameMode === 'desvanecimiento' ? 'animate-pulse' : ''}
                    ${gameMode === 'memoria' && !showMemoryNumbers ? 'opacity-0' : 'opacity-100'}
                `}
            >
                {isHidden && !shouldShow ? '?' : number}
            </div>
        );
    };

    // Calcular el número de columnas basado en 4 filas fijas
    const FIXED_ROWS = 4;
    const calculateGridLayout = () => {
        const columnsPerPage = Math.ceil(numbers.length / FIXED_ROWS);
        // Reorganizar números en páginas de 4 filas
        const pages = [];
        let currentPage = [];
        
        for (let i = 0; i < numbers.length; i++) {
            const rowIndex = i % FIXED_ROWS;
            const pageIndex = Math.floor(i / (FIXED_ROWS * columnsPerPage));
            
            if (!pages[pageIndex]) {
                pages[pageIndex] = Array(FIXED_ROWS).fill().map(() => []);
            }
            
            pages[pageIndex][rowIndex].push(numbers[i]);
        }
        
        return pages;
    };

    const pages = calculateGridLayout();

    return (
        <div className="flex space-x-8">
            {pages.map((page, pageIndex) => (
                <div key={pageIndex} className="min-w-min">
                    <div className="grid gap-4">
                        {page.map((row, rowIndex) => (
                            <div key={`${pageIndex}-${rowIndex}`} className="flex gap-4">
                                {row.map((number, colIndex) => (
                                    <div key={`${pageIndex}-${rowIndex}-${colIndex}`}>
                                        {renderNumber(number)}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default NumberGrid;
