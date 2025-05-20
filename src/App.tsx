import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box, CircularProgress, Typography } from '@mui/material';
import { getTheme } from './theme';
import { auth } from './firebase';
import Login from './components/Login';
import Home from './components/Home';
import { TaskProvider } from './contexts/TaskContext';
import { UserProvider } from './contexts/UserContext';
import { DailyProgressProvider } from './contexts/DailyProgressContext';

interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = localStorage.getItem('user');
  if (!auth) {
    return <Navigate to="/login" />;
  }
  const user = JSON.parse(auth);
  return (
    <UserProvider userId={user.uid}>
      <TaskProvider>
        <DailyProgressProvider>
          {children}
        </DailyProgressProvider>
      </TaskProvider>
    </UserProvider>
  );
};

const App: React.FC = () => {
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
    <ThemeProvider theme={getTheme('dark')}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route 
            path="/login" 
            element={user ? <Navigate to="/" /> : <Login onAuthStateChange={setUser} />} 
          />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
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
