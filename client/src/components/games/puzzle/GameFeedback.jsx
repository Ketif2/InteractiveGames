import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import { CheckCircle, XCircle, Trophy, Star, Award } from 'lucide-react';

const GameFeedback = ({ isCorrect, isWrong, gameCompleted, onFinish, stats }) => {
    const [showFeedback, setShowFeedback] = useState(false);
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
        
        if (gameCompleted) {
            const timer = setTimeout(() => {
                setShowConfetti(false);
            }, 8000);
            return () => clearTimeout(timer);
        }
        
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [gameCompleted]);

    useEffect(() => {
        if (isCorrect || isWrong) {
            setShowFeedback(true);
            const timer = setTimeout(() => setShowFeedback(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [isCorrect, isWrong]);

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

    if (gameCompleted) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                {showConfetti && (
                    <Confetti 
                        width={windowDimensions.width}
                        height={windowDimensions.height}
                        recycle={true}
                        numberOfPieces={200}
                        gravity={0.15}
                        colors={['#00398A', '#00A8E3', '#7EC3E2', '#FFD700', '#FFA500']}
                    />
                )}
                
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 transform animate-bounceIn text-center">
                    <Trophy className="w-16 h-16 mx-auto text-[#FFD700] mb-2" />
                    <h2 className="text-3xl font-bold text-[#00398A] mb-4">¡Felicidades!</h2>
                    <p className="text-xl text-gray-700 mb-6">{randomMessage}</p>
                    
                    <div className="flex justify-center mb-6">
                        {[...Array(3)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-12 h-12 ${i < stars ? 'text-[#FFD700] fill-[#FFD700]' : 'text-gray-300'} mx-1`}
                            />
                        ))}
                    </div>
                    
                    {stats && (
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-blue-50 p-3 rounded-lg">
                                <p className="text-sm text-gray-500">Movimientos correctos</p>
                                <p className="text-xl font-bold text-[#00398A]">{stats.successMoves}</p>
                            </div>
                            <div className="bg-blue-50 p-3 rounded-lg">
                                <p className="text-sm text-gray-500">Tiempo total</p>
                                <p className="text-xl font-bold text-[#00398A]">
                                    {Math.floor(stats.totalTime / 60)}:{(stats.totalTime % 60).toString().padStart(2, '0')}
                                </p>
                            </div>
                        </div>
                    )}
                    
                    <button
                        onClick={onFinish}
                        className="bg-[#00398A] text-white px-6 py-3 rounded-full font-medium hover:bg-[#002d6f] transition-colors shadow-md hover:shadow-lg flex items-center justify-center mx-auto"
                    >
                        <Award className="w-5 h-5 mr-2" />
                        Continuar
                    </button>
                </div>
            </div>
        );
    }

    if (!showFeedback) return null;

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
            {isCorrect && (
                <div className="flex items-center gap-2 bg-green-100 text-green-700 px-6 py-3 rounded-full shadow-lg animate-bounce">
                    <CheckCircle className="w-6 h-6" />
                    <span className="font-bold">¡FELICIDADES!</span>
                </div>
            )}
            {isWrong && (
                <div className="flex items-center gap-2 bg-red-100 text-red-700 px-6 py-3 rounded-full shadow-lg animate-bounce">
                    <XCircle className="w-6 h-6" />
                    <span className="font-bold">:(</span>
                </div>
            )}
        </div>
    );
};

export default GameFeedback;