import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// API URL
const API_URL = 'http://localhost:5000/api';

// Create context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Configure axios defaults
  axios.defaults.baseURL = API_URL;
  
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  useEffect(() => {
    // Check if user is logged in (from token)
    const checkUserLoggedIn = async () => {
      if (token) {
        try {
          const res = await axios.get('/auth/profile');
          setCurrentUser(res.data.user);
        } catch (error) {
          // If token is invalid, remove it
          console.error('Error loading user profile:', error);
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };

    checkUserLoggedIn();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await axios.post('/auth/login', { email, password });
      
      // Save token to localStorage and state
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      
      // Update axios headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      
      // Set current user
      setCurrentUser(res.data.user);
      
      return res.data.user;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to login');
    }
  };

  const signup = async (username, email, password) => {
    try {
      const res = await axios.post('/auth/register', {
        username,
        email,
        password
      });
      
      // Save token to localStorage and state
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      
      // Update axios headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      
      // Set current user
      setCurrentUser(res.data.user);
      
      return res.data.user;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to sign up');
    }
  };

  const logout = () => {
    // Remove token from localStorage and state
    localStorage.removeItem('token');
    setToken(null);
    
    // Remove authorization header
    delete axios.defaults.headers.common['Authorization'];
    
    // Clear current user
    setCurrentUser(null);
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await axios.put('/auth/profile', profileData);
      
      // Update current user
      setCurrentUser(res.data.user);
      
      return res.data.user;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const value = {
    currentUser,
    loading,
    login,
    signup,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 