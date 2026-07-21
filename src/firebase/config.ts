
/**
 * @fileOverview Firebase configuration with robust environment variable detection and fallback logic.
 */

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

/**
 * Validates if the Firebase configuration is complete.
 * If invalid, the app enters "Simulation Mode" for prototyping.
 * @returns boolean
 */
export function isFirebaseConfigValid(): boolean {
  const keys = [
    firebaseConfig.apiKey,
    firebaseConfig.projectId,
    firebaseConfig.appId
  ];
  
  return keys.every(key => 
    key && 
    key !== '' && 
    key !== 'YOUR_API_KEY_HERE' && 
    key !== 'YOUR_PROJECT_ID' &&
    !key.includes('YOUR_')
  );
}
