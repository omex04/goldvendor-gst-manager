
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { useNavigate, useLocation } from 'react-router-dom';
// Import from localAuth instead of supabase
import { getSession, getCurrentUser } from '@/lib/localAuth';

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
      // Get session from localStorage instead of Supabase
      const sessionData = getSession();
      
      if (sessionData) {
        setSession(sessionData);
        setUser(sessionData.user);
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

  // Set up event listener for storage events to handle auth changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_session') {
        refreshUser();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // First check for existing session
    refreshUser();
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, session, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
