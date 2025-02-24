// src/components/games/memory/GameControls.jsx
import React from 'react';

const GameControls = ({ onHelp, onPause, onExit, isPaused, gameMode }) => {
    return (
        <div className="bg-[#00398A] shadow-md p-4 flex justify-between items-center">
            <div className="flex gap-4">
                <button
                    onClick={onHelp}
                    className="px-5 py-2 bg-blue-100 text-[#00398A] rounded-md 
                             border border-blue-200 hover:bg-blue-200 transition-colors 
                             flex items-center gap-2 font-medium"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                    {gameMode === 'memoria' ? 'Mostrar Objetos' : 'Ayuda'}
                </button>
                
                <button
                    onClick={onPause}
                    className="px-5 py-2 bg-yellow-100 text-yellow-700 rounded-md 
                             border border-yellow-200 hover:bg-yellow-200 transition-colors 
                             flex items-center gap-2 font-medium"
                >
                    {isPaused ? (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                            Continuar
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            Pausar
                        </>
                    )}
                </button>
            </div>

            <button
                onClick={onExit}
                className="px-5 py-2 bg-red-600 text-red-100 rounded-md 
                         border border-red-300 hover:bg-red-400 transition-colors 
                         flex items-center gap-2 font-medium"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                </svg>
                Salir
            </button>
        </div>
    );
};

export default GameControls;