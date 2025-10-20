import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration (PASTE YOUR CONFIG HERE)
const firebaseConfig = {
  apiKey: "AIzaSyBFP8Q2HqjS9kETi_bln1TjGmgeAnyVJQc",
  authDomain: "digital-menu-system-828be.firebaseapp.com",
  projectId: "digital-menu-system-828be",
  storageBucket: "digital-menu-system-828be.firebasestorage.app",
  messagingSenderId: "965904759279",
  appId: "1:965904759279:web:426327ea153eb14ea49e1a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);