import React from 'react';
import SortablePuzzlePiece from './SortablePuzzlePiece';

const PuzzleGrid = ({ gridSize, pieces = [], onPieceClick, selectedPieceIndex }) => {
    return (
        <div
            className="grid gap-1 mx-auto"
            style={{
                gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                width: 'min(85vmin, 95%)',    
                height: 'min(85vmin, 95%)',   
                aspectRatio: '1',
                maxWidth: '85vmin',           
                maxHeight: '85vmin',          
                margin: '0 auto'              
            }}
            role="group"
            aria-label="Rompecabezas interactivo"
        >
            {pieces.map((piece, index) => (
                <SortablePuzzlePiece
                    key={piece.id}
                    piece={piece}
                    index={index}
                    gridSize={gridSize}
                    isSelected={selectedPieceIndex === index}
                    onClick={onPieceClick}
                />
            ))}
        </div>
    );
};

export default PuzzleGrid;