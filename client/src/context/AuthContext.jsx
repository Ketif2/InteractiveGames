// context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@/services/authService';

// 1. Crear el contexto
const AuthContext = createContext(null);

// 2. Definir el Provider como una función nombrada (esto es clave para Fast Refresh)
function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificación automática al cargar la aplicación
  useEffect(() => {
    // Verificar primero si hay un token almacenado
    if (!localStorage.getItem('token')) {
      setIsLoading(false);
      return; // No continuar con la verificación si no hay token
    }
    
    const verifyAuth = async () => {      
      try {
        const response = await authService.verifyToken();
        if (response && response.terapeuta) {
          setUser(response.terapeuta);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
          localStorage.removeItem('token');
        }
      } catch (error) {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
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

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. Definir el hook useAuth como una función nombrada separada
function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// 4. Exportar ambas declaraciones al final
export { AuthProvider, useAuth };