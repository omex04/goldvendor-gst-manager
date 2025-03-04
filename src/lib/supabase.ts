
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// These values must be replaced with actual Supabase credentials in .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.');
}

// Use empty strings as fallbacks to prevent URL constructor errors during development
export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey
);

// Function to check if Supabase connection is working
export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('invoices').select('count').single();
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Supabase connection error:', error);
    return false;
  }
};
