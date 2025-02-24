// services/authService.js
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
    const response = await axiosInstance.post('/auth/register', userData);
    return response.data;
  },

  async login(credentials) {
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data;
  },

  async verifyToken() {
    console.log('📡 Enviando solicitud a /auth/verify');

    try {
        const response = await axiosInstance.get('/auth/verify');
        console.log('✅ Respuesta de /auth/verify:', response.data);
        return response.data;
    } catch (error) {
        console.error('🚨 Error en /auth/verify:', error);
        throw error;
    }
},

  async logout() {
    await axiosInstance.post('/auth/logout');
  }
};