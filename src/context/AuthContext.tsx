
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase, getCurrentUser, getSession } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

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
    setIsLoading(true);
    try {
      const session = await getSession();
      const currentUser = await getCurrentUser();
      
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

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setIsAuthenticated(!!session);
        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
