import { useState, useEffect } from 'react';

export const usePuzzleGame = (config, configId, sessionId, puzzleService) => {
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
        failedMoves: 0,
        pauseCount: 0,
        initialPreview: true
    });

    const [screenOrientation, setScreenOrientation] = useState(
        window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
    );
    const [showCorrectFeedback, setShowCorrectFeedback] = useState(false);
    const [showWrongFeedback, setShowWrongFeedback] = useState(false);
    const [gameCompleted, setGameCompleted] = useState(false);
    const [showExitConfirm, setShowExitConfirm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Detectar cambios en la orientación de la pantalla
    useEffect(() => {
        const handleResize = () => {
            setScreenOrientation(
                window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
            );
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Inicializar el juego
    useEffect(() => {
        async function initialize() {
            try {
                setLoading(true);
                
                if (!config && configId) {
                    const response = await puzzleService.getConfig(configId);
                    if (response.success && response.config) {
                        initializePuzzles(response.config);
                    } else {
                        throw new Error('No se pudo cargar la configuración del juego');
                    }
                } else if (config) {
                    initializePuzzles(config);
                } else {
                    throw new Error('No se encontró configuración para el juego');
                }
                
                setLoading(false);
            } catch (err) {
                console.error('Error al inicializar el juego:', err);
                setError(err.message || 'Error al cargar el juego');
                setLoading(false);
            }
        }

        initialize();
    }, [configId, config, puzzleService]);

    // Mostrar la imagen por 10 segundos al inicio
    useEffect(() => {
        if (gameState.initialPreview) {
            const timer = setTimeout(() => {
                setGameState(prev => ({
                    ...prev,
                    initialPreview: false,
                    showHelp: false
                }));
            }, 10000);
            
            return () => clearTimeout(timer);
        }
    }, [gameState.initialPreview]);

    const initializePuzzles = (configData) => {
        const { selectedPuzzles } = configData;
        const gridSize = parseInt(configData.gridSize);
        
        const puzzles = selectedPuzzles.map(puzzleConfig => {
            const totalPieces = gridSize * gridSize;
            const positions = Array.from({ length: totalPieces }, (_, i) => i);
            
            // Aleatorizar posiciones
            for (let i = positions.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [positions[i], positions[j]] = [positions[j], positions[i]];
            }

            return {
                imageId: puzzleConfig.id,
                imageUrl: puzzleConfig.url,
                difficulty: puzzleConfig.difficulty,
                pieces: positions.map((pos, index) => ({
                    id: index,
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
            puzzles,
            showHelp: true,
            initialPreview: true
        }));
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        
        if (!over || active.id === over.id) return;

        const currentPuzzle = gameState.puzzles[gameState.currentPuzzleIndex];
        
        const activeId = active.id.toString();
        const overId = over.id.toString();
        
        const activeIdNum = parseInt(activeId.replace('piece-', ''));
        const overIdNum = parseInt(overId.replace('piece-', ''));
        
        const oldIndex = currentPuzzle.pieces.findIndex(piece => piece.id === activeIdNum);
        const newIndex = currentPuzzle.pieces.findIndex(piece => piece.id === overIdNum);

        if (oldIndex === -1 || newIndex === -1) return;
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
            
            if (updatedPuzzles.every(puzzle => puzzle.completed)) {
                setGameCompleted(true);
            } else if (gameState.currentPuzzleIndex < updatedPuzzles.length - 1) {
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
            helpCount: prev.helpCount + 1,
            puzzles: updatedPuzzles
        }));

        // Cerrar automáticamente después de 10 segundos
        setTimeout(() => {
            setGameState(prev => ({
                ...prev,
                showHelp: false
            }));
        }, 10000);
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
                pauseCount: prev.pauseCount + 1,
                lastPauseTime: now
            };
        });
    };

    const calculateGameStats = () => {
        const endTime = Date.now();
        const totalTime = Math.floor((endTime - gameState.startTime - gameState.totalPauseTime) / 1000);
      
        return {
            successMoves: gameState.puzzles.reduce((total, puzzle) => total + puzzle.stats.successMoves, 0),
            failedMoves: gameState.puzzles.reduce((total, puzzle) => total + puzzle.stats.failedMoves, 0),
            helpCount: gameState.puzzles.reduce((total, puzzle) => total + puzzle.stats.helpCount, 0),
            totalTime,
            pauseCount: gameState.pauseCount || 0,
            completed: gameState.puzzles.every(puzzle => puzzle.completed)
        };
    };

    return {
        gameState,
        screenOrientation,
        showCorrectFeedback,
        showWrongFeedback,
        gameCompleted,
        showExitConfirm,
        loading,
        error,
        handleDragEnd,
        handleToggleHelp,
        handleTogglePause,
        setShowExitConfirm,
        calculateGameStats,
        currentPuzzle: gameState.puzzles[gameState.currentPuzzleIndex] || {}
    };
};