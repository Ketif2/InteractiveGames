// server/src/controllers/sessionController.js
import pool from '../config/db.js';

export const getAllSessions = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM sesion');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createSession = async (req, res) => {
  try {
    const { 
      id_paciente, 
      id_juego, 
      id_terapeuta,
      observaciones_terapeuta
     } = req.body;
    const [result] = await pool.query(
      'INSERT INTO sesion (id_paciente, id_juego, id_terapeuta, observaciones_terapeuta) VALUES (?, ?, ?, ?)',
      [id_paciente, id_juego, id_terapeuta, observaciones_terapeuta]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSession = async (req, res) => {
  try {
    const { id } = req.params;
    const { observaciones_terapeuta } = req.body;
    await pool.query(
      'UPDATE sesion SET observaciones_terapeuta = ? WHERE id_sesion = ?',
      [observaciones_terapeuta, id]
    );
    res.json({ message: 'Session updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSessionById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM sesion WHERE id_sesion = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Session not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTotalSessionsPerWeek = async (req, res) => {
  try {
    const { id_paciente } = req.params; // O req.query, según prefieras

    if (!id_paciente) {
        return res.status(400).json({
            success: false,
            message: 'Se requiere el ID del paciente'
        });
    }

    // Obtener fecha actual
    const today = new Date();
    
    // Obtener el inicio de la semana (Lunes)
    const firstDay = new Date(today);
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    firstDay.setDate(diff);
    firstDay.setHours(0, 0, 0, 0);
    
    // Obtener el fin de la semana (Domingo)
    const lastDay = new Date(firstDay);
    lastDay.setDate(lastDay.getDate() + 6);
    lastDay.setHours(23, 59, 59, 999);

    const [results] = await pool.query(
        `SELECT COUNT(*) as total_sesiones 
         FROM sesion 
         WHERE fecha_sesion >= ? 
         AND fecha_sesion <= ?
         AND id_paciente = ?`,
        [firstDay, lastDay, id_paciente]
    );

    res.json({
        success: true,
        id_paciente,
        total_sesiones: results[0].total_sesiones,
        semana: {
            inicio: firstDay,
            fin: lastDay
        }
    });

  } catch (error) {
      console.error('Error al obtener sesiones del paciente:', error);
      res.status(500).json({
          success: false,
          message: 'Error al obtener el conteo de sesiones del paciente'
      });
  };
};

export const getSessionToday = async (req, res) => {
  try {
    const { id_paciente } = req.params;
    // Obtener fecha actual y configurar para inicio del día
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Configurar para final del día
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [results] = await pool.query(
        `SELECT COUNT(*) as has_session 
          FROM sesion 
          WHERE fecha_sesion >= ? 
          AND fecha_sesion < ?
          AND id_paciente = ?`,
        [today, tomorrow, id_paciente]
    );

    res.json({
        success: true,
        has_session: results[0].has_session > 0
    });

  } catch (error) {
      console.error('Error al verificar la sesión del día:', error);
      res.status(500).json({
          success: false,
          message: 'Error al verificar la sesión del día'
      });
  }
}

export const getLastSession = async (req, res) => {
  try {
    const { id_paciente } = req.params;
    const [rows] = await pool.query(
        `SELECT * 
         FROM sesion 
         WHERE id_paciente = ? 
         ORDER BY fecha_sesion DESC 
         LIMIT 1`,
        [id_paciente]
    );
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


