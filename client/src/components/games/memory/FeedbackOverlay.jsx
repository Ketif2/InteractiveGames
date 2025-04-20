import React, { useEffect, useState } from 'react';

const FeedbackOverlay = ({
    showCorrect,
    showWrong,
    showPause,
    showExit,
    showCompleted,
    onPauseResume,
    onExitConfirm,
    onExitCancel,
    onGameComplete,
    currentRound,
    totalRounds
}) => {
    const [animation, setAnimation] = useState('');
    
    useEffect(() => {
        if (showCorrect || showWrong || showPause || showExit) {
            setAnimation('animate-fadeIn');
        } else {
            setAnimation('animate-fadeOut');
        }
    }, [showCorrect, showWrong, showPause, showExit]);

    if (showCorrect) {
        return (
            <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-auto">
                <div className={`bg-white p-8 rounded-lg shadow-xl text-center max-w-md w-full mx-4 ${animation}`}>
                    <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <span className="text-green-500 text-5xl">✓</span>
                    </div>
                    <h2 className="text-2xl font-bold text-green-700 mb-4">
                        ¡Completado!
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Has finalizado correctamente todas las rondas.
                    </p>
                    <div className="flex justify-center space-x-2 mb-4">
                        <span className="text-yellow-400 text-3xl">★</span>
                        <span className="text-yellow-400 text-3xl">★</span>
                        <span className="text-yellow-400 text-3xl">★</span>
                    </div>
                    {showCompleted && (
                        <button
                            onClick={onGameComplete}
                            className="w-full px-6 py-3 bg-green-500 text-white rounded-lg 
                                     hover:bg-green-600 transition-colors font-medium"
                        >
                            Ver Resultados
                        </button>
                    )}
                </div>
            </div>
        );
    }

    if (showWrong) {
        return (
            <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-auto">
                <div className={`bg-white p-8 rounded-lg shadow-xl text-center max-w-md w-full mx-4 ${animation}`}>
                    <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <span className="text-red-500 text-5xl">✗</span>
                    </div>
                    <h2 className="text-2xl font-bold text-red-700 mb-4">
                        ¡Incorrecto!
                    </h2>
                    <p className="text-gray-600 mb-6">
                        El orden no es correcto. Inténtalo de nuevo.
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                        <div className="bg-red-600 h-2.5 rounded-full w-1/3"></div>
                    </div>
                    <button
                        onClick={() => {}} // Cierra automáticamente después de un tiempo
                        className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg 
                                 hover:bg-blue-600 transition-colors font-medium"
                    >
                        Volver a intentar
                    </button>
                </div>
            </div>
        );
    }

    if (showPause) {
        return (
            <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-auto bg-black bg-opacity-30">
                <div className={`bg-white p-8 rounded-lg shadow-xl text-center max-w-md w-full mx-4 ${animation}`}>
                    <div className="w-20 h-20 mx-auto bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                        <span className="text-yellow-500 text-5xl">❙ ❙</span>
                    </div>
                    <h2 className="text-2xl font-bold text-yellow-700 mb-6">
                        Juego Pausado
                    </h2>
                    <button
                        onClick={onPauseResume}
                        className="w-full px-6 py-3 bg-yellow-500 text-white rounded-lg 
                                 hover:bg-yellow-600 transition-colors font-medium"
                    >
                        Continuar
                    </button>
                </div>
            </div>
        );
    }

    if (showExit) {
        return (
            <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-auto bg-black bg-opacity-30">
                <div className={`bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4 ${animation}`}>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        ¿Deseas terminar el juego?
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Tu progreso y estadísticas serán guardados.
                    </p>
                    <div className="flex justify-end gap-4">
                        <button
                            onClick={onExitCancel}
                            className="px-6 py-3 bg-gray-100 text-gray-800 rounded-lg 
                                     hover:bg-gray-200 transition-colors flex-1"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={onExitConfirm}
                            className="px-6 py-3 bg-red-500 text-white rounded-lg 
                                     hover:bg-red-600 transition-colors flex-1"
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