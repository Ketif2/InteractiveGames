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
    
    // Estado para la ayuda
    const [helpState, setHelpState] = useState({
        showHelp: false,
        currentHelpNumber: null,
        revealedNumbers: [], // Números que ya fueron correctamente ingresados después de ayuda
        pendingHelpNumber: null // Número actual que está pendiente de ser ingresado
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
        
        // Resetear estados de respuesta y ayuda
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
        // Si ya hay un número pendiente de ser ingresado, mostramos ese mismo
        if (helpState.pendingHelpNumber) {
            setHelpState(prev => ({
                ...prev,
                showHelp: true,
                currentHelpNumber: prev.pendingHelpNumber
            }));
        } else {
            // Obtenemos los números que faltan por adivinar correctamente
            const remainingNumbers = gameState.hiddenNumbers.filter(num => {
                // Verificar si este número ya fue revelado como ayuda y usado correctamente
                if (helpState.revealedNumbers.includes(num)) return false;
                
                // Verificar si ya fue respondido correctamente
                const isAnsweredCorrectly = correctAnswers.some(idx => 
                    gameState.userAnswers[idx] === num
                );
                
                return !isAnsweredCorrectly;
            });
            
            // Si no hay más números para ayudar, no hacemos nada
            if (remainingNumbers.length === 0) {
                return;
            }
            
            // Seleccionar aleatoriamente un número de los restantes
            const randomIndex = Math.floor(Math.random() * remainingNumbers.length);
            const helpNumber = remainingNumbers[randomIndex];
            
            // Actualizar el estado de la ayuda
            setHelpState(prev => ({
                ...prev,
                showHelp: true,
                currentHelpNumber: helpNumber,
                pendingHelpNumber: helpNumber // Guardamos este número como pendiente
            }));
        }
        
        setGameState(prev => ({
            ...prev,
            helpCount: prev.helpCount + 1
        }));
        
        // Ocultar la ayuda después de 2 segundos
        setTimeout(() => {
            setHelpState(prev => ({
                ...prev,
                showHelp: false,
                currentHelpNumber: null
            }));
        }, 2000);
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
        
        // Verificar si hay respuestas para evaluar
        if (answers.length === 0) {
            setShowWrongFeedback(true);
            setTimeout(() => setShowWrongFeedback(false), 2000);
            return;
        }
    
        // Encontrar respuestas correctas e incorrectas
        const newCorrect = [];
        const newIncorrect = [];
        let correctCount = 0;
        let failedCount = 0;
        
        // Evaluar cada respuesta individualmente
        answers.forEach(([indexStr, answer]) => {
            const index = Number(indexStr);
            
            // Si ya está marcada como correcta, ignoramos
            if (correctAnswers.includes(index)) return;
            
            // Verificar si la respuesta es uno de los números ocultos
            if (hiddenNumbers.includes(answer)) {
                newCorrect.push(index);
                correctCount++;
                
                // Si este número era el pendiente de ayuda, lo marcamos como revelado
                if (answer === helpState.pendingHelpNumber) {
                    setHelpState(prev => ({
                        ...prev,
                        revealedNumbers: [...prev.revealedNumbers, answer],
                        pendingHelpNumber: null // Ya no está pendiente
                    }));
                }
                
            } else {
                newIncorrect.push(index);
                failedCount++;
            }
        });
    
        // Actualizar listas de respuestas correctas e incorrectas
        setCorrectAnswers(prev => [...prev, ...newCorrect]);
        setIncorrectAnswers(newIncorrect);
    
        // Actualizar contadores de aciertos y fallos
        setGameState(prev => ({
            ...prev,
            successCount: prev.successCount + correctCount,
            failedCount: prev.failedCount + failedCount
        }));
    
        // Verificar si se completó el juego (todas las respuestas correctas)
        const allAnswered = correctAnswers.length + newCorrect.length === hiddenNumbers.length;
        
        if (allAnswered) {
            setGameCompleted(true);
            setShowCorrectFeedback(true);
            setTimeout(() => setShowCorrectFeedback(false), 2000);
        } else if (newCorrect.length > 0) {
            // Mostrar feedback positivo si al menos una respuesta es correcta
            setShowCorrectFeedback(true);
            setTimeout(() => setShowCorrectFeedback(false), 1000);
        } else {
            // Si ninguna es correcta, mostrar feedback negativo
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

        // Navegar a la pantalla de resultados con toda la información necesaria
        navigate('/games/sequence/end', { 
            state: { 
                stats,
                config,
                patientId
            } 
        });
    };

    // Verificar si se han usado todas las ayudas posibles
    const helpDisabled = gameState.hiddenNumbers.length > 0 && 
        (helpState.revealedNumbers.length === gameState.hiddenNumbers.length);

    // Calcular el porcentaje de ayudas utilizadas
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
                    helpDisabled={helpDisabled} // Deshabilitar cuando ya se usaron todas las ayudas
                    helpPercentage={helpPercentage} // Para mostrar una barra de progreso opcional
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
                                showHelp={helpState.showHelp}
                                showMemoryNumbers={gameState.showMemoryNumbers}
                                gameMode={config.gameMode}
                                correctAnswers={correctAnswers}
                                userAnswers={gameState.userAnswers}
                                currentHelpNumber={helpState.currentHelpNumber}
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