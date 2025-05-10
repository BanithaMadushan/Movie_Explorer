import React, { createContext, useContext, useState, useEffect } from 'react';
import { register as apiRegister, login as apiLogin, logout as apiLogout, getCurrentUser, updateProfile as apiUpdateProfile } from '../services/authApi';

// Create context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// For demo purposes, we'll use localStorage to store user data
// In a real application, you would use proper authentication with a backend
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  useEffect(() => {
    // Check if user is logged in with token
    const checkLoggedIn = async () => {
      if (token) {
        try {
          const response = await getCurrentUser();
          setCurrentUser(response.data);
        } catch (error) {
          // Token might be invalid, clear it
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };

    checkLoggedIn();
  }, [token]);

  const signup = async (username, email, password) => {
    try {
      const response = await apiRegister(username, email, password);
      
      // Save token and user data
      localStorage.setItem('token', response.token);
      setToken(response.token);
      setCurrentUser(response.user);
      
      return response.user;
    } catch (error) {
      throw new Error(error.message || 'Failed to sign up');
    }
  };

  const login = async (email, password) => {
    try {
      const response = await apiLogin(email, password);
      
      // Save token and user data
      localStorage.setItem('token', response.token);
      setToken(response.token);
      setCurrentUser(response.user);
      
      return response.user;
    } catch (error) {
      throw new Error(error.message || 'Failed to login');
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear user data regardless of API success
      setCurrentUser(null);
      setToken(null);
      localStorage.removeItem('token');
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await apiUpdateProfile(profileData);
      setCurrentUser(response.data);
      return response.data;
    } catch (error) {
      throw new Error('Failed to update profile');
    }
  };

  const value = {
    currentUser,
    loading,
    login,
    signup,
    logout,
    updateProfile,
    isAuthenticated: !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 