import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCmjD4-MM3CqVIh0975UZitI_A9jJvl-Gk",
  authDomain: "todolist-tracker.firebaseapp.com",
  projectId: "todolist-tracker",
  storageBucket: "todolist-tracker.firebasestorage.app",
  messagingSenderId: "525165815950",
  appId: "1:525165815950:web:3cac6e2818e12ae09101df",
  measurementId: "G-S9BWYT74GP"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const provider = new GoogleAuthProvider(); 