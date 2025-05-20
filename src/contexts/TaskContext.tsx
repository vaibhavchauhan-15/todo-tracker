import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc 
} from 'firebase/firestore';
import { db } from '../firebase';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'completed';
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  createdAt: string;
  userId: string;
}

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  addTask: (task: Omit<Task, 'id'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const auth = localStorage.getItem('user');
    if (!auth) {
      setLoading(false);
      return;
    }

    const user = JSON.parse(auth);
    const tasksQuery = query(
      collection(db, 'tasks'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(
      tasksQuery,
      (snapshot) => {
        const tasksData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Task[];
        setTasks(tasksData);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addTask = async (task: Omit<Task, 'id'>) => {
    try {
      await addDoc(collection(db, 'tasks'), task);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const taskRef = doc(db, 'tasks', id);
      await updateDoc(taskRef, updates);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const taskRef = doc(db, 'tasks', id);
      await deleteDoc(taskRef);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <TaskContext.Provider value={{ tasks, loading, error, addTask, updateTask, deleteTask }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}; 