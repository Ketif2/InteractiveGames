import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
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
const __dirname = path.resolve();

// Configuración de CORS mejorada
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas API
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

// Ruta de verificación de estado
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'API funcionando correctamente',
    environment: process.env.NODE_ENV,
    version: '1.0.0'
  });
});

// Servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Manejo de rutas no encontradas o no API
app.get('*', (req, res) => {
  if (!req.url.startsWith('/api')) {
    // Respuesta para rutas que no son de la API
    res.status(200).send('Recuerda+ Backend API está funcionando correctamente');
  } else {
    res.status(404).json({ message: 'API endpoint not found' });
  }
});

const PORT = process.env.PORT || 5000;

// Iniciar servidor
(async () => {
  try {
    await pool.getConnection();
    console.log('✅ Database connected successfully');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
    });
  } catch (error) {
    console.error('❌ Error connecting to database:', error.message);
    process.exit(1);
  }
})();