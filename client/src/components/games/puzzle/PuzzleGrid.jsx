import React from 'react';
import SortablePuzzlePiece from './SortablePuzzlePiece';

const PuzzleGrid = ({ gridSize, pieces = [], onPieceClick, selectedPieceIndex }) => {
    return (
        <div
            className="grid gap-1 mx-auto"
            style={{
                gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                width: 'min(85vmin, 95%)',    // Ligeramente reducido para evitar desbordamiento
                height: 'min(85vmin, 95%)',   // Usar vmin para mejor adaptación
                aspectRatio: '1',
                maxWidth: '85vmin',           // Limitado para evitar cortes
                maxHeight: '85vmin',          // Asegura que se ajuste completamente
                margin: '0 auto'              // Centrado horizontal
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