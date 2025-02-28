import pool from '../../config/db.js'; 

export const getMemoryStats = async (req, res) => {
    const { id_sesion } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM estadisticas_juego where id_sesion = ?', [id_sesion]);
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener estadisticas:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};