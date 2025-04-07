import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true, // Habilita el envío de cookies
  timeout: 30000 // Aumentado para manejar archivos grandes
});

// Interceptor para peticiones
api.interceptors.request.use(
  (config) => {
    // Si estamos solicitando un blob, asegurarse de que no se envía Content-Type: application/json
    if (config.responseType === 'blob') {
      // Para peticiones de blob, no establecemos Content-Type: application/json por defecto
      if (config.headers['Content-Type'] === 'application/json') {
        delete config.headers['Content-Type'];
      }
    }
    
    // Si hay token de autenticación (opcional, solo si lo usas)
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para respuestas
api.interceptors.response.use(
  (response) => {
    // Si la respuesta es de tipo blob, no procesarla como JSON y devolverla completa
    if (response.config.responseType === 'blob') {
      // Verificar si hay errores en la respuesta (blob vacío)
      if (response.data && response.data.size === 0) {
        console.warn('Se recibió un blob vacío desde el servidor');
      }
      // Devolver la respuesta completa para peticiones de tipo blob
      return response;
    }
    // Caso especial para rutas de autenticación
    if (response.config.url.includes('/auth/')) {
      // Para rutas de autenticación, devuelve la respuesta completa
      return response;
    }
    // Para respuestas normales, mantener el comportamiento existente (devolver solo data)
    return response.data;
  },
  (error) => {
    // Si es un error en una petición de tipo blob, podría ser un error de servidor formateado como JSON
    if (error.response && error.config && error.config.responseType === 'blob' && error.response.data instanceof Blob) {
      // Intentar leer el error como texto para verificar si es un mensaje JSON
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const errorData = JSON.parse(reader.result);
            error.response.data = errorData;
            reject(error.response?.data || error);
          } catch (e) {
            // Si no es JSON, mantener el error original
            reject(error.response?.data || error);
          }
        };
        reader.onerror = () => {
          reject(error.response?.data || error);
        };
        reader.readAsText(error.response.data);
      });
    }
    
    // Para otros errores, mantener el comportamiento existente
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error);
  }
);

export default api;