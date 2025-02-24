import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // Habilita el envío de cookies
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response.data, // Mantenemos tu lógica de devolver directamente response.data
  (error) => {
    if (error.response?.status === 401) {
      // Ya no necesitamos remover el token del localStorage
      // La cookie se maneja desde el servidor
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error);
  }
);

export default api;