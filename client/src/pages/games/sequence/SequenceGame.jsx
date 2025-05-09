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
        isPaused: false,
        startTime: Date.now(),
        totalPauseTime: 0,
        lastPauseTime: null,
        helpCount: 0,
        successCount: 0,
        failedCount: 0
    });
    
    const [helpState, setHelpState] = useState({
        showHelp: false,
        currentHelpNumber: null,
        revealedNumbers: [], 
        pendingHelpNumber: null 
    });
    
    const [showCorrectFeedback, setShowCorrectFeedback] = useState(false);
    const [showWrongFeedback, setShowWrongFeedback] = useState(false);
    const [gameCompleted, setGameCompleted] = useState(false);
    const [showExitConfirm, setShowExitConfirm] = useState(false);
    const [incorrectAnswers, setIncorrectAnswers] = useState([]);
    const [correctAnswers, setCorrectAnswers] = useState([]);

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
    }, [config.gameMode, config.timeInterval, gameState.isPaused]);

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
        
        setIncorrectAnswers([]);
        setCorrectAnswers([]);
        setHelpState({
            showHelp: false,
            currentHelpNumber: null,
            revealedNumbers: [],
            pendingHelpNumber: null
        });
    };

    const shuffleNumbers = () => {
        setGameState(prev => ({
            ...prev,
            numbers: [...prev.numbers].sort(() => Math.random() - 0.5)
        }));
    };

    const handleAnswerChange = (index, value) => {
        if (value === '') {
            setGameState(prev => {
                const newAnswers = { ...prev.userAnswers };
                delete newAnswers[index];
                return {
                    ...prev,
                    userAnswers: newAnswers
                };
            });
        } else {
            const numValue = parseInt(value);
            if (!isNaN(numValue)) {
                setGameState(prev => ({
                    ...prev,
                    userAnswers: {
                        ...prev.userAnswers,
                        [index]: numValue
                    }
                }));
            }
        }

        if (incorrectAnswers.includes(index)) {
            setIncorrectAnswers(prev => prev.filter(i => i !== index));
        }
    };

    const handleToggleHelp = () => {
        if (helpState.pendingHelpNumber) {
            setHelpState(prev => ({
                ...prev,
                showHelp: true,
                currentHelpNumber: prev.pendingHelpNumber
            }));
        } else {
            const remainingNumbers = gameState.hiddenNumbers.filter(num => {
                if (helpState.revealedNumbers.includes(num)) return false;
                
                const isAnsweredCorrectly = correctAnswers.some(idx => 
                    gameState.userAnswers[idx] === num
                );
                return !isAnsweredCorrectly;
            });
            
            if (remainingNumbers.length === 0) {
                return;
            }
            const randomIndex = Math.floor(Math.random() * remainingNumbers.length);
            const helpNumber = remainingNumbers[randomIndex];
            setHelpState(prev => ({
                ...prev,
                showHelp: true,
                currentHelpNumber: helpNumber,
                pendingHelpNumber: helpNumber 
            }));
        }
        setGameState(prev => ({
            ...prev,
            helpCount: prev.helpCount + 1
        }));
        setTimeout(() => {
            setHelpState(prev => ({
                ...prev,
                showHelp: false,
                currentHelpNumber: null
            }));
        }, 2000);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'ArrowLeft') {
            handleScroll(-1);
        } else if (event.key === 'ArrowRight') {
            handleScroll(1);
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
        const { userAnswers, hiddenNumbers } = gameState;
        const answers = Object.entries(userAnswers);
        if (answers.length === 0) {
            setShowWrongFeedback(true);
            setTimeout(() => setShowWrongFeedback(false), 2000);
            return;
        }
        const newCorrect = [];
        const newIncorrect = [];
        let correctCount = 0;
        let failedCount = 0;
        answers.forEach(([indexStr, answer]) => {
            const index = Number(indexStr);
            if (correctAnswers.includes(index)) return;
            if (hiddenNumbers.includes(answer)) {
                newCorrect.push(index);
                correctCount++;
                if (answer === helpState.pendingHelpNumber) {
                    setHelpState(prev => ({
                        ...prev,
                        revealedNumbers: [...prev.revealedNumbers, answer],
                        pendingHelpNumber: null 
                    }));
                }
                
            } else {
                newIncorrect.push(index);
                failedCount++;
            }
        });
        setCorrectAnswers(prev => [...prev, ...newCorrect]);
        setIncorrectAnswers(newIncorrect);
        setGameState(prev => ({
            ...prev,
            successCount: prev.successCount + correctCount,
            failedCount: prev.failedCount + failedCount
        }));
        const allAnswered = correctAnswers.length + newCorrect.length === hiddenNumbers.length;
        
        if (allAnswered) {
            setGameCompleted(true);
            setShowCorrectFeedback(true);
            setTimeout(() => setShowCorrectFeedback(false), 2000);
        } else if (newCorrect.length > 0) {
            setShowCorrectFeedback(true);
            setTimeout(() => setShowCorrectFeedback(false), 1000);
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
            totalTime,
            totalPauses: Math.floor(gameState.totalPauseTime / 1000),
            complete: gameCompleted,
        };

        navigate('/games/sequence/end', { 
            state: { 
                stats,
                config,
                patientId
            } 
        });
    };

    const helpDisabled = gameState.hiddenNumbers.length > 0 && 
        (helpState.revealedNumbers.length === gameState.hiddenNumbers.length);

    const helpPercentage = gameState.hiddenNumbers.length > 0 
        ? Math.min(100, (helpState.revealedNumbers.length / gameState.hiddenNumbers.length) * 100)
        : 0;

    return (
        <div className="fixed inset-0 bg-gray-100">
            <div className="fixed top-0 left-0 right-0 z-50">
                <GameControls 
                    onHelp={handleToggleHelp}
                    onPause={handleTogglePause}
                    onExit={() => setShowExitConfirm(true)}
                    isPaused={gameState.isPaused}
                    gameMode={config.gameMode}
                    helpDisabled={helpDisabled} 
                    helpPercentage={helpPercentage}
                />
            </div>
    
            <div className="mt-8 h-[calc(100vh-130px)] flex items-center justify-center relative">
                <div className="w-[calc(100%-6rem)] px-4">
                    <div 
                        ref={scrollContainerRef}
                        className="overflow-x-auto hide-scrollbar"
                        style={{
                            scrollBehavior: 'smooth'
                        }}
                        tabIndex="0"
                        aria-label="Contenedor de secuencia de números, use las flechas izquierda y derecha para navegar"
                        onKeyDown={handleKeyDown}
                    >
                        <div className="min-w-max">
                            <NumberGrid 
                                numbers={gameState.numbers}
                                hiddenNumbers={gameState.hiddenNumbers}
                                showHelp={helpState.showHelp}
                                showMemoryNumbers={gameState.showMemoryNumbers}
                                gameMode={config.gameMode}
                                correctAnswers={correctAnswers}
                                userAnswers={gameState.userAnswers}
                                currentHelpNumber={helpState.currentHelpNumber}
                                timeInterval={config.timeInterval} 
                                isPaused={gameState.isPaused} 
                            />
                        </div>
                    </div>
                </div>
            </div>
                
            <div className="fixed bottom-0 left-0 right-0">
                <AnswerInputs 
                    hiddenCount={gameState.hiddenNumbers.length}
                    answers={gameState.userAnswers}
                    onChange={handleAnswerChange}
                    config={config}
                    isPaused={gameState.isPaused}
                    incorrectAnswers={incorrectAnswers}
                    correctAnswers={correctAnswers}
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
                stats={{
                    successCount: gameState.successCount,
                    failedCount: gameState.failedCount,
                    helpCount: gameState.helpCount,
                    totalTime: Math.floor((Date.now() - gameState.startTime - gameState.totalPauseTime) / 1000),
                }}
            />
        </div>
    );
};

export default SequenceGame;