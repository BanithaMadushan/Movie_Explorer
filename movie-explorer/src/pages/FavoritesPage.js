import React from 'react';
import { Container, Typography, Box, Button, Divider } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useMovieContext } from '../context/MovieContext';
import { useAuth } from '../context/AuthContext';
import MovieGrid from '../components/MovieGrid';

const FavoritesPage = () => {
  const navigate = useNavigate();
  const { favorites, clearAllFavorites } = useMovieContext();
  const { currentUser } = useAuth();
  
  // If user is not logged in, redirect to login page
  React.useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);
  
  const handleClearFavorites = async () => {
    // Remove all favorites
    if (window.confirm('Are you sure you want to clear all favorites?')) {
      try {
        await clearAllFavorites();
      } catch (error) {
        console.error('Failed to clear favorites:', error);
        alert('Failed to clear favorites. Please try again.');
      }
    }
  };
  
  if (!currentUser) {
    return null; // Will redirect to login
  }
  
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Favorites
        </Typography>
        
        {favorites.length > 0 && (
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleClearFavorites}
          >
            Clear All
          </Button>
        )}
      </Box>
      
      <MovieGrid 
        movies={favorites} 
        emptyMessage="You haven't added any favorites yet. Browse movies and click the heart icon to add them here!"
      />
      
      {favorites.length === 0 && (
        <>
          <Divider sx={{ my: 4 }} />
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/')}
              sx={{ mx: 1 }}
            >
              Browse Trending Movies
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/search')}
              sx={{ mx: 1 }}
            >
              Search Movies
            </Button>
          </Box>
        </>
      )}
    </Container>
  );
};

export default FavoritesPage; 