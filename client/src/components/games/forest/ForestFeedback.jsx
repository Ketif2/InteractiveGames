import React, { useState, useEffect } from 'react';

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
    onGameComplete,
    stats
}) => {
    const [windowDimensions, setWindowDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });
    const [showConfetti, setShowConfetti] = useState(true);

    useEffect(() => {
        const handleResize = () => {
            setWindowDimensions({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        window.addEventListener('resize', handleResize);
        
        if (showGameCompleted) {
            const timer = setTimeout(() => {
                setShowConfetti(false);
            }, 8000);
            return () => clearTimeout(timer);
        }
        
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [showGameCompleted]);

    const calculateStars = () => {
        if (!stats) return 3;
        
        const { successMoves, failedMoves, totalTime } = stats;
        const totalMoves = successMoves + failedMoves;
        const successRatio = successMoves / (totalMoves || 1);
        
        if (successRatio > 0.8 && totalTime < 180) return 3;
        if (successRatio > 0.6) return 2;
        return 1;
    };

    const stars = calculateStars();
    
    const messages = [
        "¡Excelente trabajo! Tu mente está en forma.",
        "¡Increíble! Cada reto completado fortalece tu cerebro.",
        "¡Lo lograste! Eres un experto en este juego."
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    return (
        <>
            {showCorrect && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
                    <div className="flex items-center gap-2 bg-green-100 text-green-700 px-6 py-3 rounded-full shadow-lg animate-bounce">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                        <span className="font-bold">¡FELICIDADES!</span>
                    </div>
                </div>
            )}
            
            {showWrong && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
                    <div className="flex items-center gap-2 bg-red-100 text-red-700 px-6 py-3 rounded-full shadow-lg animate-bounce">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="15" y1="9" x2="9" y2="15"></line>
                            <line x1="9" y1="9" x2="15" y2="15"></line>
                        </svg>
                        <span className="font-bold">:(</span>
                    </div>
                </div>
            )}
            
            {showCompleted && (
                <div className="fixed top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white py-3 px-8 rounded-full shadow-lg z-50 animate-fadeIn flex items-center">
                    <span className="text-2xl mr-3">🎯</span>
                    <span className="font-bold text-xl">¡Bien hecho!</span>
                </div>
            )}
            
            {showPause && (
                <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-auto bg-black bg-opacity-30">
                    <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md w-full mx-4 animate-fadeIn">
                        <div className="w-20 h-20 mx-auto bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                            <span className="text-yellow-500 text-5xl">❙ ❙</span>
                        </div>
                        <h2 className="text-2xl font-bold text-yellow-700 mb-6">
                            Juego Pausado
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Toma el tiempo que necesites para descansar.
                        </p>
                        <button
                            onClick={onResumeGame}
                            className="w-full px-6 py-3 bg-yellow-500 text-white rounded-lg 
                                     hover:bg-yellow-600 transition-colors font-medium"
                        >
                            Continuar
                        </button>
                    </div>
                </div>
            )}
            
            {showExit && (
                <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-auto bg-black bg-opacity-30">
                    <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4 animate-fadeIn">
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
            )}
            
            {showTimeout && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
                    <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md w-full mx-4 animate-fadeIn">
                        <div className="w-20 h-20 mx-auto bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                            <span className="text-yellow-500 text-3xl">⏱️</span>
                        </div>
                        <h3 className="text-2xl font-bold text-yellow-700 mb-2">Ronda finalizada</h3>
                        <p className="text-gray-600 mb-4">Muy bien, vamos a seguir jugando</p>
                    </div>
                </div>
            )}
            
            {showLevelComplete && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
                    <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md w-full mx-4 animate-fadeIn">
                        <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4 animate-pulse">
                            <span className="text-green-500 text-5xl">✓</span>
                        </div>
                        <h3 className="text-2xl font-bold text-green-700 mb-2">¡Nivel completado!</h3>
                        <p className="text-gray-600 mb-4">Avanzando al siguiente nivel...</p>
                    </div>
                </div>
            )}
            
            {showNextRound && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
                    <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md w-full mx-4 animate-fadeIn">
                        <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                            <span className="text-blue-500 text-5xl">🎮</span>
                        </div>
                        <h3 className="text-2xl font-bold text-blue-700 mb-2">¡Ronda completada!</h3>
                        <p className="text-gray-600 mb-4">Preparando la siguiente ronda...</p>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                            <div 
                                className="bg-blue-600 h-2.5 rounded-full" 
                                style={{ width: `${(currentRound / totalRounds) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            )}
            
            {showGameCompleted && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    {showConfetti && (
                        <div className="absolute inset-0 overflow-hidden">
                            {/* Simulación de confetti con elementos div */}
                            {[...Array(50)].map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute animate-confetti"
                                    style={{
                                        left: `${Math.random() * 100}%`,
                                        top: `-20px`,
                                        width: `${Math.random() * 10 + 5}px`,
                                        height: `${Math.random() * 10 + 5}px`,
                                        backgroundColor: ['#00398A', '#00A8E3', '#7EC3E2', '#FFD700', '#FFA500'][Math.floor(Math.random() * 5)],
                                        transform: `rotate(${Math.random() * 360}deg)`,
                                        animationDuration: `${Math.random() * 3 + 2}s`,
                                        animationDelay: `${Math.random()}s`
                                    }}
                                />
                            ))}
                        </div>
                    )}
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 transform animate-bounceIn text-center">
                        <div className="w-16 h-16 mx-auto text-[#FFD700] mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0.5">
                                <path d="M7 8h10V7h-1V5.5a2.5 2.5 0 0 0-5 0V7H7v1zm8-2.5c0-.83-.67-1.5-1.5-1.5S12 4.67 12 5.5V7h3V5.5z"/>
                                <path d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0-1a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/>
                                <path d="M17.03 16.58c-.28-1.56-2.31-2.48-5.03-2.48s-4.75.92-5.03 2.48L6 21h12l-.97-4.42z"/>
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-[#00398A] mb-4">¡Felicidades!</h2>
                        <p className="text-xl text-gray-700 mb-6">{randomMessage}</p>
                        
                        <div className="flex justify-center mb-6">
                            {[...Array(3)].map((_, i) => (
                                <span key={i} className={`text-4xl mx-1 ${i < stars ? 'text-[#FFD700]' : 'text-gray-300'}`}>★</span>
                            ))}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-blue-50 p-3 rounded-lg">
                                <p className="text-sm text-gray-500">Movimientos correctos</p>
                                <p className="text-xl font-bold text-[#00398A]">{stats?.successMoves || 0}</p>
                            </div>
                            <div className="bg-blue-50 p-3 rounded-lg">
                                <p className="text-sm text-gray-500">Tiempo total</p>
                                <p className="text-xl font-bold text-[#00398A]">
                                    {stats ? `${Math.floor(stats.totalTime / 60)}:${(stats.totalTime % 60).toString().padStart(2, '0')}` : '0:00'}
                                </p>
                            </div>
                        </div>
                        
                        <button
                            onClick={onGameComplete}
                            className="bg-[#00398A] text-white px-6 py-3 rounded-full font-medium hover:bg-[#002d6f] transition-colors shadow-md hover:shadow-lg flex items-center justify-center mx-auto"
                        >
                            <span className="mr-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 8c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
                                    <path d="M12 20c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
                                    <path d="M20 12c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z"/>
                                    <path d="M4 12c0 1.1.9 2 2 2s2-.9 2-2-.9-2-2-2-2 .9-2 2z"/>
                                    <path d="M16 6a4 4 0 0 0-8 0"/>
                                    <path d="M8 18a4 4 0 0 0 8 0"/>
                                    <path d="M18 8a4 4 0 0 0 0 8"/>
                                    <path d="M6 16a4 4 0 0 0 0-8"/>
                                </svg>
                            </span>
                            Ver Resultados
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ForestFeedback;