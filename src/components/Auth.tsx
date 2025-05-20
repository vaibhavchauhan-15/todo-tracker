import React from 'react';
import { signInWithPopup, User } from 'firebase/auth';
import { auth, provider } from '../firebase';
import { Button, Container, Typography, Box } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

interface AuthProps {
  onAuthStateChange: (user: User | null) => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthStateChange }) => {
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      onAuthStateChange(result.user);
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h4" gutterBottom>
          Welcome to Todo Tracker
        </Typography>
        <Button
          variant="contained"
          startIcon={<GoogleIcon />}
          onClick={signInWithGoogle}
          sx={{ mt: 3 }}
        >
          Sign in with Google
        </Button>
      </Box>
    </Container>
  );
};

export default Auth; 