import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Avatar,
  Button,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  AppBar,
  Toolbar,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { updateProfile, updatePassword, deleteUser } from 'firebase/auth';
import { auth, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface ProfileProps {
  user: {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
  };
  onBack: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onBack }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [displayName, setDisplayName] = useState(user.displayName || '');
  const [email] = useState(user.email || '');
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: displayName,
        });
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !auth.currentUser) return;

    try {
      setIsUploading(true);
      const storageRef = ref(storage, `profile_photos/${auth.currentUser.uid}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      await updateProfile(auth.currentUser, {
        photoURL: downloadURL,
      });
    } catch (error) {
      console.error('Error uploading photo:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      if (auth.currentUser) {
        await updatePassword(auth.currentUser, newPassword);
        setShowPasswordDialog(false);
        setNewPassword('');
        setConfirmPassword('');
        setError('');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setError('Failed to change password');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      if (auth.currentUser) {
        await deleteUser(auth.currentUser);
      }
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)' }}>
      <AppBar position="static" sx={{ background: 'transparent', boxShadow: 'none' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={onBack} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">Profile</Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          {/* Profile Picture */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
            <Avatar
              src={user.photoURL || undefined}
              alt={user.displayName || 'User'}
              sx={{ width: 120, height: 120, mb: 2 }}
            />
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="photo-upload"
              type="file"
              onChange={handlePhotoUpload}
              disabled={isUploading}
            />
            <label htmlFor="photo-upload">
              <Button
                variant="outlined"
                component="span"
                disabled={isUploading}
                sx={{ mt: 1 }}
              >
                {isUploading ? 'Uploading...' : 'Change Photo'}
              </Button>
            </label>
          </Box>

          {/* User Information */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              User Information
            </Typography>
            {isEditing ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Email"
                  value={email}
                  disabled
                  fullWidth
                />
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={() => setIsEditing(false)}
                    startIcon={<CancelIcon />}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleUpdateProfile}
                    startIcon={<SaveIcon />}
                  >
                    Save
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box>
                <Typography variant="body1" gutterBottom>
                  Name: {user.displayName || 'Not set'}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Email: {user.email}
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => setIsEditing(true)}
                  startIcon={<EditIcon />}
                  sx={{ mt: 2 }}
                >
                  Edit Profile
                </Button>
              </Box>
            )}
          </Box>

          {/* Account Actions */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setShowPasswordDialog(true)}
            >
              Change Password
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => setShowDeleteDialog(true)}
            >
              Delete Account
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSignOut}
              sx={{ mt: 2 }}
            >
              Sign Out
            </Button>
          </Box>
        </Paper>
      </Container>

      {/* Change Password Dialog */}
      <Dialog open={showPasswordDialog} onClose={() => setShowPasswordDialog(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="New Password"
            type="password"
            fullWidth
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Confirm Password"
            type="password"
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={!!error}
            helperText={error}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPasswordDialog(false)}>Cancel</Button>
          <Button onClick={handleChangePassword} variant="contained">
            Change Password
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
        <DialogTitle>Delete Account</DialogTitle>
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