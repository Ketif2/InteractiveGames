// src/pages/games/puzzle/PuzzleGame.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { AlertTriangle } from 'lucide-react';
import SortablePuzzlePiece from '../../../components/games/puzzle/SortablePuzzlePiece';
import GameFeedback from '../../../components/games/puzzle/GameFeedback';
import { puzzleService } from '../../../services/puzzleService';

const PuzzleGame = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { config, configId, patientId } = location.state || {};

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    );

    const [gameState, setGameState] = useState({
        currentPuzzleIndex: 0,
        puzzles: [],
        showHelp: false,
        isPaused: false,
        startTime: Date.now(),
        totalPauseTime: 0,
        lastPauseTime: null,
        helpCount: 0,
        successMoves: 0,
        failedMoves: 0
    });

    const [showCorrectFeedback, setShowCorrectFeedback] = useState(false);
    const [showWrongFeedback, setShowWrongFeedback] = useState(false);
    const [gameCompleted, setGameCompleted] = useState(false);
    const [showExitConfirm, setShowExitConfirm] = useState(false);

    useEffect(() => {
        initializePuzzles();
    }, []);

    const initializePuzzles = () => {
        const { selectedPuzzles } = config;
        const gridSize = parseInt(config.gridSize);
        
        const puzzles = selectedPuzzles.map(puzzleConfig => {
            const totalPieces = gridSize * gridSize;
            const positions = Array.from({ length: totalPieces }, (_, i) => i);
            
            for (let i = positions.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [positions[i], positions[j]] = [positions[j], positions[i]];
            }

            return {
                imageId: puzzleConfig.id,
                imageUrl: puzzleConfig.url,
                difficulty: puzzleConfig.difficulty,
                pieces: positions.map((pos, index) => ({
                    id: `piece-${index}`,
                    correctPosition: pos,
                    currentPosition: index,
                    imageUrl: puzzleConfig.url,
                    isFixed: false
                })),
                completed: false,
                stats: {
                    successMoves: 0,
                    failedMoves: 0,
                    helpCount: 0
                }
            };
        });

        setGameState(prev => ({
            ...prev,
            puzzles
        }));
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        
        if (!over || active.id === over.id) return;

        const currentPuzzle = gameState.puzzles[gameState.currentPuzzleIndex];
        const oldIndex = currentPuzzle.pieces.findIndex(piece => `piece-${piece.id}` === active.id);
        const newIndex = currentPuzzle.pieces.findIndex(piece => `piece-${piece.id}` === over.id);

        if (currentPuzzle.pieces[newIndex].isFixed) return;

        const newPieces = [...currentPuzzle.pieces];
        const movingPiece = { ...newPieces[oldIndex] };
        const targetPiece = { ...newPieces[newIndex] };

        newPieces[newIndex] = {
            ...movingPiece,
            currentPosition: newIndex
        };
        
        newPieces[oldIndex] = {
            ...targetPiece,
            currentPosition: oldIndex
        };

        const isCorrect = movingPiece.correctPosition === newIndex;

        // Mostrar feedback
        if (isCorrect) {
            setShowCorrectFeedback(true);
            setTimeout(() => setShowCorrectFeedback(false), 2000);
        } else {
            setShowWrongFeedback(true);
            setTimeout(() => setShowWrongFeedback(false), 2000);
        }

        const updatedPuzzles = [...gameState.puzzles];
        updatedPuzzles[gameState.currentPuzzleIndex] = {
            ...currentPuzzle,
            pieces: newPieces.map(piece => ({
                ...piece,
                isFixed: piece.correctPosition === piece.currentPosition
            })),
            stats: {
                ...currentPuzzle.stats,
                successMoves: currentPuzzle.stats.successMoves + (isCorrect ? 1 : 0),
                failedMoves: currentPuzzle.stats.failedMoves + (!isCorrect ? 1 : 0)
            }
        };

        const isPuzzleComplete = newPieces.every(piece => piece.correctPosition === piece.currentPosition);
        if (isPuzzleComplete) {
            updatedPuzzles[gameState.currentPuzzleIndex].completed = true;
            
            // Si todos los puzzles están completos, terminamos el juego
            if (updatedPuzzles.every(puzzle => puzzle.completed)) {
                setGameCompleted(true);
            } else if (gameState.currentPuzzleIndex < updatedPuzzles.length - 1) {
                // Si hay más puzzles, mostramos el mensaje de éxito y preparamos el siguiente
                setTimeout(() => {
                    setGameState(prev => ({
                        ...prev,
                        currentPuzzleIndex: prev.currentPuzzleIndex + 1,
                        puzzles: updatedPuzzles
                    }));
                }, 2000);
            }
        }

        setGameState(prev => ({
            ...prev,
            puzzles: updatedPuzzles
        }));
    };

    const handleToggleHelp = () => {
        const updatedPuzzles = [...gameState.puzzles];
        updatedPuzzles[gameState.currentPuzzleIndex].stats.helpCount += 1;

        setGameState(prev => ({
            ...prev,
            showHelp: true,
            puzzles: updatedPuzzles
        }));

        setTimeout(() => {
            setGameState(prev => ({
                ...prev,
                showHelp: false
            }));
        }, 3000);
    };

    const handleTogglePause = () => {
        setGameState(prev => {
            const now = Date.now();
            if (prev.isPaused) {
                const pauseDuration = now - prev.lastPauseTime;
                return {
                    ...prev,
                    isPaused: false,
                    totalPauseTime: prev.totalPauseTime + pauseDuration,
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
        const totalTime = Math.floor((endTime - gameState.startTime - gameState.totalPauseTime) / 1000);

        const stats = {
            successMoves: gameState.puzzles.reduce((total, puzzle) => total + puzzle.stats.successMoves, 0),
            failedMoves: gameState.puzzles.reduce((total, puzzle) => total + puzzle.stats.failedMoves, 0),
            helpCount: gameState.puzzles.reduce((total, puzzle) => total + puzzle.stats.helpCount, 0),
            totalTime,
            totalPauses: Math.floor(gameState.totalPauseTime / 1000)
        };

        navigate('/games/puzzle/end', { state: { stats, config, configId, patientId } });
    };

    const currentPuzzle = gameState.puzzles[gameState.currentPuzzleIndex] || {};
    const gridSize = parseInt(config.gridSize);

    return (
        <div className="fixed inset-0 bg-gray-100">
            {/* Barra superior */}
            <div className="absolute top-0 left-0 right-0 bg-[#00398A] text-white p-4 flex justify-between items-center">
                <div>Puzzle {gameState.currentPuzzleIndex + 1} de {config.selectedPuzzles.length}</div>
                <div className="flex gap-4">
                    <button
                        onClick={handleToggleHelp}
                        className="bg-[#00A8E3] px-4 py-2 rounded hover:bg-[#0096cc] transition-colors"
                    >
                        Ver Imagen
                    </button>
                    <button
                        onClick={handleTogglePause}
                        className="bg-[#00A8E3] px-4 py-2 rounded hover:bg-[#0096cc] transition-colors"
                    >
                        {gameState.isPaused ? 'Reanudar' : 'Pausar'}
                    </button>
                    <button
                        onClick={() => setShowExitConfirm(true)}
                        className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition-colors"
                    >
                        Terminar
                    </button>
                </div>
            </div>

            {/* Área del juego */}
            <div className="absolute inset-0 mt-16 p-4">
                <div className="flex justify-center items-start gap-8 h-full">
                    {/* Imagen original */}
                    <div className="w-1/2 max-w-[600px] aspect-square bg-gray-200 rounded-lg overflow-hidden">
                        <img
                            src={currentPuzzle.imageUrl}
                            alt="Imagen original"
                            className={`w-full h-full object-cover transition-opacity duration-300 ${
                                gameState.showHelp ? 'opacity-100' : 'opacity-0'
                            }`}
                        />
                    </div>

                    {/* Puzzle */}
                    {currentPuzzle.pieces && (
                        <DndContext 
                            sensors={sensors}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext 
                                items={currentPuzzle.pieces.map(piece => `piece-${piece.id}`)}
                                strategy={rectSortingStrategy}
                            >
                                <div
                                    className="grid gap-1"
                                    style={{
                                        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                                        width: '600px',
                                        height: '600px'
                                    }}
                                >
                                    {currentPuzzle.pieces.map((piece, index) => (
                                        <SortablePuzzlePiece
                                            key={piece.id}
                                            piece={piece}
                                            index={index}
                                            gridSize={gridSize}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    )}
                </div>
            </div>

            {/* Feedback y Overlay */}
            <GameFeedback 
                isCorrect={showCorrectFeedback}
                isWrong={showWrongFeedback}
                gameCompleted={gameCompleted}
                onFinish={handleFinishGame}
            />

            {/* Overlay de pausa */}
            {gameState.isPaused && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg text-center">
                        <h2 className="text-2xl font-bold text-[#00398A] mb-4">Juego Pausado</h2>
                        <button
                            onClick={handleTogglePause}
                            className="bg-[#00398A] text-white px-6 py-2 rounded hover:bg-[#002d6f] transition-colors"
                        >
                            Reanudar
                        </button>
                    </div>
                </div>
            )}

            {/* Diálogo de confirmación para terminar */}
            {showExitConfirm && (
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
                                onClick={() => setShowExitConfirm(false)}
                                className="bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleFinishGame}
                                className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition-colors"
                            >
                                Aceptar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PuzzleGame;