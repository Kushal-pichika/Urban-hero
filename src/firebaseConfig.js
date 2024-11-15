// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA1E0-f5MHMcuAC2aYwtv6LHOteac8f8ws",
  authDomain: "urban-hero-a3435.firebaseapp.com",
  projectId: "urban-hero-a3435",
  storageBucket: "urban-hero-a3435.firebasestorage.app",
  messagingSenderId: "106534789099",
  appId: "1:106534789099:web:7e20902fc0429770ce43ae",
  measurementId: "G-5W4J2PVTHV"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
