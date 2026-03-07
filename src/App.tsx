import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabaseClient';
import { ThemeProvider } from './contexts/ThemeContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import LandingPage from './pages/LandingPage';

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
        // Clean up the leftover hash fragment from OAuth redirect
        if (window.location.hash) {
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{
        height: '100vh', width: '100vw',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: 'var(--c-bg)',
        gap: 16,
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: 14,
          background: 'linear-gradient(135deg, var(--c-accent), var(--c-accent-dark))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 24px var(--c-accent-glow)',
          animation: 'pulseGlow 2s ease infinite',
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#fff" />
          </svg>
        </div>
        <p style={{ color: 'var(--c-text-secondary)', letterSpacing: '0.08em', fontSize: 13, margin: 0 }}>
          Loading workspace…
        </p>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={user ? <Navigate to="/app" replace /> : <LandingPage />} />
          <Route 
            path="/login" 
            element={user ? <Navigate to="/app" /> : <Login onAuthStateChange={setUser} />} 
          />
          <Route 
            path="/signup" 
            element={user ? <Navigate to="/app" /> : <Signup onAuthStateChange={setUser} />} 
          />
          <Route 
            path="/app" 
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
