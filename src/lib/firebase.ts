import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, enableNetwork, disableNetwork } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Performance Monitor utility (inline implementation to avoid external dependency)
const PerformanceMonitor = {
  timers: new Map(),
  start: function(label) {
    this.timers.set(label, performance.now());
  },
  end: function(label) {
    const startTime = this.timers.get(label);
    if (startTime) {
      const duration = performance.now() - startTime;
      console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
      this.timers.delete(label);
    }
  }
};

const firebaseConfig = {
  apiKey: "AIzaSyBeKf76tWLRKJ0cF8bqqZV_2IlpkRLI1-Q",
  authDomain: "habit-tracker-0567.firebaseapp.com",
  projectId: "habit-tracker-0567",
  storageBucket: "habit-tracker-0567.firebasestorage.app",
  messagingSenderId: "278103082783",
  appId: "1:278103082783:web:8ddd49944b5b5c5c5388122a",
  measurementId: "G-DTME8RMQCE"
};

console.log('🔥 Initializing Firebase...');
PerformanceMonitor.start('firebase-init');

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Firebase Storage
export const storage = getStorage(app);

PerformanceMonitor.end('firebase-init');

// Monitor connection status
let isOnline = navigator.onLine;

const handleOnline = async () => {
  if (!isOnline) {
    console.log('🌐 Network connection restored, enabling Firestore...');
    try {
      await enableNetwork(db);
      isOnline = true;
    } catch (error) {
      console.error('Failed to enable network:', error);
    }
  }
};

const handleOffline = async () => {
  if (isOnline) {
    console.log('📡 Network connection lost, disabling Firestore...');
    try {
      await disableNetwork(db);
      isOnline = false;
    } catch (error) {
      console.error('Failed to disable network:', error);
    }
  }
};

// Add network event listeners
window.addEventListener('online', handleOnline);
window.addEventListener('offline', handleOffline);

// Configure Google Auth Provider for better performance
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

console.log('✅ Firebase initialized successfully');

export default app;