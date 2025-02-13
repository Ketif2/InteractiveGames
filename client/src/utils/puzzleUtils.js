// src/utils/puzzleUtils.js

/**
 * Genera un array de piezas mezcladas para el rompecabezas
 * @param {number} gridSize - Tamaño del grid (4 para 4x4, 5 para 5x5, etc)
 * @param {string} imageUrl - URL de la imagen del rompecabezas
 * @returns {Array} Array de piezas mezcladas
 */
export const generateShuffledPieces = (gridSize, imageUrl) => {
    const totalPieces = gridSize * gridSize;
    const positions = Array.from({ length: totalPieces }, (_, i) => i);
    
    // Fisher-Yates shuffle
    for (let i = positions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [positions[i], positions[j]] = [positions[j], positions[i]];
    }

    return positions.map((pos, index) => ({
        id: `piece-${index}`,
        correctPosition: pos,
        currentPosition: index,
        imageUrl,
        isFixed: false
    }));
};

/**
 * Calcula el tiempo total de juego
 * @param {Date} startTime - Tiempo de inicio
 * @param {number} totalPauseTime - Tiempo total en pausas
 * @returns {number} Tiempo total en segundos
 */
export const calculateGameTime = (startTime, totalPauseTime) => {
    const endTime = Date.now();
    return Math.floor((endTime - startTime - totalPauseTime) / 1000);
};

/**
 * Verifica si todas las piezas están en su posición correcta
 * @param {Array} pieces - Array de piezas
 * @returns {boolean} true si el puzzle está completo
 */
export const isPuzzleComplete = (pieces) => {
    return pieces.every((piece, index) => piece.correctPosition === index);
};

/**
 * Calcula las estadísticas del juego
 * @param {object} gameState - Estado actual del juego
 * @returns {object} Estadísticas calculadas
 */
export const calculateGameStats = (gameState) => {
    const totalTime = calculateGameTime(gameState.startTime, gameState.totalPauseTime);
    
    return {
        successMoves: gameState.successMoves,
        failedMoves: gameState.failedMoves,
        helpCount: gameState.helpCount,
        totalTime,
        totalPauses: Math.floor(gameState.totalPauseTime / 1000)
    };
};