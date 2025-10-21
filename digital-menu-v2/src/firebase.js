import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase configuration - works in both dev and production
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBFP8Q2HqjS9kETi_bln1TjGmgeAnyVJQc",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "digital-menu-system-828be.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "digital-menu-system-828be",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "digital-menu-system-828be.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "965904759279",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:965904759279:web:426327ea153eb14ea49e1a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);