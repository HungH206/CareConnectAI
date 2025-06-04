// src/lib/firebaseConfig.ts

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

// Firebase credentials (safely pulled from environment variables or fallback to default)
const firebaseCredentials = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDTh5Qh_hnM5iYAXdEbWH5x_IQ-2ygrRgo",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "careconnect-fbe1b.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "careconnect-fbe1b",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "careconnect-fbe1b.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "666977299527",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:666977299527:web:cc3a409eb846608b4d9562",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-6ZBMZFH5ME"
};

let app: FirebaseApp;
let db: Firestore | null = null;
let auth: Auth | null = null;
let firebaseConfigAvailable = false;

// Check for required credentials before initializing Firebase
if (firebaseCredentials.apiKey && firebaseCredentials.projectId) {
  if (!getApps().length) {
    app = initializeApp(firebaseCredentials);
  } else {
    app = getApp();
  }

  db = getFirestore(app);
  auth = getAuth(app);
  firebaseConfigAvailable = true;

  console.log("✅ Firebase initialized with project ID:", firebaseCredentials.projectId);
} else {
  console.warn(
    "⚠️ Firebase configuration is missing or incomplete in firebaseConfig.ts. " +
    "Please provide valid credentials via environment variables or directly in this file."
  );
}

export { app, db, auth, firebaseConfigAvailable, firebaseCredentials };
