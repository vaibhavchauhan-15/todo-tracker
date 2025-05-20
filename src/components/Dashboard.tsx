import React from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  LinearProgress,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  IconButton,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip
} from '@mui/material';
import {
  Assignment as TaskIcon,
  CheckCircle as CompletedIcon,
  Schedule as PendingIcon,
  TrendingUp as ProgressIcon,
  CalendarToday as CalendarIcon,
  Star as StarIcon,
  MoreVert as MoreIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { useTasks } from '../contexts/TaskContext';
import { useUser } from '../contexts/UserContext';

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { tasks, loading, error } = useTasks();
  const { preferences } = useUser();

  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const pendingTasks = tasks.filter(task => task.status === 'pending').length;
  const todayTasks = tasks.filter(task => {
    const today = new Date().toISOString().split('T')[0];
    return task.dueDate === today;
  });
  const todayCompleted = todayTasks.filter(task => task.status === 'completed').length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const dailyProgress = (completedTasks / preferences.dailyGoal) * 100;

  // Calculate progress percentages
  const overallProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const todayProgress = todayTasks.length > 0 ? (todayCompleted / todayTasks.length) * 100 : 0;

  // Get priority counts
  const priorityCounts = {
    high: tasks.filter(task => task.priority === 'high').length,
    medium: tasks.filter(task => task.priority === 'medium').length,
    low: tasks.filter(task => task.priority === 'low').length,
  };

  // Get recent tasks (last 5)
  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography variant="h6" color="white">Loading...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography variant="h6" color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `
          linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%),
          repeating-linear-gradient(45deg, #2d2d2d 0px, #2d2d2d 2px, transparent 2px, transparent 4px),
          repeating-linear-gradient(-45deg, #2d2d2d 0px, #2d2d2d 2px, transparent 2px, transparent 4px)
        `,
        backgroundBlendMode: 'overlay',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(0, 188, 212, 0.1) 0%, transparent 50%)',
          pointerEvents: 'none'
        }
      }}
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header Section */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" sx={{ 
              color: 'white',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #fff 0%, #e0e0e0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Welcome back, {user?.displayName || 'User'}
            </Typography>
            <Typography variant="body1" sx={{ color: '#9e9e9e', mt: 1 }}>
              Here's your progress overview
            </Typography>
          </Box>
          <IconButton sx={{ color: 'white' }}>
            <MoreIcon />
          </IconButton>
        </Box>

        {/* Progress Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Today's Progress */}
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              bgcolor: 'rgba(26, 26, 26, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 2
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CalendarIcon sx={{ color: '#00bcd4', mr: 1 }} />
                  <Typography variant="h6" sx={{ color: 'white' }}>Today's Progress</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h3" sx={{ color: 'white', mb: 1 }}>
                    {todayCompleted}/{todayTasks.length}
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={todayProgress} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: '#00bcd4'
                      }
                    }} 
                  />
                </Box>
                <Typography variant="body2" sx={{ color: '#9e9e9e' }}>
                  {todayTasks.length} tasks due today
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Overall Progress */}
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              bgcolor: 'rgba(26, 26, 26, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 2
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ProgressIcon sx={{ color: '#00bcd4', mr: 1 }} />
                  <Typography variant="h6" sx={{ color: 'white' }}>Overall Progress</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h3" sx={{ color: 'white', mb: 1 }}>
                    {completedTasks}/{totalTasks}
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={overallProgress} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: '#00bcd4'
                      }
                    }} 
                  />
                </Box>
                <Typography variant="body2" sx={{ color: '#9e9e9e' }}>
                  {pendingTasks} tasks remaining
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Task Statistics */}
        <Grid container spacing={3}>
          {/* Priority Distribution */}
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              bgcolor: 'rgba(26, 26, 26, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 2,
              height: '100%'
            }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>Priority Distribution</Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <StarIcon sx={{ color: '#f44336' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="High Priority" 
                      secondary={`${priorityCounts.high} tasks`}
                      sx={{ 
                        '& .MuiListItemText-primary': { color: 'white' },
                        '& .MuiListItemText-secondary': { color: '#9e9e9e' }
                      }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <StarIcon sx={{ color: '#ff9800' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Medium Priority" 
                      secondary={`${priorityCounts.medium} tasks`}
                      sx={{ 
                        '& .MuiListItemText-primary': { color: 'white' },
                        '& .MuiListItemText-secondary': { color: '#9e9e9e' }
                      }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <StarIcon sx={{ color: '#4caf50' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Low Priority" 
                      secondary={`${priorityCounts.low} tasks`}
                      sx={{ 
                        '& .MuiListItemText-primary': { color: 'white' },
                        '& .MuiListItemText-secondary': { color: '#9e9e9e' }
                      }}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Tasks */}
          <Grid item xs={12} md={8}>
            <Card sx={{ 
              bgcolor: 'rgba(26, 26, 26, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 2,
              height: '100%'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ color: 'white' }}>Recent Tasks</Typography>
                  <IconButton sx={{ color: '#00bcd4' }}>
                    <AddIcon />
                  </IconButton>
                </Box>
                <List>
                  {recentTasks.map((task) => (
                    <React.Fragment key={task.id}>
                      <ListItem>
                        <ListItemIcon>
                          {task.status === 'completed' ? (
                            <CompletedIcon sx={{ color: '#4caf50' }} />
                          ) : (
                            <PendingIcon sx={{ color: '#ff9800' }} />
                          )}
                        </ListItemIcon>
                        <ListItemText 
                          primary={task.title}
                          secondary={task.dueDate}
                          sx={{ 
                            '& .MuiListItemText-primary': { color: 'white' },
                            '& .MuiListItemText-secondary': { color: '#9e9e9e' }
                          }}
                        />
                        <Chip 
                          label={task.priority}
                          size="small"
                          sx={{ 
                            bgcolor: task.priority === 'high' ? 'rgba(244, 67, 54, 0.1)' :
                                   task.priority === 'medium' ? 'rgba(255, 152, 0, 0.1)' :
                                   'rgba(76, 175, 80, 0.1)',
                            color: task.priority === 'high' ? '#f44336' :
                                   task.priority === 'medium' ? '#ff9800' :
                                   '#4caf50',
                            border: '1px solid',
                            borderColor: task.priority === 'high' ? 'rgba(244, 67, 54, 0.3)' :
                                        task.priority === 'medium' ? 'rgba(255, 152, 0, 0.3)' :
                                        'rgba(76, 175, 80, 0.3)'
                          }}
                        />
                      </ListItem>
                      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Daily Progress */}
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 3,
              background: 'rgba(26, 26, 26, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Daily Progress
            </Typography>
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {completedTasks} of {preferences.dailyGoal} tasks completed
              </Typography>
              <LinearProgress
                variant="determinate"
                value={Math.min(dailyProgress, 100)}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  mt: 1,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 5,
                  },
                }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Completion Rate */}
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 3,
              background: 'rgba(26, 26, 26, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Overall Progress
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={completionRate}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 5,
                    },
                  }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                {Math.round(completionRate)}%
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard; 