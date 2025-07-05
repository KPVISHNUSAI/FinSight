// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};


let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

// We check if the essential config keys are provided.
// Using `&&` ensures they are not undefined, null, or empty strings.
if (firebaseConfig.apiKey && firebaseConfig.projectId) {
  // Initialize Firebase
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
} else {
  // If config is missing, we create a proxy for `auth`, `app`, and `db`.
  // When any function on these objects is called, it will throw a helpful error.
  // This prevents cryptic Firebase errors and tells the developer exactly what's wrong.
  const handler = {
    get() {
      throw new Error(
        'Firebase is not configured. Please add your Firebase credentials to your .env file and restart the development server.'
      );
    },
  };
  app = new Proxy({}, handler) as FirebaseApp;
  auth = new Proxy({}, handler) as Auth;
  db = new Proxy({}, handler) as Firestore;
}

export { app, auth, db };
