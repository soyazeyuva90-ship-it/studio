/**
 * @fileOverview Firebase configuration with support for multiple environment variable patterns.
 * Ensures compatibility with standard Firebase Studio injections and Next.js public prefixes.
 */

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID || ""
};

// Log a warning in development if the API key is missing
if (process.env.NODE_ENV === 'development' && !firebaseConfig.apiKey) {
  console.warn("Firebase API Key is missing. Please ensure NEXT_PUBLIC_FIREBASE_API_KEY is set in your .env file.");
}
