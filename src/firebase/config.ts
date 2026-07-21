/**
 * @fileOverview Firebase configuration with robust environment variable detection and validation.
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
 * Validates if the Firebase configuration is complete enough to initialize.
 * @returns boolean
 */
export function isFirebaseConfigValid(): boolean {
  return !!(
    firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
  );
}

// Log detailed missing keys in development
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  const missingKeys = Object.entries(firebaseConfig)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingKeys.length > 0) {
    console.error(
      `[SafeGuard] Missing Firebase Environment Variables: ${missingKeys.join(', ')}. ` +
      `Ensure your .env file contains these variables with the NEXT_PUBLIC_ prefix.`
    );
  }
}
