import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortablePuzzlePiece = ({ piece, gridSize }) => {
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
        transition: transition || 'transform 0.3s ease, border 0.2s ease',
        aspectRatio: '1',
        backgroundImage: `url(${piece.imageUrl})`,
        backgroundSize: `${gridSize * 100}%`,
        backgroundPosition: `${(piece.correctPosition % gridSize) * (100 / (gridSize - 1))}% ${Math.floor(piece.correctPosition / gridSize) * (100 / (gridSize - 1))}%`,
        touchAction: 'none',
    };

    return (
        <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            style={style}
            className={`
                relative rounded-lg shadow 
                ${isDragging ? 'z-50 shadow-xl opacity-80 scale-105' : 'z-10'}
                ${piece.isFixed 
                    ? 'border-4 border-green-500 cursor-not-allowed' 
                    : 'border border-gray-300 hover:border-blue-500 hover:shadow-md cursor-grab active:cursor-grabbing'
                }
                transition-all duration-300 ease-in-out
            `}
            aria-label={`Pieza de rompecabezas ${piece.id + 1}`}
            aria-grabbed={isDragging}
            data-fixed={piece.isFixed}
        />
    );
};

export default SortablePuzzlePiece;