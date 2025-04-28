import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { usePuzzleGame } from '../../../hooks/usePuzzleGame';
import { puzzleService } from '../../../services/puzzleService';
import GameControls from '../../../components/games/puzzle/GameControls';
import PuzzleGrid from '../../../components/games/puzzle/PuzzleGrid';
import GameFeedback from '../../../components/games/puzzle/GameFeedback';
import GameOverlay from '../../../components/games/puzzle/GameOverlay';
import PuzzleHelp from '../../../components/games/puzzle/PuzzleHelp';

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
        handlePieceClick,
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

    // Renderizado del layout de juego basado en orientación de pantalla
    const renderGameLayout = () => {
        if (screenOrientation === 'landscape') {
            return (
                <div className="flex h-full justify-center items-center">
                    {/* Panel izquierdo - imagen original */}
                    <div className={`h-full flex items-center justify-center transition-all duration-500 ${
                        gameState.showHelp || gameState.initialPreview ? 'w-[40%]' : 'w-0 opacity-0'
                    }`}>
                        <div className="relative w-full h-full p-1 flex items-center justify-center">
                            <PuzzleHelp 
                                originalImage={currentPuzzle.imageUrl} 
                                showHelp={gameState.showHelp || gameState.initialPreview} 
                            />
                        </div>
                    </div>

                    {/* Rompecabezas */}
                    <div className={`h-full flex items-center justify-center transition-all duration-500 ${
                        gameState.showHelp || gameState.initialPreview ? 'w-[60%]' : 'w-full'
                    }`}>
                        <PuzzleGrid 
                            gridSize={gridSize}
                            pieces={currentPuzzle.pieces || []}
                            onPieceClick={handlePieceClick}
                            selectedPieceIndex={gameState.selectedPieceIndex}
                        />
                    </div>
                </div>
            );
        } else {
            return (
                <div className="flex flex-col h-full">
                    {/* Rompecabezas */}
                    <div className={`w-full flex justify-center items-center transition-all duration-500 ${
                        gameState.showHelp || gameState.initialPreview ? 'h-2/3' : 'h-full'
                    }`}>
                        <PuzzleGrid 
                            gridSize={gridSize}
                            pieces={currentPuzzle.pieces || []}
                            onPieceClick={handlePieceClick}
                            selectedPieceIndex={gameState.selectedPieceIndex}
                        />
                    </div>
                    
                    {/* Imagen original */}
                    <div className={`w-full flex justify-center items-center transition-all duration-500 ${
                        gameState.showHelp || gameState.initialPreview ? 'opacity-100 h-1/3' : 'opacity-0 h-0'
                    }`}>
                        <div className="relative w-full h-full p-2 flex items-center justify-center">
                            <PuzzleHelp 
                                originalImage={currentPuzzle.imageUrl} 
                                showHelp={gameState.showHelp || gameState.initialPreview} 
                            />
                        </div>
                    </div>
                </div>
            );
        }
    };

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
                {renderGameLayout()}
            </div>

            <div className={`absolute bottom-3 right-3 transition-opacity duration-300 ${
                gameState.selectedPieceIndex !== null ? 'opacity-100' : 'opacity-0'
            }`}>
                <div className="bg-[#00398A] text-white px-4 py-2 rounded-lg inline-block shadow-md max-w-xs text-sm">
                    <span className="font-medium">Pieza seleccionada</span> - Haz clic en otra pieza para intercambiarlas
                </div>
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