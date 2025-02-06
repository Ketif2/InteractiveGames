// components/layout/Layout.jsx
import Header from './Header';
import { useLocation, Link } from 'react-router-dom';

const Layout = ({ children }) => {
  const location = useLocation();
  const pathName = location.pathname;

  const renderNavigation = () => {
    return (
      <nav className="bg-[#D7D7D7] border-b border-gray-200">
        <div className="container mx-auto">
          <div className="flex justify-center space-x-8 py-3">
            <Link 
              to="/"
              className={`text-base font-medium px-4 py-2 ${
                pathName === '/' 
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