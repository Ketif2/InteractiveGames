// controllers/games/sequenceController.js
import { pool } from '../../config/db.js';

const saveSequenceConfig = async (req, res) => {
    const { sessionId } = req.params;
    const { difficulty, hideImages, sequenceCount } = req.body;
    
    try {
        // Por ahora retornamos una respuesta simulada
        res.status(201).json({
            success: true,
            configId: 1,
            message: 'Configuración guardada exitosamente'
        });

        /* Cuando implementes la BD, descomenta esto:
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

        const [result] = await pool.query(
            `INSERT INTO sequence_config (
                id_sesion, 
                dificultad, 
                ocultar_imagenes,
                cantidad_cadenas,
                tiempo_inicio
            ) VALUES (?, ?, ?, ?, NOW())`,
            [sessionId, difficulty, hideImages, sequenceCount]
        );

        res.status(201).json({
            success: true,
            configId: result.insertId,
            message: 'Configuración guardada exitosamente'
        });
        */
    } catch (error) {
        console.error('Error al guardar la configuración:', error);
        res.status(500).json({
            success: false,
            message: 'Error al guardar la configuración de la secuencia'
        });
    }
};

const saveSequenceStats = async (req, res) => {
    const { configId } = req.params;
    const { 
        timeTotal,
        correctMoves,
        incorrectMoves,
        completed,
        showHelpCount
    } = req.body;

    try {
        // Por ahora retornamos una respuesta simulada
        res.status(201).json({
            success: true,
            message: 'Estadísticas guardadas exitosamente'
        });

        /* Cuando implementes la BD, descomenta esto:
        const [result] = await pool.query(
            `INSERT INTO sequence_estadisticas (
                id_config, 
                tiempo_total,
                movimientos_correctos,
                movimientos_incorrectos,
                veces_ayuda_mostrada,
                completado
            ) VALUES (?, ?, ?, ?, ?, ?)`,
            [configId, timeTotal, correctMoves, incorrectMoves, showHelpCount, completed]
        );

        await pool.query(
            `UPDATE sequence_config 
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
        */
    } catch (error) {
        console.error('Error al guardar estadísticas:', error);
        res.status(500).json({
            success: false,
            message: 'Error al guardar las estadísticas de la secuencia'
        });
    }
};

const updateSequenceConfig = async (req, res) => {
    const { configId } = req.params;
    const { completed } = req.body;

    try {
        // Por ahora retornamos una respuesta simulada
        res.status(200).json({
            success: true,
            message: 'Configuración actualizada exitosamente'
        });

        /* Cuando implementes la BD, descomenta esto:
        await pool.query(
            `UPDATE sequence_config 
             SET completado = ?,
                 tiempo_fin = NOW()
             WHERE id_config = ?`,
            [completed, configId]
        );

        res.status(200).json({
            success: true,
            message: 'Configuración actualizada exitosamente'
        });
        */
    } catch (error) {
        console.error('Error al actualizar configuración:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar la configuración'
        });
    }
};

const getSequenceSessionStats = async (req, res) => {
    const { sessionId } = req.params;

    try {
        // Por ahora retornamos datos simulados
        res.status(200).json({
            success: true,
            stats: {
                timeTotal: 300,
                correctMoves: 10,
                incorrectMoves: 2,
                showHelpCount: 3,
                completed: true
            }
        });

        /* Cuando implementes la BD, descomenta esto:
        const [stats] = await pool.query(
            `SELECT 
                sc.*,
                se.tiempo_total,
                se.movimientos_correctos,
                se.movimientos_incorrectos,
                se.veces_ayuda_mostrada,
                se.completado,
                se.fecha_registro as fecha_estadisticas
            FROM sequence_config sc 
            LEFT JOIN sequence_estadisticas se ON sc.id_config = se.id_config 
            WHERE sc.id_sesion = ?`,
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
        */
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener las estadísticas de la sesión'
        });
    }
};

export {
    saveSequenceConfig,
    saveSequenceStats,
    updateSequenceConfig,
    getSequenceSessionStats
};