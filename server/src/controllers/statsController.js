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

export const getSessionsByPatient = async (req, res) => {
    const { id_paciente } = req.params;
    try {
        const [rows] = await pool.query(`
            SELECT s.id_sesion, s.fecha_sesion, s.observaciones_terapeuta, 
                   j.nombre_juego, j.categoria_cognitiva,
                   CASE 
                     WHEN e.id_estadistica IS NOT NULL THEN 'Completada' 
                     ELSE 'Pendiente' 
                   END AS estado
            FROM sesion s
            LEFT JOIN juego j ON s.id_juego = j.id_juego
            LEFT JOIN estadisticas_juego e ON s.id_sesion = e.id_sesion
            WHERE s.id_paciente = ?
            ORDER BY s.fecha_sesion DESC
        `, [id_paciente]);
        
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener sesiones:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Obtener detalles completos de una sesión específica
export const getSessionDetails = async (req, res) => {
    const { id_sesion } = req.params;
    try {
        // Obtenemos los datos básicos de la sesión
        const [sessionData] = await pool.query(`
            SELECT s.id_sesion, s.fecha_sesion, s.observaciones_terapeuta, s.id_paciente, s.id_terapeuta,
                   j.id_juego, j.nombre_juego, j.categoria_cognitiva,
                   p.nombre AS nombre_paciente, p.apellido AS apellido_paciente,
                   t.nombre AS nombre_terapeuta, t.apellido AS apellido_terapeuta
            FROM sesion s
            JOIN juego j ON s.id_juego = j.id_juego
            JOIN paciente p ON s.id_paciente = p.id_paciente
            LEFT JOIN terapeuta t ON s.id_terapeuta = t.id_terapeuta
            WHERE s.id_sesion = ?
        `, [id_sesion]);

        if (sessionData.length === 0) {
            return res.status(404).json({ message: 'Sesión no encontrada' });
        }

        // Obtenemos las estadísticas del juego
        const [statsData] = await pool.query(
            'SELECT * FROM estadisticas_juego WHERE id_sesion = ?', 
            [id_sesion]
        );

        // Obtenemos la configuración específica dependiendo del tipo de juego
        const gameId = sessionData[0].id_juego;
        let configData = [];
        
        switch (gameId) {
            case 1: // Rompecabezas
                [configData] = await pool.query('SELECT * FROM configuracion_puzzle WHERE id_sesion = ?', [id_sesion]);
                break;
            case 2: // Memoria
                [configData] = await pool.query('SELECT * FROM configuracion_memoria WHERE id_sesion = ?', [id_sesion]);
                break;
            case 3: // Secuencia
                [configData] = await pool.query('SELECT * FROM configuracion_secuencia WHERE id_sesion = ?', [id_sesion]);
                break;
            default:
                break;
        }

        res.json({
            session: sessionData[0],
            stats: statsData.length > 0 ? statsData[0] : null,
            config: configData.length > 0 ? configData[0] : null
        });
    } catch (error) {
        console.error('Error al obtener detalles de la sesión:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
