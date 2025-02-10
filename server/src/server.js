import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import pool from './config/db.js';
import sessionRoutes from './routes/sessionRoutes.js';

import puzzleRoutes from './routes/games/puzzleRoutes.js'; 
import sequenceRoutes from './routes/games/sequenceRoutes.js';

import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();

app.use(cors({
    origin: 'http://localhost:5173'
  }));
  
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/games/puzzle', puzzleRoutes);
app.use('/api/games/sequence', sequenceRoutes);

const PORT = process.env.PORT || 5000;

(async () => {
    try {
        await pool.getConnection();
        console.log('✅ Database connected successfully');
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Error connecting to database:', error.message);
        process.exit(1);
    }
})();
