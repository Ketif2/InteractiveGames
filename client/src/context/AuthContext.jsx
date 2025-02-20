// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@/services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [therapist, setTherapist] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      const token = authService.getToken();
      const storedTherapist = localStorage.getItem('therapistData');
      
      if (token && storedTherapist) {
        setTherapist(JSON.parse(storedTherapist));
      }
      
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    setTherapist(response.terapeuta);
    return response;
  };

  const logout = () => {
    authService.logout();
    setTherapist(null);
    localStorage.removeItem('therapistData');
    localStorage.removeItem('therapistId');
  };

  const value = {
    therapist,
    isLoading,
    login,
    logout,
    isAuthenticated: authService.isAuthenticated()
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
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