import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import pool from './config/db.js';
import cookieParser from 'cookie-parser';
import sessionRoutes from './routes/sessionRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import therapistRoutes from './routes/therapistRoutes.js';
import authRoutes from './routes/authRoutes.js';

import statsRoutes from './routes/statsRoutes.js';
import generalStatsRoutes from './routes/generalStatsRoutes.js';

import memoryRoutes from './routes/games/memoryRoutes.js';
import puzzleRoutes from './routes/games/puzzleRoutes.js';
import sequenceRoutes from './routes/games/sequenceRoutes.js';
import forestRoutes from './routes/games/forestRoutes.js';

dotenv.config();

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
  }));
app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/therapist', therapistRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/sessions', sessionRoutes);

app.use('/api/games/stats', statsRoutes);
app.use('/api/stats', generalStatsRoutes);

app.use('/api/games/sequence', sequenceRoutes);
app.use('/api/games/memory', memoryRoutes);
app.use('/api/games/puzzle', puzzleRoutes);
app.use('/api/games/forest', forestRoutes);

app.get('*', (req, res) => {
    if (!req.url.startsWith('/api')) {
      res.redirect('/'); // Redirige al index.html de tu app React
    } else {
      res.status(404).json({ message: 'API endpoint not found' });
    }
  });

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
