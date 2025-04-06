
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';
import { toast } from 'sonner';

// Import the supabase client that's already correctly configured
import { supabase as supabaseClient } from '@/integrations/supabase/client';

// Export the pre-configured client
export const supabase = supabaseClient;

// Function to check if Supabase connection is working
export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('profiles').select('count').single();
    if (error && error.code !== 'PGRST116') throw error;
    return true;
  } catch (error) {
    console.error('Supabase connection error:', error);
    return false;
  }
};

// Authentication helper functions
export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return { success: true, data };
  } catch (error: any) {
    console.error('Login error:', error.message);
    return { success: false, error: error.message };
  }
};

export const signUp = async (email: string, password: string, userData: { name: string, businessName?: string }) => {
  try {
    // First check if the email already exists
    const { data: existingUser } = await supabase.auth.signInWithPassword({
      email,
      password: 'dummy-password-to-check-existence'
    }).catch(() => ({ data: null }));
    
    if (existingUser) {
      return { success: false, error: 'This email is already registered. Please log in instead.' };
    }
    
    // Create user with auth only first - don't set metadata here
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Setting emailRedirectTo ensures the user returns to the app after confirming by email
        emailRedirectTo: `${window.location.origin}/dashboard`
      }
    });

    if (error) throw error;
    
    if (data.user) {
      // If row level security is properly set up, this will work without additional security checks
      await supabase.from('profiles').upsert({
        id: data.user.id,
        full_name: userData.name,
        business_name: userData.businessName || null,
        email: email
      }, {
        onConflict: 'id'
      });
      
      return { success: true, data };
    } else {
      return { success: false, error: 'User creation failed.' };
    }
  } catch (error: any) {
    console.error('Registration error:', error);
    return { success: false, error: error.message };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error('Logout error:', error.message);
    return { success: false, error: error.message };
  }
};

export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
};

export const getSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  } catch (error) {
    console.error('Get session error:', error);
    return null;
  }
};
