import { Routes, Route } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';
import Layout from '../components/layout/Layout';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Dashboard from '../pages/dashboard/Dashboard';
import NewSession from '../pages/sessions/NewSession';
import GameDashboard from '../pages/games/GameDashboard';

import Patients from '../pages/patients/Patients';
import PuzzleConfig from '../pages/games/config/PuzzleConfig';
import SequenceConfig from '../pages/games/config/SequenceConfig';
import MemoryConfig from '../pages/games/config/MemoryConfig';
import ForestConfig from '../pages/games/config/ForestConfig';

import PuzzleGame from '../pages/games/puzzle/PuzzleGame';
import SequenceGame from '../pages/games/sequence/SequenceGame';
import MemoryGame from '../pages/games/memory/MemoryGame';
import ForestGame from '../pages/games/forest/ForestGame';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Rutas privadas */}
      <Route path="/" element={
        <PrivateRoute>
          <Layout>
            <Dashboard />
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

     <Route path="/sessions/:sessionId/stats" element={
       <PrivateRoute>
         <Layout>
           {/* Aquí irá el componente de estadísticas*/}
         </Layout>
       </PrivateRoute>
     } />

     {/* Juego Puzzle */}
     <Route path="/games/puzzle/config" element={
        <PrivateRoute>
          <Layout>
            <PuzzleConfig />
          </Layout>
        </PrivateRoute>
      } />

      <Route path="/games/puzzle/play" element={
        <PrivateRoute>
          <PuzzleGame />
        </PrivateRoute>
      } />

      <Route path="/patients" element={
        <PrivateRoute>
          <Patients />
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
      
      <Route path="/games/sequence/config" element={
        <PrivateRoute>
          <Layout>
            <SequenceConfig />
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

      {/* FIN DE JUEGOS ------------------------------------------- */}

     <Route path="/games/:gameId/end" element={
       <PrivateRoute>
         <Layout>
           {/* Aquí irá el componente de fin de juego cuando lo creemos */}
         </Layout>
       </PrivateRoute>
     } />
   </Routes>
  );
};