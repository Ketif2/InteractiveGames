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
    const { id_paciente, id_juego, id_terapeuta } = req.body;
    const [result] = await pool.query(
      'INSERT INTO sesion (id_paciente, id_juego, id_terapeuta) VALUES (?, ?, ?)',
      [id_paciente, id_juego, id_terapeuta]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSession = async (req, res) => {
  try {
    const { id } = req.params;
    const { duracion, aciertos, fallos, observaciones_terapeuta } = req.body;
    await pool.query(
      'UPDATE sesion SET duracion = ?, aciertos = ?, fallos = ?, observaciones_terapeuta = ? WHERE id_sesion = ?',
      [duracion, aciertos, fallos, observaciones_terapeuta, id]
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