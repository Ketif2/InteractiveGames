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
            <div className="flex h-full justify-center items-center">
                {/* Panel izquierdo - imagen original */}
                <div className={`h-full flex items-center justify-center transition-all duration-500 ${
                    showHelp || initialPreview ? 'w-[40%]' : 'w-0 opacity-0'
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
                    showHelp || initialPreview ? 'w-[60%]' : 'w-full'
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
    } else {
        return (
            <div className="flex flex-col h-full">
                {/* Rompecabezas */}
                <div className={`w-full flex justify-center items-center transition-all duration-500 ${
                    showHelp || initialPreview ? 'h-2/3' : 'h-full'
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
                
                {/* Imagen original */}
                <div className={`w-full flex justify-center items-center transition-all duration-500 ${
                    showHelp || initialPreview ? 'opacity-100 h-1/3' : 'opacity-0 h-0'
                }`}>
                    <div className="relative w-full h-full p-4 flex items-center justify-center">
                        <PuzzleHelp 
                            originalImage={currentPuzzle.imageUrl} 
                            showHelp={showHelp || initialPreview} 
                        />
                    </div>
                </div>
            </div>
        );
    }
};

export default PuzzleGameLayout;