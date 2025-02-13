// src/components/games/puzzle/PuzzleBoard.jsx
import React from 'react';
import PuzzleHelp from './PuzzleHelp';
import PuzzleGrid from './PuzzleGrid';

const PuzzleBoard = ({ originalImage, showHelp, gridSize, pieces, onDragEnd }) => {
    return (
        <div className="absolute inset-0 mt-16 p-4">
            <div className="flex justify-center items-start gap-8 h-full">
                <PuzzleHelp originalImage={originalImage} showHelp={showHelp} />
                <PuzzleGrid 
                    gridSize={gridSize}
                    pieces={pieces}
                    onDragEnd={onDragEnd}
                />
            </div>
        </div>
    );
};

export default PuzzleBoard;