// Firebase Auth service wrapper
import { 
  signInAnonymously, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  linkWithCredential,
  GoogleAuthProvider,
  OAuthProvider,
  User,
  UserCredential,
  Auth
} from 'firebase/auth';
import { getAuth } from './config';

// Auth state listener type
export type AuthStateListener = (user: User | null) => void;

function getAuthInstance(): Auth {
  const auth = getAuth();
  if (!auth) {
    throw new Error('Firebase Auth not initialized. Check your Firebase configuration.');
  }
  return auth;
}

/**
 * Sign in anonymously - default for frictionless onboarding
 */
export async function signInAnon(): Promise<UserCredential> {
  return await signInAnonymously(getAuthInstance());
}

/**
 * Sign in with Google - for account recovery and cloud sync
 */
export async function signInWithGoogle(): Promise<UserCredential> {
  const provider = new GoogleAuthProvider();
  return await signInWithPopup(getAuthInstance(), provider);
}

/**
 * Sign in with Apple - for account recovery and cloud sync
 */
export async function signInWithApple(): Promise<UserCredential> {
  const provider = new OAuthProvider('apple.com');
  return await signInWithPopup(getAuthInstance(), provider);
}

/**
 * Sign out
 */
export async function signOut(): Promise<void> {
  return await firebaseSignOut(getAuthInstance());
}

/**
 * Listen for auth state changes
 * Returns unsubscribe function
 */
export function onAuthStateChange(listener: AuthStateListener): () => void {
  return onAuthStateChanged(getAuthInstance(), listener);
}

/**
 * Link anonymous account with Google credential
 * This preserves existing data while enabling account recovery
 */
export async function linkWithGoogle(): Promise<UserCredential> {
  const auth = getAuthInstance();
  const provider = new GoogleAuthProvider();
  const credential = await signInWithPopup(auth, provider).then(result => {
    return GoogleAuthProvider.credentialFromResult(result);
  });
  
  if (!credential) {
    throw new Error('Failed to get Google credential');
  }
  
  return await linkWithCredential(auth.currentUser!, credential);
}

/**
 * Link anonymous account with Apple credential
 */
export async function linkWithApple(): Promise<UserCredential> {
  const auth = getAuthInstance();
  const provider = new OAuthProvider('apple.com');
  const credential = await signInWithPopup(auth, provider).then(result => {
    return OAuthProvider.credentialFromResult(result);
  });
  
  if (!credential) {
    throw new Error('Failed to get Apple credential');
  }
  
  return await linkWithCredential(auth.currentUser!, credential);
}

/**
 * Get current user synchronously
 */
export function getCurrentUser(): User | null {
  const auth = getAuth();
  return auth?.currentUser || null;
}
