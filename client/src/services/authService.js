// services/authService.js
import api from './api'
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // Importante para las cookies
});

export const authService = {
  async register(userData) {
    try {
      const response = await axiosInstance.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      if (error.response) {
        // Handle specific HTTP error codes
        switch (error.response.status) {
          case 409:
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
      const response = await axiosInstance.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      if (error.response) {
        // Handle specific HTTP error codes
        switch (error.response.status) {
          case 401:
            throw new Error('El usuario o la contraseña no son correctos');
          case 404:
            throw new Error('El usuario no existe');
          case 429:
            throw new Error('Demasiados intentos. Por favor, espere unos minutos');
          default:
            throw new Error('Error al iniciar sesión. Por favor, inténtelo de nuevo');
        }
      }
      // Handle network errors or other issues
      throw new Error('Error de conexión. Por favor, verifique su conexión a internet');
    }
  },

  async verifyToken() {
    try {
      const response = await axiosInstance.get('/auth/verify');
      console.log('Respuesta verify:', response); // Para debugging
      return response.data;
    } catch (error) {
      console.error('Error en verifyToken:', error); // Para debugging
      if (error.response) {
        switch (error.response.status) {
          case 401:
            throw new Error('Sesión expirada');
          default:
            throw new Error(`Error al verificar la sesión: ${error.response.status}`);
        }
      }
      // Si no hay response, es un error de conexión
      console.error('Error detallado:', error); // Para debugging
      throw new Error(`Error de conexión: ${error.message}`);
    }
},

  async logout() {
    await axiosInstance.post('/auth/logout');
  }
};