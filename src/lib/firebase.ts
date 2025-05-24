
// src/lib/firebase.ts
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';
import { getAnalytics, type Analytics } from 'firebase/analytics';
import { getStorage, type FirebaseStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD4L4eVD4anFgOA87k2bNzXX8ItBNIflwY",
  authDomain: "urban-gardening-platform.firebaseapp.com",
  projectId: "urban-gardening-platform",
  storageBucket: "urban-gardening-platform.appspot.com", // Corrected typical storage bucket name
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
let storage: FirebaseStorage; // Added storage
let analytics: Analytics | undefined;

if (typeof window !== 'undefined') {
  if (!getApps().length) {
    try {
      app = initializeApp(firebaseConfig);
      db = getFirestore(app);
      auth = getAuth(app);
      storage = getStorage(app); // Initialize storage
      if (firebaseConfig.measurementId) {
        analytics = getAnalytics(app);
      }
    } catch (error) {
      console.error("Error initializing Firebase app:", error);
      alert("Could not initialize Firebase. Some features may not work. Please check the console for details.");
    }
  } else {
    app = getApp();
    db = getFirestore(app);
    auth = getAuth(app);
    storage = getStorage(app); // Initialize storage if app already exists
    if (firebaseConfig.measurementId) {
        analytics = getAnalytics(app);
    }
  }
} else {
  // Server-side initialization might be needed for admin tasks, but client SDKs are primary here.
}

export { app, db, auth, storage, analytics }; // Export storage
