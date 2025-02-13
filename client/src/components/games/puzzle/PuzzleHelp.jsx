import React from 'react';

const PuzzleHelp = ({ originalImage, showHelp }) => {
    return (
        <div className="w-1/2 max-w-[600px] aspect-square bg-gray-200 rounded-lg overflow-hidden">
            <img
                src={originalImage}
                alt="Imagen original"
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                    showHelp ? 'opacity-100' : 'opacity-0'
                }`}
            />
        </div>
    );
};

export default PuzzleHelp;