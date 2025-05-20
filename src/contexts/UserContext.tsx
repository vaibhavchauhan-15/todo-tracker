import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface UserPreferences {
  theme: 'light' | 'dark';
  dailyGoal: number;
  notifications: {
    dailyReminders: boolean;
    emailReminders: boolean;
  };
  lastPasswordUpdate?: string;
  accountCreated: string;
}

interface UserContextType {
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => Promise<void>;
  updatePassword: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const defaultPreferences: UserPreferences = {
  theme: 'dark',
  dailyGoal: 5,
  notifications: {
    dailyReminders: true,
    emailReminders: false,
  },
  accountCreated: new Date().toISOString(),
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode; userId: string }> = ({ children, userId }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);

  useEffect(() => {
    const fetchUserPreferences = async () => {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        setPreferences(userDoc.data() as UserPreferences);
      } else {
        // Initialize user preferences if they don't exist
        await setDoc(doc(db, 'users', userId), defaultPreferences);
      }
    };

    fetchUserPreferences();
  }, [userId]);

  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, updates);
    setPreferences(prev => ({ ...prev, ...updates }));
  };

  const updatePassword = async () => {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      lastPasswordUpdate: new Date().toISOString(),
    });
    setPreferences(prev => ({
      ...prev,
      lastPasswordUpdate: new Date().toISOString(),
    }));
  };

  const deleteAccount = async () => {
    // Implement account deletion logic here
    // This should also delete all user data from Firestore
  };

  return (
    <UserContext.Provider value={{ preferences, updatePreferences, updatePassword, deleteAccount }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 