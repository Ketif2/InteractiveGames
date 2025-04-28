import React from 'react';
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import SortablePuzzlePiece from './SortablePuzzlePiece';

const PuzzleGrid = ({ gridSize, pieces, onDragEnd }) => {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    );

    return (
        <DndContext 
            sensors={sensors}
            onDragEnd={onDragEnd}
        >
            <SortableContext 
                items={pieces.map(piece => `piece-${piece.id}`)}
                strategy={rectSortingStrategy}
            >
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
                    {pieces.map((piece) => (
                        <SortablePuzzlePiece
                            key={piece.id}
                            piece={piece}
                            gridSize={gridSize}
                        />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
};

export default PuzzleGrid;