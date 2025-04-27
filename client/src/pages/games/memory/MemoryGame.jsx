// src/pages/games/memory/MemoryGame.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { selectObjectsByDifficultyAndCategory } from '../../../data/memoryObjects';
import MemoryArea from '../../../components/games/memory/MemoryArea';
import GameControls from '../../../components/games/memory/GameControls';
import FeedbackOverlay from '../../../components/games/memory/FeedbackOverlay';
import GameFeedback from '../../../components/games/puzzle/GameFeedback';

// Agregar estilos CSS globales para animaciones
const globalStyles = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeOut {
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(-20px); }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out forwards;
}

.animate-fadeOut {
  animation: fadeOut 0.3s ease-out forwards;
}
`;

const MemoryGame = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { config, patientId } = location.state || {};
    const memoryAreaRef = useRef(null);

    // Game state
    const [gameState, setGameState] = useState({
        items: [],               // selected objects for the game
        currentOrder: [],        // current order of objects in drop zone
        correctOrder: [],        // correct order for comparison
        showItems: true,         // visibility of objects
        isPaused: false,
        startTime: Date.now(),
        totalPauseTime: 0,
        lastPauseTime: null,
        helpCount: 0,
        attempts: 0,
        memoryShows: 0,
        totalPauses: 0,
        num_errores: 0,          // contador de errores (acumulativo en todas las rondas)
        num_aciertos: 0,         // contador de aciertos (acumulativo en todas las rondas)
        currentRound: 1,         // ronda actual
        totalRounds: config?.rounds || 3  // total de rondas a jugar (configurable)
    });

    // Feedback states
    const [showCorrectFeedback, setShowCorrectFeedback] = useState(false);
    const [showWrongFeedback, setShowWrongFeedback] = useState(false);
    const [showExitConfirm, setShowExitConfirm] = useState(false);
    const [showNextRoundMessage, setShowNextRoundMessage] = useState(false);
    const [gameCompleted, setGameCompleted] = useState(false);

    // Game initialization
    useEffect(() => {
        initializeGame();
        
        // Add global styles for animations
        const styleElement = document.createElement('style');
        styleElement.innerHTML = globalStyles;
        document.head.appendChild(styleElement);
        
        return () => {
            document.head.removeChild(styleElement);
        };
    }, []);

    const initializeGame = (preserveStats = false) => {
        // Seleccionar nuevos objetos para esta ronda
        const selectedItems = selectObjectsByDifficultyAndCategory(
            config?.difficulty || 'Fácil', 
            config?.category || 'Todos'
        );
        
        // Ordenar los items por ID para tener el orden correcto
        const sortedItems = [...selectedItems].sort((a, b) => a.id - b.id);
        
        // Set initial game state
        setGameState(prev => {
            // Si preserveStats es true, mantener las estadísticas acumuladas
            if (preserveStats) {
                return {
                    ...prev,
                    items: selectedItems,
                    currentOrder: Array(selectedItems.length).fill(null),
                    correctOrder: sortedItems,
                    showItems: config?.gameMode !== 'memoria'
                };
            } else {
                // Si es la primera ronda, inicializar todo
                return {
                    ...prev,
                    items: selectedItems,
                    currentOrder: Array(selectedItems.length).fill(null),
                    correctOrder: sortedItems,
                    showItems: config?.gameMode !== 'memoria',
                    startTime: Date.now(),
                    totalPauseTime: 0,
                    lastPauseTime: null,
                    helpCount: 0,
                    attempts: 0,
                    memoryShows: 0,
                    totalPauses: 0,
                    num_errores: 0,
                    num_aciertos: 0,
                    currentRound: 1,
                    totalRounds: config?.rounds || 3
                };
            }
        });

        // In memory mode, hide objects after initial viewing time
        if (config?.gameMode === 'memoria') {
            setTimeout(() => {
                setGameState(prev => ({ ...prev, showItems: false }));
            }, 12000); // Give a bit more time (12 seconds) to view in memory mode
        }
    };

    // Handle order change from MemoryArea component
    const handleOrderChange = useCallback((newOrder) => {
        setGameState(prev => ({ ...prev, currentOrder: newOrder }));
    }, []);

    // Handle errors count changes
    const handleErrorsChange = useCallback((errors, successes) => {
        setGameState(prev => ({ 
            ...prev, 
            // Acumulación de errores y aciertos - los errores son permanentes
            num_errores: prev.num_errores + errors,
            num_aciertos: prev.num_aciertos + successes
        }));
    }, []);

    // Función para pasar a la siguiente ronda
    const startNextRound = useCallback(() => {
        setGameState(prev => ({
            ...prev,
            currentRound: prev.currentRound + 1,
            items: [],
            currentOrder: []
        }));

        // Inicializar nueva ronda manteniendo estadísticas acumuladas
        initializeGame(true);
        
        // Ocultar mensaje de siguiente ronda
        setShowNextRoundMessage(false);
    }, []);

    // Handle check result
    const handleCheckResult = (isCorrect) => {
        if (isCorrect) {
            // Solo actualizamos el contador de intentos
            // Los errores y aciertos ya están acumulados mediante handleErrorsChange
            setGameState(prev => ({
                ...prev,
                attempts: prev.attempts + 1
            }));
            
            // Verificar si es la última ronda
            setGameState(prev => {
                if (prev.currentRound >= prev.totalRounds) {
                    // Es la última ronda, mostrar mensaje de juego completado
                    setShowCorrectFeedback(true);
                    setGameCompleted(true);
                    
                    // Hide feedback after delay and go to results
                    setTimeout(() => {
                        setShowCorrectFeedback(false);
                        handleFinishGame(true);
                    }, 3000);
                } else {
                    // No es la última ronda, mostrar mensaje para siguiente ronda
                    setShowNextRoundMessage(true);
                    
                    // Después de un tiempo, ocultar mensaje y pasar a siguiente ronda
                    setTimeout(() => {
                        startNextRound();
                    }, 3000);
                }
                return prev;
            });
        } else {
            setShowWrongFeedback(true);
            setGameState(prev => ({
                ...prev,
                attempts: prev.attempts + 1
            }));
            
            // Hide feedback after delay
            setTimeout(() => setShowWrongFeedback(false), 2000);
        }
    };

    // Game control handlers
    const handleHelp = () => {
        // Si estamos en modo memoria, mantener el comportamiento original
        if (config?.gameMode === 'memoria') {
            setGameState(prev => ({
                ...prev,
                showItems: true,
                helpCount: prev.helpCount + 1
            }));
            
            // Hide items again after viewing period in memory mode
            setTimeout(() => {
                setGameState(prev => ({ 
                    ...prev, 
                    showItems: false,
                    memoryShows: prev.memoryShows + 1
                }));
            }, 5000);
        } else {
            // Si no estamos en modo memoria, autocompleta un objeto aleatorio
            // Incrementa contador de ayuda
            setGameState(prev => ({
                ...prev,
                helpCount: prev.helpCount + 1
            }));
            
            // Invoca la función de autocompletar en MemoryArea a través de la referencia
            if (memoryAreaRef.current && typeof memoryAreaRef.current.autocompleteRandomItem === 'function') {
                memoryAreaRef.current.autocompleteRandomItem();
            }
        }
    };

    const handleTogglePause = () => {
        setGameState(prev => {
            const now = Date.now();
            if (prev.isPaused) {
                // Resuming game
                return {
                    ...prev,
                    isPaused: false,
                    totalPauseTime: prev.totalPauseTime + (now - (prev.lastPauseTime || now)),
                    lastPauseTime: null
                };
            }
            // Pausing game
            return {
                ...prev,
                isPaused: true,
                lastPauseTime: now,
                totalPauses: prev.totalPauses + 1
            };
        });
    };

    const handleFinishGame = (completed = false) => {
        const endTime = Date.now();
        let totalTimeSeconds = Math.floor(
            (endTime - gameState.startTime - gameState.totalPauseTime) / 1000
        );
        
        // Ensure time is at least 1 second
        totalTimeSeconds = Math.max(1, totalTimeSeconds);

        // Prepare stats for results page
        const stats = {
            attempts: gameState.attempts,
            helpCount: gameState.helpCount,
            memoryShows: gameState.memoryShows,
            totalTime: totalTimeSeconds,
            totalPauses: gameState.totalPauses,
            num_errores: gameState.num_errores,
            num_aciertos: gameState.num_aciertos,
            completado: completed,
            totalRounds: gameState.totalRounds
        };

        // Navigate to results page
        navigate('/games/memory/end', { 
            state: { 
                stats,
                config,
                patientId
            } 
        });
    };

    // Obtener el número de filas según la dificultad
    const getRowsForDifficulty = () => {
        switch (config?.difficulty) {
            case 'fácil':
                return 2;
            case 'medio':
                return 3;
            case 'difícil':
                return 4;
            default:
                return 2;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Control bar */}
            <div className="sticky top-0 z-40">
                <GameControls 
                    onHelp={handleHelp}
                    onPause={handleTogglePause}
                    onExit={() => setShowExitConfirm(true)}
                    isPaused={gameState.isPaused}
                    gameMode={config?.gameMode || 'normal'}
                />
            </div>

            {/* Main game area */}
            <div className="p-4 pb-20" style={{opacity: gameState.isPaused ? 0.5 : 1, pointerEvents: gameState.isPaused ? 'none' : 'auto'}}>
                {/* Instructions */}
                <div className="mb-8 text-center">
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">
                        Ordena los objetos del menos pesado al más pesado
                    </h2>
                    <p className="text-gray-600">
                        Arrastra las palabras desde arriba hacia los espacios de abajo para ordenarlas
                    </p>
                    {config?.category && config.category !== 'todos' && (
                        <p className="text-blue-600 mt-2">
                            Categoría: {config.category.charAt(0).toUpperCase() + config.category.slice(1)}
                        </p>
                    )}
                    <p className="text-green-600 font-medium mt-2">
                        Ronda {gameState.currentRound} de {gameState.totalRounds}
                    </p>
                </div>

                {/* Game area component */}
                {gameState.items.length > 0 && (
                    <MemoryArea
                        ref={memoryAreaRef}
                        items={gameState.items}
                        difficulty={config?.difficulty || 'fácil'}
                        gameMode={config?.gameMode || 'normal'}
                        showItems={gameState.showItems}
                        onOrderChange={handleOrderChange}
                        onCheckResult={handleCheckResult}
                        onErrorsChange={handleErrorsChange}
                        rows={getRowsForDifficulty()}
                    />
                )}
            </div>

            {/* Feedback overlays */}
            <FeedbackOverlay 
                showCorrect={showCorrectFeedback}
                showWrong={showWrongFeedback}
                showPause={gameState.isPaused}
                showExit={showExitConfirm}
                showCompleted={gameCompleted}
                onPauseResume={handleTogglePause}
                onExitConfirm={() => handleFinishGame(false)}
                onExitCancel={() => setShowExitConfirm(false)}
                onGameComplete={() => handleFinishGame(true)}
            />

            {/* Feedback y Overlay */}
            <GameFeedback 
                isCorrect={showCorrectFeedback}
                isWrong={showWrongFeedback}
                gameCompleted={gameCompleted}
                onFinish={handleFinishGame}
                stats={{
                    successMoves: gameState.num_aciertos,
                    failedMoves: gameState.num_errores,
                    helpCount: gameState.helpCount,
                    totalTime: Math.floor((Date.now() - gameState.startTime - gameState.totalPauseTime) / 1000),
                    pauseCount: gameState.totalPauses
                }}
            />

            {/* Mensaje de siguiente ronda */}
            {showNextRoundMessage && (
                <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-auto">
                    <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md w-full mx-4 animate-fadeIn">
                        <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <span className="text-green-500 text-5xl">✓</span>
                        </div>
                        <h2 className="text-2xl font-bold text-green-700 mb-4">
                            ¡Muy bien!
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Has completado la ronda {gameState.currentRound}. Preparando siguiente ronda...
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                            <div 
                                className="bg-green-600 h-2.5 rounded-full" 
                                style={{ width: `${(gameState.currentRound / gameState.totalRounds) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MemoryGame;