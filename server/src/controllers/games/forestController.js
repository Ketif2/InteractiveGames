import pool from '../../config/db.js'; 

export const getForestConfig = async (req, res) => {
    const { id_sesion } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM configuracion_bosque where id_sesion = ?', [id_sesion]);
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener configuración:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const saveForestConfig = async (req, res) => {
    const { id_sesion, nivel, densidad_objetos, numero_rondas, tiempo_limite } = req.body;
    try {
        const [rows] = await pool.query(
            'INSERT INTO configuracion_bosque (id_sesion, nivel, densidad_objetos, numero_rondas, tiempo_limite) VALUES (?, ?, ?, ?, ?)', 
            [id_sesion, nivel, densidad_objetos, numero_rondas, tiempo_limite]);
        res.json(rows);
    } catch (error) {
        console.error('Error al guardar configuración:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};