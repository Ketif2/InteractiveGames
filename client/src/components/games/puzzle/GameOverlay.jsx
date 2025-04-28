import React from 'react';
import { AlertTriangle } from 'lucide-react';

const GameOverlay = ({ 
    isPaused, 
    showExitConfirm, 
    onResume, 
    onConfirmExit, 
    onCancelExit 
}) => {
    if (!isPaused && !showExitConfirm) return null;
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
            {isPaused && (
                <div className="bg-white p-8 rounded-lg text-center shadow-xl animate-scaleIn">
                    <h2 className="text-2xl font-bold text-[#00398A] mb-4">Juego Pausado</h2>
                    <button
                        onClick={onResume}
                        className="bg-[#00398A] text-white px-6 py-3 rounded-lg text-lg hover:bg-[#002d6f] transition-colors"
                    >
                        Reanudar
                    </button>
                </div>
            )}

            {showExitConfirm && (
                <div className="bg-white p-8 rounded-lg text-center max-w-md shadow-xl animate-scaleIn">
                    <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-800 mb-4">
                        ¿Seguro que quieres terminar el juego?
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Todo el progreso actual se guardará y se mostrará en la página de resultados.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={onCancelExit}
                            className="bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={onConfirmExit}
                            className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition-colors"
                        >
                            Finalizar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GameOverlay;