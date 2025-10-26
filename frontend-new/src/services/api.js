import axios from 'axios';
import { API_BASE_URL, ERROR_MESSAGES } from '../utils/constants';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
    });

    // Handle specific error cases
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return Promise.reject(new Error(ERROR_MESSAGES.UNAUTHORIZED));
    }

    if (error.code === 'NETWORK_ERROR' || !error.response) {
      return Promise.reject(new Error(ERROR_MESSAGES.NETWORK_ERROR));
    }

    // Return server error message or generic error
    const errorMessage = error.response?.data?.message || ERROR_MESSAGES.GENERIC_ERROR;
    return Promise.reject(new Error(errorMessage));
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/me'),
};

// Documents API
export const documentsAPI = {
  upload: (formData) => api.post('/documents/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    timeout: 60000, // 60 seconds for file upload
  }),
  list: () => api.get('/documents/list'),
  delete: (documentId) => api.delete(`/documents/${documentId}`),
};

// Chat API
export const chatAPI = {
  start: () => api.post('/chat/start'),
  query: (data) => api.post('/chat/query', data),
  getHistory: (sessionId) => api.get(`/chat/history/${sessionId}`),
};

// Health check API
export const healthAPI = {
  check: () => api.get('/health'),
};

export default api;