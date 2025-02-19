// src/components/games/memory/FeedbackOverlay.jsx
import React from 'react';

const FeedbackOverlay = ({
    showCorrect,
    showWrong,
    showPause,
    showExit,
    showCompleted,
    onPauseResume,
    onExitConfirm,
    onExitCancel,
    onGameComplete
}) => {
    if (showCorrect) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-8 rounded-lg shadow-xl text-center">
                    <span className="material-icons text-6xl text-green-500 mb-4">
                        check_circle
                    </span>
                    <h2 className="text-2xl font-bold text-green-700 mb-4">
                        ¡Correcto!
                    </h2>
                    <p className="text-gray-600 mb-4">
                        Has ordenado correctamente todos los objetos.
                    </p>
                    {showCompleted && (
                        <button
                            onClick={onGameComplete}
                            className="px-6 py-2 bg-green-500 text-white rounded-lg 
                                     hover:bg-green-600 transition-colors"
                        >
                            Continuar
                        </button>
                    )}
                </div>
            </div>
        );
    }

    if (showWrong) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-8 rounded-lg shadow-xl text-center">
                    <span className="material-icons text-6xl text-red-500 mb-4">
                        error
                    </span>
                    <h2 className="text-2xl font-bold text-red-700 mb-4">
                        ¡Incorrecto!
                    </h2>
                    <p className="text-gray-600">
                        El orden no es correcto. Inténtalo de nuevo.
                    </p>
                </div>
            </div>
        );
    }

    if (showPause) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-8 rounded-lg shadow-xl text-center">
                    <span className="material-icons text-6xl text-yellow-500 mb-4">
                        pause_circle
                    </span>
                    <h2 className="text-2xl font-bold text-yellow-700 mb-4">
                        Juego Pausado
                    </h2>
                    <button
                        onClick={onPauseResume}
                        className="px-6 py-2 bg-yellow-500 text-white rounded-lg 
                                 hover:bg-yellow-600 transition-colors"
                    >
                        Continuar
                    </button>
                </div>
            </div>
        );
    }

    if (showExit) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-8 rounded-lg shadow-xl">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        ¿Deseas terminar el juego?
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Tu progreso será guardado.
                    </p>
                    <div className="flex justify-end gap-4">
                        <button
                            onClick={onExitCancel}
                            className="px-6 py-2 bg-gray-100 text-gray-800 rounded-lg 
                                     hover:bg-gray-200 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={onExitConfirm}
                            className="px-6 py-2 bg-red-500 text-white rounded-lg 
                                     hover:bg-red-600 transition-colors"
                        >
                            Terminar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

export default FeedbackOverlay;