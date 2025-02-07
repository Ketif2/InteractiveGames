
import { pool } from '../config/db.js';

export const getGames = async (req, res) => {
  try {
    const query = 'SELECT * FROM juego';
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getGameConfig = async (req, res) => {
  const { id } = req.params;
  
  try {
    const query = 'SELECT * FROM juego WHERE id_juego = $1';
    const { rows } = await pool.query(query, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Juego no encontrado' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const saveGameResults = async (req, res) => {
  const { id } = req.params;
  const { idSesion, aciertos, fallos, duracion } = req.body;

  try {
    const query = `
      UPDATE sesion 
      SET aciertos = $1, fallos = $2, duracion = $3
      WHERE id_sesion = $4 AND id_juego = $5
      RETURNING *
    `;
    const values = [aciertos, fallos, duracion, idSesion, id];
    const { rows } = await pool.query(query, values);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Sesión no encontrada' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};