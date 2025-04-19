import React from 'react';
import { Draggable } from '@hello-pangea/dnd';

const PuzzlePiece = ({ piece, index, gridSize }) => {
    return (
        <Draggable
            draggableId={piece.id}
            index={index}
            isDragDisabled={piece.isFixed}
        >
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`relative bg-white rounded-lg shadow transition-all duration-300 ${
                        piece.isFixed ? 'border-4 border-green-500' :
                        'border border-gray-300 hover:border-blue-500'
                    } ${snapshot.isDragging ? 'z-50 shadow-xl' : ''}`}
                    style={{
                        aspectRatio: '1',
                        backgroundImage: `url(${piece.imageUrl})`,
                        backgroundSize: `${gridSize * 100}%`,
                        backgroundPosition: `${(piece.correctPosition % gridSize) * (100 / (gridSize - 1))}% ${Math.floor(piece.correctPosition / gridSize) * (100 / (gridSize - 1))}%`,
                        ...provided.draggableProps.style
                    }}
                />
            )}
        </Draggable>
    );
};

export default PuzzlePiece;