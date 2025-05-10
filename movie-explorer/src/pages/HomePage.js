import React, { useEffect, useMemo } from 'react';
import { Container, Typography, Box, Divider, CircularProgress } from '@mui/material';
import { useMovieContext } from '../context/MovieContext';
import Hero from '../components/Hero';
import MovieGrid from '../components/MovieGrid';
import GenreFilter from '../components/GenreFilter';

// Number of featured movies to show in the hero carousel
const FEATURED_MOVIES_COUNT = 5;

const HomePage = () => {
  const { 
    trendingMovies, 
    searchResults,
    fetchTrending, 
    loading, 
    error,
    fetchMoviesByGenre,
    selectedGenre
  } = useMovieContext();
  
  useEffect(() => {
    // Fetch trending movies on initial load if we don't have any and no genre is selected
    if (!trendingMovies.length && !selectedGenre) {
      fetchTrending();
    }
  }, [trendingMovies.length, fetchTrending, selectedGenre]);
  
  const handleGenreSelect = (genreId) => {
    if (genreId) {
      fetchMoviesByGenre(genreId);
    } else {
      fetchTrending();
    }
  };
  
  // Select featured movies for the carousel
  const featuredMovies = useMemo(() => {
    if (!trendingMovies.length) return [];
    
    // Filter movies with backdrop images for better visual experience
    const moviesWithBackdrops = trendingMovies.filter(
      movie => movie.backdrop_path && movie.overview
    );
    
    if (moviesWithBackdrops.length <= FEATURED_MOVIES_COUNT) {
      return moviesWithBackdrops;
    }
    
    // Select the first movie plus some random ones
    const firstMovie = moviesWithBackdrops[0];
    const otherMovies = [...moviesWithBackdrops.slice(1)];
    
    // Shuffle the remaining movies
    for (let i = otherMovies.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [otherMovies[i], otherMovies[j]] = [otherMovies[j], otherMovies[i]];
    }
    
    // Return first movie plus selected random movies
    return [firstMovie, ...otherMovies.slice(0, FEATURED_MOVIES_COUNT - 1)];
  }, [trendingMovies]);
  
  if (loading && !trendingMovies.length && !searchResults.length) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h5" color="error" align="center">
          {error}
        </Typography>
      </Container>
    );
  }
  
  // Determine which movies to show based on the current state
  const displayMovies = selectedGenre ? searchResults : trendingMovies;
  
  return (
    <Box>
      {/* Only show hero carousel when not filtering by genre and we have featured movies */}
      {!selectedGenre && featuredMovies.length > 0 && (
        <Hero movies={featuredMovies} />
      )}
      
      <Container maxWidth="xl">
        <GenreFilter 
          selectedGenre={selectedGenre}
          onGenreSelect={handleGenreSelect}
        />
        
        <MovieGrid 
          movies={displayMovies} 
          title={selectedGenre ? "Movies by Genre" : "Trending Movies"}
          emptyMessage={selectedGenre ? "No movies found for this genre" : "No trending movies available"} 
          showLoadMore={true} 
        />
        
        <Divider sx={{ my: 6 }} />
        
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
            About MovieFlix
          </Typography>
          <Typography variant="body1" paragraph>
            Welcome to MovieFlix, your ultimate destination for exploring movies from around the world. 
            Our platform provides an immersive experience for movie enthusiasts, allowing you to discover 
            trending films, search for your favorites, and create your own watchlist.
          </Typography>
          <Typography variant="body1" paragraph>
            With data powered by The Movie Database (TMDb), we offer comprehensive information about movies, 
            including ratings, cast details, trailers, and more. Whether you're looking for the latest blockbusters 
            or hidden gems, MovieFlix has got you covered.
          </Typography>
          <Typography variant="body1">
            Start exploring now by browsing our trending section or searching for a specific title. 
            Don't forget to create an account to save your favorite movies for later!
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage; 