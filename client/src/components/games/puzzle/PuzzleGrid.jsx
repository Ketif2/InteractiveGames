import React from 'react';
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { SortablePuzzlePiece } from './SortablePuzzlePiece';

const PuzzleGrid = ({ gridSize, pieces = [], onPieceMoved }) => {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;
        
        if (!over || active.id === over.id) return;

        const oldIndex = pieces.findIndex(piece => piece.id === active.id);
        const newIndex = pieces.findIndex(piece => piece.id === over.id);

        onPieceMoved({
            source: { index: oldIndex },
            destination: { index: newIndex }
        });
    };

    return (
        <DndContext 
            sensors={sensors}
            onDragEnd={handleDragEnd}
        >
            <SortableContext 
                items={pieces.map(piece => piece.id)}
                strategy={rectSortingStrategy}
            >
                <div
                    className="grid gap-1"
                    style={{
                        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                        width: '600px',
                        height: '600px'
                    }}
                >
                    {pieces.map((piece, index) => (
                        <SortablePuzzlePiece
                            key={piece.id}
                            piece={piece}
                            index={index}
                            gridSize={gridSize}
                        />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
};

export default PuzzleGrid;