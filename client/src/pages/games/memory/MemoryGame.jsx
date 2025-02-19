// src/pages/games/memory/MemoryGame.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { selectObjectsByDifficulty } from '../../../data/memoryObjects';
import DraggableItem from '../../../components/games/memory/DraggableItem';
import GameControls from '../../../components/games/memory/GameControls';
import FeedbackOverlay from '../../../components/games/memory/FeedbackOverlay';

const MemoryGame = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { config, patientId } = location.state || {};

    // Estado del juego
    const [gameState, setGameState] = useState({
        items: [],               // objetos seleccionados para el juego
        currentOrder: [],        // orden actual de los objetos
        originalOrder: [],       // orden original para comparar
        showItems: true,         // visibilidad de los objetos
        isPaused: false,
        startTime: Date.now(),
        totalPauseTime: 0,
        lastPauseTime: null,
        helpCount: 0,
        attempts: 0,
        memoryShows: 0
    });

    // Estados de retroalimentación
    const [showCorrectFeedback, setShowCorrectFeedback] = useState(false);
    const [showWrongFeedback, setShowWrongFeedback] = useState(false);
    const [showExitConfirm, setShowExitConfirm] = useState(false);
    const [gameCompleted, setGameCompleted] = useState(false);

    // Inicialización del juego
    useEffect(() => {
        initializeGame();
    }, []);

    const initializeGame = () => {
        const selectedItems = selectObjectsByDifficulty(config.difficulty);
        
        setGameState(prev => ({
            ...prev,
            items: selectedItems,
            currentOrder: [...Array(selectedItems.length)].map((_, i) => i),
            originalOrder: [...Array(selectedItems.length)].map((_, i) => i),
            showItems: config.gameMode !== 'memoria'
        }));

        // En modo memoria, ocultar los objetos después de 10 segundos
        if (config.gameMode === 'memoria') {
            setTimeout(() => {
                setGameState(prev => ({ ...prev, showItems: false }));
            }, 10000);
        }
    };

    // Manejar el cambio de posición de los objetos
    const handleDrop = (sourceIndex, targetIndex) => {
        if (sourceIndex === targetIndex) return;

        setGameState(prev => {
            const newOrder = [...prev.currentOrder];
            const [movedItem] = newOrder.splice(sourceIndex, 1);
            newOrder.splice(targetIndex, 0, movedItem);
            return { ...prev, currentOrder: newOrder };
        });
    };

    // Verificar el orden de los objetos
    const handleCheck = () => {
        // Verificar si los objetos están en orden por ID (menor a mayor)
        const isCorrect = gameState.currentOrder.every((itemIndex, position) => {
            return gameState.items[itemIndex].id === gameState.items[position].id;
        });

        if (isCorrect) {
            setShowCorrectFeedback(true);
            setGameCompleted(true);
            setTimeout(() => setShowCorrectFeedback(false), 2000);
        } else {
            setShowWrongFeedback(true);
            setGameState(prev => ({
                ...prev,
                attempts: prev.attempts + 1
            }));
            setTimeout(() => setShowWrongFeedback(false), 2000);
        }
    };

    // Manejadores de controles del juego
    const handleHelp = () => {
        setGameState(prev => ({
            ...prev,
            showItems: true,
            helpCount: prev.helpCount + 1
        }));
        
        if (config.gameMode === 'memoria') {
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
            attempts: gameState.attempts,
            helpCount: gameState.helpCount,
            memoryShows: gameState.memoryShows,
            totalTime,
            totalPauses: Math.floor(gameState.totalPauseTime / 1000)
        };

        navigate('/games/memory/end', { 
            state: { 
                stats,
                config,
                patientId
            } 
        });
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="fixed inset-0 bg-gray-100">
                {/* Barra de controles */}
                <div className="fixed top-0 left-0 right-0 z-50">
                    <GameControls 
                        onHelp={handleHelp}
                        onPause={handleTogglePause}
                        onExit={() => setShowExitConfirm(true)}
                        isPaused={gameState.isPaused}
                        gameMode={config.gameMode}
                    />
                </div>

                {/* Área principal del juego */}
                <div className="mt-16 p-4 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
                    {/* Instrucciones */}
                    <div className="mb-8 text-center">
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">
                            Ordena los objetos del más ligero al más pesado
                        </h2>
                        <p className="text-gray-600">
                            Arrastra los objetos para ordenarlos correctamente
                        </p>
                    </div>

                    {/* Área de objetos */}
                    <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6">
                        <div className="flex flex-wrap justify-center gap-4">
                            {gameState.showItems && gameState.currentOrder.map((itemIndex, position) => (
                                <DraggableItem
                                    key={gameState.items[itemIndex].id}
                                    id={gameState.items[itemIndex].id}
                                    index={position}
                                    name={gameState.items[itemIndex].name}
                                    showName={config.showObjectName}
                                    onDrop={handleDrop}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Botón de verificación */}
                    <button
                        onClick={handleCheck}
                        className="mt-8 px-8 py-3 bg-[#00398A] text-white rounded-lg
                                 hover:bg-[#002d6f] transition-colors text-lg font-semibold
                                 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={gameState.isPaused || !gameState.showItems}
                    >
                        Verificar Orden
                    </button>
                </div>

                {/* Overlays de retroalimentación */}
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
        </DndProvider>
    );
};

export default MemoryGame;