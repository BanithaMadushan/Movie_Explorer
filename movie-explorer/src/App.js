import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { MovieProvider } from './context/MovieContext';
import { AuthProvider } from './context/AuthContext';
import { createAppTheme } from './utils/theme';

// Components
import Navbar from './components/Navbar';

// Pages
import HomePage from './pages/HomePage';
import MovieDetailPage from './pages/MovieDetailPage';
import SearchPage from './pages/SearchPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import FavoritesPage from './pages/FavoritesPage';
import NotFoundPage from './pages/NotFoundPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  // Get dark mode preference from localStorage or default to true for Netflix-like feel
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode !== null ? JSON.parse(savedMode) : true;
  });
  
  // Create theme based on dark mode preference
  const theme = React.useMemo(() => createAppTheme(darkMode ? 'dark' : 'light'), [darkMode]);
  
  // Handle dark mode toggling
  const handleToggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };
  
  // Save to localStorage when darkMode changes
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Create a context value with both the state and toggle function
  const movieContextValue = {
    darkMode,
    toggleDarkMode: handleToggleDarkMode
  };
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <MovieProvider initialValues={movieContextValue}>
          <Router>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              minHeight: '100vh',
              bgcolor: 'background.default',
              color: 'text.primary',
            }}>
              <Navbar />
              <Box component="main" sx={{ flexGrow: 1 }}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/movie/:id" element={<MovieDetailPage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignUpPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/favorites" element={<FavoritesPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Box>
              <Box component="footer" sx={{ py: 3, textAlign: 'center', mt: 'auto' }}>
                <Box sx={{ typography: 'body2', color: 'text.secondary' }}>
                  © {new Date().getFullYear()} MovieFlix. Powered by TMDb.
                </Box>
              </Box>
            </Box>
          </Router>
        </MovieProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
