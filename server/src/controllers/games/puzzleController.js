import pool from '../../config/db.js';

export const getPuzzleConfig = async (req, res) => {
    const { id_sesion } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM configuracion_puzzle WHERE id_sesion = ?', [id_sesion]);
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener configuración del puzzle:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const savePuzzleConfig = async (req, res) => {
    const { id_sesion, tamano_grid, cantidad_puzzles, ids_imagenes } = req.body;
    try {
        const [rows] = await pool.query(
            'INSERT INTO configuracion_puzzle (id_sesion, tamano_grid, cantidad_puzzles, ids_imagenes) VALUES (?, ?, ?, ?)', 
            [id_sesion, tamano_grid, cantidad_puzzles, ids_imagenes]
        );
        res.json(rows);
    } catch (error) {
        console.error('Error al guardar configuración del puzzle:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};