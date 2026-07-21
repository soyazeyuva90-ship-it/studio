'use client';

import { useState, useEffect } from 'react';
import { Query, onSnapshot, QuerySnapshot, DocumentData } from 'firebase/firestore';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';
import { isFirebaseConfigValid } from '../config';

export function useCollection<T = DocumentData>(query: Query<T> | null) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Guard against simulation mode or invalid queries
    if (!query || !isFirebaseConfigValid() || Object.keys(query).length === 0) {
      setLoading(false);
      // In simulation mode, we return empty data or could potentially return mock data
      if (!isFirebaseConfigValid()) {
        setData([]);
      }
      return;
    }

    const unsubscribe = onSnapshot(
      query,
      (snapshot: QuerySnapshot<T>) => {
        const items = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        } as unknown as T));
        setData(items);
        setLoading(false);
      },
      async (err) => {
        const permissionError = new FirestorePermissionError({
          path: (query as any)._query?.path?.toString() || 'unknown collection',
          operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [query]);

  return { data, loading, error };
}
