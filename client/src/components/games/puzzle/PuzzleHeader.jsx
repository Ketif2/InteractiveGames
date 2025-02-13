import React from 'react';

const PuzzleHeader = ({ currentPuzzle, puzzleCount, onShowHelp, onTogglePause, onFinish, isPaused }) => {
    return (
        <div className="absolute top-0 left-0 right-0 bg-[#00398A] text-white p-4 flex justify-between items-center">
            <div>Puzzle {currentPuzzle + 1} de {puzzleCount}</div>
            <div className="flex gap-4">
                <button
                    onClick={onShowHelp}
                    className="bg-[#00A8E3] px-4 py-2 rounded hover:bg-[#0096cc] transition-colors"
                >
                    Ver Imagen
                </button>
                <button
                    onClick={onTogglePause}
                    className="bg-[#00A8E3] px-4 py-2 rounded hover:bg-[#0096cc] transition-colors"
                >
                    {isPaused ? 'Reanudar' : 'Pausar'}
                </button>
                <button
                    onClick={onFinish}
                    className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition-colors"
                >
                    Terminar
                </button>
            </div>
        </div>
    );
};

export default PuzzleHeader;