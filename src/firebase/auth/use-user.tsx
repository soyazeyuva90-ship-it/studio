'use client';

import { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { useAuth } from '../provider';
import { isFirebaseConfigValid } from '../config';

/**
 * @fileOverview Hook to track the current user.
 * Handles simulation mode by checking localStorage for a mock session.
 */
export function useUser() {
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Handle Simulation Mode
    if (!isFirebaseConfigValid()) {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('safeguard_mock_user') : null;
      if (stored) {
        try {
          setUser(JSON.parse(stored) as User);
        } catch (e) {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
      return;
    }

    // Handle Real Firebase Auth
    if (!auth || Object.keys(auth).length === 0) return;
    
    return onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
  }, [auth]);

  return { user, loading };
}
