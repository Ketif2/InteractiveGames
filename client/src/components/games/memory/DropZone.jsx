// src/components/games/memory/DropZone.jsx
import React from 'react';

const DropZone = ({ index, item, onDrop, onRemove, isEmpty, isCorrect }) => {
    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        try {
            const data = JSON.parse(e.dataTransfer.getData('text/plain'));
            onDrop(data.index, index);
        } catch (err) {
            console.error("Error en drop:", err);
        }
    };
    
    const handleClick = () => {
        if (!isEmpty) {
            onRemove();
        }
    };

    return (
        <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={handleClick}
            className={`
                flex items-center justify-center
                w-full h-12 px-3 rounded-md 
                transition-all duration-200
                ${isEmpty 
                    ? 'bg-gray-100 border-dashed border-2 border-gray-300 cursor-default' 
                    : isCorrect 
                        ? 'bg-green-100 border-2 border-green-500 cursor-pointer' 
                        : 'bg-white border-2 border-blue-500 cursor-pointer hover:bg-gray-50'}
                shadow-sm
            `}
        >
            {!isEmpty && (
                <div className="flex justify-between items-center w-full">
                    <span className="text-base font-medium">{item?.name}</span>
                    <span className="text-xs text-gray-500 ml-1">×</span>
                </div>
            )}
            
            {isEmpty && (
                <span className="text-gray-400 text-xs">Arrastra aquí</span>
            )}
        </div>
    );
};

export default DropZone;