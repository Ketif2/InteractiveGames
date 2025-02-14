import pool from '../config/db.js';

// Obtener todos los pacientes
export const getPacientes = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM paciente');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener pacientes:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Obtener un paciente por ID
export const getPacienteById = async (req, res) => {
    const { id } = req.params;
    try {
        const [patients] = await pool.query(
            'SELECT * FROM paciente WHERE id_paciente = ?',
            [id]
        );

        if (patients.length === 0) {
            return res.status(404).json({ message: 'Paciente no encontrado' });
        }

        res.json(patients[0]);
    } catch (error) {
        console.error('Error al obtener paciente:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Crear un nuevo paciente
export const createPaciente = async (req, res) => {
    const { 
        id_terapeuta,
        nombre, 
        apellido, 
        fecha_nacimiento,
        sexo, 
        diagnostico, 
        documentos 
    } = req.body;
    try {
        const [result] = await pool.query(
            `INSERT INTO paciente (
                id_terapeuta, nombre, apellido, 
                fecha_nacimiento, sexo, diagnostico, documentos
            ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                id_terapeuta, nombre, apellido, 
                fecha_nacimiento, sexo, diagnostico, 
                documentos ? JSON.stringify(documentos) : null
            ]
        );

        res.status(201).json({
            message: 'Paciente creado exitosamente',
            pacienteId: result.insertId
        });
    } catch (error) {
        console.error('Error al crear paciente:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Actualizar un paciente por ID
export const updatePaciente = async (req, res) => {
    const { id } = req.params;
    const { id_terapeuta, nombre, apellido, fecha_nacimiento, diagnostico } = req.body;
    try {
        const [result] = await pool.query(
            'UPDATE paciente SET id_terapeuta = ?, nombre = ?, apellido = ?, fecha_nacimiento = ?, diagnostico = ? WHERE id_paciente = ?',
            [id_terapeuta, nombre, apellido, fecha_nacimiento, diagnostico, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Paciente no encontrado' });
        }

        res.json({ message: 'Paciente actualizado' });
    } catch (error) {
        console.error('Error al actualizar paciente:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Eliminar un paciente por ID
export const deletePaciente = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM paciente WHERE id_paciente = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Paciente no encontrado' });
        }

        res.json({ message: 'Paciente eliminado' });
    } catch (error) {
        console.error('Error al eliminar paciente:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const assignTherapist = async (req, res) => {
    try {
        const { id_paciente } = req.params;
        const { id_terapeuta } = req.body;

        // Verificar que el paciente existe
        const [patient] = await pool.query(
            'SELECT * FROM paciente WHERE id_paciente = ?',
            [id_paciente]
        );

        if (patient.length === 0) {
            return res.status(404).json({ message: 'Paciente no encontrado' });
        }

        // Verificar que el terapeuta existe
        const [therapist] = await pool.query(
            'SELECT * FROM terapeuta WHERE id_terapeuta = ?',
            [id_terapeuta]
        );

        if (therapist.length === 0) {
            return res.status(404).json({ message: 'Terapeuta no encontrado' });
        }

        // Asignar terapeuta al paciente
        const [result] = await pool.query(
            'UPDATE paciente SET id_terapeuta = ? WHERE id_paciente = ?',
            [id_terapeuta, id_paciente]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'No se pudo asignar el terapeuta' });
        }

        res.json({ 
            message: 'Terapeuta asignado exitosamente',
            id_paciente,
            id_terapeuta
        });
    } catch (error) {
        console.error('Error al asignar terapeuta:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

export default {
    getPacientes, 
    getPacienteById, 
    createPaciente, 
    updatePaciente, 
    deletePaciente, 
    assignTherapist
};