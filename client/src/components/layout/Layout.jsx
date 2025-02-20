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
      <nav className="bg-[#D7D7D7] border-b border-gray-200">
        <div className="container mx-auto">
          <div className="flex justify-center space-x-8 py-3">
            <Link 
              to="/dashboard"
              className={`text-base font-medium px-4 py-2 ${
                pathName.includes('/dashboard')
                  ? 'bg-[#00A8E3] text-white rounded-md'
                  : 'text-gray-700 hover:text-[#00A8E3]'
              }`}
            >
              Inicio
            </Link>
            <Link 
              to="/patients"
              className={`text-base font-medium px-4 py-2 ${
                pathName.includes('/patients')
                  ? 'bg-[#00A8E3] text-white rounded-md'
                  : 'text-gray-700 hover:text-[#00A8E3]'
              }`}
            >
              Pacientes
            </Link>
            <Link 
              to="/new-session"
              className={`text-base font-medium px-4 py-2 ${
                pathName.includes('/new-session')
                  ? 'bg-[#00A8E3] text-white rounded-md'
                  : 'text-gray-700 hover:text-[#00A8E3]'
              }`}
            >
              Nueva Sesión
            </Link>
          </div>
        </div>
      </nav>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#D7D7D7]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00A8E3]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#D7D7D7]">
      <Header />
      {renderNavigation()}
      <main className="container mx-auto p-4">
        {children}
      </main>
    </div>
  );
};

export default Layout;