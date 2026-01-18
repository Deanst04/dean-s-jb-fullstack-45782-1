import { useState, useEffect, useCallback } from 'react';
import {
  signInAnonymously,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AuthState {
  user: User | null;
  userId: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: Error | null;
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const signIn = useCallback(async () => {
    try {
      await signInAnonymously(auth);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to sign in'));
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setIsLoading(false);
        setError(null);
      } else {
        signIn();
      }
    });

    return () => unsubscribe();
  }, [signIn]);

  return {
    user,
    userId: user?.uid ?? null,
    isLoading,
    isAuthenticated: !!user,
    error,
  };
}
