import React, { useState, useEffect, useCallback } from 'react';
import { collection, addDoc, query, where, getDocs, updateDoc, doc, onSnapshot, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { 
  Container, 
  TextField, 
  Button, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { CheckCircle, RadioButtonUnchecked, Delete, Edit, Save } from '@mui/icons-material';
import { Task } from '../contexts/TaskContext';
import { useDailyProgress } from '../contexts/DailyProgressContext';

interface TodoProps {
  user: any;
}

const Todo: React.FC<TodoProps> = ({ user }) => {
  const [todos, setTodos] = useState<Task[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const { updateDailyProgress } = useDailyProgress();

  // Set up real-time listener for todos
  useEffect(() => {
    const q = query(collection(db, 'tasks'), where('userId', '==', user.uid));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const todoList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Task[];
      
      // Sort todos: incomplete first, then by creation date
      const sortedTodos = todoList.sort((a, b) => {
        if (a.status === b.status) {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // Newest first
        }
        return a.status === 'completed' ? 1 : -1; // Incomplete first
      });
      
      setTodos(sortedTodos);
      setLoading(false);

      // Update daily progress
      const today = new Date().toISOString().split('T')[0];
      const todayTasks = todoList.filter(task => task.dueDate === today);
      const completedTasks = todayTasks.filter(task => task.status === 'completed').length;
      updateDailyProgress(completedTasks, todayTasks.length);
    }, (error) => {
      console.error('Error fetching todos:', error);
      setError('Failed to fetch todos');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user.uid, updateDailyProgress]);

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim() || isAdding) return;

    // Check for duplicate todos
    const isDuplicate = todos.some(
      todo => todo.title.toLowerCase().trim() === newTodo.toLowerCase().trim()
    );

    if (isDuplicate) {
      setError('This task already exists');
      return;
    }

    const tempId = Date.now().toString();
    const today = new Date().toISOString().split('T')[0];
    const newTodoItem: Task = {
      id: tempId,
      title: newTodo,
      description: '',
      status: 'pending',
      priority: priority,
      dueDate: today,
      createdAt: new Date().toISOString(),
      userId: user.uid
    };

    // Optimistic update
    setTodos(prev => [...prev, newTodoItem]);
    setNewTodo('');
    setIsAdding(true);
    setError(null); // Clear any previous errors

    try {
      await addDoc(collection(db, 'tasks'), {
        title: newTodo,
        description: '',
        status: 'pending',
        priority: priority,
        dueDate: today,
        createdAt: new Date().toISOString(),
        userId: user.uid
      });
    } catch (error) {
      // Revert on error
      setTodos(prev => prev.filter(todo => todo.id !== tempId));
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while adding todo';
      setError(errorMessage);
    } finally {
      setIsAdding(false);
    }
  };

  const toggleTodo = async (todoId: string, status: 'pending' | 'completed') => {
    if (updatingId === todoId) return;

    const newStatus = status === 'completed' ? 'pending' : 'completed';

    // Optimistic update
    setTodos(prev => prev.map(todo => 
      todo.id === todoId ? { ...todo, status: newStatus } : todo
    ));
    setUpdatingId(todoId);

    try {
      const todoRef = doc(db, 'tasks', todoId);
      await updateDoc(todoRef, { status: newStatus });
    } catch (error) {
      // Revert on error
      setTodos(prev => prev.map(todo => 
        todo.id === todoId ? { ...todo, status } : todo
      ));
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while updating todo';
      setError(errorMessage);
    } finally {
      setUpdatingId(null);
    }
  };

  const startEditing = (todo: Task) => {
    setEditingId(todo.id);
    setEditText(todo.title);
    setPriority(todo.priority);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditText('');
    setPriority('medium');
  };

  const updateTodoText = async (todoId: string) => {
    if (!editText.trim() || updatingId === todoId) return;

    setUpdatingId(todoId);
    try {
      const todoRef = doc(db, 'tasks', todoId);
      await updateDoc(todoRef, { 
        title: editText.trim(),
        priority: priority
      });
      setEditingId(null);
      setEditText('');
      setPriority('medium');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while updating todo';
      setError(errorMessage);
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteTodo = async (todoId: string) => {
    if (updatingId === todoId) return;

    setUpdatingId(todoId);
    try {
      const todoRef = doc(db, 'tasks', todoId);
      await deleteDoc(todoRef);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while deleting todo';
      setError(errorMessage);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ p: 0 }}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          My Tasks
        </Typography>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <form onSubmit={addTodo}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Add a new task"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                disabled={isAdding}
              />
              <Button 
                variant="contained" 
                type="submit"
                disabled={isAdding || !newTodo.trim()}
              >
                {isAdding ? 'Adding...' : 'Add'}
              </Button>
            </Box>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={priority}
                label="Priority"
                onChange={(e) => setPriority(e.target.value as 'high' | 'medium' | 'low')}
              >
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="low">Low</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </form>
        <List>
          {todos.map((todo) => (
            <ListItem 
              key={todo.id}
              sx={{
                mb: 1,
                borderRadius: 1,
                opacity: updatingId === todo.id ? 0.7 : 1,
                transition: 'opacity 0.2s ease-in-out',
              }}
            >
              {editingId === todo.id ? (
                <Box sx={{ display: 'flex', width: '100%', gap: 1 }}>
                  <TextField
                    fullWidth
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    disabled={updatingId === todo.id}
                  />
                  <FormControl sx={{ minWidth: 120 }}>
                    <Select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as 'high' | 'medium' | 'low')}
                      size="small"
                    >
                      <MenuItem value="high">High</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="low">Low</MenuItem>
                    </Select>
                  </FormControl>
                  <IconButton
                    onClick={() => updateTodoText(todo.id)}
                    disabled={updatingId === todo.id || !editText.trim()}
                    color="primary"
                  >
                    <Save />
                  </IconButton>
                  <IconButton
                    onClick={cancelEditing}
                    disabled={updatingId === todo.id}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </Box>
              ) : (
                <>
                  <ListItemText
                    primary={todo.title}
                    secondary={`Priority: ${todo.priority}`}
                    sx={{
                      '& .MuiListItemText-primary': {
                        textDecoration: todo.status === 'completed' ? 'line-through' : 'none',
                        color: todo.status === 'completed' ? 'text.secondary' : 'text.primary',
                      },
                    }}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => toggleTodo(todo.id, todo.status)}
                      color={todo.status === 'completed' ? 'success' : 'default'}
                      disabled={updatingId === todo.id}
                      sx={{ mr: 1 }}
                    >
                      {todo.status === 'completed' ? <CheckCircle /> : <RadioButtonUnchecked />}
                    </IconButton>
                    <IconButton
                      edge="end"
                      onClick={() => startEditing(todo)}
                      disabled={updatingId === todo.id}
                      sx={{ mr: 1 }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      edge="end"
                      onClick={() => deleteTodo(todo.id)}
                      disabled={updatingId === todo.id}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </>
              )}
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
};

export default Todo; 