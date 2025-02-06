import { jwtDecode } from 'jwt-decode'; 

export const getToken = () => localStorage.getItem('token');

export const isAuthenticated = () => !!getToken();

export const getDecodedToken = () => {
  const token = getToken();
  if (token) {
    try {
      return jwtDecode(token);
    } catch (error) {
      return null;
    }
  }
  return null;
};

export const getUserRole = () => {
  const decoded = getDecodedToken();
  return decoded?.role || null;
};

export const getUserId = () => {
  const decoded = getDecodedToken();
  return decoded?.userId || null;
};