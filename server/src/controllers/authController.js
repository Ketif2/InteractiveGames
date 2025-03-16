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
            { expiresIn: '16h' }
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
        const accessToken = jwt.sign(
            { 
                userId: user.id_terapeuta,
                role: 'terapeuta'
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Set HTTP Only cookie
        res.cookie('token', accessToken, { 
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // HTTPS en producción
            sameSite: 'lax', // Protección contra CSRF
            path: '/', // Asegura que la cookie esté disponible en toda la app
            maxAge: 3600000*16 // 1 hora
        });

        res.json({
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

export const verifyToken = async (req, res) => {
    try {
        const userId = req.user.userId;
        
        const [users] = await pool.query(
            'SELECT id_terapeuta, nombre, apellido, email FROM terapeuta WHERE id_terapeuta = ?',
            [userId]
        );

        if (users.length === 0) {
            res.clearCookie('token', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/'
            });
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const user = users[0];
        
        res.json({
            terapeuta: {
                id: user.id_terapeuta,
                nombre: user.nombre,
                apellido: user.apellido,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Error en verificación:', error);
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/'
        });
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

export const logout = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
    });
    res.json({ message: 'Sesión cerrada exitosamente' });
};

export default {
    register,
    login,
    verifyToken,
    logout
};