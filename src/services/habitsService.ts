
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Habit {
  id: string;
  userId: string;
  name: string;
  description?: string;
  category: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  targetCount: number;
  color: string;
  createdAt: string;
  isActive: boolean;
}

export interface HabitCompletion {
  id: string;
  habitId: string;
  userId: string;
  completedAt: string;
  count: number;
}

// Habits CRUD operations
export const createHabit = async (userId: string, habitData: Omit<Habit, 'id' | 'userId' | 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, 'habits'), {
      ...habitData,
      userId,
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating habit:', error);
    throw error;
  }
};

export const getUserHabits = async (userId: string): Promise<Habit[]> => {
  try {
    const q = query(
      collection(db, 'habits'),
      where('userId', '==', userId),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Habit));
  } catch (error) {
    console.error('Error fetching habits:', error);
    throw error;
  }
};

export const updateHabit = async (habitId: string, updates: Partial<Habit>) => {
  try {
    const habitRef = doc(db, 'habits', habitId);
    await updateDoc(habitRef, updates);
  } catch (error) {
    console.error('Error updating habit:', error);
    throw error;
  }
};

export const deleteHabit = async (habitId: string) => {
  try {
    await updateDoc(doc(db, 'habits', habitId), { isActive: false });
  } catch (error) {
    console.error('Error deleting habit:', error);
    throw error;
  }
};

// Habit completions
export const markHabitComplete = async (userId: string, habitId: string, count: number = 1) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const docRef = await addDoc(collection(db, 'habitCompletions'), {
      habitId,
      userId,
      completedAt: today,
      count,
      timestamp: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error marking habit complete:', error);
    throw error;
  }
};

export const getHabitCompletions = async (userId: string, habitId: string, date?: string): Promise<HabitCompletion[]> => {
  try {
    let q = query(
      collection(db, 'habitCompletions'),
      where('userId', '==', userId),
      where('habitId', '==', habitId)
    );

    if (date) {
      q = query(q, where('completedAt', '==', date));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as HabitCompletion));
  } catch (error) {
    console.error('Error fetching habit completions:', error);
    throw error;
  }
};

export const getTodayCompletions = async (userId: string): Promise<HabitCompletion[]> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const q = query(
      collection(db, 'habitCompletions'),
      where('userId', '==', userId),
      where('completedAt', '==', today)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as HabitCompletion));
  } catch (error) {
    console.error('Error fetching today\'s completions:', error);
    throw error;
  }
};
