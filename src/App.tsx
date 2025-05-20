import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { auth } from './firebase';
import { User } from 'firebase/auth';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import { TaskProvider } from './contexts/TaskContext';
import { UserProvider, useUser } from './contexts/UserContext';
import { Box, CircularProgress, Typography } from '@mui/material';
import { getTheme } from './theme';
import Todo from './components/Todo';

interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

// Theme Provider Component
const ThemeProviderWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { preferences } = useUser();
  const theme = getTheme(preferences.theme);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const userData: UserData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        };
        setUser(userData);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          height: '100vh',
          width: '100vw',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          color: 'white'
        }}
      >
        <CircularProgress size={60} sx={{ color: '#00bcd4', mb: 2 }} />
        <Typography variant="h6" sx={{ color: '#9e9e9e' }}>
          Loading your workspace...
        </Typography>
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <UserProvider userId={user.uid}>
      <ThemeProviderWrapper>
        {children}
      </ThemeProviderWrapper>
    </UserProvider>
  );
};

function App() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Clear any existing user data on initial load
    localStorage.removeItem('user');
    
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const userData: UserData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        };
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      } else {
        localStorage.removeItem('user');
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          height: '100vh',
          width: '100vw',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          color: 'white'
        }}
      >
        <CircularProgress size={60} sx={{ color: '#00bcd4', mb: 2 }} />
        <Typography variant="h6" sx={{ color: '#9e9e9e' }}>
          Loading your workspace...
        </Typography>
      </Box>
    );
  }

  return (
    <Router>
      <TaskProvider>
        <Routes>
          <Route 
            path="/login" 
            element={user ? <Navigate to="/" /> : <Login onAuthStateChange={setUser} />} 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard user={user!} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Home user={user!} />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </TaskProvider>
    </Router>
  );
}

export default App;
