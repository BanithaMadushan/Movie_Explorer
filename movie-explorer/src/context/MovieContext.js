import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as movieAPI from '../services/api';
import { useAuth } from './AuthContext';
import * as favoritesAPI from '../services/favoritesApi';

// Create context
const MovieContext = createContext();

// Custom hook to use the movie context
export const useMovieContext = () => useContext(MovieContext);

// Provider component
export const MovieProvider = ({ children, initialValues }) => {
  const { currentUser } = useAuth();
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

  // Load user preferences from localStorage
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

  // Load favorites from backend when user logs in
  useEffect(() => {
    const loadFavorites = async () => {
      if (currentUser) {
        try {
          setLoading(true);
          const response = await favoritesAPI.getFavorites();
          
          // Convert backend format to TMDB format
          const formattedFavorites = response.data.map(fav => ({
            id: fav.movieId,
            title: fav.title,
            poster_path: fav.poster_path,
            backdrop_path: fav.backdrop_path,
            overview: fav.overview,
            release_date: fav.release_date,
            vote_average: fav.vote_average,
            genre_ids: fav.genre_ids || []
          }));
          
          setFavorites(formattedFavorites);
        } catch (err) {
          console.error("Error loading favorites:", err);
          setError('Failed to load favorites');
        } finally {
          setLoading(false);
        }
      } else {
        // Clear favorites when user logs out
        setFavorites([]);
      }
    };
    
    loadFavorites();
  }, [currentUser]);

  // Save darkMode to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('darkMode', JSON.stringify(darkMode));
    } catch (err) {
      console.error("Error saving darkMode to localStorage:", err);
    }
  }, [darkMode]);

  // Save lastSearch to localStorage whenever it changes
  useEffect(() => {
    try {
      if (lastSearch) {
        localStorage.setItem('lastSearch', lastSearch);
      }
    } catch (err) {
      console.error("Error saving lastSearch to localStorage:", err);
    }
  }, [lastSearch]);

  // Toggle dark mode
  const toggleDarkMode = useCallback(() => {
    setDarkMode(prevMode => !prevMode);
  }, []);

  // Fetch trending movies
  const fetchTrending = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const data = await movieAPI.fetchTrendingMovies(page);
      if (page === 1) {
        setTrendingMovies(data.results || []);
      } else {
        setTrendingMovies(prev => [...prev, ...(data.results || [])]);
      }
      setTotalPages(data.total_pages || 0);
      setCurrentPage(data.page || 1);
    } catch (err) {
      setError('Failed to fetch trending movies. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Search movies
  const searchMovies = useCallback(async (query, page = 1) => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    setLastSearch(query);
    
    try {
      const data = await movieAPI.searchMovies(query, page);
      
      // If it's the first page or a new search, replace results
      // Otherwise append to existing results
      if (page === 1) {
        setSearchResults(data.results || []);
      } else {
        setSearchResults(prev => [...prev, ...(data.results || [])]);
      }
      
      setTotalPages(data.total_pages || 0);
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
    setMovieDetails(null);
    
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

  // Fetch genres
  const fetchGenres = useCallback(async () => {
    if (genres.length > 0) return; // Only fetch if not already loaded
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await movieAPI.getGenres();
      setGenres(data || []);
    } catch (err) {
      setError('Failed to fetch genres. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [genres.length]);

  // Fetch filtered movies
  const fetchFilteredMovies = useCallback(async (params, page = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await movieAPI.getFilteredMovies({
        ...params,
        page
      });
      
      if (page === 1) {
        setSearchResults(data.results || []);
      } else {
        setSearchResults(prev => [...prev, ...(data.results || [])]);
      }
      
      setTotalPages(data.total_pages || 0);
      setCurrentPage(data.page || 1);
    } catch (err) {
      setError('Failed to fetch filtered movies. Please try again later.');
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
    } catch (err) {
      setError('Failed to fetch movies by genre. Please try again later.');
      console.error(err);
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
      const isFav = favorites.some(fav => fav.id === movie.id);
      
      if (isFav) {
        await favoritesAPI.removeFavorite(movie.id);
        setFavorites(prevFavorites => prevFavorites.filter(fav => fav.id !== movie.id));
      } else {
        await favoritesAPI.addFavorite(movie);
        setFavorites(prevFavorites => [...prevFavorites, movie]);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      throw new Error(error.message || 'Failed to update favorites');
    }
  }, [currentUser, favorites]);

  // Check if a movie is in favorites
  const isFavorite = useCallback((movieId) => {
    return favorites.some(movie => movie.id === movieId);
  }, [favorites]);

  // Load more results (pagination)
  const loadMore = useCallback(async () => {
    if (loading || currentPage >= totalPages) return;
    
    const nextPage = currentPage + 1;
    
    if (lastSearch) {
      // If we have a search query, load more search results
      await searchMovies(lastSearch, nextPage);
    } else if (selectedGenre) {
      // If we have a selected genre, load more movies from that genre
      await fetchMoviesByGenre(selectedGenre, nextPage);
    } else {
      // Otherwise load more trending movies
      await fetchTrending(nextPage);
    }
  }, [loading, currentPage, totalPages, lastSearch, selectedGenre, searchMovies, fetchMoviesByGenre, fetchTrending]);

  // Clear search results
  const clearSearch = useCallback(() => {
    setSearchResults([]);
    setLastSearch('');
    localStorage.removeItem('lastSearch');
  }, []);

  // Clear all favorites
  const clearAllFavorites = useCallback(async () => {
    if (!currentUser) {
      throw new Error('Please log in to manage favorites');
    }

    try {
      await favoritesAPI.clearFavorites();
      setFavorites([]);
    } catch (error) {
      console.error("Error clearing favorites:", error);
      throw new Error(error.message || 'Failed to clear favorites');
    }
  }, [currentUser]);

  const value = {
    trendingMovies,
    searchResults,
    movieDetails,
    genres,
    loading,
    error,
    favorites,
    lastSearch,
    darkMode,
    currentPage,
    totalPages,
    selectedGenre,
    fetchTrending,
    searchMovies,
    getMovieDetails,
    fetchMoviesByGenre,
    fetchGenres,
    toggleFavorite,
    isFavorite,
    toggleDarkMode,
    fetchFilteredMovies,
    loadMore,
    clearSearch,
    clearAllFavorites
  };

  return (
    <MovieContext.Provider value={value}>
      {children}
    </MovieContext.Provider>
  );
}; 