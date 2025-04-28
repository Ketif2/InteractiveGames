import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { usePuzzleGame } from '../../../hooks/usePuzzleGame';
import { puzzleService } from '../../../services/puzzleService';
import GameControls from '../../../components/games/puzzle/GameControls';
import PuzzleGameLayout from '../../../components/games/puzzle/PuzzleGameLayout';
import GameFeedback from '../../../components/games/puzzle/GameFeedback';
import GameOverlay from '../../../components/games/puzzle/GameOverlay';

const PuzzleGame = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { config, configId, patientId, sessionId } = location.state || {};

    const {
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
        currentPuzzle
    } = usePuzzleGame(config, configId, sessionId, puzzleService);

    // Finalizar el juego y navegar a la pantalla de resultados
    const handleFinishGame = () => {
        const stats = calculateGameStats();
        
        // Para pruebas, crear un sessionId falso si no existe
        const fakeSessionId = sessionId || Date.now();
      
        navigate('/games/puzzle/end', { 
            state: { 
                stats, 
                config,
                patientId,
                sessionId: sessionId || fakeSessionId
            } 
        });
    };

    // Si está cargando, mostrar indicador
    if (loading) {
        return (
            <div className="fixed inset-0 bg-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00398A]"></div>
            </div>
        );
    }

    // Si hay un error, mostrar mensaje
    if (error) {
        return (
            <div className="fixed inset-0 bg-gray-100 flex flex-col items-center justify-center p-4">
                <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
                <h2 className="text-xl font-semibold text-gray-800 mb-2 text-center">Error al cargar el juego</h2>
                <p className="text-gray-600 mb-6 text-center">{error}</p>
                <button
                    onClick={() => navigate(-1)}
                    className="bg-[#00398A] text-white px-6 py-2 rounded hover:bg-[#002d6f] transition-colors"
                >
                    Volver
                </button>
            </div>
        );
    }

    const gridSize = parseInt(config?.gridSize || 4);

    return (
        <div className="fixed inset-0 bg-gray-100">
            {/* Controles del juego */}
            <GameControls 
                currentIndex={gameState.currentPuzzleIndex}
                totalPuzzles={gameState.puzzles.length}
                onHelp={handleToggleHelp}
                onPause={handleTogglePause}
                onExit={() => setShowExitConfirm(true)}
                isPaused={gameState.isPaused}
            />

            {/* Área del juego */}
            <div className="absolute inset-0 mt-16 pb-2">
                <PuzzleGameLayout 
                    screenOrientation={screenOrientation}
                    showHelp={gameState.showHelp}
                    initialPreview={gameState.initialPreview}
                    currentPuzzle={currentPuzzle}
                    gridSize={gridSize}
                    onDragEnd={handleDragEnd}
                />
            </div>

            {/* Feedback visual */}
            <GameFeedback 
                isCorrect={showCorrectFeedback}
                isWrong={showWrongFeedback}
                gameCompleted={gameCompleted}
                onFinish={handleFinishGame}
                stats={calculateGameStats()}
            />

            {/* Overlay de pausa y confirmación */}
            <GameOverlay 
                isPaused={gameState.isPaused}
                showExitConfirm={showExitConfirm}
                onResume={handleTogglePause}
                onConfirmExit={handleFinishGame}
                onCancelExit={() => setShowExitConfirm(false)}
            />
        </div>
    );
};

export default PuzzleGame;