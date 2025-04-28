// Actualización para el interceptor en api.js

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Control para evitar redirecciones múltiples
let isRedirecting = false;
const isProd = API_URL.includes('railway.app') || API_URL.includes('netlify.app');

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true,
  timeout: 30000
});

// Interceptor para peticiones
api.interceptors.request.use(
  (config) => {
    // Si estamos solicitando un blob, quitar Content-Type: application/json
    if (config.responseType === 'blob' && config.headers['Content-Type'] === 'application/json') {
      delete config.headers['Content-Type'];
    }
    
    // Obtener token de localStorage e incluirlo en el header
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Añadir prefijo /api en producción si la URL no lo incluye ya
    if (isProd && !config.url.startsWith('/api/') && !config.url.startsWith('/api')) {
      config.url = `/api${config.url.startsWith('/') ? '' : '/'}${config.url}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);


// Interceptor para respuestas
api.interceptors.response.use(
  (response) => {
    // Manejo de respuestas tipo blob
    if (response.config.responseType === 'blob') {
      if (response.data && response.data.size === 0) {
        console.warn('Se recibió un blob vacío desde el servidor');
      }
      return response;
    }
    
    return response.data;
  },
  (error) => {
    // Manejo especial para errores en peticiones blob
    if (error.response && error.config && error.config.responseType === 'blob' && error.response.data instanceof Blob) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const errorData = JSON.parse(reader.result);
            error.response.data = errorData;
            reject(error.response?.data || error);
          } catch (e) {
            reject(error.response?.data || error);
          }
        };
        reader.onerror = () => {
          reject(error.response?.data || error);
        };
        reader.readAsText(error.response.data);
      });
    }
    
    // Control para evitar redirecciones cíclicas
    if (error.response?.status === 401) {
      // Verificar que no estamos ya en la página de login y que no estamos en proceso de redirección
      if (!isRedirecting && !window.location.pathname.includes('/login')) {
        isRedirecting = true;
        console.log('Sesión expirada. Redirigiendo a login...');
        
        // Limpiar token si existe
        localStorage.removeItem('token');
        
        // Redirigir a login después de un pequeño retraso
        setTimeout(() => {
          window.location.href = '/login';
          
          // Resetear la bandera después de un tiempo
          setTimeout(() => {
            isRedirecting = false;
          }, 2000);
        }, 100);
      } else {
        console.warn('Evitando redirección cíclica a login');
      }
    }
    
    return Promise.reject(error.response?.data || error);
  }
);

export default api;