import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Box, Button, CircularProgress } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useMovieContext } from '../context/MovieContext';
import MovieDetail from '../components/MovieDetail';
import MovieGrid from '../components/MovieGrid';

const MovieDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getMovieDetails, movieDetails, loading, error, trendingMovies, fetchTrending } = useMovieContext();
  
  useEffect(() => {
    // Fetch movie details when the component mounts or ID changes
    if (id) {
      getMovieDetails(id);
    }
    
    // If we don't have trending movies yet, fetch them for recommendations
    if (!trendingMovies.length) {
      fetchTrending();
    }
    
    // Scroll to top when navigating to a new movie
    window.scrollTo(0, 0);
  }, [id, getMovieDetails, trendingMovies.length, fetchTrending]);
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
  if (loading && !movieDetails) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }
  
  // Get similar movies (for this demo, we'll just use trending movies)
  // In a real app, you would call an API endpoint to get similar movies
  const similarMovies = trendingMovies.filter(movie => movie.id !== Number(id)).slice(0, 6);
  
  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={handleGoBack}
          sx={{ mb: 2 }}
        >
          Back
        </Button>
      </Box>
      
      <MovieDetail movie={movieDetails} />
      
      {similarMovies.length > 0 && (
        <Box sx={{ mt: 6 }}>
          <MovieGrid
            movies={similarMovies}
            title="You May Also Like"
          />
        </Box>
      )}
    </Container>
  );
};

export default MovieDetailPage; 