import axios from 'axios';

const API_URL = 'http://localhost:5004/api';

// Create axios instance for favorites API
const favoritesApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
favoritesApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Favorites service functions
export const getFavorites = async () => {
  try {
    const response = await favoritesApi.get('/favorites');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get favorites');
  }
};

export const addFavorite = async (movie) => {
  try {
    // Convert TMDB movie object to our backend format
    const favoriteData = {
      movieId: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
      overview: movie.overview,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
      genre_ids: movie.genre_ids || []
    };
    
    const response = await favoritesApi.post('/favorites', favoriteData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to add favorite');
  }
};

export const removeFavorite = async (movieId) => {
  try {
    const response = await favoritesApi.delete(`/favorites/${movieId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to remove favorite');
  }
};

export const checkFavorite = async (movieId) => {
  try {
    const response = await favoritesApi.get(`/favorites/check/${movieId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to check favorite status');
  }
};

export const clearFavorites = async () => {
  try {
    const response = await favoritesApi.delete('/favorites');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to clear favorites');
  }
};

export default {
  getFavorites,
  addFavorite,
  removeFavorite,
  checkFavorite,
  clearFavorites
}; 