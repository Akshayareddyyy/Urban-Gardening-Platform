
// src/lib/firebase.ts
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';
import { getAnalytics, type Analytics } from 'firebase/analytics';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD4L4eVD4anFgOA87k2bNzXX8ItBNIflwY",
  authDomain: "urban-gardening-platform.firebaseapp.com",
  projectId: "urban-gardening-platform",
  storageBucket: "urban-gardening-platform.firebasestorage.app",
  messagingSenderId: "117499841888",
  appId: "1:117499841888:web:a00efb1f3878dcd5982205",
  measurementId: "G-BS71932CHD"
};

// Log the config to the browser console for debugging
if (typeof window !== 'undefined') {
  console.log("Firebase Config Loaded by App (Hardcoded):", firebaseConfig);
}

let app: FirebaseApp;
let db: Firestore;
let auth: Auth;
let analytics: Analytics | undefined;

if (typeof window !== 'undefined') {
  if (!getApps().length) {
    try {
      app = initializeApp(firebaseConfig);
      db = getFirestore(app);
      auth = getAuth(app);
      if (firebaseConfig.measurementId) {
        analytics = getAnalytics(app);
      }
    } catch (error) {
      console.error("Error initializing Firebase app:", error);
      // You might want to display a user-friendly message if initialization fails
      alert("Could not initialize Firebase. Some features may not work. Please check the console for details.");
    }
  } else {
    app = getApp();
    db = getFirestore(app); // Ensure db is initialized if app already exists
    auth = getAuth(app); // Ensure auth is initialized if app already exists
    if (firebaseConfig.measurementId) {
        // Check if analytics was already initialized with this app instance
        // This simple check might not be fully robust for all scenarios of re-initialization
        // but typically getAnalytics(getApp()) is safe if called multiple times.
        analytics = getAnalytics(app);
    }
  }
} else {
  // Handle server-side initialization if needed, or leave uninitialized
  // For client-side only usage, this else block might not be strictly necessary
  // but it's good practice for universal modules.
  // Note: Firebase client SDKs are generally for client-side use.
}

export { app, db, auth, analytics };
