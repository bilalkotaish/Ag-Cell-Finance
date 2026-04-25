import axios from 'axios';

const api = axios.create({
  // Use environment variable for production, fallback to localhost for development
  baseURL: import.meta.env.VITE_API_URL || 'http://[IP_ADDRESS]/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
