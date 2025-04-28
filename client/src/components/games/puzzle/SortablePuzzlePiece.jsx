import React from 'react';

const SortablePuzzlePiece = ({ piece, index, gridSize, isSelected, onClick }) => {
    return (
        <div
            onClick={() => onClick(index)}
            className={`
                relative rounded-lg 
                ${isSelected 
                    ? 'border-4 border-blue-800 shadow-lg z-30 cursor-pointer' 
                    : piece.isFixed 
                        ? 'border-4 border-green-500 cursor-not-allowed' 
                        : 'border-2 border-gray-300 hover:border-blue-700 hover:shadow-md cursor-pointer'
                }
                transition-all duration-100 ease-in-out
            `}
            style={{
                aspectRatio: '1',
                backgroundImage: `url(${piece.imageUrl})`,
                backgroundSize: `${gridSize * 100}%`,
                backgroundPosition: `${(piece.correctPosition % gridSize) * (100 / (gridSize - 1))}% ${Math.floor(piece.correctPosition / gridSize) * (100 / (gridSize - 1))}%`,
            }}
            aria-label={`Pieza de rompecabezas ${index + 1}${piece.isFixed ? ', fijada' : ''}${isSelected ? ', seleccionada' : ''}`}
            role="button"
        >
            {/* Indicador visual de selección - Ahora encima de la pieza */}
            {isSelected && (
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-white px-1 py-1 rounded-full text-lg font-bold text-blue-800 shadow-md border-2 border-blue-800">
                    Seleccionada
                </div>
            )}
            
            {/* Indicador visual de pieza fijada correctamente */}
            {piece.isFixed && (
                <div className="absolute bottom-2 right-2 bg-green-500 rounded-full w-6 h-6 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                </div>
            )}
        </div>
    );
};

export default SortablePuzzlePiece;