import { pool } from '../config/db.js';

export const getAllSessions = async (req, res) => {
  try {
    const query = `
      SELECT s.*, p.nombre, p.apellido 
      FROM sesion s 
      JOIN paciente p ON s.id_paciente = p.id_paciente
    `;
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createSession = async (req, res) => {
  const { idPaciente, idJuego, idTerapeuta } = req.body;
  
  try {
    const query = `
      INSERT INTO sesion (id_paciente, id_juego, id_terapeuta, fecha_sesion)
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
      RETURNING *
    `;
    const values = [idPaciente, idJuego, idTerapeuta];
    const { rows } = await pool.query(query, values);
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSession = async (req, res) => {
  const { id } = req.params;
  const { duracion, aciertos, fallos, observacionesTerapeuta } = req.body;

  try {
    const query = `
      UPDATE sesion 
      SET duracion = $1, aciertos = $2, fallos = $3, observaciones_terapeuta = $4
      WHERE id_sesion = $5
      RETURNING *
    `;
    const values = [duracion, aciertos, fallos, observacionesTerapeuta, id];
    const { rows } = await pool.query(query, values);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Sesión no encontrada' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};