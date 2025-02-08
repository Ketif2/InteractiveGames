import { Routes, Route } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';
import Layout from '../components/layout/Layout';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Dashboard from '../pages/dashboard/Dashboard';
import NewSession from '../pages/sessions/NewSession';
import GameDashboard from '../pages/games/GameDashboard';
import PuzzleConfig from '../pages/games/config/PuzzleConfig';

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
           {/* Aquí irá el componente de estadísticas cuando lo creemos */}
         </Layout>
       </PrivateRoute>
     } />

      <Route path="/games/puzzle/config" element={
        <PrivateRoute>
          <Layout>
            <PuzzleConfig />
          </Layout>
        </PrivateRoute>
      } />

     <Route path="/games/:gameId/play" element={
       <PrivateRoute>
         <Layout>
           {/* Aquí irá el componente de juego cuando lo creemos */}
         </Layout>
       </PrivateRoute>
     } />

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