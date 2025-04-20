import React, { useState } from 'react';

const DroppableContainer = ({ items, showNames, onReorder, isPaused }) => {
    const [draggedItem, setDraggedItem] = useState(null);
    
    const handleDragStart = (e, index) => {
        if (isPaused) return;
        
        setDraggedItem(index);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', index);
        
        if (e.target.style) {
            setTimeout(() => {
                e.target.style.opacity = '0.5';
            }, 0);
        }
    };
    
    const handleDragOver = (e, index) => {
        e.preventDefault();
        
        if (draggedItem === null || draggedItem === index) return;
        
        onReorder(draggedItem, index);
        setDraggedItem(index);
    };
    
    const handleDragEnd = (e) => {
        setDraggedItem(null);
        
        if (e.target.style) {
            e.target.style.opacity = '1';
        }
    };
    
    return (
        <div className="flex flex-wrap justify-center gap-4">
            {items.map((item, index) => (
                <div
                    key={item.id}
                    draggable={!isPaused}
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`
                        flex flex-col items-center justify-center
                        w-24 h-24 m-2 rounded-lg 
                        cursor-move transition-all duration-200
                        bg-white border-2 border-blue-500
                        shadow-lg hover:shadow-xl
                        ${isPaused ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                >
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl">
                        {index + 1}
                    </div>
                    {showNames && (
                        <span className="mt-2 text-xs text-center font-medium text-gray-700 truncate w-full px-1">
                            {item.name}
                        </span>
                    )}
                </div>
            ))}
        </div>
    );
};

export default DroppableContainer;