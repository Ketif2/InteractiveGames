import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import GameControls from '../../../components/games/sequence/GameControls';
import NumberGrid from '../../../components/games/sequence/NumberGrid';
import AnswerInputs from '../../../components/games/sequence/AnswerInputs';
import FeedbackOverlay from '../../../components/games/sequence/FeedbackOverlay';

const SequenceGame = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { config, configId, patientId } = location.state || {};
    const scrollContainerRef = useRef(null);

    const [gameState, setGameState] = useState({
        numbers: [],
        hiddenNumbers: [],
        userAnswers: {},
        showHelp: false,
        isPaused: false,
        startTime: Date.now(),
        totalPauseTime: 0,
        lastPauseTime: null,
        helpCount: 0,
        successCount: 0,
        failedCount: 0,
        memoryShows: 0
    });

    const [showCorrectFeedback, setShowCorrectFeedback] = useState(false);
    const [showWrongFeedback, setShowWrongFeedback] = useState(false);
    const [gameCompleted, setGameCompleted] = useState(false);
    const [showExitConfirm, setShowExitConfirm] = useState(false);
    const [showMemoryNumbers, setShowMemoryNumbers] = useState(false);

    useEffect(() => {
        initializeGame();
    }, []);

    useEffect(() => {
        let intervalId;
        if (config.gameMode === 'revuelto' && !gameState.isPaused) {
            intervalId = setInterval(shuffleNumbers, config.timeInterval * 1000);
        }
        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [config.gameMode, gameState.isPaused]);

    const initializeGame = () => {
        const { startRange, endRange, numbersToHide } = config;
        const allNumbers = Array.from(
            { length: endRange - startRange + 1 },
            (_, i) => startRange + i
        ).sort(() => Math.random() - 0.5);

        const hiddenIndices = new Set();
        while (hiddenIndices.size < numbersToHide) {
            hiddenIndices.add(Math.floor(Math.random() * allNumbers.length));
        }

        const hiddenNums = Array.from(hiddenIndices).map(index => allNumbers[index]);
        
        setGameState(prev => ({
            ...prev,
            numbers: allNumbers,
            hiddenNumbers: hiddenNums,
            userAnswers: {}
        }));

        if (config.gameMode === 'memoria') {
            setShowMemoryNumbers(true);
            setTimeout(() => setShowMemoryNumbers(false), 10000);
        }
    };

    const shuffleNumbers = () => {
        setGameState(prev => ({
            ...prev,
            numbers: [...prev.numbers].sort(() => Math.random() - 0.5)
        }));
    };

    const handleScroll = (direction) => {
        if (scrollContainerRef.current) {
            const pageWidth = scrollContainerRef.current.clientWidth;
            scrollContainerRef.current.scrollBy({
                left: direction * pageWidth,
                behavior: 'smooth'
            });
        }
    };

    const handleAnswerChange = (index, value) => {
        const numValue = parseInt(value);
        if (isNaN(numValue)) return;

        setGameState(prev => {
            const isCorrect = prev.hiddenNumbers.includes(numValue);
            const newAnswers = { ...prev.userAnswers, [index]: numValue };

            // Verificar si el juego está completo
            if (Object.keys(newAnswers).length === prev.hiddenNumbers.length) {
                const allCorrect = prev.hiddenNumbers.every(num => 
                    Object.values(newAnswers).includes(num)
                );
                if (allCorrect) {
                    setGameCompleted(true); // Activar el modal de completado
                }
            }

            // Mostrar feedback
            if (isCorrect && !prev.userAnswers[index]) {
                setShowCorrectFeedback(true);
                setTimeout(() => setShowCorrectFeedback(false), 2000);
                return {
                    ...prev,
                    userAnswers: newAnswers,
                    successCount: prev.successCount + 1
                };
            } else if (!isCorrect && prev.userAnswers[index] !== numValue) {
                setShowWrongFeedback(true);
                setTimeout(() => setShowWrongFeedback(false), 2000);
                return {
                    ...prev,
                    userAnswers: newAnswers,
                    failedCount: prev.failedCount + 1
                };
            }

            return { ...prev, userAnswers: newAnswers };
        });
    };

    const handleToggleHelp = () => {
        if (config.gameMode === 'memoria') {
            setShowMemoryNumbers(true);
            setGameState(prev => ({
                ...prev,
                memoryShows: prev.memoryShows + 1
            }));
            setTimeout(() => setShowMemoryNumbers(false), 10000);
        } else {
            setGameState(prev => ({
                ...prev,
                showHelp: true,
                helpCount: prev.helpCount + 1
            }));
            setTimeout(() => {
                setGameState(prev => ({ ...prev, showHelp: false }));
            }, 3000);
        }
    };

    const handleTogglePause = () => {
        setGameState(prev => {
            const now = Date.now();
            if (prev.isPaused) {
                return {
                    ...prev,
                    isPaused: false,
                    totalPauseTime: prev.totalPauseTime + (now - prev.lastPauseTime),
                    lastPauseTime: null
                };
            }
            return {
                ...prev,
                isPaused: true,
                lastPauseTime: now
            };
        });
    };

    

    const handleFinishGame = () => {
        const endTime = Date.now();
        const totalTime = Math.floor(
            (endTime - gameState.startTime - gameState.totalPauseTime) / 1000
        );

        const stats = {
            successCount: gameState.successCount,
            failedCount: gameState.failedCount,
            helpCount: gameState.helpCount,
            memoryShows: gameState.memoryShows,
            totalTime,
            totalPauses: Math.floor(gameState.totalPauseTime / 1000)
        };

        navigate('/games/sequence/end', { 
            state: { stats, config, configId, patientId } 
        });
    };

    return (
        <div className="fixed inset-0 bg-gray-100">
            {/* Header fijo */}
            <div className="fixed top-0 left-0 right-0 h-16 z-50">
                <GameControls 
                    onHelp={handleToggleHelp}
                    onPause={handleTogglePause}
                    onExit={() => setShowExitConfirm(true)}
                    isPaused={gameState.isPaused}
                    gameMode={config.gameMode}
                />
            </div>

            {/* Contenedor principal con scroll */}
            <div className="absolute top-16 bottom-32 left-0 right-0 overflow-hidden">
                <div className="h-full flex items-center justify-center">
                    <div className="relative w-full max-w-[1400px] mx-auto px-12">
                        {gameState.numbers.length > 48 && (
                            <button
                                onClick={() => handleScroll(-1)}
                                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 
                                         bg-[#00398A] text-white rounded-full w-12 h-12
                                         flex items-center justify-center text-2xl
                                         hover:bg-[#002d6f] transition-colors shadow-lg"
                            >
                                ←
                            </button>
                        )}

                        <div 
                            ref={scrollContainerRef}
                            className="overflow-x-auto scrollbar-hide"
                            style={{
                                scrollSnapType: 'x mandatory',
                                WebkitOverflowScrolling: 'touch'
                            }}
                        >
                            <NumberGrid 
                                numbers={gameState.numbers}
                                hiddenNumbers={gameState.hiddenNumbers}
                                showHelp={gameState.showHelp}
                                showMemoryNumbers={showMemoryNumbers}
                                gameMode={config.gameMode}
                            />
                        </div>

                        {gameState.numbers.length > 48 && (
                            <button
                                onClick={() => handleScroll(1)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 
                                         bg-[#00398A] text-white rounded-full w-12 h-12
                                         flex items-center justify-center text-2xl
                                         hover:bg-[#002d6f] transition-colors shadow-lg"
                            >
                                →
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Área de inputs fija en la parte inferior */}
            <div className="fixed bottom-0 left-0 right-0 h-32 bg-white bg-opacity-95 shadow-lg">
                <AnswerInputs 
                    hiddenCount={gameState.hiddenNumbers.length}
                    answers={gameState.userAnswers}
                    onChange={handleAnswerChange}
                    config={config}
                    isPaused={gameState.isPaused}
                />
            </div>

            {/* Overlay de feedbacks */}
            <FeedbackOverlay 
                showCorrect={showCorrectFeedback}
                showWrong={showWrongFeedback}
                showPause={gameState.isPaused}
                showExit={showExitConfirm}
                showCompleted={gameCompleted}
                onPauseResume={handleTogglePause}
                onExitConfirm={handleFinishGame}
                onExitCancel={() => setShowExitConfirm(false)}
                onGameComplete={handleFinishGame}
            />
        </div>
    );
};


export default SequenceGame;