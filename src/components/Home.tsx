import React from 'react';
import { Box, Container, Typography, Paper, AppBar, Toolbar, IconButton, Avatar, Menu, MenuItem, Button, Stack, Divider } from '@mui/material';
import Todo from './Todo';
import Dashboard from './Dashboard';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import Profile from './Profile';
import {
  Dashboard as DashboardIcon,
  List as ListIcon,
  Person as PersonIcon,
  Home as HomeIcon,
  Logout as LogoutIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface HomeProps {
  user: UserData;
}

const Home: React.FC<HomeProps> = ({ user }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [showProfile, setShowProfile] = React.useState(false);
  const [currentView, setCurrentView] = React.useState<'dashboard' | 'todo'>('todo');
  const [previousView, setPreviousView] = React.useState<'dashboard' | 'todo' | null>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    setPreviousView(currentView);
    setShowProfile(true);
    handleClose();
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('user');
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleBack = () => {
    if (showProfile) {
      setShowProfile(false);
      if (previousView) {
        setCurrentView(previousView);
      }
    } else {
      setCurrentView('dashboard');
    }
  };

  if (showProfile) {
    return <Profile user={user} onBack={handleBack} />;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      }}
    >
      <AppBar 
        position="fixed" 
        sx={{ 
          background: 'rgba(26, 26, 26, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
      >
        <Toolbar>
          {/* Logo and Brand */}
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
            <CheckCircleIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              TaskMaster
            </Typography>
          </Box>

          {/* Navigation Links */}
          <Stack direction="row" spacing={2} sx={{ flexGrow: 1 }}>
            <Button
              color="inherit"
              startIcon={<HomeIcon />}
              onClick={() => setCurrentView('todo')}
              sx={{
                color: currentView === 'todo' ? 'primary.main' : 'inherit',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              Home
            </Button>
            <Button
              color="inherit"
              startIcon={<DashboardIcon />}
              onClick={() => setCurrentView('dashboard')}
              sx={{
                color: currentView === 'dashboard' ? 'primary.main' : 'inherit',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              Dashboard
            </Button>
          </Stack>

          {/* User Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              {user.displayName}
            </Typography>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <Avatar 
                src={user.photoURL ? user.photoURL : undefined} 
                alt={user.displayName || 'User'} 
                sx={{ 
                  width: 40, 
                  height: 40,
                  border: '2px solid rgba(255, 255, 255, 0.1)'
                }} 
              />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              PaperProps={{
                sx: {
                  bgcolor: 'rgba(26, 26, 26, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  mt: 1.5,
                  '& .MuiMenuItem-root': {
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                    },
                  },
                },
              }}
            >
              <MenuItem onClick={handleProfileClick}>
                <PersonIcon sx={{ mr: 1 }} /> Profile
              </MenuItem>
              <Divider sx={{ my: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
              <MenuItem onClick={handleSignOut} sx={{ color: 'error.main' }}>
                <LogoutIcon sx={{ mr: 1 }} /> Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ pt: 8, pb: 4 }}>
        <Container maxWidth="md">
          {currentView === 'dashboard' ? (
            <Dashboard user={user} />
          ) : (
            <Todo user={user} />
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 