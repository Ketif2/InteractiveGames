import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import { CheckCircle, XCircle, Trophy, Star, Award, AlertTriangle } from 'lucide-react';

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
    stats,  
}) => {
    const [windowDimensions, setWindowDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });
    // Eliminamos el timeout automático del confeti
    const [showFeedback, setShowFeedback] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setWindowDimensions({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        window.addEventListener('resize', handleResize);
        
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        if (showCorrect || showWrong) {
            setShowFeedback(true);
            const timer = setTimeout(() => setShowFeedback(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [showCorrect, showWrong]);

    if (showCompleted) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                {/* El confeti permanecerá activo hasta que se presione "Continuar" */}
                <Confetti 
                    width={windowDimensions.width}
                    height={windowDimensions.height}
                    recycle={true}
                    numberOfPieces={200}
                    gravity={0.15}
                    colors={['#00398A', '#00A8E3', '#7EC3E2', '#FFD700', '#FFA500']}
                />
                
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 transform animate-bounceIn text-center">
                    <Trophy className="w-16 h-16 mx-auto text-[#FFD700] mb-2" />
                    <h2 className="text-3xl font-bold text-[#00398A] mb-4">¡Felicidades!</h2>
                    <p className="text-xl text-gray-700 mb-6">
                        ¡Increíble! Has completado correctamente la secuencia de números.
                    </p>
                    
                    <div className="flex justify-center mb-6">
                        {/* Siempre mostramos 3 estrellas doradas */}
                        <Star className="w-12 h-12 text-[#FFD700] fill-[#FFD700] mx-1" />
                        <Star className="w-12 h-12 text-[#FFD700] fill-[#FFD700] mx-1" />
                        <Star className="w-12 h-12 text-[#FFD700] fill-[#FFD700] mx-1" />
                    </div>
                    
                    <button
                        onClick={onGameComplete}
                        className="bg-[#00398A] text-white px-6 py-3 rounded-full font-medium hover:bg-[#002d6f] transition-colors shadow-md hover:shadow-lg flex items-center justify-center mx-auto"
                    >
                        <Award className="w-5 h-5 mr-2" />
                        Continuar
                    </button>
                </div>
            </div>
        );
    }

    if (showPause) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-8 rounded-lg text-center">
                    <h2 className="text-2xl font-bold text-[#00398A] mb-4">Juego Pausado</h2>
                    <button
                        onClick={onPauseResume}
                        className="bg-[#00398A] text-white px-6 py-2 rounded hover:bg-[#002d6f] transition-colors"
                    >
                        Reanudar
                    </button>
                </div>
            </div>
        );
    }

    if (showExit) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-8 rounded-lg text-center max-w-md">
                    <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-800 mb-4">
                        ¿Seguro que quieres terminar el juego?
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Todo el progreso actual se perderá.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={onExitCancel}
                            className="bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={onExitConfirm}
                            className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition-colors"
                        >
                            Aceptar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!showFeedback) return null;

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
            {showCorrect && (
                <div className="flex items-center gap-2 bg-green-100 text-green-700 px-6 py-3 rounded-full shadow-lg animate-bounce">
                    <CheckCircle className="w-6 h-6" />
                    <span className="font-bold">¡FELICIDADES!</span>
                </div>
            )}
            {showWrong && (
                <div className="flex items-center gap-2 bg-red-100 text-red-700 px-6 py-3 rounded-full shadow-lg animate-bounce">
                    <XCircle className="w-6 h-6" />
                    <span className="font-bold">:(</span>
                </div>
            )}
        </div>
    );
};

export default FeedbackOverlay;