import React, { useState } from 'react';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, User } from 'firebase/auth';
import { auth, provider } from '../firebase';
import { 
  Box, 
  Button, 
  Container, 
  TextField, 
  Typography, 
  Paper, 
  Avatar, 
  InputAdornment,
  IconButton,
  Divider,
  Link,
  useTheme,
  useMediaQuery
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AssignmentIcon from '@mui/icons-material/Assignment';

interface LoginProps {
  onAuthStateChange: (user: User | null) => void;
}

const Login: React.FC<LoginProps> = ({ onAuthStateChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState('');

  // Google Login
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      onAuthStateChange(result.user);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Email/Password Login or Signup
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isSignup) {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        onAuthStateChange(result.user);
      } else {
        const result = await signInWithEmailAndPassword(auth, email, password);
        onAuthStateChange(result.user);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `
          linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%),
          repeating-linear-gradient(45deg, #2d2d2d 0px, #2d2d2d 2px, transparent 2px, transparent 4px),
          repeating-linear-gradient(-45deg, #2d2d2d 0px, #2d2d2d 2px, transparent 2px, transparent 4px)
        `,
        backgroundBlendMode: 'overlay',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(0, 188, 212, 0.1) 0%, transparent 50%)',
          pointerEvents: 'none'
        }
      }}
    >
      <Container 
        maxWidth="xs" 
        sx={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          px: isMobile ? 2 : 3,
          py: isMobile ? 2 : 4,
          position: 'relative',
          zIndex: 1
        }}
      >
        <Paper 
          elevation={6} 
          sx={{ 
            p: isMobile ? 2 : 4, 
            width: '100%', 
            borderRadius: isMobile ? 2 : 4,
            bgcolor: 'rgba(26, 26, 26, 0.95)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            maxWidth: isMobile ? '100%' : '400px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: 'inherit',
              padding: '1px',
              background: 'linear-gradient(135deg, rgba(0, 188, 212, 0.2), rgba(0, 188, 212, 0.1))',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
              pointerEvents: 'none'
            }
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            mb: isMobile ? 2 : 4 
          }}>
            <Avatar 
              sx={{ 
                bgcolor: '#00bcd4', 
                width: isMobile ? 48 : 64, 
                height: isMobile ? 48 : 64, 
                mb: isMobile ? 1 : 2,
                boxShadow: '0 4px 12px rgba(0, 188, 212, 0.3)',
                background: 'linear-gradient(135deg, #00bcd4 0%, #0097a7 100%)'
              }}
            >
              <AssignmentIcon sx={{ fontSize: isMobile ? 24 : 32 }} />
            </Avatar>
            <Typography 
              variant={isMobile ? "h5" : "h4"} 
              fontWeight={700} 
              color="white" 
              gutterBottom
              sx={{ 
                textAlign: 'center',
                background: 'linear-gradient(135deg, #fff 0%, #e0e0e0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              {isSignup ? 'Create Your Account' : 'Welcome Back'}
            </Typography>
            <Typography 
              variant={isMobile ? "body2" : "body1"} 
              sx={{ 
                color: '#9e9e9e',
                textAlign: 'center',
                px: isMobile ? 1 : 0
              }}
            >
              {isSignup ? 'Sign up to get started' : 'Log in to your ToDo'}
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleEmailAuth} sx={{ mt: isMobile ? 1 : 2 }}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              margin="normal"
              size={isMobile ? "small" : "medium"}
              InputProps={{
                startAdornment: <InputAdornment position="start"><EmailIcon sx={{ color: '#9e9e9e' }} /></InputAdornment>
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                  '&:hover fieldset': { borderColor: '#00bcd4' },
                  '&.Mui-focused fieldset': { borderColor: '#00bcd4' }
                },
                '& .MuiInputLabel-root': { color: '#9e9e9e' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#00bcd4' }
              }}
              required
            />
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              margin="normal"
              size={isMobile ? "small" : "medium"}
              InputProps={{
                startAdornment: <InputAdornment position="start"><LockIcon sx={{ color: '#9e9e9e' }} /></InputAdornment>,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: '#9e9e9e' }}
                      size={isMobile ? "small" : "medium"}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                  '&:hover fieldset': { borderColor: '#00bcd4' },
                  '&.Mui-focused fieldset': { borderColor: '#00bcd4' }
                },
                '& .MuiInputLabel-root': { color: '#9e9e9e' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#00bcd4' }
              }}
              required
            />

            {!isSignup && (
              <Box sx={{ textAlign: 'right', mt: 1 }}>
                <Link 
                  href="#" 
                  sx={{ 
                    color: '#9e9e9e', 
                    textDecoration: 'none',
                    fontSize: isMobile ? '0.875rem' : '1rem',
                    '&:hover': { color: '#00bcd4' }
                  }}
                >
                  Forgot password?
                </Link>
              </Box>
            )}

            <Button 
              type="submit" 
              fullWidth 
              variant="contained" 
              sx={{ 
                mt: isMobile ? 2 : 3, 
                mb: isMobile ? 1 : 2, 
                py: isMobile ? 1 : 1.5, 
                background: 'linear-gradient(135deg, #00bcd4 0%, #0097a7 100%)',
                '&:hover': { 
                  background: 'linear-gradient(135deg, #0097a7 0%, #006064 100%)'
                },
                fontWeight: 600,
                fontSize: isMobile ? 14 : 16,
                boxShadow: '0 4px 12px rgba(0, 188, 212, 0.3)'
              }}
            >
              {isSignup ? 'Sign Up' : 'Login'}
            </Button>

            <Divider sx={{ my: isMobile ? 2 : 3, color: '#9e9e9e' }}>
              <Typography variant="body2" sx={{ color: '#9e9e9e' }}>or</Typography>
            </Divider>

            <Button 
              fullWidth 
              variant="outlined" 
              startIcon={<GoogleIcon />} 
              onClick={signInWithGoogle}
              sx={{ 
                mb: isMobile ? 1 : 2, 
                py: isMobile ? 1 : 1.5, 
                borderColor: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: isMobile ? 14 : 16,
                '&:hover': { 
                  borderColor: '#00bcd4',
                  bgcolor: 'rgba(0, 188, 212, 0.1)'
                }
              }}
            >
              {isSignup ? 'Sign up with Google' : 'Sign in with Google'}
            </Button>

            <Box sx={{ textAlign: 'center', mt: isMobile ? 1 : 2 }}>
              <Typography 
                variant={isMobile ? "body2" : "body1"} 
                sx={{ 
                  color: '#9e9e9e',
                  fontSize: isMobile ? '0.875rem' : '1rem'
                }}
              >
                {isSignup ? 'Already have an account?' : "Don't have an account?"}
                <Link 
                  component="button"
                  onClick={() => setIsSignup(!isSignup)}
                  sx={{ 
                    ml: 1, 
                    color: '#00bcd4',
                    textDecoration: 'none',
                    fontSize: isMobile ? '0.875rem' : '1rem',
                    '&:hover': { color: '#0097a7' }
                  }}
                >
                  {isSignup ? 'Login' : 'Sign Up'}
                </Link>
              </Typography>
            </Box>
          </Box>

          {error && (
            <Typography 
              color="error" 
              sx={{ 
                mt: isMobile ? 1 : 2, 
                textAlign: 'center',
                color: '#f44336',
                bgcolor: 'rgba(244, 67, 54, 0.1)',
                p: isMobile ? 0.5 : 1,
                borderRadius: 1,
                fontSize: isMobile ? '0.875rem' : '1rem',
                border: '1px solid rgba(244, 67, 54, 0.2)'
              }}
            >
              {error}
            </Typography>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default Login; 