import pool from '../config/db.js'; 

export const getStatsPerSession = async (req, res) => {
    const { id_sesion } = req.params;
    try {
        const [rows] = await pool.query(
            'SELECT * FROM estadisticas_juego where id_sesion = ?',
            [id_sesion]
        );
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Estadísticas no encontradas' });
        }
        res.status(200).json({
            success: true,
            stats: rows[0]
        });
    } catch (error) {
        console.error('Error al obtener estadisticas:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const registerStats = async (req, res) => {
    const { 
        id_sesion, 
        tiempo_transcurrido, 
        num_errores, 
        num_aciertos, 
        num_pausas, 
        num_ayudas, 
        completado
    } = req.body;
    
    try {
        const [result] = await pool.query(
            `INSERT INTO estadisticas_juego (
                id_sesion, tiempo_transcurrido, num_errores, 
                num_aciertos, num_pausas, num_ayudas, 
                completado
            ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                id_sesion, 
                tiempo_transcurrido, 
                num_errores || 0, 
                num_aciertos || 0, 
                num_pausas || 0, 
                num_ayudas || 0, 
                completado || false
            ]
        );

        res.status(201).json({
            message: 'Estadísticas registradas exitosamente',
            id_estadistica: result.insertId
        });
    } catch (error) {
        console.error('Error al registrar estadísticas:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

