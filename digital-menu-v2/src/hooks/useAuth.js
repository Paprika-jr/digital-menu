import { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../services/firebase';

/**
 * Custom hook for managing Firebase authentication
 * @returns {Object} Authentication state and operations
 */
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /**
   * Sign in with email and password
   */
  const login = async (email, password) => {
    setError(null);
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (err) {
      const errorMessage = err.code === 'auth/invalid-credential'
        ? 'Invalid email or password'
        : 'Login failed. Please try again.';

      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sign out current user
   */
  const logout = async () => {
    setError(null);
    try {
      await signOut(auth);
      return { success: true };
    } catch {
      const errorMessage = 'Logout failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    logout
  };
}
