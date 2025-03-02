import pool from '../../config/db.js'; 

export const getMemoryConfig = async (req, res) => {
    const { id_sesion } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM configuracion_memoria where id_sesion = ?', [id_sesion]);
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener estadisticas:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const saveMemoryConfig = async (req, res) => {
    const { id_sesion, dificultad, categoria, numero_rondas } = req.body;
    try {
        const [rows] = await pool.query(
            'INSERT INTO configuracion_memoria (id_sesion, dificultad, categoria, numero_rondas) VALUES (?, ?, ?, ?)', 
            [id_sesion, dificultad, categoria, numero_rondas]);
        res.json(rows);
    } catch (error) {
        console.error('Error al guardar estadisticas:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};