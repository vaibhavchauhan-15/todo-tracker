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
  CircularProgress
} from '@mui/material';
import { CheckCircle, RadioButtonUnchecked, Delete, Edit, Save } from '@mui/icons-material';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  userId: string;
  createdAt?: Timestamp;
}

interface TodoProps {
  user: any;
}

const Todo: React.FC<TodoProps> = ({ user }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  // Set up real-time listener for todos
  useEffect(() => {
    const q = query(collection(db, 'todos'), where('userId', '==', user.uid));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const todoList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Todo[];
      
      // Sort todos: incomplete first, then by creation date
      const sortedTodos = todoList.sort((a, b) => {
        if (a.completed === b.completed) {
          // If completion status is the same, sort by creation date
          const dateA = a.createdAt?.toDate?.() || new Date(0);
          const dateB = b.createdAt?.toDate?.() || new Date(0);
          return dateB.getTime() - dateA.getTime(); // Newest first
        }
        return a.completed ? 1 : -1; // Incomplete first
      });
      
      setTodos(sortedTodos);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching todos:', error);
      setError('Failed to fetch todos');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user.uid]);

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim() || isAdding) return;

    // Check for duplicate todos
    const isDuplicate = todos.some(
      todo => todo.text.toLowerCase().trim() === newTodo.toLowerCase().trim()
    );

    if (isDuplicate) {
      setError('This task already exists');
      return;
    }

    const tempId = Date.now().toString();
    const newTodoItem = {
      id: tempId,
      text: newTodo,
      completed: false,
      userId: user.uid,
      createdAt: Timestamp.fromDate(new Date())
    };

    // Optimistic update
    setTodos(prev => [...prev, newTodoItem]);
    setNewTodo('');
    setIsAdding(true);
    setError(null); // Clear any previous errors

    try {
      await addDoc(collection(db, 'todos'), {
        text: newTodo,
        completed: false,
        userId: user.uid,
        createdAt: Timestamp.fromDate(new Date())
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

  const toggleTodo = async (todoId: string, completed: boolean) => {
    if (updatingId === todoId) return;

    // Optimistic update
    setTodos(prev => prev.map(todo => 
      todo.id === todoId ? { ...todo, completed: !completed } : todo
    ));
    setUpdatingId(todoId);

    try {
      const todoRef = doc(db, 'todos', todoId);
      await updateDoc(todoRef, { completed: !completed });
    } catch (error) {
      // Revert on error
      setTodos(prev => prev.map(todo => 
        todo.id === todoId ? { ...todo, completed } : todo
      ));
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while updating todo';
      setError(errorMessage);
    } finally {
      setUpdatingId(null);
    }
  };

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditText('');
  };

  const updateTodoText = async (todoId: string) => {
    if (!editText.trim() || updatingId === todoId) return;

    setUpdatingId(todoId);
    try {
      const todoRef = doc(db, 'todos', todoId);
      await updateDoc(todoRef, { text: editText.trim() });
      setEditingId(null);
      setEditText('');
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
      const todoRef = doc(db, 'todos', todoId);
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
          <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
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
                    primary={todo.text}
                    sx={{
                      '& .MuiListItemText-primary': {
                        textDecoration: todo.completed ? 'line-through' : 'none',
                        color: todo.completed ? 'text.secondary' : 'text.primary',
                      },
                    }}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => toggleTodo(todo.id, todo.completed)}
                      color={todo.completed ? 'success' : 'default'}
                      disabled={updatingId === todo.id}
                      sx={{ mr: 1 }}
                    >
                      {todo.completed ? <CheckCircle /> : <RadioButtonUnchecked />}
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