import React from 'react';

const GameControls = ({ 
    currentIndex, 
    totalPuzzles, 
    onHelp, 
    onPause, 
    onExit,
    isPaused 
}) => {
    return (
        <div className="absolute top-0 left-0 right-0 bg-[#00398A] text-white py-3 px-4 flex justify-between items-center shadow-md">
            <div className="text-lg font-medium">
                Puzzle {currentIndex + 1} de {totalPuzzles}
            </div>
            <div className="flex gap-2 md:gap-3">
                <button
                    onClick={onHelp}
                    className="bg-[#00A8E3] px-3 md:px-5 py-2 rounded-lg text-black font-medium shadow hover:bg-[#0096cc] transition-colors text-base md:text-lg flex items-center justify-center min-w-[100px]"
                    aria-label="Ver imagen original"
                >
                    Ver Imagen
                </button>
                <button
                    onClick={onPause}
                    className="bg-[#00A8E3] px-3 md:px-5 py-2 rounded-lg text-black font-medium shadow hover:bg-[#0096cc] transition-colors text-base md:text-lg flex items-center justify-center min-w-[100px]"
                    aria-label={isPaused ? "Reanudar juego" : "Pausar juego"}
                >
                    {isPaused ? 'Reanudar' : 'Pausar'}
                </button>
                <button
                    onClick={onExit}
                    className="bg-red-500 px-3 md:px-5 py-2 rounded-lg text-black font-medium shadow hover:bg-red-600 transition-colors text-base md:text-lg flex items-center justify-center min-w-[100px]"
                    aria-label="Terminar juego"
                >
                    Terminar
                </button>
            </div>
        </div>
    );
};

export default GameControls;