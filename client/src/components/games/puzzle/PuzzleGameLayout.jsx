import React from 'react';
import PuzzleHelp from './PuzzleHelp';
import PuzzleGrid from './PuzzleGrid';

const PuzzleGameLayout = ({ 
    screenOrientation, 
    showHelp, 
    initialPreview,
    currentPuzzle, 
    gridSize,
    onPieceClick,
    selectedPieceIndex
}) => {
    if (screenOrientation === 'landscape') {
        return (
            <div className="flex h-full justify-center items-center overflow-hidden">
                {/* Panel izquierdo - imagen original */}
                <div className={`h-full flex items-center justify-center transition-all duration-500 ${
                    showHelp || initialPreview ? 'w-[45%]' : 'w-0 opacity-0'
                }`}>
                    <div className="relative w-full h-full p-4 flex items-center justify-center">
                        <PuzzleHelp 
                            originalImage={currentPuzzle.imageUrl} 
                            showHelp={showHelp || initialPreview} 
                        />
                    </div>
                </div>

                {/* Rompecabezas */}
                <div className={`h-full flex items-center justify-center transition-all duration-500 ${
                    showHelp || initialPreview ? 'w-[55%]' : 'w-full'
                }`}>
                    <div className="flex justify-center items-center w-full h-full py-2 md:py-4">
                        <PuzzleGrid 
                            gridSize={gridSize}
                            pieces={currentPuzzle.pieces || []}
                            onPieceClick={onPieceClick}
                            selectedPieceIndex={selectedPieceIndex}
                        />
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div className="flex flex-col h-full">
                {/* Imagen original - Ahora encima para tabletas */}
                <div className={`w-full flex justify-center items-center transition-all duration-500 ${
                    showHelp || initialPreview ? 'opacity-100 h-[40%]' : 'opacity-0 h-0'
                }`}>
                    <div className="relative w-full h-full p-2 md:p-4 flex items-center justify-center">
                        <PuzzleHelp 
                            originalImage={currentPuzzle.imageUrl} 
                            showHelp={showHelp || initialPreview} 
                        />
                    </div>
                </div>
                
                {/* Rompecabezas - Ahora debajo para tabletas */}
                <div className={`w-full flex justify-center items-center transition-all duration-500 ${
                    showHelp || initialPreview ? 'h-[60%]' : 'h-full pb-8'
                }`}>
                    <div className="flex justify-center items-center w-full h-full">
                        <PuzzleGrid 
                            gridSize={gridSize}
                            pieces={currentPuzzle.pieces || []}
                            onPieceClick={onPieceClick}
                            selectedPieceIndex={selectedPieceIndex}
                        />
                    </div>
                </div>
            </div>
        );
    }
};

export default PuzzleGameLayout;