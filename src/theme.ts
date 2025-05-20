import { createTheme, ThemeOptions } from '@mui/material/styles';

const getThemeOptions = (mode: 'light' | 'dark'): ThemeOptions => ({
  palette: {
    mode,
    primary: {
      main: '#00bcd4',
      light: '#33c9dc',
      dark: '#008394',
    },
    secondary: {
      main: '#f50057',
      light: '#f73378',
      dark: '#ab003c',
    },
    background: {
      default: mode === 'dark' ? '#1a1a1a' : '#f5f5f5',
      paper: mode === 'dark' ? 'rgba(26, 26, 26, 0.95)' : 'rgba(255, 255, 255, 0.95)',
    },
    text: {
      primary: mode === 'dark' ? '#ffffff' : '#1a1a1a',
      secondary: mode === 'dark' ? '#9e9e9e' : '#666666',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: mode === 'dark' ? 'rgba(26, 26, 26, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            border: `1px solid ${mode === 'dark' ? 'rgba(0, 188, 212, 0.3)' : 'rgba(0, 188, 212, 0.5)'}`,
            boxShadow: `0 0 20px ${mode === 'dark' ? 'rgba(0, 188, 212, 0.1)' : 'rgba(0, 188, 212, 0.2)'}`,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          transition: 'all 0.3s ease-in-out',
        },
        contained: {
          background: 'linear-gradient(135deg, #00bcd4 0%, #0097a7 100%)',
          boxShadow: '0 4px 12px rgba(0, 188, 212, 0.2)',
          '&:hover': {
            background: 'linear-gradient(135deg, #0097a7 0%, #006064 100%)',
            boxShadow: '0 6px 16px rgba(0, 188, 212, 0.3)',
            transform: 'translateY(-2px)',
          },
        },
        outlined: {
          borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
          '&:hover': {
            borderColor: '#00bcd4',
            backgroundColor: 'rgba(0, 188, 212, 0.1)',
            boxShadow: '0 4px 12px rgba(0, 188, 212, 0.1)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            transition: 'all 0.3s ease-in-out',
            '& fieldset': {
              borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
              transition: 'all 0.3s ease-in-out',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(0, 188, 212, 0.5)',
              boxShadow: '0 0 0 4px rgba(0, 188, 212, 0.1)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#00bcd4',
              boxShadow: '0 0 0 4px rgba(0, 188, 212, 0.2)',
            },
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s ease-in-out',
          borderRadius: 8,
          marginBottom: 8,
          '&:hover': {
            backgroundColor: 'rgba(0, 188, 212, 0.1)',
            transform: 'translateX(4px)',
            boxShadow: '0 4px 12px rgba(0, 188, 212, 0.1)',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            backgroundColor: 'rgba(0, 188, 212, 0.1)',
            transform: 'scale(1.1)',
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: '0 0 20px rgba(0, 188, 212, 0.2)',
          },
        },
      },
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      background: mode === 'dark' 
        ? 'linear-gradient(135deg, #fff 0%, #e0e0e0 100%)'
        : 'linear-gradient(135deg, #1a1a1a 0%, #333333 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
});

const theme = createTheme(getThemeOptions('dark'));

export const getTheme = (mode: 'light' | 'dark') => createTheme(getThemeOptions(mode));

export default theme; 