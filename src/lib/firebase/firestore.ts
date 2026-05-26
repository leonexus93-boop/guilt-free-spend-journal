// Firestore service for spend journal entries
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  Timestamp,
  DocumentData,
  FirestoreError,
  Firestore
} from 'firebase/firestore';
import { getFirestore } from './config';
import { getCurrentUser } from './auth';

// Spend entry type
export interface SpendEntry {
  id?: string;
  userId: string;
  amount: number;
  category: string;
  description: string;
  moodScore: number; // 1-5
  worthIt: 'yes' | 'maybe' | 'no';
  createdAt: Timestamp | Date;
  updatedAt?: Timestamp | Date;
  synced?: boolean;
}

function getFirestoreInstance(): Firestore {
  const db = getFirestore();
  if (!db) {
    throw new Error('Firebase Firestore not initialized. Check your Firebase configuration.');
  }
  return db;
}

/**
 * Collection reference for spend entries
 */
function entriesCollection() {
  return collection(getFirestoreInstance(), 'spend_entries');
}

/**
 * Create a new spend entry
 */
export async function createEntry(entry: Omit<SpendEntry, 'id' | 'userId'>): Promise<string> {
  const user = getCurrentUser();
  if (!user) {
    throw new Error('User must be authenticated to create entries');
  }

  const docRef = await addDoc(entriesCollection(), {
    ...entry,
    userId: user.uid,
    createdAt: Timestamp.now(),
    synced: true,
  });

  return docRef.id;
}

/**
 * Update an existing spend entry
 */
export async function updateEntry(id: string, updates: Partial<SpendEntry>): Promise<void> {
  const entryRef = doc(getFirestoreInstance(), 'spend_entries', id);
  await updateDoc(entryRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  });
}

/**
 * Delete a spend entry
 */
export async function deleteEntry(id: string): Promise<void> {
  const entryRef = doc(getFirestoreInstance(), 'spend_entries', id);
  await deleteDoc(entryRef);
}

/**
 * Get all entries for current user (real-time listener)
 * Returns unsubscribe function
 */
export function subscribeToEntries(
  callback: (entries: SpendEntry[]) => void,
  onError?: (error: FirestoreError) => void
): () => void {
  const user = getCurrentUser();
  
  if (!user) {
    callback([]);
    return () => {};
  }

  const q = query(
    entriesCollection(),
    where('userId', '==', user.uid),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const entries = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as SpendEntry));
      callback(entries);
    },
    (error) => {
      if (onError) {
        onError(error);
      }
      console.error('Firestore subscription error:', error);
    }
  );
}

/**
 * Get entries by date range
 */
export function subscribeToEntriesByDateRange(
  startDate: Date,
  endDate: Date,
  callback: (entries: SpendEntry[]) => void
): () => void {
  const user = getCurrentUser();
  
  if (!user) {
    callback([]);
    return () => {};
  }

  const q = query(
    entriesCollection(),
    where('userId', '==', user.uid),
    where('createdAt', '>=', Timestamp.fromDate(startDate)),
    where('createdAt', '<=', Timestamp.fromDate(endDate)),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const entries = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as SpendEntry));
    callback(entries);
  });
}

/**
 * Get entries by category
 */
export function subscribeToEntriesByCategory(
  category: string,
  callback: (entries: SpendEntry[]) => void
): () => void {
  const user = getCurrentUser();
  
  if (!user) {
    callback([]);
    return () => {};
  }

  const q = query(
    entriesCollection(),
    where('userId', '==', user.uid),
    where('category', '==', category),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const entries = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as SpendEntry));
    callback(entries);
  });
}
