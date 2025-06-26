
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDocs, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface JournalEntry {
  id: string;
  userId: string;
  date: string;
  content: string;
  mood: string;
  createdAt: string;
  updatedAt: string;
}

export const createJournalEntry = async (userId: string, entryData: Omit<JournalEntry, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
  try {
    const now = new Date().toISOString();
    const docRef = await addDoc(collection(db, 'journalEntries'), {
      ...entryData,
      userId,
      createdAt: now,
      updatedAt: now,
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating journal entry:', error);
    throw error;
  }
};

export const updateJournalEntry = async (entryId: string, updates: Partial<JournalEntry>) => {
  try {
    const entryRef = doc(db, 'journalEntries', entryId);
    await updateDoc(entryRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating journal entry:', error);
    throw error;
  }
};

export const getUserJournalEntries = async (userId: string): Promise<JournalEntry[]> => {
  try {
    const q = query(
      collection(db, 'journalEntries'),
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as JournalEntry));
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    throw error;
  }
};

export const getJournalEntryByDate = async (userId: string, date: string): Promise<JournalEntry | null> => {
  try {
    const q = query(
      collection(db, 'journalEntries'),
      where('userId', '==', userId),
      where('date', '==', date)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return null;
    }
    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data()
    } as JournalEntry;
  } catch (error) {
    console.error('Error fetching journal entry by date:', error);
    throw error;
  }
};
