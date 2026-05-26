'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { onAuthStateChange, signInAnon } from '@/lib/firebase/auth';
import { initializeErrorTracking } from '@/lib/firebase/crashlytics';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAnonymous: boolean;
  signInAnonymously: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize error tracking
    initializeErrorTracking();

    // Auto sign-in anonymously on mount
    const initializeAuth = async () => {
      try {
        await signInAnon();
      } catch (error) {
        console.error('Failed to sign in anonymously:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInAnonymously = async () => {
    try {
      await signInAnon();
    } catch (error) {
      console.error('Failed to sign in anonymously:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    isAnonymous: user?.isAnonymous ?? false,
    signInAnonymously,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
