// src/components/games/puzzle/GameFeedback.jsx
import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import { CheckCircle, XCircle, Trophy } from 'lucide-react';

const GameFeedback = ({ isCorrect, isWrong, gameCompleted, onFinish }) => {
    const [showFeedback, setShowFeedback] = useState(false);

    useEffect(() => {
        if (isCorrect || isWrong) {
            setShowFeedback(true);
            const timer = setTimeout(() => setShowFeedback(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [isCorrect, isWrong]);

    if (gameCompleted) {
        return (
            <>
                <Confetti 
                    width={window.innerWidth}
                    height={window.innerHeight}
                    recycle={false}
                    numberOfPieces={500}
                    colors={['#00398A', '#00A8E3', '#7EC3E2']}
                />
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg text-center max-w-md">
                        <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
                        <h2 className="text-2xl font-bold text-[#00398A] mb-4">
                            ¡Felicitaciones!
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Has completado el rompecabezas exitosamente.
                        </p>
                        <button
                            onClick={onFinish}
                            className="bg-[#00398A] text-white px-6 py-2 rounded hover:bg-[#002d6f] transition-colors"
                        >
                            Continuar
                        </button>
                    </div>
                </div>
            </>
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