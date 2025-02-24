// src/pages/games/memory/MemoryGame.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { selectObjectsByDifficulty } from '../../../data/memoryObjects';
import MemoryArea from '../../../components/games/memory/MemoryArea';
import GameControls from '../../../components/games/memory/GameControls';
import FeedbackOverlay from '../../../components/games/memory/FeedbackOverlay';

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
        totalPauses: 0
    });

    // Feedback states
    const [showCorrectFeedback, setShowCorrectFeedback] = useState(false);
    const [showWrongFeedback, setShowWrongFeedback] = useState(false);
    const [showExitConfirm, setShowExitConfirm] = useState(false);
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

    const initializeGame = () => {
        const selectedItems = selectObjectsByDifficulty(config?.difficulty || 'fácil');
        
        // Set initial game state
        setGameState(prev => ({
            ...prev,
            items: selectedItems,
            currentOrder: Array(selectedItems.length).fill(null),
            correctOrder: [...selectedItems].sort((a, b) => a.id - b.id),
            showItems: config?.gameMode !== 'memoria'
        }));

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

    // Handle check result
    const handleCheckResult = (isCorrect) => {
        if (isCorrect) {
            setShowCorrectFeedback(true);
            setGameCompleted(true);
            
            // Hide feedback after delay and go to results
            setTimeout(() => {
                setShowCorrectFeedback(false);
                handleFinishGame(true);
            }, 3000);
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
        setGameState(prev => ({
            ...prev,
            showItems: true,
            helpCount: prev.helpCount + 1
        }));
        
        if (config?.gameMode === 'memoria') {
            // Hide items again after viewing period in memory mode
            setTimeout(() => {
                setGameState(prev => ({ 
                    ...prev, 
                    showItems: false,
                    memoryShows: prev.memoryShows + 1
                }));
            }, 5000);
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
            completed: completed
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
                </div>

                {/* Game area component */}
                {gameState.items.length > 0 && (
                    <MemoryArea
                        items={gameState.items}
                        difficulty={config?.difficulty || 'fácil'}
                        gameMode={config?.gameMode || 'normal'}
                        showItems={gameState.showItems}
                        onOrderChange={handleOrderChange}
                        onCheckResult={handleCheckResult}
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
        </div>
    );
};

export default MemoryGame;