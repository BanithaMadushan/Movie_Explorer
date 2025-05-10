import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { useMovieContext } from '../context/MovieContext';

const PaginationDebugger = () => {
  const {
    currentPage,
    totalPages,
    trendingMovies,
    searchResults,
    selectedGenre,
    lastSearch
  } = useMovieContext();

  const displayMovies = selectedGenre || lastSearch ? searchResults : trendingMovies;

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 2, 
        my: 2, 
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        border: '1px dashed rgba(0, 0, 0, 0.2)'
      }}
    >
      <Typography variant="subtitle1" fontWeight="bold">Debug Information</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography variant="body2">Current Page: {currentPage}</Typography>
        <Typography variant="body2">Total Pages: {totalPages}</Typography>
        <Typography variant="body2">Trending Movies: {trendingMovies.length}</Typography>
        <Typography variant="body2">Search Results: {searchResults.length}</Typography>
        <Typography variant="body2">Current View: {selectedGenre ? 'Genre Filter' : (lastSearch ? 'Search Results' : 'Trending')}</Typography>
        <Typography variant="body2">Display Movies: {displayMovies.length}</Typography>
      </Box>
    </Paper>
  );
};

export default PaginationDebugger; 