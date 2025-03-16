// pages/dashboard/Dashboard.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import Patients from '../../assets/icons/patient-icon.png';
import NewSession from '../../assets/icons/new-session.png';
import Stats from '../../assets/icons/stats-icon.png';

const Dashboard = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState('');
  
  useEffect(() => {
    // Actualizar el saludo según la hora del día
    const hour = currentTime.getHours();
    if (hour < 12) setGreeting('Buenos días');
    else if (hour < 18) setGreeting('Buenas tardes');
    else setGreeting('Buenas noches');
    
    // Actualizar la hora cada minuto
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00398A]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con saludo personalizado - Más sutil y elegante */}
      <div className="bg-gradient-to-r from-[#003380] to-[#0055b3] text-white py-8 px-6 shadow-md">
        <div className="container mx-auto max-w-5xl">
          <h1 className="text-3xl font-light">
            <span className="font-bold">{greeting},</span> {user?.nombre || 'Terapeuta'}
          </h1>
          <p className="mt-2 text-blue-100 opacity-90 font-light">
            {currentTime.toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>
      
      <div className="container mx-auto max-w-5xl px-4 py-10">
        {/* Título minimizado */}
        <h2 className="text-xl font-light text-gray-700 mb-8 border-b border-gray-200 pb-2">Dashboard</h2>
        
        {/* Cards con diseño minimalista */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Pacientes */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md transform hover:-translate-y-1">
            <div className="h-2 bg-blue-500"></div>
            <div className="p-6">
              <div className="flex items-start mb-4">
                <div className="mr-4 p-3 bg-blue-50 rounded-full">
                  <img 
                    src={Patients}
                    alt="Pacientes" 
                    className="w-8 h-8"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Pacientes</h3>
                  <p className="text-gray-500 text-sm">Información de pacientes</p>
                </div>
              </div>
              <Link 
                to="/patients"
                className="block w-full text-center text-blue-600 hover:text-blue-800 font-medium py-2 border border-blue-100 rounded-md hover:bg-blue-50 transition-colors"
              >
                Acceder
              </Link>
            </div>
          </div>

          {/* Nueva Sesión */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md transform hover:-translate-y-1">
            <div className="h-2 bg-green-500"></div>
            <div className="p-6">
              <div className="flex items-start mb-4">
                <div className="mr-4 p-3 bg-green-50 rounded-full">
                  <img 
                    src={NewSession}
                    alt="Nueva Sesión" 
                    className="w-8 h-8"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Nueva Sesión</h3>
                  <p className="text-gray-500 text-sm">Iniciar sesión de terapia</p>
                </div>
              </div>
              <Link 
                to="/new-session"
                className="block w-full text-center text-green-600 hover:text-green-800 font-medium py-2 border border-green-100 rounded-md hover:bg-green-50 transition-colors"
              >
                Iniciar
              </Link>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md transform hover:-translate-y-1">
            <div className="h-2 bg-purple-500"></div>
            <div className="p-6">
              <div className="flex items-start mb-4">
                <div className="mr-4 p-3 bg-purple-50 rounded-full">
                  <img 
                    src={Stats}
                    alt="Estadísticas" 
                    className="w-8 h-8"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Estadísticas</h3>
                  <p className="text-gray-500 text-sm">Ver historial y estadísticas</p>
                </div>
              </div>
              <Link 
                to="/stats"
                className="block w-full text-center text-purple-600 hover:text-purple-800 font-medium py-2 border border-purple-100 rounded-md hover:bg-purple-50 transition-colors"
              >
                Visualizar
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;