import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useTasks } from '../contexts/TaskContext';

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  task?: {
    id: string;
    title: string;
    status: 'completed' | 'pending';
    priority: 'high' | 'medium' | 'low';
    dueDate: string;
  };
}

const TaskForm: React.FC<TaskFormProps> = ({ open, onClose, task }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { addTask, updateTask } = useTasks();
  const [formData, setFormData] = useState({
    title: task?.title || '',
    status: task?.status || 'pending',
    priority: task?.priority || 'medium',
    dueDate: task?.dueDate || new Date().toISOString().split('T')[0]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const auth = localStorage.getItem('user');
    if (!auth) return;

    const user = JSON.parse(auth);
    const taskData = {
      ...formData,
      userId: user.uid
    };

    if (task) {
      await updateTask(task.id, taskData);
    } else {
      await addTask(taskData);
    }
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          bgcolor: 'rgba(26, 26, 26, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 2
        }
      }}
    >
      <DialogTitle sx={{ color: 'white' }}>
        {task ? 'Edit Task' : 'Add New Task'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Task Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                  '&:hover fieldset': { borderColor: '#00bcd4' },
                  '&.Mui-focused fieldset': { borderColor: '#00bcd4' }
                },
                '& .MuiInputLabel-root': { color: '#9e9e9e' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#00bcd4' }
              }}
            />

            <FormControl fullWidth>
              <InputLabel sx={{ color: '#9e9e9e' }}>Priority</InputLabel>
              <Select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'high' | 'medium' | 'low' })}
                label="Priority"
                sx={{
                  color: 'white',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#00bcd4' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#00bcd4' },
                  '& .MuiSvgIcon-root': { color: '#9e9e9e' }
                }}
              >
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="low">Low</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Due Date"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                  '&:hover fieldset': { borderColor: '#00bcd4' },
                  '&.Mui-focused fieldset': { borderColor: '#00bcd4' }
                },
                '& .MuiInputLabel-root': { color: '#9e9e9e' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#00bcd4' }
              }}
            />

            <FormControl fullWidth>
              <InputLabel sx={{ color: '#9e9e9e' }}>Status</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'completed' | 'pending' })}
                label="Status"
                sx={{
                  color: 'white',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#00bcd4' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#00bcd4' },
                  '& .MuiSvgIcon-root': { color: '#9e9e9e' }
                }}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button 
            onClick={onClose}
            sx={{ 
              color: '#9e9e9e',
              '&:hover': { color: 'white' }
            }}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained"
            sx={{ 
              bgcolor: '#00bcd4',
              '&:hover': { bgcolor: '#0097a7' }
            }}
          >
            {task ? 'Update' : 'Add'} Task
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TaskForm; 