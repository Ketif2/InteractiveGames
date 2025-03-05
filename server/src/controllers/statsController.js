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
  console.log('Params recibidos:', req.params);
  const { id } = req.params;
  
  if (!id) {
    console.error('ID de sesión no proporcionado en los parámetros');
    return res.status(400).json({ message: 'ID de sesión no proporcionado' });
  }
  
  try {
    // Obtenemos información básica de la sesión
    console.log(`Procesando petición para sesión ID: ${id}`);
    const [sessionRows] = await pool.query(`
      SELECT s.id_sesion, s.id_paciente, s.id_juego, s.id_terapeuta, s.fecha_sesion, s.observaciones_terapeuta,
             j.nombre_juego, j.categoria_cognitiva,
             CONCAT(p.nombre, ' ', p.apellido) AS nombre_paciente,
             p.diagnostico
      FROM sesion s
      JOIN juego j ON s.id_juego = j.id_juego
      JOIN paciente p ON s.id_paciente = p.id_paciente
      WHERE s.id_sesion = ?
    `, [id]);
    
    if (!sessionRows || sessionRows.length === 0) {
      return res.status(404).json({ message: 'Sesión no encontrada' });
    }
    
    const sessionInfo = sessionRows[0];
    
    // Obtenemos estadísticas generales del juego
    const [statsRows] = await pool.query(`
      SELECT * FROM estadisticas_juego
      WHERE id_sesion = ?
    `, [id]);
    
    // Obtenemos configuración específica según el tipo de juego
    let configRows = [];
    
    if (sessionInfo.nombre_juego === 'Rompecabezas') {
      [configRows] = await pool.query(`
        SELECT * FROM configuracion_puzzle
        WHERE id_sesion = ?
      `, [id]);
    } else if (sessionInfo.nombre_juego === 'Secuencia Lógica') {
      [configRows] = await pool.query(`
        SELECT * FROM configuracion_secuencia
        WHERE id_sesion = ?
      `, [id]);
    } else if (sessionInfo.nombre_juego === 'Ordena' || sessionInfo.nombre_juego === 'Sendero del Bosque') {
      [configRows] = await pool.query(`
        SELECT * FROM configuracion_memoria
        WHERE id_sesion = ?
      `, [id]);
    }
    
    // Construimos el objeto de respuesta
    const sessionDetails = {
      session: sessionInfo,
      statistics: statsRows[0] || null,
      configuration: configRows[0] || null
    };
    
    res.status(200).json(sessionDetails);
  } catch (error) {
    console.error('Error al obtener detalles de la sesión:', error);
    return res.status(500).json({ message: 'Error al obtener detalles de la sesión', error: error.message });
  }
};