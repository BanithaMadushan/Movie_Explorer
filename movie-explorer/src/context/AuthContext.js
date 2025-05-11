import React, { createContext, useContext, useState, useEffect } from 'react';

// Create context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Initialize demo users if they don't exist
const initializeDemoUsers = () => {
  if (!localStorage.getItem('users')) {
    // Create demo users
    const demoUsers = [
      {
        id: '1',
        username: 'demo',
        email: 'demo@example.com',
        password: 'password',
        favorites: []
      },
      {
        id: '2',
        username: 'user',
        email: 'user@example.com',
        password: 'password',
        favorites: []
      }
    ];
    
    // Save to localStorage
    localStorage.setItem('users', JSON.stringify(demoUsers));
    console.log('Demo users initialized');
  }
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    // Initialize demo users
    initializeDemoUsers();
    
    // Check if user is logged in (from localStorage)
    const checkUserLoggedIn = () => {
      if (token) {
        try {
          // Get user data from localStorage
          const userData = JSON.parse(localStorage.getItem('user'));
          if (userData) {
            setCurrentUser(userData);
          } else {
            // If no user data, remove token
            localStorage.removeItem('token');
            setToken(null);
          }
        } catch (error) {
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
      // Get users from localStorage or initialize empty array
      const users = JSON.parse(localStorage.getItem('users')) || [];
      
      // Find user with matching email and password
      const user = users.find(user => user.email === email && user.password === password);
      
      if (!user) {
        throw new Error('Invalid email or password');
      }
      
      // Create a token (simple implementation for demo)
      const mockToken = `demo-token-${Date.now()}`;
      
      // Remove password from user object before storing in state
      const { password: _, ...userWithoutPassword } = user;
      
      // Save token to localStorage and state
      localStorage.setItem('token', mockToken);
      setToken(mockToken);
      
      // Save user to localStorage
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
      // Set current user
      setCurrentUser(userWithoutPassword);
      
      return userWithoutPassword;
    } catch (error) {
      throw new Error(error.message || 'Failed to login');
    }
  };

  const signup = async (username, email, password) => {
    try {
      // Get existing users or initialize empty array
      const users = JSON.parse(localStorage.getItem('users')) || [];
      
      // Check if email already exists
      if (users.some(user => user.email === email)) {
        throw new Error('Email already exists');
      }
      
      // Create new user
      const newUser = {
        id: Date.now().toString(),
        username,
        email,
        password,
        favorites: []
      };
      
      // Add to users array
      users.push(newUser);
      
      // Save updated users array
      localStorage.setItem('users', JSON.stringify(users));
      
      // Create a token
      const mockToken = `demo-token-${Date.now()}`;
      
      // Remove password from user object before storing in state
      const { password: _, ...userWithoutPassword } = newUser;
      
      // Save token to localStorage and state
      localStorage.setItem('token', mockToken);
      setToken(mockToken);
      
      // Save user to localStorage
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
      // Set current user
      setCurrentUser(userWithoutPassword);
      
      return userWithoutPassword;
    } catch (error) {
      throw new Error(error.message || 'Failed to sign up');
    }
  };

  const logout = () => {
    // Remove token and user from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    
    // Clear current user
    setCurrentUser(null);
  };

  const updateProfile = async (profileData) => {
    try {
      // Get current user data
      const userData = JSON.parse(localStorage.getItem('user'));
      
      // Get all users
      const users = JSON.parse(localStorage.getItem('users')) || [];
      
      // Update user in users array
      const updatedUsers = users.map(user => {
        if (user.id === userData.id) {
          return { ...user, ...profileData };
        }
        return user;
      });
      
      // Save updated users array
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      // Update current user
      const updatedUser = { ...userData, ...profileData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
      
      return updatedUser;
    } catch (error) {
      throw new Error('Failed to update profile');
    }
  };

  const addToFavorites = async (movie) => {
    try {
      if (!currentUser) {
        throw new Error('You must be logged in to add favorites');
      }

      // Get current user data
      const userData = JSON.parse(localStorage.getItem('user'));
      
      // Get all users
      const users = JSON.parse(localStorage.getItem('users')) || [];
      
      // Find current user in users array
      const userIndex = users.findIndex(user => user.id === userData.id);
      
      if (userIndex === -1) {
        throw new Error('User not found');
      }

      // Check if movie is already in favorites
      const favorites = users[userIndex].favorites || [];
      if (favorites.some(fav => fav.id === movie.id)) {
        return userData; // Already a favorite
      }

      // Add movie to favorites
      users[userIndex].favorites = [...favorites, movie];
      
      // Save updated users array
      localStorage.setItem('users', JSON.stringify(users));
      
      // Update current user
      const updatedUser = { 
        ...userData, 
        favorites: [...(userData.favorites || []), movie] 
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
      
      return updatedUser;
    } catch (error) {
      throw new Error(error.message || 'Failed to add favorite');
    }
  };

  const removeFromFavorites = async (movieId) => {
    try {
      if (!currentUser) {
        throw new Error('You must be logged in');
      }

      // Get current user data
      const userData = JSON.parse(localStorage.getItem('user'));
      
      // Get all users
      const users = JSON.parse(localStorage.getItem('users')) || [];
      
      // Find current user in users array
      const userIndex = users.findIndex(user => user.id === userData.id);
      
      if (userIndex === -1) {
        throw new Error('User not found');
      }

      // Remove movie from favorites
      const favorites = users[userIndex].favorites || [];
      users[userIndex].favorites = favorites.filter(fav => fav.id !== movieId);
      
      // Save updated users array
      localStorage.setItem('users', JSON.stringify(users));
      
      // Update current user
      const updatedUser = {
        ...userData,
        favorites: (userData.favorites || []).filter(fav => fav.id !== movieId)
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
      
      return updatedUser;
    } catch (error) {
      throw new Error(error.message || 'Failed to remove favorite');
    }
  };

  const value = {
    currentUser,
    loading,
    login,
    signup,
    logout,
    updateProfile,
    addToFavorites,
    removeFromFavorites
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 