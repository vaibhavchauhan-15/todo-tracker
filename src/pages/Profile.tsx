import React, { useState } from 'react';
import {
  Box, Typography, Paper, Avatar, Button, TextField,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  AppBar, Toolbar, Stack, Divider, Chip,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon, Edit as EditIcon, Save as SaveIcon,
  Cancel as CancelIcon,
  Lock as LockIcon, DeleteForever as DeleteIcon, Logout as LogoutIcon,
} from '@mui/icons-material';
import { supabase } from '../lib/supabaseClient';

interface ProfileProps {
  user: { uid: string; email: string | null; displayName: string | null; photoURL: string | null };
  onBack: () => void;
}

const dialogPaperSx = {
  sx: {
    background: '#151520',
    border: '1px solid rgba(255,255,255,0.18)',
    borderRadius: 3,
    boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
  }
};

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    color: '#f0f0f0',
    background: 'rgba(255,255,255,0.08)',
    '& fieldset': { borderColor: 'rgba(255,255,255,0.22)' },
    '&:hover fieldset': { borderColor: 'rgba(99,102,241,0.65)' },
    '&.Mui-focused fieldset': { borderColor: '#6366F1' },
  },
  '& .MuiInputLabel-root': { color: '#b4bac6' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#6366F1' },
};

const Profile: React.FC<ProfileProps> = ({ user, onBack }) => {
  const [isEditing, setIsEditing]           = useState(false);
  const [displayName, setDisplayName]       = useState(user.displayName || '');
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog]     = useState(false);
  const [newPassword, setNewPassword]       = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError]                   = useState('');
  const [success, setSuccess]               = useState('');

  const handleUpdateProfile = async () => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: displayName, name: displayName },
      });
      if (error) throw error;
      setIsEditing(false);
      setSuccess('Profile updated!');
      setTimeout(() => setSuccess(''), 3000);
    } catch { setError('Failed to update profile'); }
  };


  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) { setError('Passwords do not match'); return; }
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setShowPasswordDialog(false);
      setNewPassword('');
      setConfirmPassword('');
      setError('');
    } catch { setError('Failed to change password'); }
  };

  const handleDeleteAccount = async () => {
    try {
      await supabase.rpc('delete_user');
      await supabase.auth.signOut();
    } catch { setError('Failed to delete account'); }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(160deg, #0d0d14 0%, #0f1520 100%)', display: 'flex', flexDirection: 'column' }}>
      {/* ── Navbar ── */}
      <AppBar position="static" elevation={0} sx={{ background: 'rgba(13,13,20,0.90)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
        <Toolbar>
          <IconButton edge="start" onClick={onBack} sx={{ mr: 2, color: '#b4bac6', '&:hover': { color: '#6366F1' } }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#f0f0f0' }}>Profile</Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ py: 5, px: 2, maxWidth: 540, mx: 'auto', width: '100%', animation: 'fadeInUp 0.45s ease both' }}>
        {/* ── Avatar Card ── */}
        <Paper elevation={0} sx={{ p: 4, borderRadius: 3, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.14)', mb: 3 }}>
          <Stack alignItems="center" spacing={2}>
            <Box sx={{ position: 'relative' }}>
              <Avatar
                src={user.photoURL || undefined}
                alt={user.displayName || 'User'}
                sx={{ width: 100, height: 100, border: '3px solid rgba(99,102,241,0.55)', boxShadow: '0 0 24px rgba(99,102,241,0.30)' }}
              />
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: '#f0f0f0', fontWeight: 700 }}>{user.displayName || 'User'}</Typography>
              <Typography variant="body2" sx={{ color: '#b4bac6' }}>{user.email}</Typography>
            </Box>
            <Chip label="Active Account" size="small" sx={{ background: 'rgba(76,175,80,0.16)', color: '#4caf50', border: '1px solid rgba(76,175,80,0.40)', fontWeight: 600 }} />
          </Stack>
        </Paper>

        {/* ── Info Card ── */}
        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.14)', mb: 3 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2.5 }}>
            <Typography variant="subtitle1" sx={{ color: '#f0f0f0', fontWeight: 600 }}>User Information</Typography>
            {!isEditing && (
              <IconButton size="small" onClick={() => setIsEditing(true)} sx={{ color: '#b4bac6', '&:hover': { color: '#6366F1' } }}>
                <EditIcon fontSize="small" />
              </IconButton>
            )}
          </Stack>

          {success && <Box sx={{ mb: 2, p: 1.25, borderRadius: 1.5, background: 'rgba(76,175,80,0.14)', border: '1px solid rgba(76,175,80,0.38)' }}><Typography sx={{ color: '#4caf50', fontSize: 13 }}>{success}</Typography></Box>}

          {isEditing ? (
            <Stack spacing={2}>
              <TextField label="Display Name" value={displayName} onChange={e => setDisplayName(e.target.value)} fullWidth size="small" sx={fieldSx} />
              <TextField label="Email" value={user.email || ''} disabled fullWidth size="small" sx={fieldSx} />
              <Stack direction="row" spacing={1} justifyContent="flex-end">
                <Button variant="outlined" onClick={() => setIsEditing(false)} startIcon={<CancelIcon />} sx={{ borderRadius: 2, borderColor: 'rgba(255,255,255,0.25)', color: '#b4bac6' }}>Cancel</Button>
                <Button variant="contained" onClick={handleUpdateProfile} startIcon={<SaveIcon />} sx={{ borderRadius: 2 }}>Save</Button>
              </Stack>
            </Stack>
          ) : (
            <Stack spacing={2}>
              {[{ label: 'Name', value: user.displayName || 'Not set' }, { label: 'Email', value: user.email || '' }].map(f => (
                <Box key={f.label} sx={{ p: 1.5, borderRadius: 2, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.14)' }}>
                  <Typography variant="caption" sx={{ color: '#b4bac6', display: 'block', mb: 0.25 }}>{f.label}</Typography>
                  <Typography variant="body2" sx={{ color: '#f0f0f0', fontWeight: 500 }}>{f.value}</Typography>
                </Box>
              ))}
            </Stack>
          )}
        </Paper>

        {/* ── Actions Card ── */}
        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.14)' }}>
          <Typography variant="subtitle1" sx={{ color: '#f0f0f0', fontWeight: 600, mb: 2.5 }}>Account Actions</Typography>
          <Stack spacing={1.5}>
            <Button variant="outlined" startIcon={<LockIcon />} onClick={() => setShowPasswordDialog(true)}
              sx={{ justifyContent: 'flex-start', borderRadius: 2, borderColor: 'rgba(255,255,255,0.22)', color: '#d0d4de', '&:hover': { borderColor: '#6366F1', color: '#6366F1', background: 'rgba(99,102,241,0.10)' } }}>
              Change Password
            </Button>
            <Button variant="outlined" startIcon={<LogoutIcon />} onClick={() => supabase.auth.signOut()}
              sx={{ justifyContent: 'flex-start', borderRadius: 2, borderColor: 'rgba(255,255,255,0.22)', color: '#d0d4de', '&:hover': { borderColor: '#ff9800', color: '#ff9800', background: 'rgba(255,152,0,0.10)' } }}>
              Sign Out
            </Button>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)' }} />
            <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => setShowDeleteDialog(true)}
              sx={{ justifyContent: 'flex-start', borderRadius: 2, borderColor: 'rgba(244,67,54,0.40)', color: '#f44336', '&:hover': { background: 'rgba(244,67,54,0.12)' } }}>
              Delete Account
            </Button>
          </Stack>
        </Paper>
      </Box>

      {/* ── Change Password Dialog ── */}
      <Dialog open={showPasswordDialog} onClose={() => setShowPasswordDialog(false)} PaperProps={dialogPaperSx}>
        <DialogTitle sx={{ color: '#f0f0f0', fontWeight: 700, pb: 1 }}>Change Password</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1, minWidth: 320 }}>
            <TextField autoFocus label="New Password" type="password" fullWidth size="small" value={newPassword} onChange={e => setNewPassword(e.target.value)} sx={fieldSx} />
            <TextField label="Confirm Password" type="password" fullWidth size="small" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} error={!!error} helperText={error} sx={fieldSx} />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setShowPasswordDialog(false)} sx={{ color: '#b4bac6' }}>Cancel</Button>
          <Button onClick={handleChangePassword} variant="contained" sx={{ borderRadius: 2 }}>Update</Button>
        </DialogActions>
      </Dialog>

      {/* ── Delete Account Dialog ── */}
      <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} PaperProps={dialogPaperSx}>
        <DialogTitle sx={{ color: '#f44336', fontWeight: 700 }}>Delete Account</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#d0d4de', fontSize: 14, lineHeight: 1.6 }}>
            Are you sure you want to permanently delete your account? All your tasks and data will be lost. <strong>This cannot be undone.</strong>
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setShowDeleteDialog(false)} sx={{ color: '#9e9e9e' }}>Cancel</Button>
          <Button onClick={handleDeleteAccount} color="error" variant="contained" sx={{ borderRadius: 2 }}>Delete Forever</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Profile;
