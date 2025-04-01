
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { toast } from 'sonner';

interface AuthContextProps {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  session: Session | null;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  session: null,
  refreshUser: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  const refreshUser = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setIsAuthenticated(!!data.session);
    } catch (error) {
      console.error("Auth refresh error:", error);
      setIsAuthenticated(false);
      setUser(null);
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial session check
    refreshUser();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsAuthenticated(!!currentSession);
        
        // Show toast for certain auth events
        if (event === 'SIGNED_IN') {
          toast.success('Signed in successfully');
        } else if (event === 'SIGNED_OUT') {
          toast.info('Signed out');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, session, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
