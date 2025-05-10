import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import { useMovieContext } from '../context/MovieContext';
import MovieGrid from '../components/MovieGrid';
import GenreFilter from '../components/GenreFilter';
import MovieFilter from '../components/MovieFilter';

const SearchPage = () => {
  const { 
    searchResults, 
    searchMovies, 
    lastSearch, 
    loading, 
    error,
    fetchMoviesByGenre,
    fetchFilteredMovies,
    clearSearch
  } = useMovieContext();
  
  const [selectedGenre, setSelectedGenre] = useState(null);
  
  useEffect(() => {
    // If there's a last search but no results, search again
    if (lastSearch && !searchResults.length && !loading) {
      searchMovies(lastSearch);
    }
    
    // Cleanup function
    return () => {
      // This will run when the component unmounts
      // clearSearch();
    };
  }, [lastSearch, searchResults.length, searchMovies, loading]);
  
  const handleGenreSelect = (genreId) => {
    setSelectedGenre(genreId);
    if (genreId) {
      fetchMoviesByGenre(genreId);
    } else if (lastSearch) {
      searchMovies(lastSearch);
    }
  };
  
  const handleFilter = (filters) => {
    fetchFilteredMovies(filters);
  };
  
  if (loading && !searchResults.length) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }
  
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {lastSearch ? `Search Results for "${lastSearch}"` : 'Browse Movies'}
        </Typography>
        
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
      </Box>
      
      <GenreFilter 
        selectedGenre={selectedGenre}
        onGenreSelect={handleGenreSelect}
      />
      
      <MovieFilter onFilter={handleFilter} />
      
      <MovieGrid 
        movies={searchResults} 
        title={null}
        emptyMessage={lastSearch ? `No results found for "${lastSearch}"` : 'No movies found'}
        showLoadMore
      />
    </Container>
  );
};

export default SearchPage; 