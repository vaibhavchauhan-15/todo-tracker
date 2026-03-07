import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box, Typography } from '@mui/material';
import { getTheme } from './theme';
import { supabase } from './lib/supabaseClient';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';

interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

const ProtectedRoute: React.FC<{ children: React.ReactNode; user: UserData | null }> = ({ children, user }) => {
  if (!user) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const u = session.user;
        setUser({
          uid: u.id,
          email: u.email ?? null,
          displayName: u.user_metadata?.full_name || u.user_metadata?.name || null,
          photoURL: u.user_metadata?.avatar_url || null,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <Box sx={{
        height: '100vh', width: '100vw',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: 'radial-gradient(ellipse at 50% 40%, rgba(0,188,212,0.07) 0%, transparent 60%), #0d0d14',
        gap: 2,
      }}>
        <Box sx={{ width: 64, height: 64, mb: 1, animation: 'pulseGlow 2s ease infinite' }}>
          <img src="/logo.png" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </Box>
        <Typography variant="body2" sx={{ color: '#9e9e9e', letterSpacing: '0.08em', fontSize: 13 }}>
          Loading workspace…
        </Typography>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={getTheme('dark')}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route 
            path="/login" 
            element={user ? <Navigate to="/" /> : <Login onAuthStateChange={setUser} />} 
          />
          <Route 
            path="/signup" 
            element={user ? <Navigate to="/" /> : <Signup onAuthStateChange={setUser} />} 
          />
          <Route 
            path="/" 
            element={
              <ProtectedRoute user={user}>
                <Home user={user!} />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
