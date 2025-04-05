'use client';

import { useAuthStore } from '@/store/auth/auth.store';
import { useEffect, useState, createContext, useContext, ReactNode } from 'react';

// Create a context to expose authentication methods that require React hooks
interface AuthContextType {
  isInitialized: boolean;
}

const AuthContext = createContext<AuthContextType>({ isInitialized: false });

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const { initializeAuth, token, isAuthenticated } = useAuthStore(state => ({
    initializeAuth: state.initializeAuth,
    token: state.token,
    isAuthenticated: state.isAuthenticated
  }));

  // Initialize auth state on component mount
  useEffect(() => {
    const initialize = async () => {
      try {
        await initializeAuth();
      } catch (error) {
        console.error('Error initializing authentication:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    initialize();
  }, [initializeAuth]);

  // Set up token revalidation interval
  useEffect(() => {
    // Only set up revalidation if we have a token and are authenticated
    if (!token || !isAuthenticated) return;

    // Revalidate auth every 10 minutes
    const revalidationInterval = setInterval(() => {
      console.log('Revalidating authentication token...');
      initializeAuth();
    }, 10 * 60 * 1000); // 10 minutes

    return () => {
      clearInterval(revalidationInterval);
    };
  }, [token, isAuthenticated, initializeAuth]);

  return (
    <AuthContext.Provider value={{ isInitialized }}>
      {children}
    </AuthContext.Provider>
  );
}

