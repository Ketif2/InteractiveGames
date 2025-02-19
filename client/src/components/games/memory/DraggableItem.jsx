import React from 'react';

const DraggableItem = ({ id, name, index, showName, isCorrect, onDragStart }) => {
    const handleDragStart = (e) => {
        e.dataTransfer.setData('text/plain', JSON.stringify({ id, index }));
        onDragStart?.(index);
    };

    return (
        <div
            draggable
            onDragStart={handleDragStart}
            className={`
                flex flex-col items-center justify-center
                w-24 h-24 m-2 rounded-lg 
                cursor-move transition-all duration-200
                ${isCorrect ? 'bg-green-100' : 'bg-white'}
                border-2 ${isCorrect ? 'border-green-500' : 'border-blue-500'}
                shadow-lg hover:shadow-xl
            `}
        >
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl">
                {index + 1}
            </div>
            {showName && (
                <span className="mt-2 text-sm text-center font-medium text-gray-700">
                    {name}
                </span>
            )}
        </div>
    );
};

export default DraggableItem;