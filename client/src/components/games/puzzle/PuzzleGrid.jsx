import React from 'react';
import SortablePuzzlePiece from './SortablePuzzlePiece';

const PuzzleGrid = ({ gridSize, pieces = [], onPieceClick, selectedPieceIndex }) => {
    return (
        <div
            className="grid gap-1 mx-auto"
            style={{
                gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                width: 'min(90vh, 90%)',
                height: 'min(90vh, 90%)',
                aspectRatio: '1',
                maxWidth: '85vh',
                maxHeight: '85vh'
            }}
            role="grid"
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