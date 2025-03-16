// components/layout/Layout.jsx
import Header from './Header';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Layout = ({ children }) => {
  const location = useLocation();
  const pathName = location.pathname;
  const { isLoading } = useAuth();

  const renderNavigation = () => {
    return (
      <nav className="bg-gray-50 border-b border-gray-200 shadow-sm">
        <div className="container mx-auto max-w-7xl">
          <div className="flex justify-center space-x-6 py-3 px-4">
            <Link 
              to="/dashboard"
              className={`text-base font-medium px-4 py-2 rounded-md transition-all duration-200 ${
                pathName.includes('/dashboard')
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
              }`}
            >
              Inicio
            </Link>
            <Link 
              to="/patients"
              className={`text-base font-medium px-4 py-2 rounded-md transition-all duration-200 ${
                pathName.includes('/patients')
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
              }`}
            >
              Pacientes
            </Link>
            <Link 
              to="/new-session"
              className={`text-base font-medium px-4 py-2 rounded-md transition-all duration-200 ${
                pathName.includes('/new-session')
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
              }`}
            >
              Nueva Sesión
            </Link>
            <Link 
              to="/stats"
              className={`text-base font-medium px-4 py-2 rounded-md transition-all duration-200 ${
                pathName.includes('/stats')
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
              }`}
            >
              Estadísticas
            </Link>
          </div>
        </div>
      </nav>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00398A]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {renderNavigation()}
      <main className="container mx-auto max-w-7xl px-4 py-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;