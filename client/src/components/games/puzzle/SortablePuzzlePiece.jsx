// src/components/games/puzzle/SortablePuzzlePiece.jsx
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortablePuzzlePiece = ({ piece, index, gridSize }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ 
        id: `piece-${piece.id}`,
        disabled: piece.isFixed,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition: transition || 'all 0.5s ease', // Transición más lenta y suave
        aspectRatio: '1',
        backgroundImage: `url(${piece.imageUrl})`,
        backgroundSize: `${gridSize * 100}%`,
        backgroundPosition: `${(piece.correctPosition % gridSize) * (100 / (gridSize - 1))}% ${Math.floor(piece.correctPosition / gridSize) * (100 / (gridSize - 1))}%`,
        touchAction: 'none',
        gridColumn: (piece.currentPosition % gridSize) + 1,
        gridRow: Math.floor(piece.currentPosition / gridSize) + 1,
    };

    return (
        <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            style={style}
            className={`
                relative rounded-lg 
                ${isDragging ? 'z-50 shadow-xl opacity-80' : 'z-10'}
                ${piece.isFixed 
                    ? 'border-4 border-green-500 cursor-not-allowed' 
                    : 'border border-gray-300 hover:border-blue-500 cursor-grab active:cursor-grabbing'
                }
                transition-all duration-500 ease-in-out
            `}
            data-fixed={piece.isFixed}
            data-index={index}
        />
    );
};

export default SortablePuzzlePiece;