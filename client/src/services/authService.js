
import api from './api';

export const authService = {
  login: async (credentials) => {
    try {
      const { email: username, password } = credentials;
      const response = await api.post('/auth/login', {
        username,
        password
      });
      
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      
      return response;
    } catch (error) {
      throw new Error(error.message || 'Error en inicio de sesión');
    }
  },

  register: async (userData) => {
    try {
      const registerData = {
        username: userData.email, // Usando email como username
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: 'therapist' // Por defecto registramos terapeutas
      };
      
      const response = await api.post('/auth/register', registerData);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Error en registro');
    }
  },

  getUserProfile: async () => {
    try {
      const response = await api.get('/auth/profile');
      return response;
    } catch (error) {
      throw new Error(error.message || 'Error al obtener perfil');
    }
  },

  logout: () => {
    localStorage.removeItem('token');
  }
};