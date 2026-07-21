import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { firebaseConfig, isFirebaseConfigValid } from './config';

/**
 * @fileOverview Centralized Firebase initialization with safety checks.
 */

let firebaseApp: FirebaseApp;
let firestore: Firestore;
let auth: Auth;

export function initializeFirebase() {
  if (!isFirebaseConfigValid()) {
    throw new Error("Firebase configuration is invalid or missing. Check your environment variables.");
  }

  if (getApps().length === 0) {
    firebaseApp = initializeApp(firebaseConfig);
  } else {
    firebaseApp = getApp();
  }

  firestore = getFirestore(firebaseApp);
  auth = getAuth(firebaseApp);

  // Set persistence to local (survives browser restarts)
  if (typeof window !== 'undefined') {
    setPersistence(auth, browserLocalPersistence).catch((err) => {
      console.error("Auth persistence error:", err);
    });
  }

  return { firebaseApp, firestore, auth };
}

export * from './provider';
export * from './client-provider';
export * from './auth/use-user';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './errors';
export * from './error-emitter';
