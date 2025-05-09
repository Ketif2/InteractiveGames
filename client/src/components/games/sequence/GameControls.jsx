import React from 'react';

const GameControls = ({ onHelp, onPause, onExit, isPaused, gameMode, helpDisabled }) => (
    <div className="absolute top-0 left-0 right-0 bg-[#00398A] text-white p-4 flex justify-between items-center">
        <div className="text-xl">Secuencia numérica</div>
        <div className="flex gap-4">
            <button
                onClick={onHelp}
                className="bg-[#00A8E3] px-6 py-3 rounded-lg hover:bg-[#0096cc] text-black transition-colors text-lg font-medium min-w-[140px]"
                aria-label={gameMode === 'memoria' ? 'Mostrar números temporalmente' : 'Ver ayuda con un número'}
                disabled={helpDisabled}
            >
                {gameMode === 'memoria' ? 'Mostrar Números' : 'Ver Ayuda'}
            </button>
            <button
                onClick={onPause}
                className="bg-[#00A8E3] px-6 py-3 rounded-lg hover:bg-[#0096cc] text-black transition-colors text-lg font-medium min-w-[140px]"
                aria-label={isPaused ? 'Reanudar juego' : 'Pausar juego'}
            >
                {isPaused ? 'Reanudar' : 'Pausar'}
            </button>
            <button
                onClick={onExit}
                className="bg-red-500 px-6 py-3 rounded-lg hover:bg-red-600 text-black transition-colors text-lg font-medium min-w-[140px]"
                aria-label="Terminar juego"
            >
                Terminar
            </button>
        </div>
    </div>
);

export default GameControls;