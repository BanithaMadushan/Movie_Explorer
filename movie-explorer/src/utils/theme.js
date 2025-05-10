import { createTheme } from '@mui/material/styles';

// Netflix-inspired colors
const netflixRed = '#E50914';
const netflixBlack = '#141414';
const netflixDarkGray = '#181818';
const netflixLightGray = '#b3b3b3';
const netflixWhite = '#FFFFFF';

// Create theme based on mode (light or dark)
export const createAppTheme = (mode) => {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: netflixRed,
      },
      secondary: {
        main: mode === 'dark' ? netflixLightGray : '#757575',
      },
      background: {
        default: mode === 'dark' ? netflixBlack : '#f5f5f5',
        paper: mode === 'dark' ? netflixDarkGray : netflixWhite,
        navbar: mode === 'dark' ? 'rgba(20, 20, 20, 0.9)' : 'rgba(255, 255, 255, 0.9)',
      },
      text: {
        primary: mode === 'dark' ? netflixWhite : '#212121',
        secondary: mode === 'dark' ? netflixLightGray : '#757575',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 700,
      },
      h2: {
        fontWeight: 600,
      },
      h3: {
        fontWeight: 600,
      },
      h4: {
        fontWeight: 600,
      },
      h5: {
        fontWeight: 500,
      },
      h6: {
        fontWeight: 500,
      },
      subtitle1: {
        fontWeight: 400,
      },
      body1: {
        fontWeight: 400,
      },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'dark' ? 'rgba(20, 20, 20, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            boxShadow: 'none',
            borderBottom: mode === 'dark' ? 'none' : '1px solid rgba(0, 0, 0, 0.12)',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 4,
            textTransform: 'none',
            fontWeight: 600,
          },
          containedPrimary: {
            '&:hover': {
              backgroundColor: '#c4151c',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            overflow: 'hidden',
            transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
            '&:hover': {
              transform: 'scale(1.03)',
              boxShadow: '0 8px 40px rgba(0, 0, 0, 0.12)',
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 4,
            },
          },
        },
      },
    },
    shape: {
      borderRadius: 8,
    },
  });
}; 