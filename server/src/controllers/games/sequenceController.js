// src/controllers/games/sequenceController.js
import pool from '../../config/db.js';

export const getSequenceConfig = async (req, res) => {
    const { id_sesion } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM configuracion_secuencia WHERE id_sesion = ?', [id_sesion]);
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener configuración de secuencia:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const saveSequenceConfig = async (req, res) => {
    const { id_sesion, rango_inicial, rango_final, numeros_ocultar, modo_juego } = req.body;
    try {
        const [rows] = await pool.query(
            'INSERT INTO configuracion_secuencia (id_sesion, rango_inicial, rango_final, numeros_ocultar, modo_juego) VALUES (?, ?, ?, ?, ?)', 
            [id_sesion, rango_inicial, rango_final, numeros_ocultar, modo_juego]
        );
        res.json(rows);
    } catch (error) {
        console.error('Error al guardar configuración de secuencia:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};