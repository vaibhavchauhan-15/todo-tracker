import React from 'react';
import { Box, Container, Typography, Paper, AppBar, Toolbar, IconButton, Avatar, Menu, MenuItem, BottomNavigation, BottomNavigationAction } from '@mui/material';
import Todo from './Todo';
import Dashboard from './Dashboard';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import Profile from './Profile';
import {
  Dashboard as DashboardIcon,
  List as ListIcon,
  Person as PersonIcon
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
  const [currentView, setCurrentView] = React.useState<'dashboard' | 'todo'>('dashboard');

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
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

  if (showProfile) {
    return <Profile user={user} onBack={() => setShowProfile(false)} />;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        pb: 7 // Add padding bottom for the bottom navigation
      }}
    >
      <AppBar 
        position="static" 
        sx={{ 
          background: 'transparent', 
          boxShadow: 'none',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {currentView === 'dashboard' ? 'Dashboard' : 'Todo List'}
          </Typography>
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
              <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
              <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4 }}>
        {currentView === 'dashboard' ? (
          <Dashboard user={user} />
        ) : (
          <Todo user={user} />
        )}
      </Container>

      <BottomNavigation
        value={currentView}
        onChange={(event, newValue) => {
          setCurrentView(newValue);
        }}
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          bgcolor: 'rgba(26, 26, 26, 0.95)',
          backdropFilter: 'blur(10px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          '& .MuiBottomNavigationAction-root': {
            color: 'text.secondary',
            '&.Mui-selected': {
              color: 'primary.main',
            },
          },
        }}
      >
        <BottomNavigationAction
          label="Dashboard"
          value="dashboard"
          icon={<DashboardIcon />}
        />
        <BottomNavigationAction
          label="Todo List"
          value="todo"
          icon={<ListIcon />}
        />
      </BottomNavigation>
    </Box>
  );
};

export default Home; 