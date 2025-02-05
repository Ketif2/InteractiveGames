import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

// Register a new user
export const register = async (req, res) => {
    const { username, password, firstName, lastName, role } = req.body;

    try {
        // Check if the user already exists
        const [existingUser] = await pool.query('SELECT * FROM usuario WHERE nombre_usuario = ?', [username]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        const [result] = await pool.query(
            'INSERT INTO usuario (nombre_usuario, contraseña_hash, nombre, apellido, rol) VALUES (?, ?, ?, ?, ?)',
            [username, hashedPassword, firstName, lastName, role]
        );

        res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
    } catch (error) {
        console.error('Error during user registration:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// User login
export const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Get user from database
        const [users] = await pool.query('SELECT * FROM usuario WHERE nombre_usuario = ?', [username]);

        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const user = users[0];

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.contraseña_hash);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id_usuario, role: user.rol },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get user profile
export const getUserProfile = async (req, res) => {
    const userId = req.user.userId;

    try {
        const [users] = await pool.query('SELECT id_usuario, nombre, apellido, nombre_usuario, rol, fecha_registro FROM usuario WHERE id_usuario = ?', [userId]);

        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(users[0]);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
