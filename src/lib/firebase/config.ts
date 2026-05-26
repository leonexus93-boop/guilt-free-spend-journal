// Firebase configuration
// Note: These are placeholder values - replace with your actual Firebase project config
// Get these from Firebase Console > Project Settings > General > Your apps > SDK setup and configuration

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import type { Analytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase only on client side
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let analytics: Analytics | null = null;

if (typeof window !== 'undefined') {
  // Only initialize if API key is present
  if (firebaseConfig.apiKey) {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    
    // Dynamic imports to avoid server-side bundling issues
    import('firebase/auth').then(({ getAuth }) => {
      auth = getAuth(app!);
    });
    
    import('firebase/firestore').then(({ getFirestore }) => {
      db = getFirestore(app!);
    });
    
    import('firebase/analytics').then(({ getAnalytics }) => {
      analytics = getAnalytics(app!);
    });
  } else {
    console.warn('Firebase not configured: NEXT_PUBLIC_FIREBASE_API_KEY is missing');
  }
}

// Lazy getters for services
export function getAuth() {
  if (typeof window === 'undefined') return null;
  if (!auth) {
    const { getAuth } = require('firebase/auth');
    auth = getAuth(app);
  }
  return auth;
}

export function getFirestore() {
  if (typeof window === 'undefined') return null;
  if (!db) {
    const { getFirestore } = require('firebase/firestore');
    db = getFirestore(app);
  }
  return db;
}

export function getAnalytics() {
  if (typeof window === 'undefined') return null;
  if (!analytics) {
    const { getAnalytics } = require('firebase/analytics');
    analytics = getAnalytics(app);
  }
  return analytics;
}

export { app };
