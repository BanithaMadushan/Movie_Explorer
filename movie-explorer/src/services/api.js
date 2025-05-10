import axios from 'axios';

const API_KEY = 'ea5758a7e6e0705021c3e48f9579899d';
const BASE_URL = 'https://api.themoviedb.org/3';
const YOUTUBE_API_KEY = 'AIzaSyD_hmdsN5vnXpOrBP4GXWKXaRe7Ix_wpYU';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'en-US',
  },
});

// API service functions
export const fetchTrendingMovies = async (page = 1) => {
  try {
    console.log('Making API request to TMDb for trending movies...');
    const response = await api.get(`/trending/movie/week`, {
      params: { 
        page,
        include_adult: false,
        // Request full image paths
        include_image_language: 'en,null',
        append_to_response: 'images'
      },
    });
    
    // Force log entire response for debugging
    console.log('TMDb API response received');
    
    // Check if we have results
    if (response.data.results && response.data.results.length > 0) {
      // Log the first result as sample
      const firstMovie = response.data.results[0];
      console.log('First movie title:', firstMovie.title);
      console.log('First movie backdrop path:', firstMovie.backdrop_path);
      console.log('First movie poster path:', firstMovie.poster_path);
      
      // Generate and log a sample image URL
      if (firstMovie.backdrop_path) {
        const backdropUrl = `https://image.tmdb.org/t/p/original${firstMovie.backdrop_path}`;
        console.log('Sample backdrop URL:', backdropUrl);
        
        // Test image loading
        const testImg = new Image();
        testImg.onload = () => console.log('Test image loaded successfully');
        testImg.onerror = (err) => console.error('Test image failed to load');
        testImg.src = backdropUrl;
      }
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    throw error;
  }
};

export const searchMovies = async (query, page = 1) => {
  try {
    const response = await api.get('/search/movie', {
      params: {
        query,
        page,
        include_adult: false,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
};

export const getMovieDetails = async (movieId) => {
  try {
    const response = await api.get(`/movie/${movieId}`, {
      params: {
        append_to_response: 'videos,credits,images',
      },
    });
    
    // If videos aren't included in the response, fetch them separately
    if (!response.data.videos || !response.data.videos.results || response.data.videos.results.length === 0) {
      try {
        const videosResponse = await api.get(`/movie/${movieId}/videos`);
        response.data.videos = videosResponse.data;
      } catch (videoError) {
        console.error('Error fetching videos separately:', videoError);
      }
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
};

export const getMoviesByGenre = async (genreId, page = 1) => {
  try {
    const response = await api.get('/discover/movie', {
      params: {
        with_genres: genreId,
        page,
        sort_by: 'popularity.desc',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching movies by genre:', error);
    throw error;
  }
};

export const getMovieTrailer = async (movieId) => {
  try {
    const response = await api.get(`/movie/${movieId}/videos`);
    const trailers = response.data.results.filter(
      (video) => video.type === 'Trailer' && video.site === 'YouTube'
    );
    return trailers.length > 0 ? trailers[0] : null;
  } catch (error) {
    console.error('Error fetching movie trailer:', error);
    throw error;
  }
};

export const getGenres = async () => {
  try {
    const response = await api.get('/genre/movie/list');
    return response.data.genres;
  } catch (error) {
    console.error('Error fetching genres:', error);
    throw error;
  }
};

export const getFilteredMovies = async (params) => {
  try {
    const response = await api.get('/discover/movie', {
      params: {
        ...params,
        sort_by: params.sort_by || 'popularity.desc',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching filtered movies:', error);
    throw error;
  }
};

// Image URL helpers
export const getImageUrl = (path, size = 'w500') => {
  if (!path) return 'https://via.placeholder.com/500x750?text=No+Image';
  
  try {
    // Handle paths that already include the full URL
    if (path.startsWith('http')) {
      console.log('Image URL already complete:', path);
      return path;
    }
    
    // Ensure the path starts with /
    const formattedPath = path.startsWith('/') ? path : `/${path}`;
    
    // Construct the TMDb image URL
    const url = `https://image.tmdb.org/t/p/${size}${formattedPath}`;
    console.log('API getImageUrl generated:', url);
    return url;
  } catch (error) {
    console.error('Error generating image URL:', error);
    return 'https://via.placeholder.com/500x750?text=No+Image';
  }
};

export const getBackdropUrl = (path, size = 'original') => {
  if (!path) return 'https://via.placeholder.com/1920x1080?text=No+Backdrop';
  
  try {
    // Handle paths that already include the full URL
    if (path.startsWith('http')) {
      console.log('Backdrop URL already complete:', path);
      return path;
    }
    
    // Ensure the path starts with /
    const formattedPath = path.startsWith('/') ? path : `/${path}`;
    
    // Construct the TMDb image URL
    const url = `https://image.tmdb.org/t/p/${size}${formattedPath}`;
    console.log('API getBackdropUrl generated:', url);
    return url;
  } catch (error) {
    console.error('Error generating backdrop URL:', error);
    return 'https://via.placeholder.com/1920x1080?text=No+Backdrop';
  }
};

export default {
  fetchTrendingMovies,
  searchMovies,
  getMovieDetails,
  getMoviesByGenre,
  getMovieTrailer,
  getGenres,
  getFilteredMovies,
  getImageUrl,
  getBackdropUrl,
}; 