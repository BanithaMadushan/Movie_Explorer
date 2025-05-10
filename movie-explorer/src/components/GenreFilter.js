import React, { useEffect } from 'react';
import {
  Box,
  Chip,
  Typography,
  Skeleton,
  useMediaQuery,
  useTheme,
  IconButton,
  Paper,
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { useMovieContext } from '../context/MovieContext';

const GenreFilter = ({ selectedGenre, onGenreSelect }) => {
  const { genres, fetchGenres, loading } = useMovieContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const containerRef = React.useRef(null);
  
  useEffect(() => {
    if (!genres.length) {
      fetchGenres();
    }
  }, [genres.length, fetchGenres]);
  
  const handleScroll = (direction) => {
    if (containerRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      containerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };
  
  if (loading && !genres.length) {
    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Genres
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Skeleton key={i} variant="rectangular" width={80} height={32} sx={{ borderRadius: 4 }} />
          ))}
        </Box>
      </Box>
    );
  }
  
  return (
    <Paper
      elevation={1}
      sx={{
        mb: 3,
        p: 2,
        borderRadius: 2,
        position: 'relative',
      }}
    >
      <Typography variant="h6" gutterBottom>
        Browse by Genre
      </Typography>
      
      <Box sx={{ position: 'relative' }}>
        {genres.length > 0 && (
          <>
            <IconButton
              onClick={() => handleScroll('left')}
              sx={{
                position: 'absolute',
                left: -16,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'background.paper',
                boxShadow: 2,
                zIndex: 2,
                '&:hover': {
                  bgcolor: 'background.paper',
                },
                display: { xs: 'none', sm: 'flex' },
              }}
              size="small"
            >
              <ChevronLeft />
            </IconButton>
            
            <IconButton
              onClick={() => handleScroll('right')}
              sx={{
                position: 'absolute',
                right: -16,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'background.paper',
                boxShadow: 2,
                zIndex: 2,
                '&:hover': {
                  bgcolor: 'background.paper',
                },
                display: { xs: 'none', sm: 'flex' },
              }}
              size="small"
            >
              <ChevronRight />
            </IconButton>
          </>
        )}
        
        <Box
          ref={containerRef}
          sx={{
            display: 'flex',
            gap: 1,
            overflowX: 'auto',
            pb: 1,
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            '& .MuiChip-root': {
              transition: 'all 0.2s ease',
            },
          }}
        >
          <Chip
            label="All Genres"
            color={!selectedGenre ? 'primary' : 'default'}
            onClick={() => onGenreSelect(null)}
            variant={!selectedGenre ? 'filled' : 'outlined'}
            sx={{ fontWeight: !selectedGenre ? 'bold' : 'normal' }}
          />
          
          {genres.map((genre) => (
            <Chip
              key={genre.id}
              label={genre.name}
              color={selectedGenre === genre.id ? 'primary' : 'default'}
              onClick={() => onGenreSelect(genre.id)}
              variant={selectedGenre === genre.id ? 'filled' : 'outlined'}
              sx={{ fontWeight: selectedGenre === genre.id ? 'bold' : 'normal' }}
            />
          ))}
        </Box>
      </Box>
    </Paper>
  );
};

export default GenreFilter; 