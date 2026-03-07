import React from 'react';
import { Box, Container, Typography, Stack } from '@mui/material';
import Workspace from '../components/Workspace';


interface UserData {
  uid: string; email: string | null; displayName: string | null; photoURL: string | null;
}
interface HomeProps { user: UserData }

/* ─── Footer ─────────────────────────────────────────────── */
const Footer: React.FC = () => (
  <Box component="footer" sx={{
    mt: 'auto',
    py: 3,
    borderTop: '1px solid rgba(255,255,255,0.07)',
    background: 'rgba(255,255,255,0.02)',
  }}>
    <Container maxWidth="md">
      <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" justifyContent="space-between" spacing={1}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <img src="/logo.png" alt="Logo" style={{ width: 20, height: 20, objectFit: 'contain' }} />
          <Typography variant="body2" sx={{ color: '#9e9e9e', fontWeight: 600, letterSpacing: '0.05em' }}>
            TaskMaster
          </Typography>
        </Stack>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.2)' }}>
          © {new Date().getFullYear()} · Stay productive, stay focused.
        </Typography>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.18)', fontSize: 11 }}>
          Built with ❤️ &amp; React
        </Typography>
      </Stack>
    </Container>
  </Box>
);

/* ─── Home ────────────────────────────────────────────────── */
const Home: React.FC<HomeProps> = ({ user }) => {
  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(160deg, #0d0d14 0%, #0f1520 100%)', display: 'flex', flexDirection: 'column' }}>

      {/* ── Main content ───────────────────────────────────── */}
      <Box sx={{ flexGrow: 1 }}>
        <Workspace user={user} />
      </Box>

      {/* ── Footer ─────────────────────────────────────────── */}
      <Footer />
    </Box>
  );
};

export default Home;
