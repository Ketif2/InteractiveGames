// src/pages/games/puzzle/PuzzleGame.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { puzzleService } from '../../../services/puzzleService';

const PuzzleGame = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { config, configId, patientId } = location.state || {};

    const [gameState, setGameState] = useState({
        currentPuzzle: 0,
        pieces: [],
        originalImage: '',
        showHelp: false,
        isPaused: false,
        startTime: Date.now(),
        totalPauseTime: 0,
        lastPauseTime: null,
        helpCount: 0,
        successMoves: 0,
        failedMoves: 0,
        showErrors: false
    });

    useEffect(() => {
        initializePuzzle();
    }, []);

    const initializePuzzle = async () => {
        const gridSize = parseInt(config.gridSize);
        const totalPieces = gridSize * gridSize;
        const positions = Array.from({ length: totalPieces }, (_, i) => i);
        
        // Mezclar posiciones
        for (let i = positions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [positions[i], positions[j]] = [positions[j], positions[i]];
        }

        const imageUrl = `/src/assets/images/puzzle/${config.difficulty}/Alpacas.jpg`;
        const pieces = positions.map((pos, index) => ({
            id: `piece-${index}`,
            correctPosition: pos,
            currentPosition: index,
            imageUrl,
            isFixed: false
        }));

        setGameState(prev => ({
            ...prev,
            pieces,
            originalImage: imageUrl
        }));
    };

    const handleDragEnd = (result) => {
        const { source, destination } = result;
        
        // Si no hay destino o es el mismo lugar, no hacemos nada
        if (!destination || 
            (source.droppableId === destination.droppableId && 
             source.index === destination.index)) {
            return;
        }

        // Crear copia del array de piezas
        const newPieces = Array.from(gameState.pieces);
        
        // Remover pieza del origen
        const [draggedPiece] = newPieces.splice(source.index, 1);
        // Insertar en el destino
        newPieces.splice(destination.index, 0, draggedPiece);

        // Verificar si la pieza está en su posición correcta
        const isCorrect = draggedPiece.correctPosition === destination.index;

        // Actualizar el estado
        setGameState(prev => ({
            ...prev,
            pieces: newPieces.map((piece, index) => ({
                ...piece,
                isFixed: piece.correctPosition === index // Se fija si está en posición correcta
            })),
            successMoves: prev.successMoves + (isCorrect ? 1 : 0),
            failedMoves: prev.failedMoves + (!isCorrect ? 1 : 0)
        }));

        // Verificar si el puzzle está completo
        if (newPieces.every((piece, index) => piece.correctPosition === index)) {
            handleFinishGame();
        }
    };

    const handleToggleHelp = () => {
        setGameState(prev => ({
            ...prev,
            showHelp: true,
            helpCount: prev.helpCount + 1
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
            successMoves: gameState.successMoves,
            failedMoves: gameState.failedMoves,
            helpCount: gameState.helpCount,
            totalTime,
            totalPauses: Math.floor(gameState.totalPauseTime / 1000)
        };

        navigate('/games/puzzle/end', { state: { stats, config, configId, patientId } });
    };

    const gridSize = parseInt(config.gridSize);

    return (
        <div className="fixed inset-0 bg-gray-100">
            {/* Barra superior */}
            <div className="absolute top-0 left-0 right-0 bg-[#00398A] text-white p-4 flex justify-between items-center">
                <div>Puzzle {gameState.currentPuzzle + 1} de {config.puzzleCount}</div>
                <div className="flex gap-4">
                    <button
                        onClick={handleToggleHelp}
                        className="bg-[#00A8E3] px-4 py-2 rounded"
                    >
                        Ver Imagen
                    </button>
                    <button
                        onClick={handleTogglePause}
                        className="bg-[#00A8E3] px-4 py-2 rounded"
                    >
                        {gameState.isPaused ? 'Reanudar' : 'Pausar'}
                    </button>
                    <button
                        onClick={handleFinishGame}
                        className="bg-red-500 px-4 py-2 rounded"
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
                            src={gameState.originalImage}
                            alt="Imagen original"
                            className={`w-full h-full object-cover transition-opacity duration-300 ${
                                gameState.showHelp ? 'opacity-100' : 'opacity-0'
                            }`}
                        />
                    </div>

                    {/* Puzzle */}
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId="puzzle-grid" type="PIECE">
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="grid gap-1"
                                    style={{
                                        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                                        width: '600px',
                                        height: '600px'
                                    }}
                                >
                                    {gameState.pieces.map((piece, index) => (
                                        <Draggable
                                            key={piece.id}
                                            draggableId={piece.id}
                                            index={index}
                                            isDragDisabled={piece.isFixed}
                                        >
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className={`relative bg-white rounded-lg shadow transition-all duration-300 ${
                                                        piece.isFixed ? 'border-4 border-green-500' :
                                                        'border border-gray-300 hover:border-blue-500'
                                                    } ${snapshot.isDragging ? 'z-50 shadow-xl' : ''}`}
                                                    style={{
                                                        aspectRatio: '1',
                                                        backgroundImage: `url(${piece.imageUrl})`,
                                                        backgroundSize: `${gridSize * 100}%`,
                                                        backgroundPosition: `${(piece.correctPosition % gridSize) * (100 / (gridSize - 1))}% ${Math.floor(piece.correctPosition / gridSize) * (100 / (gridSize - 1))}%`,
                                                        ...provided.draggableProps.style
                                                    }}
                                                />
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>
            </div>

            {/* Overlay de pausa */}
            {gameState.isPaused && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-8 rounded-lg text-center">
                        <h2 className="text-2xl font-bold text-[#00398A] mb-4">Juego Pausado</h2>
                        <button
                            onClick={handleTogglePause}
                            className="bg-[#00398A] text-white px-6 py-2 rounded"
                        >
                            Reanudar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PuzzleGame;