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

export const getSessionDetails = async (req, res) => {
    const { id_sesion } = req.params;
    try {
        console.log(`Procesando solicitud para sesión ID: ${id_sesion}`);
        
        // Verificar primero si la sesión existe
        const [sessionCheck] = await pool.query('SELECT * FROM sesion WHERE id_sesion = ?', [id_sesion]);
        
        if (sessionCheck.length === 0) {
            console.log(`No se encontró la sesión con ID: ${id_sesion}`);
            return res.status(404).json({ message: 'Sesión no encontrada' });
        }
        
        // Continuar con el resto de las consultas...
    } catch (error) {
        console.error('Error al obtener detalles de la sesión:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};