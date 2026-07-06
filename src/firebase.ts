import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import localConfig from '../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: (import.meta as any).env.VITE_FIREBASE_API_KEY || localConfig.apiKey || "AIzaSyCGq-VB-uwoww6jarP67Rt3hXcnhvHRAtI",
  authDomain: (import.meta as any).env.VITE_FIREBASE_AUTH_DOMAIN || localConfig.authDomain || "world-college-of-medical.firebaseapp.com",
  projectId: (import.meta as any).env.VITE_FIREBASE_PROJECT_ID || localConfig.projectId || "world-college-of-medical",
  storageBucket: (import.meta as any).env.VITE_FIREBASE_STORAGE_BUCKET || localConfig.storageBucket || "world-college-of-medical.firebasestorage.app",
  messagingSenderId: (import.meta as any).env.VITE_FIREBASE_MESSAGING_SENDER_ID || localConfig.messagingSenderId || "780627005834",
  appId: (import.meta as any).env.VITE_FIREBASE_APP_ID || localConfig.appId || "1:780627005834:web:082d3915cae2e4694c7873",
  firestoreDatabaseId: (import.meta as any).env.VITE_FIREBASE_DATABASE_ID || localConfig.firestoreDatabaseId || "ai-studio-worldcollegeofme-195a8968-9d0e-48b7-be77-a11764464c87"
};

// Lazy initialization or checking so it initializes only if API key is provided
const isConfigured = !!firebaseConfig.apiKey;

let app;
if (getApps().length > 0) {
  app = getApp();
} else if (isConfigured) {
  app = initializeApp(firebaseConfig);
} else {
  // Graceful fallback for development if keys aren't set yet
  app = initializeApp({
    apiKey: "placeholder-api-key",
    authDomain: "placeholder-auth-domain",
    projectId: "world-college-of-medical",
    storageBucket: "placeholder-storage-bucket",
    messagingSenderId: "placeholder-messaging-sender",
    appId: "placeholder-app-id"
  });
}

const dbId = (firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)') 
  ? firebaseConfig.firestoreDatabaseId 
  : undefined;
const db = getFirestore(app, dbId);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage, isConfigured };
