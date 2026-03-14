/**
 * @module axios
 * @description Production-grade HTTP client for $10k+ enterprise marketplace
 * @author Senior Full-Stack Architect
 * @version 3.0.0
 */

import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

/**
 * Request Interceptor
 */
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response Interceptor
 */
API.interceptors.response.use(
  (response) => {
    if (import.meta.env.MODE === 'development') {
      console.log(`🚀 [API Response]: ${response.config.url}`, response.data);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    if (!error.response) {
      console.error("🌐 Network Error: Check your connection or server status.");
    }

    return Promise.reject(error);
  }
);

export default API;
