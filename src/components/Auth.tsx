import React from 'react';
import { supabase } from '../lib/supabaseClient';
import { Button, Container, Typography, Box } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

type UserData = { uid: string; email: string | null; displayName: string | null; photoURL: string | null };

interface AuthProps {
  onAuthStateChange: (user: UserData | null) => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthStateChange }) => {
  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin + '/app' },
      });
      if (error) throw error;
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