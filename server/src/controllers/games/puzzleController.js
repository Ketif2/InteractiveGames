import pool from '../../config/db.js';

const savePuzzleConfig = async (req, res) => {
    const { sessionId } = req.params;
    const { difficulty, gridSize, puzzleCount } = req.body;
    
    try {
        // Primero verificamos que la sesión exista
        const [session] = await pool.query(
            'SELECT * FROM sesion WHERE id_sesion = ?',
            [sessionId]
        );

        if (session.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Sesión no encontrada'
            });
        }

        // Guardamos la configuración
        const [result] = await pool.query(
            `INSERT INTO puzzle_config (
                id_sesion, 
                dificultad, 
                tamano_grid, 
                cantidad_puzzles, 
                tiempo_inicio
            ) VALUES (?, ?, ?, ?, NOW())`,
            [sessionId, difficulty, gridSize, puzzleCount]
        );

        res.status(201).json({
            success: true,
            configId: result.insertId,
            message: 'Configuración guardada exitosamente'
        });
    } catch (error) {
        console.error('Error al guardar la configuración:', error);
        res.status(500).json({
            success: false,
            message: 'Error al guardar la configuración del puzzle'
        });
    }
};

const savePuzzleStats = async (req, res) => {
    const { configId } = req.params;
    const { 
        timeTotal,
        movesTotal,
        correctMoves,
        incorrectMoves,
        completed
    } = req.body;

    try {
        // Verificamos que exista la configuración
        const [config] = await pool.query(
            'SELECT * FROM puzzle_config WHERE id_config = ?',
            [configId]
        );

        if (config.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Configuración no encontrada'
            });
        }

        // Guardamos las estadísticas
        const [result] = await pool.query(
            `INSERT INTO puzzle_estadisticas (
                id_config, 
                tiempo_total, 
                movimientos_totales, 
                movimientos_correctos,
                movimientos_incorrectos, 
                puzzle_completado
            ) VALUES (?, ?, ?, ?, ?, ?)`,
            [configId, timeTotal, movesTotal, correctMoves, incorrectMoves, completed]
        );

        // Actualizamos el estado de completado en la configuración
        await pool.query(
            `UPDATE puzzle_config 
            SET completado = ?, 
                tiempo_fin = NOW() 
            WHERE id_config = ?`,
            [completed, configId]
        );

        res.status(201).json({
            success: true,
            statsId: result.insertId,
            message: 'Estadísticas guardadas exitosamente'
        });
    } catch (error) {
        console.error('Error al guardar estadísticas:', error);
        res.status(500).json({
            success: false,
            message: 'Error al guardar las estadísticas del puzzle'
        });
    }
};

const getPuzzleSessionStats = async (req, res) => {
    const { sessionId } = req.params;

    try {
        const [stats] = await pool.query(
            `SELECT 
                pc.*,
                pe.tiempo_total,
                pe.movimientos_totales,
                pe.movimientos_correctos,
                pe.movimientos_incorrectos,
                pe.puzzle_completado,
                pe.fecha_registro as fecha_estadisticas
            FROM puzzle_config pc 
            LEFT JOIN puzzle_estadisticas pe ON pc.id_config = pe.id_config 
            WHERE pc.id_sesion = ?`,
            [sessionId]
        );

        if (stats.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No se encontraron estadísticas para esta sesión'
            });
        }

        res.status(200).json({
            success: true,
            stats
        });
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener las estadísticas de la sesión'
        });
    }
};

const updatePuzzleConfig = async (req, res) => {
    const { configId } = req.params;
    const { completado, tiempo_fin } = req.body;

    try {
        // Verificamos que exista la configuración
        const [config] = await pool.query(
            'SELECT * FROM puzzle_config WHERE id_config = ?',
            [configId]
        );

        if (config.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Configuración no encontrada'
            });
        }

        // Actualizamos la configuración
        await pool.query(
            `UPDATE puzzle_config 
             SET completado = ?,
                 tiempo_fin = ?
             WHERE id_config = ?`,
            [completado, tiempo_fin || new Date(), configId]
        );

        res.status(200).json({
            success: true,
            message: 'Configuración actualizada exitosamente'
        });
    } catch (error) {
        console.error('Error al actualizar configuración:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar la configuración'
        });
    }
};

export {
    savePuzzleConfig,
    savePuzzleStats,
    getPuzzleSessionStats,
    updatePuzzleConfig  
};