import React, { useState } from 'react';
import { signOut, updateProfile, updatePassword, deleteUser } from 'firebase/auth';
import { auth, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { 
  Box, 
  Avatar, 
  Typography, 
  Button, 
  TextField,
  Switch,
  FormControlLabel,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider,
  Paper,
  useTheme,
  CircularProgress,
  AppBar,
  Toolbar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useTasks } from '../contexts/TaskContext';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  PhotoCamera as PhotoCameraIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Notifications as NotificationsIcon,
  Google as GoogleIcon,
  Lock as LockIcon,
  Warning as WarningIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';

interface ProfileProps {
  user: any;
  onBack?: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onBack }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { preferences, updatePreferences, updatePassword: updateUserPassword, deleteAccount } = useUser();
  const { tasks } = useTasks();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user.displayName || '');
  const [isUploading, setIsUploading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('user');
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      await updateProfile(auth.currentUser!, {
        displayName: displayName
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const storageRef = ref(storage, `profile_photos/${user.uid}`);
      await uploadBytes(storageRef, file);
      const photoURL = await getDownloadURL(storageRef);
      await updateProfile(auth.currentUser!, { photoURL });
    } catch (error) {
      console.error('Error uploading photo:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      await updatePassword(auth.currentUser!, newPassword);
      await updateUserPassword();
      setShowPasswordDialog(false);
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error updating password:', error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      await deleteUser(auth.currentUser!);
      navigate('/login');
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  // Calculate task statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const dailyProgress = (completedTasks / preferences.dailyGoal) * 100;

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)' }}>
      <AppBar 
        position="static" 
        sx={{ 
          background: 'transparent', 
          boxShadow: 'none',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={onBack}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Profile Settings
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 3, 
            background: 'rgba(26, 26, 26, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          {/* Profile Picture Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Box sx={{ position: 'relative' }}>
              <Avatar 
                src={user.photoURL} 
                alt={user.displayName} 
                sx={{ 
                  width: 100, 
                  height: 100,
                  border: '2px solid rgba(255, 255, 255, 0.1)'
                }} 
              />
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="photo-upload"
                type="file"
                onChange={handlePhotoUpload}
              />
              <label htmlFor="photo-upload">
                <IconButton
                  component="span"
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    bgcolor: 'primary.main',
                    '&:hover': { bgcolor: 'primary.dark' }
                  }}
                >
                  <PhotoCameraIcon />
                </IconButton>
              </label>
            </Box>
            <Box sx={{ flex: 1 }}>
              {isEditing ? (
                <TextField
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  fullWidth
                  sx={{ mb: 1 }}
                />
              ) : (
                <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {user.displayName}
                  <IconButton size="small" onClick={() => setIsEditing(true)}>
                    <EditIcon />
                  </IconButton>
                </Typography>
              )}
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Account created: {new Date(preferences.accountCreated).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>

          {isEditing && (
            <Box sx={{ mb: 3 }}>
              <Button 
                variant="contained" 
                onClick={handleProfileUpdate}
                sx={{ mr: 1 }}
              >
                Save Changes
              </Button>
              <Button 
                variant="outlined" 
                onClick={() => {
                  setIsEditing(false);
                  setDisplayName(user.displayName || '');
                }}
              >
                Cancel
              </Button>
            </Box>
          )}

          <Divider sx={{ my: 3 }} />

          {/* Theme Settings */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Theme Settings</Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.theme === 'dark'}
                  onChange={(e) => updatePreferences({ theme: e.target.checked ? 'dark' : 'light' })}
                  icon={<LightModeIcon />}
                  checkedIcon={<DarkModeIcon />}
                />
              }
              label={preferences.theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
            />
          </Box>

          {/* Daily Goals */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Daily Goals</Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Complete {preferences.dailyGoal} tasks per day
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={Math.min(dailyProgress, 100)} 
              sx={{ 
                height: 10, 
                borderRadius: 5,
                mb: 1
              }} 
            />
            <Typography variant="caption" color="text.secondary">
              {completedTasks} of {preferences.dailyGoal} tasks completed today
            </Typography>
          </Box>

          {/* Progress Overview */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Progress Overview</Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Paper sx={{ p: 2, flex: 1, textAlign: 'center' }}>
                <Typography variant="h4">{totalTasks}</Typography>
                <Typography variant="body2" color="text.secondary">Total Tasks</Typography>
              </Paper>
              <Paper sx={{ p: 2, flex: 1, textAlign: 'center' }}>
                <Typography variant="h4">{completedTasks}</Typography>
                <Typography variant="body2" color="text.secondary">Completed</Typography>
              </Paper>
              <Paper sx={{ p: 2, flex: 1, textAlign: 'center' }}>
                <Typography variant="h4">{Math.round(completionRate)}%</Typography>
                <Typography variant="body2" color="text.secondary">Completion Rate</Typography>
              </Paper>
            </Box>
          </Box>

          {/* Notifications Settings */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Notifications</Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.notifications.dailyReminders}
                  onChange={(e) => updatePreferences({
                    notifications: {
                      ...preferences.notifications,
                      dailyReminders: e.target.checked
                    }
                  })}
                />
              }
              label="Daily Reminders"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.notifications.emailReminders}
                  onChange={(e) => updatePreferences({
                    notifications: {
                      ...preferences.notifications,
                      emailReminders: e.target.checked
                    }
                  })}
                />
              }
              label="Email Reminders"
            />
          </Box>

          {/* Account Actions */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Account Actions</Typography>
            <Button
              variant="outlined"
              startIcon={<LockIcon />}
              onClick={() => setShowPasswordDialog(true)}
              fullWidth
              sx={{ mb: 1 }}
            >
              Change Password
            </Button>
            {preferences.lastPasswordUpdate && (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                Last updated: {new Date(preferences.lastPasswordUpdate).toLocaleDateString()}
              </Typography>
            )}
            <Button
              variant="outlined"
              startIcon={<GoogleIcon />}
              fullWidth
              sx={{ mb: 1 }}
            >
              Connected to Google
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setShowDeleteDialog(true)}
              fullWidth
            >
              Delete Account
            </Button>
          </Box>

          <Button
            variant="contained"
            onClick={handleSignOut}
            fullWidth
            sx={{ mt: 2 }}
          >
            Sign Out
          </Button>
        </Paper>
      </Box>

      {/* Password Change Dialog */}
      <Dialog open={showPasswordDialog} onClose={() => setShowPasswordDialog(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            type="password"
            label="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          />
          <TextField
            type="password"
            label="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPasswordDialog(false)}>Cancel</Button>
          <Button onClick={handlePasswordChange} variant="contained">
            Update Password
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
        <DialogTitle sx={{ color: 'error.main' }}>
          <WarningIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Delete Account
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete your account? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteAccount} color="error" variant="contained">
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Profile; 