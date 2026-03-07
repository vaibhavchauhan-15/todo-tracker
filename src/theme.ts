import { createTheme, ThemeOptions } from '@mui/material/styles';

const getThemeOptions = (mode: 'light' | 'dark'): ThemeOptions => ({
  palette: {
    mode,
    primary: {
      main: '#00bcd4',
      light: '#4dd0e1',
      dark: '#0097a7',
    },
    secondary: {
      main: '#7c3aed',
      light: '#a78bfa',
      dark: '#5b21b6',
    },
    success: { main: '#4caf50' },
    warning: { main: '#ff9800' },
    error:   { main: '#f44336' },
    background: {
      default: mode === 'dark' ? '#0d0d14' : '#f5f5f5',
      paper:   mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(255, 255, 255, 0.95)',
    },
    text: {
      primary:   mode === 'dark' ? '#f0f0f0' : '#1a1a1a',
      secondary: mode === 'dark' ? '#9e9e9e' : '#666666',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(255, 255, 255, 0.97)',
          backdropFilter: 'blur(12px)',
          border: `1px solid ${mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
          transition: 'all 0.25s ease',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 600,
          transition: 'all 0.25s ease',
        },
        contained: {
          background: 'linear-gradient(135deg, #00bcd4 0%, #0097a7 100%)',
          boxShadow: '0 2px 10px rgba(0, 188, 212, 0.25)',
          '&:hover': {
            background: 'linear-gradient(135deg, #0097a7 0%, #006064 100%)',
            boxShadow: '0 4px 16px rgba(0, 188, 212, 0.4)',
            transform: 'translateY(-1px)',
          },
          '&:disabled': {
            background: 'rgba(255,255,255,0.08)',
            color: 'rgba(255,255,255,0.25)',
            boxShadow: 'none',
          },
        },
        outlined: {
          borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.2)',
          '&:hover': {
            borderColor: '#00bcd4',
            backgroundColor: 'rgba(0, 188, 212, 0.08)',
            transform: 'translateY(-1px)',
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
      letterSpacing: '-0.02em',
      background: mode === 'dark'
        ? 'linear-gradient(135deg, #ffffff 0%, #b0b0b0 100%)'
        : 'linear-gradient(135deg, #1a1a1a 0%, #333333 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    h5: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h6: {
      fontWeight: 600,
    },
    body1: {
      letterSpacing: '0.01em',
    },
  },
  shape: {
    borderRadius: 8,
  },
});

const theme = createTheme(getThemeOptions('dark'));

export const getTheme = (mode: 'light' | 'dark') => createTheme(getThemeOptions(mode));

export default theme; 