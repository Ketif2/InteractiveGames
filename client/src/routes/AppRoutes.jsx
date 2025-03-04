import { Routes, Route, Navigate } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';
import Layout from '../components/layout/Layout';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Dashboard from '../pages/dashboard/Dashboard';
import NewSession from '../pages/sessions/NewSession';
import GameDashboard from '../pages/games/GameDashboard';
import PatientDetails from '@/pages/patients/PatientDetails';
import Patients from '../pages/patients/Patients';

import PuzzleConfig from '../pages/games/config/PuzzleConfig';
import SequenceConfig from '../pages/games/config/SequenceConfig';
import MemoryConfig from '../pages/games/config/MemoryConfig';
import ForestConfig from '../pages/games/config/ForestConfig';

import PuzzleGame from '../pages/games/puzzle/PuzzleGame';
import SequenceGame from '../pages/games/sequence/SequenceGame';
import MemoryGame from '../pages/games/memory/MemoryGame';
import ForestGame from '../pages/games/forest/ForestGame';

import PuzzleEnd from '../pages/games/puzzle/PuzzleEnd';
import SequenceEnd from '../pages/games/sequence/SequenceEnd';
import MemoryEnd from '../pages/games/memory/MemoryEnd';

import Stats from '../pages/stats/Stats';
import PatientStats from '../pages/stats/PatientStats';
import SessionStats from '../pages/stats/SessionStats';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Rutas privadas */}
      <Route path="/dashboard" element={
        <PrivateRoute>
          <Layout>
            <Dashboard />
          </Layout>
        </PrivateRoute>
      } />

      <Route path="/patients" element={
        <PrivateRoute>
          <Layout>
            <Patients />
          </Layout>
        </PrivateRoute>
      } />

      <Route path="/patients/:id" element={
        <PrivateRoute>
          <Layout>
            <PatientDetails />
          </Layout>
        </PrivateRoute>
      } />

      {/* SESIÓN ------------------------------------------- */}
      
      <Route path="/new-session" element={
       <PrivateRoute>
         <Layout>
           <NewSession />
         </Layout>
       </PrivateRoute>
     } />

     <Route path="/games/:patientId" element={
       <PrivateRoute>
         <Layout>
           <GameDashboard />
         </Layout>
       </PrivateRoute>
     } />

     {/* Estadísticas -------------------------------------------*/}

     <Route path="/stats" element={
       <PrivateRoute>
         <Layout>
           <Stats/>
         </Layout>
       </PrivateRoute>
     } />

      <Route path="/stats/patient/:id/sessions" element={
       <PrivateRoute>
         <Layout>
           <PatientStats />
         </Layout>
       </PrivateRoute>
     } />

      <Route path="/stats/session/:id/details" element={
       <PrivateRoute>
         <Layout>
           <SessionStats />
         </Layout>
       </PrivateRoute>
     } />

     {/* Juego Puzzle -------------------------------------------*/}
     <Route path="/games/puzzle/config" element={
        <PrivateRoute>
          <Layout>
            <PuzzleConfig />
          </Layout>
        </PrivateRoute>
      } />

      <Route path="/games/puzzle/play" element={
        <PrivateRoute>
          <PuzzleGame/>
        </PrivateRoute>
      } />

      <Route path="/games/puzzle/end" element={
        <PrivateRoute>
          <Layout>
          <PuzzleEnd />
          </Layout>
        </PrivateRoute>
      } />

      {/* Juego Sequence */}
      <Route path="/games/sequence/config" element={
        <PrivateRoute>
          <Layout>
            <SequenceConfig />
          </Layout>
        </PrivateRoute>
      } />
      
      <Route path="/games/sequence/play" element={
        <PrivateRoute>
          <SequenceGame/>
        </PrivateRoute>
      } />

      <Route path="/games/sequence/end" element={
        <PrivateRoute>
          <Layout>
          <SequenceEnd />
          </Layout>
        </PrivateRoute>
      } />

      {/* Juego Memory */}
      <Route path="/games/memory/config" element={
        <PrivateRoute>
          <Layout>
            <MemoryConfig />
          </Layout>
        </PrivateRoute>
      } />
      
      <Route path="/games/memory/play" element={
        <PrivateRoute>
          <MemoryGame />
        </PrivateRoute>
      } />

      <Route path="/games/memory/end" element={
        <PrivateRoute>
          <Layout>
            <MemoryEnd />
          </Layout>
        </PrivateRoute>
      } />

      {/* Juego Forest */}
      <Route path="/games/forest/config" element={
        <PrivateRoute>
          <Layout>
            <ForestConfig />
          </Layout>
        </PrivateRoute>
      } />
      
      <Route path="/games/forest/play" element={
        <PrivateRoute>
          <ForestGame />
        </PrivateRoute>
      } />

      {/* Rutas por defecto */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
   </Routes>
  );
};