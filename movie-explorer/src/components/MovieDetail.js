import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Chip,
  Rating,
  Button,
  IconButton,
  Divider,
  Paper,
  useMediaQuery,
  useTheme,
  Skeleton,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  PlayArrow,
  Star,
  AccessTime,
  CalendarToday,
  Language,
} from '@mui/icons-material';
import YouTube from 'react-youtube';
import { getImageUrl, getBackdropUrl } from '../services/api';
import { useMovieContext } from '../context/MovieContext';

const MovieDetail = ({ movie }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { toggleFavorite, isFavorite, loading } = useMovieContext();
  const [showTrailer, setShowTrailer] = useState(false);
  
  if (loading || !movie) {
    return <MovieDetailSkeleton />;
  }
  
  // Format runtime to hours and minutes
  const formatRuntime = (minutes) => {
    if (!minutes) return 'Unknown';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };
  
  // Format release date
  const formatReleaseDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  // Get trailer
  const trailer = movie.videos?.results?.find(
    (video) => video.type === 'Trailer' && video.site === 'YouTube'
  );
  
  console.log('Movie data:', movie);
  console.log('Available trailers:', movie.videos?.results);
  
  // Calculate rating out of 5 stars
  const rating = movie.vote_average ? movie.vote_average / 2 : 0;
  
  // Get top cast
  const topCast = movie.credits?.cast.slice(0, 10) || [];
  
  return (
    <Box sx={{ position: 'relative' }}>
      {/* Backdrop Image */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '100vh',
          backgroundImage: `url(${getBackdropUrl(movie.backdrop_path)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: -1,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, ${theme.palette.background.default} 100%)`,
          },
        }}
      />
      
      {/* Movie Content */}
      <Box sx={{ pt: { xs: 4, md: 8 }, pb: 5, position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4}>
          {/* Movie Poster */}
          <Grid item xs={12} md={4} lg={3}>
            <Box
              component={Paper}
              elevation={6}
              sx={{
                borderRadius: 2,
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <Box
                component="img"
                src={getImageUrl(movie.poster_path) || 'https://via.placeholder.com/500x750?text=No+Image'}
                alt={movie.title}
                sx={{
                  width: '100%',
                  display: 'block',
                }}
              />
              <IconButton
                onClick={() => toggleFavorite(movie)}
                sx={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  bgcolor: 'rgba(0, 0, 0, 0.6)',
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.8)',
                  },
                }}
              >
                {isFavorite(movie.id) ? (
                  <Favorite sx={{ color: 'red' }} />
                ) : (
                  <FavoriteBorder sx={{ color: 'white' }} />
                )}
              </IconButton>
            </Box>
          </Grid>
          
          {/* Movie Info */}
          <Grid item xs={12} md={8} lg={9}>
            <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
              {movie.title}
            </Typography>
            
            {/* Movie Meta Info */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3, alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Star sx={{ color: 'gold', mr: 0.5 }} />
                <Typography variant="body1">
                  {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'} ({movie.vote_count} votes)
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarToday sx={{ mr: 0.5 }} fontSize="small" />
                <Typography variant="body1">
                  {formatReleaseDate(movie.release_date)}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AccessTime sx={{ mr: 0.5 }} fontSize="small" />
                <Typography variant="body1">
                  {formatRuntime(movie.runtime)}
                </Typography>
              </Box>
              
              {movie.original_language && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Language sx={{ mr: 0.5 }} fontSize="small" />
                  <Typography variant="body1">
                    {movie.original_language.toUpperCase()}
                  </Typography>
                </Box>
              )}
            </Box>
            
            {/* Genres */}
            <Box sx={{ mb: 3 }}>
              {movie.genres?.map((genre) => (
                <Chip
                  key={genre.id}
                  label={genre.name}
                  variant="outlined"
                  sx={{ mr: 1, mb: 1 }}
                />
              ))}
            </Box>
            
            {/* Overview */}
            <Typography variant="h6" gutterBottom>
              Overview
            </Typography>
            <Typography variant="body1" paragraph>
              {movie.overview || 'No overview available.'}
            </Typography>
            
            {/* Trailer Button */}
            {trailer && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<PlayArrow />}
                onClick={() => setShowTrailer(!showTrailer)}
                sx={{ mt: 2, mb: 4 }}
              >
                {showTrailer ? 'Hide Trailer' : 'Watch Trailer'}
              </Button>
            )}
            
            {/* Trailer */}
            {showTrailer && trailer && (
              <Box sx={{ mt: 3, mb: 4, width: '100%' }}>
                <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden', pb: '56.25%', position: 'relative', height: 0 }}>
                  <YouTube
                    videoId={trailer.key}
                    opts={{
                      width: '100%',
                      height: '100%',
                      playerVars: {
                        autoplay: 1,
                      },
                    }}
                    onError={(e) => console.error('YouTube player error:', e)}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                    }}
                  />
                </Paper>
              </Box>
            )}
            
            {/* Cast */}
            {topCast.length > 0 && (
              <>
                <Divider sx={{ my: 3 }} />
                <Typography variant="h6" gutterBottom>
                  Top Cast
                </Typography>
                <Grid container spacing={2}>
                  {topCast.map((person) => (
                    <Grid item key={person.id} xs={6} sm={4} md={3}>
                      <Paper
                        elevation={2}
                        sx={{
                          p: 1,
                          textAlign: 'center',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                        }}
                      >
                        <Box
                          component="img"
                          src={
                            person.profile_path
                              ? getImageUrl(person.profile_path, 'w185')
                              : 'https://via.placeholder.com/185x278?text=No+Image'
                          }
                          alt={person.name}
                          sx={{
                            width: '100%',
                            height: 150,
                            objectFit: 'cover',
                            borderRadius: 1,
                            mb: 1,
                          }}
                        />
                        <Typography variant="subtitle2" noWrap>
                          {person.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" noWrap>
                          {person.character}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </>
            )}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

// Skeleton for loading state
const MovieDetailSkeleton = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  return (
    <Box sx={{ pt: { xs: 4, md: 8 }, pb: 5 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4} lg={3}>
          <Skeleton variant="rectangular" width="100%" height={450} sx={{ borderRadius: 2 }} />
        </Grid>
        <Grid item xs={12} md={8} lg={9}>
          <Skeleton variant="text" width="80%" height={60} />
          <Box sx={{ display: 'flex', gap: 2, mb: 3, mt: 2 }}>
            <Skeleton variant="text" width={100} />
            <Skeleton variant="text" width={100} />
            <Skeleton variant="text" width={100} />
          </Box>
          <Box sx={{ mb: 3 }}>
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} variant="rectangular" width={80} height={32} sx={{ mr: 1, borderRadius: 4, display: 'inline-block' }} />
            ))}
          </Box>
          <Skeleton variant="text" width="100%" height={30} />
          <Skeleton variant="text" width="100%" />
          <Skeleton variant="text" width="100%" />
          <Skeleton variant="text" width="90%" />
          <Skeleton variant="rectangular" width={150} height={40} sx={{ mt: 2, borderRadius: 1 }} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default MovieDetail; 