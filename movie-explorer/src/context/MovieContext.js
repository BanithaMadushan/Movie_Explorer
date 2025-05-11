import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as movieAPI from '../services/api';
import { useAuth } from './AuthContext';

// Create context
export const MovieContext = createContext();

// Custom hook to use the movie context
export const useMovieContext = () => useContext(MovieContext);

// Provider component
export const MovieProvider = ({ children, initialValues }) => {
  const { currentUser, addToFavorites: authAddToFavorites, removeFromFavorites: authRemoveFromFavorites } = useAuth();
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [movieDetails, setMovieDetails] = useState(null);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [lastSearch, setLastSearch] = useState('');
  const [darkMode, setDarkMode] = useState(initialValues?.darkMode ?? false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedGenre, setSelectedGenre] = useState(null);

  // Load user favorites from localStorage when user logs in
  useEffect(() => {
    const loadUserFavorites = () => {
      if (currentUser) {
        try {
          // Get current user data
          const userData = JSON.parse(localStorage.getItem('user'));
          if (userData && userData.favorites) {
            setFavorites(userData.favorites);
          } else {
            setFavorites([]);
          }
        } catch (err) {
          console.error("Error loading favorites from localStorage:", err);
          setFavorites([]);
        }
      } else {
        // Clear favorites when user logs out
        setFavorites([]);
      }
    };

    loadUserFavorites();
  }, [currentUser]);

  // Load other preferences from localStorage
  useEffect(() => {
    try {
      const storedLastSearch = localStorage.getItem('lastSearch');
      if (storedLastSearch) {
        setLastSearch(storedLastSearch);
      }

      // Only set darkMode from localStorage if not provided through initialValues
      if (!initialValues?.darkMode) {
        const storedDarkMode = localStorage.getItem('darkMode');
        if (storedDarkMode !== null) {
          setDarkMode(JSON.parse(storedDarkMode));
        }
      }
    } catch (err) {
      console.error("Error loading data from localStorage:", err);
    }
  }, [initialValues?.darkMode]);

  // Save last search to localStorage
  useEffect(() => {
    try {
      if (lastSearch) {
        localStorage.setItem('lastSearch', lastSearch);
      }
    } catch (err) {
      console.error("Error saving search to localStorage:", err);
    }
  }, [lastSearch]);

  // Fetch all genres
  const fetchGenres = useCallback(async () => {
    try {
      const genresData = await movieAPI.getGenres();
      setGenres(genresData);
      return genresData;
    } catch (err) {
      console.error('Failed to fetch genres:', err);
      setError('Failed to fetch genres. Please try again later.');
      return [];
    }
  }, []);

  // Fetch genres on mount
  useEffect(() => {
    fetchGenres();
  }, [fetchGenres]);

  // Toggle dark mode
  const toggleDarkMode = useCallback(() => {
    if (initialValues?.toggleDarkMode) {
      // Use the function from App.js if available
      initialValues.toggleDarkMode();
    } else {
      setDarkMode(prev => {
        const newMode = !prev;
        try {
          localStorage.setItem('darkMode', JSON.stringify(newMode));
        } catch (err) {
          console.error("Error saving dark mode to localStorage:", err);
        }
        return newMode;
      });
    }
  }, [initialValues?.toggleDarkMode]);

  // Fetch trending movies
  const fetchTrending = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      // Reset any genre filter
      setSelectedGenre(null);
      // Clear any search query
      setLastSearch('');
      // Reset pagination when starting a new trending query
      setCurrentPage(1);
      
      console.log('Fetching trending movies...');
      const data = await movieAPI.fetchTrendingMovies(page);
      
      // Filter out movies with no images for better UX
      const moviesWithImages = data.results.filter(movie => 
        movie.backdrop_path || movie.poster_path
      );
      
      console.log('Trending API response:', data);
      console.log('Movies with images:', moviesWithImages.length);
      console.log('Total pages from API:', data.total_pages);
      
      // Log the first few movies for debugging
      if (moviesWithImages.length > 0) {
        const firstMovie = moviesWithImages[0];
        console.log('First movie:', firstMovie.title);
        console.log('First movie backdrop:', firstMovie.backdrop_path);
        console.log('First movie poster:', firstMovie.poster_path);
        
        // Test image URL generation
        if (firstMovie.backdrop_path) {
          const backdropUrl = movieAPI.getBackdropUrl(firstMovie.backdrop_path);
          console.log('First movie backdrop URL:', backdropUrl);
        }
        
        if (firstMovie.poster_path) {
          const posterUrl = movieAPI.getImageUrl(firstMovie.poster_path);
          console.log('First movie poster URL:', posterUrl);
        }
      }
      
      // Set state with filtered movies
      setTrendingMovies(moviesWithImages);
      
      // Ensure totalPages is at least 2 to enable "Load More"
      setTotalPages(Math.max(data.total_pages || 0, 2));
      setCurrentPage(data.page || 1);
    } catch (err) {
      setError('Failed to fetch trending movies. Please try again later.');
      console.error('Error fetching trending movies:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Search movies
  const searchMovies = useCallback(async (query, page = 1) => {
    if (!query) return;
    
    setLoading(true);
    setError(null);
    setLastSearch(query);
    // Clear any genre filters when searching
    setSelectedGenre(null);
    // Reset pagination when starting a new search
    setCurrentPage(1);
    
    try {
      const data = await movieAPI.searchMovies(query, page);
      setSearchResults(data.results);
      // Ensure totalPages is at least 2 to enable "Load More"
      setTotalPages(Math.max(data.total_pages || 0, 2));
      setCurrentPage(data.page || 1);
    } catch (err) {
      setError('Failed to search movies. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get movie details
  const getMovieDetails = useCallback(async (movieId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await movieAPI.getMovieDetails(movieId);
      setMovieDetails(data);
    } catch (err) {
      setError('Failed to fetch movie details. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch movies by genre
  const fetchMoviesByGenre = useCallback(async (genreId, page = 1) => {
    setLoading(true);
    setError(null);
    try {
      setSelectedGenre(genreId);
      // Reset pagination when starting a new genre filter
      setCurrentPage(1);
      
      const data = await movieAPI.getMoviesByGenre(genreId, page);
      setSearchResults(data.results);
      // Ensure totalPages is at least 2 to enable "Load More"
      setTotalPages(Math.max(data.total_pages || 0, 2));
      setCurrentPage(data.page || 1);
    } finally {
      setLoading(false);
    }
  }, []);

  // Add/remove favorite
  const toggleFavorite = useCallback(async (movie) => {
    if (!currentUser) {
      throw new Error('Please log in to add favorites');
    }

    try {
      console.log('Toggle favorite for movie:', movie);
      const isCurrentlyFavorite = favorites.some(fav => fav.id === movie.id);
      console.log('Is currently favorite:', isCurrentlyFavorite);
      
      if (isCurrentlyFavorite) {
        // Remove from favorites
        console.log('Removing from favorites with ID:', movie.id);
        await authRemoveFromFavorites(movie.id);
        setFavorites(prevFavorites => prevFavorites.filter(fav => fav.id !== movie.id));
      } else {
        // Add to favorites
        console.log('Adding to favorites:', movie);
        await authAddToFavorites(movie);
        setFavorites(prevFavorites => [...prevFavorites, movie]);
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
      setError(`Failed to ${favorites.some(fav => fav.id === movie.id) ? 'remove from' : 'add to'} favorites. Please try again later.`);
      throw err; // Re-throw to allow component to handle the error
    }
  }, [currentUser, favorites, authAddToFavorites, authRemoveFromFavorites]);

  // Check if a movie is in favorites
  const isFavorite = useCallback((movieId) => {
    return favorites.some(movie => movie.id === movieId.toString() || movie.id === movieId);
  }, [favorites]);

  // Clear all favorites
  const clearAllFavorites = useCallback(async () => {
    if (!currentUser || !favorites.length) return;

    try {
      // Get current user data
      const userData = JSON.parse(localStorage.getItem('user'));
      
      // Get all users
      const users = JSON.parse(localStorage.getItem('users')) || [];
      
      // Find current user in users array
      const userIndex = users.findIndex(user => user.id === userData.id);
      
      if (userIndex === -1) {
        throw new Error('User not found');
      }

      // Clear favorites array
      users[userIndex].favorites = [];
      
      // Save updated users array
      localStorage.setItem('users', JSON.stringify(users));
      
      // Update current user
      const updatedUser = { ...userData, favorites: [] };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setFavorites([]);
    } catch (err) {
      console.error('Error clearing favorites:', err);
      setError('Failed to clear favorites. Please try again later.');
    }
  }, [currentUser, favorites]);

  // Load more results (pagination)
  const loadMore = useCallback(async () => {
    if (loading || currentPage >= totalPages) return;
    
    const nextPage = currentPage + 1;
    setLoading(true);
    
    try {
      let data;
      
      if (lastSearch) {
        // Load more search results
        data = await movieAPI.searchMovies(lastSearch, nextPage);
      } else if (selectedGenre) {
        // Load more genre filtered results
        data = await movieAPI.getMoviesByGenre(selectedGenre, nextPage);
      } else {
        // Load more trending results
        data = await movieAPI.fetchTrendingMovies(nextPage);
      }
      
      if (lastSearch || selectedGenre) {
        setSearchResults(prev => [...prev, ...data.results]);
      } else {
        setTrendingMovies(prev => [...prev, ...data.results]);
      }
      
      setCurrentPage(nextPage);
    } catch (err) {
      setError('Failed to load more results. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [loading, currentPage, totalPages, lastSearch, selectedGenre]);

  // Context value
  const value = {
    trendingMovies,
    searchResults,
    movieDetails,
    favorites,
    loading,
    error,
    darkMode,
    genres,
    totalPages,
    currentPage,
    lastSearch,
    selectedGenre,
    fetchTrending,
    searchMovies,
    getMovieDetails,
    toggleFavorite,
    isFavorite,
    toggleDarkMode,
    fetchGenres,
    fetchMoviesByGenre,
    loadMore,
    clearAllFavorites
  };

  return (
    <MovieContext.Provider value={value}>
      {children}
    </MovieContext.Provider>
  );
}; 