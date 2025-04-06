
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
    console.log("Starting registration with values:", {
      email: email,
      name: userData.name,
      businessName: userData.businessName || undefined
    });
    
    // Create user with auth only first - don't try to check email existence beforehand
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Setting emailRedirectTo ensures the user returns to the app after confirming by email
        emailRedirectTo: `${window.location.origin}/dashboard`
      }
    });

    if (error) {
      console.error("Authentication error during signup:", error);
      // If the error is about email already in use, provide a clearer error message
      if (error.message.includes("email already in use")) {
        return { success: false, error: 'This email is already registered. Please log in instead.' };
      }
      throw error;
    }
    
    if (data.user) {
      // If row level security is properly set up, this will work without additional security checks
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: data.user.id,
        full_name: userData.name,
        business_name: userData.businessName || null,
        email: email
      }, {
        onConflict: 'id'
      });
      
      if (profileError) {
        console.error("Profile creation error:", profileError);
        // We don't want to fail the signup if just the profile creation fails
        // The user is created, they just might not have complete profile data
      }
      
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
