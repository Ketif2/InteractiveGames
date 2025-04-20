import React from 'react';

const DraggableWordItem = ({ 
    id, 
    name, 
    index, 
    isInDropZone, 
    isCorrectPosition, 
    onDragStart,
    isDisabled
}) => {
    const handleDragStart = (e) => {
        if (isDisabled) {
            e.preventDefault();
            return;
        }
        
        e.dataTransfer.setData('text/plain', JSON.stringify({ id, index, name }));
        onDragStart?.(index);
    };

    return (
        <div
            draggable={!isDisabled}
            onDragStart={handleDragStart}
            className={`
                flex items-center justify-center
                w-full h-12 px-3 rounded-md
                transition-all duration-200 text-base font-medium text-center
                ${isDisabled 
                    ? 'bg-gray-200 border-gray-300 cursor-not-allowed opacity-60' 
                    : isInDropZone 
                        ? isCorrectPosition 
                            ? 'bg-green-100 border-green-500 cursor-move shadow-md' 
                            : 'bg-white border-red-500 cursor-move shadow-md' 
                        : 'bg-white border-blue-500 cursor-move shadow-md hover:shadow-lg'}
                border-2
            `}
        >
            {name}
        </div>
    );
};

export default DraggableWordItem;