// context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@/services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await authService.verifyToken();
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Token verification failed:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('therapistId');
          localStorage.removeItem('therapistData');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    const { token, terapeuta } = response;
    
    localStorage.setItem('token', token);
    localStorage.setItem('therapistId', terapeuta.id_terapeuta);
    localStorage.setItem('therapistData', JSON.stringify(terapeuta));
    
    setUser(terapeuta);
    setIsAuthenticated(true);
    return response;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('therapistId');
    localStorage.removeItem('therapistData');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      isLoading, 
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