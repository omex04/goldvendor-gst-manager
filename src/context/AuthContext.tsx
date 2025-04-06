
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { useNavigate, useLocation } from 'react-router-dom';

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
  const navigate = useNavigate();
  const location = useLocation();

  const refreshUser = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      
      if (data.session) {
        setSession(data.session);
        setUser(data.session.user);
        setIsAuthenticated(true);
        
        // Handle redirects based on auth state and current path
        if (['/login', '/register'].includes(location.pathname)) {
          navigate('/dashboard');
        }
      } else {
        setSession(null);
        setUser(null);
        setIsAuthenticated(false);
        
        // If not authenticated and on protected pages, redirect to login
        if (!['/login', '/register', '/', '/about', '/contact', '/pricing', '/terms', '/privacy'].includes(location.pathname)) {
          navigate('/login');
        }
      }
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
    const setupAuth = async () => {
      // First set up the auth state listener to avoid missing auth events
      const { data: authListener } = supabase.auth.onAuthStateChange((event, currentSession) => {
        console.log('Auth state change event:', event);
        
        // Handle synchronous state updates
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsAuthenticated(!!currentSession);
        
        // Handle events with toast notifications outside the callback
        if (event === 'SIGNED_IN') {
          setTimeout(() => toast.success('Signed in successfully'), 0);
        } else if (event === 'SIGNED_OUT') {
          setTimeout(() => toast.info('Signed out'), 0);
        } else if (event === 'USER_UPDATED') {
          setTimeout(() => console.log('User updated'), 0);
        }
      });

      // Then check for existing session
      await refreshUser();
      
      return () => {
        authListener.subscription.unsubscribe();
      };
    };
    
    setupAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, session, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
