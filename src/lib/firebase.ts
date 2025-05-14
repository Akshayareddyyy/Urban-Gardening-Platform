
// src/lib/firebase.ts
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Log the config to the browser console for debugging
if (typeof window !== 'undefined') {
  console.log("Firebase Config Loaded by App:", firebaseConfig);
  if (!firebaseConfig.apiKey) {
    console.error("Firebase API Key is MISSING in firebaseConfig. Check your .env file and ensure NEXT_PUBLIC_FIREBASE_API_KEY is set and the server was restarted.");
  }
}


let app: FirebaseApp;
let db: Firestore;
let auth: Auth;

if (typeof window !== 'undefined' && !getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
  } catch (error) {
    console.error("Error initializing Firebase app:", error);
    // Provide a more user-facing error if critical environment variables are missing
    if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
        alert("Firebase is not configured correctly. Please check the application setup. API key or Project ID might be missing.");
    }
  }
} else if (typeof window !== 'undefined') {
  app = getApp();
  db = getFirestore(app);
  auth = getAuth(app);
} else {
  // Handle server-side initialization if needed, or leave uninitialized
  // For client-side only usage, this else block might not be strictly necessary
  // but it's good practice for universal modules.
}

export { app, db, auth };
