// src/components/games/forest/ForestFeedback.jsx
import React from 'react';

const ForestFeedback = ({
    showCorrect,
    showWrong,
    showPause,
    showExit,
    showTimeout,
    showLevelComplete,
    showNextRound,
    showGameCompleted,
    showCompleted,
    currentRound,
    totalRounds,
    onResumeGame,
    onExitConfirm,
    onExitCancel,
    onGameComplete
}) => {
    return (
        <>
            {/* Correcto - Feedback pequeño */}
            {showCorrect && (
                <div className="fixed top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white py-2 px-6 rounded-full shadow-lg z-50 animate-fadeIn flex items-center">
                    <span className="text-xl mr-2">✓</span>
                    <span className="font-medium">¡Correcto!</span>
                </div>
            )}
            
            {/* Incorrecto - Feedback pequeño */}
            {showWrong && (
                <div className="fixed top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white py-2 px-6 rounded-full shadow-lg z-50 animate-fadeIn flex items-center">
                    <span className="text-xl mr-2">✗</span>
                    <span className="font-medium">Incorrecto</span>
                </div>
            )}
            
            {/* Bien Hecho - Feedback al completar todos los objetos */}
            {showCompleted && (
                <div className="fixed top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white py-3 px-8 rounded-full shadow-lg z-50 animate-fadeIn flex items-center">
                    <span className="text-2xl mr-3">🎯</span>
                    <span className="font-bold text-xl">¡Bien hecho!</span>
                    {console.log("Mostrando mensaje de '¡Bien hecho!'")}
                </div>
            )}
            
            {/* Pausa - Overlay completo */}
            {showPause && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg max-w-md text-center animate-fadeIn">
                        <div className="w-16 h-16 mx-auto bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                            <span className="text-yellow-500 text-3xl">⏸️</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Juego en Pausa</h3>
                        <p className="mb-6 text-gray-600">Toma el tiempo que necesites para descansar.</p>
                        <button 
                            onClick={onResumeGame}
                            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-md transition-colors"
                        >
                            Continuar Jugando
                        </button>
                    </div>
                </div>
            )}
            
            {/* Salir - Confirmación */}
            {showExit && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-md animate-fadeIn">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">¿Estás seguro que deseas salir?</h3>
                        <p className="mb-6 text-gray-600">Se perderá el progreso de esta sesión.</p>
                        <div className="flex justify-end space-x-4">
                            <button 
                                onClick={onExitCancel}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={onExitConfirm}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                            >
                                Salir
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Tiempo agotado */}
            {showTimeout && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
                    <div className="bg-white p-6 rounded-lg max-w-md text-center animate-fadeIn">
                        <div className="w-16 h-16 mx-auto bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                            <span className="text-yellow-500 text-3xl">⏱️</span>
                        </div>
                        <h3 className="text-xl font-bold text-yellow-700 mb-2">Ronda finalizada</h3>
                        <p className="mb-4">Muy bien, vamos a seguir jugando</p>
                    </div>
                </div>
            )}
            
            {/* Nivel completado */}
            {showLevelComplete && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
                    <div className="bg-white p-6 rounded-lg max-w-md text-center animate-fadeIn">
                        <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4 animate-pulse">
                            <span className="text-green-500 text-3xl">✓</span>
                        </div>
                        <h3 className="text-xl font-bold text-green-700 mb-2">¡Nivel completado!</h3>
                        <p className="mb-4">Avanzando al siguiente nivel...</p>
                    </div>
                </div>
            )}
            
            {/* Siguiente ronda */}
            {showNextRound && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
                    <div className="bg-white p-6 rounded-lg max-w-md text-center animate-fadeIn">
                        <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                            <span className="text-blue-500 text-3xl">🎮</span>
                        </div>
                        <h3 className="text-xl font-bold text-blue-700 mb-2">¡Ronda completada!</h3>
                        <p className="mb-4">Preparando la siguiente ronda...</p>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                            <div 
                                className="bg-blue-600 h-2.5 rounded-full" 
                                style={{ width: `${(currentRound / totalRounds) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Juego completado */}
            {showGameCompleted && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
                    <div className="bg-white p-8 rounded-lg max-w-md text-center animate-fadeIn">
                        <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4 animate-pulse">
                            <span className="text-green-500 text-5xl">🏆</span>
                        </div>
                        <h2 className="text-2xl font-bold text-green-700 mb-4">
                            ¡Felicidades!
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Has completado todas las rondas del juego.
                        </p>
                        <button
                            onClick={onGameComplete}
                            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-md transition-colors"
                        >
                            Ver Resultados
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ForestFeedback;