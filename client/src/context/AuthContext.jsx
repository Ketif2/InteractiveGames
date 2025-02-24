// context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@/services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificación automática al cargar la aplicación
  useEffect(() => {
    console.log('🔄 Montando el AuthContext - Se ejecutará verifyAuth');

    const verifyAuth = async () => {
        console.log('🔍 Iniciando verificación de autenticación...');
        
        try {
            const response = await authService.verifyToken();
            console.log('✅ Respuesta de verifyToken:', response);

            if (response && response.terapeuta) {
                setUser(response.terapeuta);
                setIsAuthenticated(true);
                console.log('✅ Usuario autenticado:', response.terapeuta);
            } else {
                setUser(null);
                setIsAuthenticated(false);
                console.log('❌ No se encontró un usuario válido.');
            }
        } catch (error) {
            console.error('🚨 Error verificando autenticación:', error);
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    };

    verifyAuth();
}, []);


  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      setUser(response.terapeuta);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  if (isLoading) {
    return <div>Cargando...</div>; // O tu componente de loading
  }

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};