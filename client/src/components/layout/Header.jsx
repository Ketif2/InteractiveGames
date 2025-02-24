// components/layout/Header.jsx
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-[#00398A] text-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <img 
              src="/src/assets/icons/brainLogo.svg" 
              alt="Logo" 
              className="w-8 h-8"
            />
            <h1 className="text-2xl font-semibold">Recuerda+</h1>
          </div>
          <div className="relative">
            <button 
              className="p-2 flex items-center gap-2 hover:bg-[#004AAE] rounded-md transition-colors duration-200"
              onClick={() => setShowMenu(!showMenu)}
            >
              <img 
                src="/src/assets/icons/userIcon.svg" 
                alt="Usuario" 
                className="w-8 h-8"
              />
            </button>

            {/* Menú desplegable */}
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                  <p className="font-medium">{user?.nombre} {user?.apellido}</p>
                  <p className="text-gray-500 text-xs">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors duration-200"
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;