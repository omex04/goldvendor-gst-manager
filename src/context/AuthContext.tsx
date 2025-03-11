
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getCurrentUser, getSession, signOut } from '@/lib/localAuth';

interface AuthContextProps {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  refreshUser: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any | null>(null);

  const refreshUser = async () => {
    try {
      const session = getSession();
      const currentUser = getCurrentUser();
      
      setIsAuthenticated(!!session);
      setUser(currentUser);
    } catch (error) {
      console.error("Auth refresh error:", error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();

    // Set up auth state change listener using storage events
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'auth_session') {
        refreshUser();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
