import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

import MainLogo from '/icons/logoApp.svg';
import UserIcon from '/icons/doctor icon.png';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const { isLoading } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00398A]"></div>
      </div>
    );
  }

  return (
    <header className="bg-gradient-to-r from-[#003380] to-[#0055b3] text-white shadow-md">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <img 
              src={MainLogo}
              alt="Logo" 
              className="w-8 h-8"
            />
            <h1 className="text-2xl font-light">
              <span className="font-bold">Recuerda</span>+
            </h1>
          </div>
          <div className="relative">
            <button 
              className="p-2 flex items-center gap-2 hover:bg-blue-800 rounded-md transition-all duration-200"
              onClick={() => setShowMenu(!showMenu)}
            >
              <div className="flex items-center">
                <span className="mr-2 text-sm font-light hidden md:inline">
                  {user?.nombre} {user?.apellido}
                </span>
                <div className="bg-blue-100 bg-opacity-20 p-2 rounded-full">
                  <img 
                    src={UserIcon}
                    alt="Usuario" 
                    className="w-6 h-6"
                  />
                </div>
              </div>
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-100 overflow-hidden">
                <div className="px-4 py-3 text-sm text-gray-700 border-b border-gray-100 bg-gray-50">
                  <p className="font-medium">{user?.nombre} {user?.apellido}</p>
                  <p className="text-gray-500 text-xs">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors duration-200"
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