// services/authService.js
import api from './api';

export const authService = {
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      
      // Guardar el token en localStorage si el servidor lo devuelve
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      
      return response;
    } catch (error) {
      if (error.response) {
        // Handle specific HTTP error codes
        switch (error.response.status) {
          case 400:
            // Conflict - Email already exists
            throw new Error('El correo electrónico ya está registrado');
            
          case 422:
            // Unprocessable Entity - Invalid data format
            throw new Error('El formato de los datos no es válido');
            
          case 429:
            // Too Many Requests
            throw new Error('Demasiados intentos. Por favor, espere unos minutos');
            
          case 500:
            // Server error
            throw new Error('Error en el servidor. Por favor, inténtelo más tarde');
            
          default:
            throw new Error('Error al registrar usuario. Por favor, inténtelo de nuevo');
        }
      }
      // Handle network errors
      if (!error.response) {
        throw new Error('Error de conexión. Por favor, verifique su conexión a internet');
      }
      // Handle unexpected errors
      throw new Error('Error inesperado. Por favor, inténtelo de nuevo');
    }
  },

  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      
      // Guardar el token si existe
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      
      return response;
    } catch (error) {
      // Mejor manejo de errores con mensajes específicos
      if (error.response) {
        switch (error.response.status) {
          case 401:
            throw new Error('El usuario o la contraseña no son correctos');
          case 404:
            throw new Error('El usuario no existe');
          case 500:
            throw new Error('Error en el servidor. Por favor, intente más tarde');
          default:
            throw new Error(`Error (${error.response.status}): ${error.message || 'Error al iniciar sesión'}`);
        }
      }
      throw new Error('No se pudo conectar al servidor.');
    }
  },

  async verifyToken() {
    try {
      const response = await api.get('/auth/verify');
      return response;
    } catch (error) {
      console.error('Error en verifyToken:', error);
      
      // Si hay un error 401, redirigir al login
      if (error.response && error.response.status === 401) {
        // Limpiar localStorage
        localStorage.removeItem('token');
        throw new Error('Sesión expirada o inválida');
      }
      
      throw error;
    }
  },

  async logout() {
    try {
      await api.post('/auth/logout');
      // Siempre limpiar el token del localStorage al cerrar sesión
      localStorage.removeItem('token');
    } catch (error) {
      console.error('Error en logout:', error);
      // Limpiar localStorage incluso si hay error en el servidor
      localStorage.removeItem('token');
      throw error;
    }
  },
  
  // Método para comprobar si hay una sesión activa
  isAuthenticated() {
    return !!localStorage.getItem('token');
  },
  
  // Método para obtener el token actual
  getToken() {
    return localStorage.getItem('token');
  }
};