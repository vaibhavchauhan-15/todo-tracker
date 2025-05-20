import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc, 
  getDoc,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../firebase';

export interface DailyProgress {
  id: string;
  userId: string;
  date: string;
  totalTasks: number;
  completedTasks: number;
  dailyGoal: number;
  createdAt: string;
  updatedAt: string;
}

interface DailyProgressContextType {
  todayProgress: DailyProgress | null;
  loading: boolean;
  error: string | null;
  updateDailyProgress: (completedTasks: number, totalTasks: number) => Promise<void>;
}

const DailyProgressContext = createContext<DailyProgressContextType | undefined>(undefined);

export const DailyProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [todayProgress, setTodayProgress] = useState<DailyProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const auth = localStorage.getItem('user');
    if (!auth) {
      setLoading(false);
      return;
    }

    const user = JSON.parse(auth);
    const today = new Date().toISOString().split('T')[0];
    
    const q = query(
      collection(db, 'dailyProgress'),
      where('userId', '==', user.uid),
      where('date', '==', today)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const progressDoc = snapshot.docs[0];
          setTodayProgress({
            id: progressDoc.id,
            ...progressDoc.data()
          } as DailyProgress);
        } else {
          // Create initial progress for today if it doesn't exist
          createInitialProgress(user.uid, today);
        }
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const createInitialProgress = async (userId: string, date: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      const dailyGoal = userDoc.exists() ? userDoc.data().dailyGoal || 5 : 5;

      const newProgress: Omit<DailyProgress, 'id'> = {
        userId,
        date,
        totalTasks: 0,
        completedTasks: 0,
        dailyGoal,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, 'dailyProgress'), newProgress);
      setTodayProgress({
        id: docRef.id,
        ...newProgress
      });
    } catch (err: any) {
      setError(err.message);
    }
  };

  const updateDailyProgress = async (completedTasks: number, totalTasks: number) => {
    if (!todayProgress) return;

    try {
      const progressRef = doc(db, 'dailyProgress', todayProgress.id);
      await updateDoc(progressRef, {
        completedTasks,
        totalTasks,
        updatedAt: new Date().toISOString()
      });
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <DailyProgressContext.Provider value={{ todayProgress, loading, error, updateDailyProgress }}>
      {children}
    </DailyProgressContext.Provider>
  );
};

export const useDailyProgress = () => {
  const context = useContext(DailyProgressContext);
  if (context === undefined) {
    throw new Error('useDailyProgress must be used within a DailyProgressProvider');
  }
  return context;
}; 