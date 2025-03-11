
// Simple local authentication system that replaces Supabase auth
import { toast } from 'sonner';

// Default admin credentials - in a real app, these would be more secure
const DEFAULT_USER = {
  id: 'local-user-id',
  email: 'admin@goldgst.com',
  password: 'gold123', // In a real app, this would be hashed
  name: 'Gold Shop Admin',
  created_at: new Date().toISOString()
};

// Session handling
export const getSession = () => {
  const sessionData = localStorage.getItem('auth_session');
  if (!sessionData) return null;
  
  try {
    return JSON.parse(sessionData);
  } catch (error) {
    console.error('Error parsing session:', error);
    return null;
  }
};

export const getCurrentUser = () => {
  const session = getSession();
  if (!session) return null;
  
  const { user } = session;
  return user || null;
};

// Authentication functions
export const signIn = async (email: string, password: string) => {
  try {
    // Compare with our default user credentials
    if (email === DEFAULT_USER.email && password === DEFAULT_USER.password) {
      // Create session
      const session = {
        user: {
          id: DEFAULT_USER.id,
          email: DEFAULT_USER.email,
          user_metadata: {
            name: DEFAULT_USER.name
          }
        },
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
      };
      
      // Store in localStorage
      localStorage.setItem('auth_session', JSON.stringify(session));
      
      return { success: true, data: session };
    } else {
      return { success: false, error: 'Invalid email or password' };
    }
  } catch (error: any) {
    console.error('Login error:', error.message);
    return { success: false, error: error.message };
  }
};

export const signUp = async (email: string, password: string, userData: { name: string }) => {
  // No real signup in single-user mode
  toast.error('Registration is disabled. Please use the default admin account.');
  return { success: false, error: 'Registration is disabled' };
};

export const signOut = async () => {
  try {
    localStorage.removeItem('auth_session');
    return { success: true };
  } catch (error: any) {
    console.error('Logout error:', error.message);
    return { success: false, error: error.message };
  }
};

// Check if authentication system is working correctly
export const checkAuthConnection = () => {
  return true; // Always returns true as local storage is always available
};
