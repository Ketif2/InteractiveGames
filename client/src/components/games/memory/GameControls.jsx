// src/components/games/memory/GameControls.jsx
import React from 'react';

const GameControls = ({ onHelp, onPause, onExit, isPaused, gameMode }) => {
    return (
        <div className="bg-white shadow-md p-4 flex justify-between items-center">
            <div className="flex gap-4">
                <button
                    onClick={onHelp}
                    className="px-4 py-2 bg-blue-100 text-[#00398A] rounded-lg 
                             hover:bg-blue-200 transition-colors flex items-center gap-2"
                >
                    <span className="material-icons">help_outline</span>
                    {gameMode === 'memoria' ? 'Mostrar Objetos' : 'Ayuda'}
                </button>
                
                <button
                    onClick={onPause}
                    className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg 
                             hover:bg-yellow-200 transition-colors flex items-center gap-2"
                >
                    <span className="material-icons">
                        {isPaused ? 'play_arrow' : 'pause'}
                    </span>
                    {isPaused ? 'Continuar' : 'Pausar'}
                </button>
            </div>

            <button
                onClick={onExit}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg 
                         hover:bg-red-200 transition-colors flex items-center gap-2"
            >
                <span className="material-icons">exit_to_app</span>
                Salir
            </button>
        </div>
    );
};

export default GameControls;