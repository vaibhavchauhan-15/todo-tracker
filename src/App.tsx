import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabaseClient';
import { ThemeProvider } from './contexts/ThemeContext';

const Login      = lazy(() => import('./pages/Login'));
const Signup     = lazy(() => import('./pages/Signup'));
const Home       = lazy(() => import('./pages/Home'));
const LandingPage = lazy(() => import('./pages/LandingPage'));

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
        <img
          src="/logo.png"
          alt="TaskMaster"
          style={{
            width: 64, height: 64, objectFit: 'contain',
            borderRadius: 16,
            boxShadow: '0 4px 24px var(--c-accent-glow)',
            animation: 'pulseGlow 2s ease infinite',
          }}
        />
        <p style={{ color: 'var(--c-text-secondary)', letterSpacing: '0.08em', fontSize: 13, margin: 0 }}>
          Loading workspace…
        </p>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Suspense fallback={null}>
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
        </Suspense>
      </Router>
    </ThemeProvider>
  );
};

export default App;
