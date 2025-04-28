import React from 'react';

const PuzzleHelp = ({ originalImage, showHelp }) => {
    return (
        <div className={`relative w-full h-full bg-gray-200 rounded-lg overflow-hidden transition-all duration-500 ease-in-out ${
            showHelp ? 'opacity-100' : 'opacity-0'
        }`}>
            <img
                src={originalImage}
                alt="Imagen original de referencia"
                className="w-full h-full object-contain"
                aria-hidden={!showHelp}
            />
            {showHelp && (
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-center py-2 px-1 text-sm">
                    Esta imagen desaparecerá automáticamente en 10 segundos
                </div>
            )}
        </div>
    );
};

export default PuzzleHelp;