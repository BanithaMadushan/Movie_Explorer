import React, { useCallback, useEffect } from 'react';
import { Grid, Box, Typography, Button, CircularProgress, Divider } from '@mui/material';
import MovieCard from './MovieCard';
import { useMovieContext } from '../context/MovieContext';

const MovieGrid = ({ 
  movies, 
  title, 
  emptyMessage = 'No movies found', 
  showLoadMore = true,
  hideRating = false
}) => {
  const { loading, loadMore, currentPage, totalPages } = useMovieContext();
  
  // Debug info
  useEffect(() => {
    console.log(`MovieGrid mounted/updated:
    - movies: ${movies?.length || 0}
    - showLoadMore: ${showLoadMore}
    - currentPage: ${currentPage}
    - totalPages: ${totalPages}
    `);
  }, [movies, showLoadMore, currentPage, totalPages]);
  
  // Wrapped loadMore in useCallback to prevent unnecessary re-renders
  const handleLoadMore = useCallback(() => {
    console.log(`Load more clicked. Current page: ${currentPage}, Total pages: ${totalPages}`);
    loadMore();
  }, [loadMore, currentPage, totalPages]);
  
  if (!movies || movies.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 5 }}>
        <Typography variant="h5" color="text.secondary">
          {emptyMessage}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 3 }}>
      {title && (
        <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
          {title} {movies.length > 0 && `(${movies.length})`}
        </Typography>
      )}
      
      <Grid container spacing={3}>
        {movies.map((movie) => (
          <Grid item xs={6} sm={4} md={3} lg={2.4} key={`movie-${movie.id}`}>
            <MovieCard movie={movie} hideRating={hideRating} />
          </Grid>
        ))}
      </Grid>
      
      {showLoadMore && currentPage < totalPages && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleLoadMore}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
            sx={{ px: 4, py: 1.5 }}
          >
            {loading ? 'Loading...' : 'Load More Movies'}
          </Button>
        </Box>
      )}
      
      <Divider sx={{ mt: 4 }} />
    </Box>
  );
};

export default MovieGrid; 