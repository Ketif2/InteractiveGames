import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import GameControls from '../../../components/games/sequence/GameControls';
import NumberGrid from '../../../components/games/sequence/NumberGrid';
import AnswerInputs from '../../../components/games/sequence/AnswerInputs';
import FeedbackOverlay from '../../../components/games/sequence/FeedbackOverlay';

const SequenceGame = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { config, patientId } = location.state || {};
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
    const [incorrectAnswers, setIncorrectAnswers] = useState([]);

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
            const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
            scrollContainerRef.current.scrollBy({
                left: direction * scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const handleAnswerChange = (index, value) => {
        const numValue = parseInt(value);
        if (isNaN(numValue)) return;

        setGameState(prev => ({
            ...prev,
            userAnswers: {
                ...prev.userAnswers,
                [index]: numValue
            }
        }));

        // Limpiar los errores cuando el usuario modifica una respuesta
        if (incorrectAnswers.includes(index)) {
            setIncorrectAnswers(prev => prev.filter(i => i !== index));
        }
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

    const handleCheck = () => {
        const answers = Object.values(gameState.userAnswers);
        
        // Verificar si todos los espacios están llenos
        if (answers.length !== gameState.hiddenNumbers.length) {
            setShowWrongFeedback(true);
            setTimeout(() => setShowWrongFeedback(false), 2000);
            return;
        }

        // Encontrar respuestas incorrectas
        const incorrect = [];
        answers.forEach((answer, index) => {
            if (!gameState.hiddenNumbers.includes(Number(answer))) {
                incorrect.push(index);
                setGameState(prev => ({
                    ...prev,
                    failedCount: prev.failedCount + 1
                }));
            }
        });

        setIncorrectAnswers(incorrect);

        if (incorrect.length === 0) {
            setGameState(prev => ({
                ...prev,
                successCount: prev.successCount + answers.length
            }));
            setGameCompleted(true);
            setShowCorrectFeedback(true);
            setTimeout(() => setShowCorrectFeedback(false), 2000);
        } else {
            setShowWrongFeedback(true);
            setTimeout(() => setShowWrongFeedback(false), 2000);
        }
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

        // Navegar a la pantalla de resultados con toda la información necesaria
        navigate('/games/sequence/end', { 
            state: { 
                stats,
                config,
                patientId
            } 
        });
    };

    return (
        <div className="fixed inset-0 bg-gray-100">
            <div className="fixed top-0 left-0 right-0 z-50">
                <GameControls 
                    onHelp={handleToggleHelp}
                    onPause={handleTogglePause}
                    onExit={() => setShowExitConfirm(true)}
                    isPaused={gameState.isPaused}
                    gameMode={config.gameMode}
                />
            </div>
    
            {/* Área principal centrada */}
            <div className="mt-16 h-[calc(100vh-56px-130px)] flex items-center justify-center relative">
            <div className="absolute left-14 bottom-8 -translate-y-1/2 z-10">
                <button
                    onClick={() => handleScroll(-1)}
                    className="bg-[#00398A] text-white rounded-full w-12 h-12 
                            flex items-center justify-center text-2xl pb-1
                            hover:bg-blue-400 hover:text-black transition-colors shadow-lg"
                >
                    ←
                </button>
            </div>
                <div className="w-[calc(100%-6rem)] px-4">
                    <div 
                        ref={scrollContainerRef}
                        className="overflow-x-auto hide-scrollbar"
                        style={{
                            scrollBehavior: 'smooth'
                        }}
                    >
                        <div className="min-w-max">
                            <NumberGrid 
                                numbers={gameState.numbers}
                                hiddenNumbers={gameState.hiddenNumbers}
                                showHelp={gameState.showHelp}
                                showMemoryNumbers={showMemoryNumbers}
                                gameMode={config.gameMode}
                            />
                        </div>
                    </div>
                </div>

                <div className="absolute right-14 bottom-8 -translate-y-1/2 z-10">
                    <button
                        onClick={() => handleScroll(1)}
                        className="bg-[#00398A] text-white rounded-full w-12 h-12
                                flex items-center justify-center text-2xl pb-1
                                hover:bg-blue-400 hover:text-black transition-colors shadow-lg"
                    >
                        →
                    </button>
                </div>
            </div>
                
            {/* Área de inputs */}
            <div className="fixed bottom-0 left-0 right-0">
                <AnswerInputs 
                    hiddenCount={gameState.hiddenNumbers.length}
                    answers={gameState.userAnswers}
                    onChange={handleAnswerChange}
                    config={config}
                    isPaused={gameState.isPaused}
                    incorrectAnswers={incorrectAnswers}
                    onCheck={handleCheck}
                />
            </div>
    
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