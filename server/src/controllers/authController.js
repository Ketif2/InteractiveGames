import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

// Register a new user
export const register = async (req, res) => {
    const { nombre, apellido, email, password } = req.body;

    try {
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET no está definido en las variables de entorno');
            throw new Error('JWT_SECRET no configurado');
        }

        // Check if the therapist already exists
        const [existingUser] = await pool.query(
            'SELECT * FROM terapeuta WHERE email = ?', 
            [email]
        );
        
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'El email ya está registrado' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new therapist
        const [result] = await pool.query(
            'INSERT INTO terapeuta (nombre, apellido, email, contraseña_hash) VALUES (?, ?, ?, ?)',
            [nombre, apellido, email, hashedPassword]
        );

        // Generate JWT token for immediate login
        const token = jwt.sign(
            { 
                userId: result.insertId,
                role: 'terapeuta'
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({ 
            message: 'Terapeuta registrado exitosamente',
            userId: result.insertId,
            token
        });
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// User login
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Get therapist from database
        const [users] = await pool.query(
            'SELECT * FROM terapeuta WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const user = users[0];

        // Verify password
        const validPassword = await bcrypt.compare(password, user.contraseña_hash);
        
        if (!validPassword) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: user.id_terapeuta,
                role: 'terapeuta'
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            token,
            terapeuta: {
                id: user.id_terapeuta,
                nombre: user.nombre,
                apellido: user.apellido,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Get user profile
export const getTherapistProfile = async (req, res) => {
    const userId = req.user.userId;

    try {
        const [users] = await pool.query(
            'SELECT id_terapeuta, nombre, apellido, email, fecha_registro FROM terapeuta WHERE id_terapeuta = ?',
            [userId]
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
    const userId = req.user.userId;
    const { nombre, apellido, email } = req.body;

    try {
        // Check if email is being changed and if it's already taken
        if (email) {
            const [existingUser] = await pool.query(
                'SELECT * FROM terapeuta WHERE email = ? AND id_terapeuta != ?',
                [email, userId]
            );
            
            if (existingUser.length > 0) {
                return res.status(400).json({ message: 'El email ya está en uso' });
            }
        }

        const [result] = await pool.query(
            'UPDATE terapeuta SET nombre = ?, apellido = ?, email = ? WHERE id_terapeuta = ?',
            [nombre, apellido, email, userId]
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
        const { id_terapeuta } = req.params;

        const [patients] = await pool.query(
            'SELECT * FROM paciente WHERE id_terapeuta = ?',
            [id_terapeuta]
        );

        res.json(patients);
    } catch (error) {
        console.error('Error al obtener pacientes:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

export default {
    register,
    login,
    getTherapistProfile,
    updateTherapistProfile
};