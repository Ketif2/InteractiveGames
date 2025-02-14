import pool from '../config/db.js';

// Get user profile
export const getTherapistById = async (req, res) => {
    const { id } = req.params;

    try {
        const [users] = await pool.query(
            'SELECT id_terapeuta, nombre, apellido, email, fecha_registro FROM terapeuta WHERE id_terapeuta = ?',
            [id]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: 'Terapeuta no encontrado' });
        }

        res.json(users[0]);
    } catch (error) {
        console.error('Error al obtener perfil:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

export const updateTherapistProfile = async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, email } = req.body;

    try {
        // Check if email is being changed and if it's already taken
        if (email) {
            const [existingUser] = await pool.query(
                'SELECT * FROM terapeuta WHERE email = ? AND id_terapeuta != ?',
                [email, id]
            );
            
            if (existingUser.length > 0) {
                return res.status(400).json({ message: 'El email ya está en uso' });
            }
        }

        const [result] = await pool.query(
            'UPDATE terapeuta SET nombre = ?, apellido = ?, email = ? WHERE id_terapeuta = ?',
            [nombre, apellido, email, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Terapeuta no encontrado' });
        }

        res.json({ message: 'Perfil actualizado exitosamente' });
    } catch (error) {
        console.error('Error al actualizar perfil:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

export const getAllMyPatients = async (req, res) => {
    try {
        const { id } = req.params;
        const [patients] = await pool.query(
            'SELECT * FROM paciente WHERE id_terapeuta = ?',
            [id]
        );

        res.json(patients);
    } catch (error) {
        console.error('Error al obtener pacientes:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

export const getTherapists = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM terapeuta');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener terapeutas:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export default {
    getTherapistById,
    updateTherapistProfile,
    getAllMyPatients,
    getTherapists
};