import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Configure axios defaults
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  axios.defaults.baseURL = API_URL;

  // Set auth token in axios headers
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  };

  // Check if user is authenticated on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
      // Verify token with backend
      axios.get('/auth/me')
        .then(response => {
          setUser(response.data.user);
        })
        .catch(() => {
          // Token is invalid
          logout();
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const signup = async (userData) => {
    try {
      const response = await axios.post('/auth/signup', userData);
      const { token, user } = response.data;
      
      setAuthToken(token);
      setUser(user);
      toast.success('Account created successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Signup failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const login = async (credentials) => {
    try {
      const response = await axios.post('/auth/login', credentials);
      const { token, user } = response.data;
      
      setAuthToken(token);
      setUser(user);
      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
    toast.success('Logged out successfully');
  };

  const value = {
    user,
    loading,
    signup,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};