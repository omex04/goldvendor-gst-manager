
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// Mock implementation for now
class MockSupabaseClient {
  from() {
    return {
      select: () => this,
      eq: () => this,
      single: () => Promise.resolve({ data: null, error: null }),
      delete: () => Promise.resolve({ data: null, error: null }),
      upsert: () => this,
    };
  }
}

// This is a temporary implementation that doesn't connect to Supabase
// but still allows the app to work without errors
const mockClient = new MockSupabaseClient() as any;

// Comment out the actual Supabase client creation for now
// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// if (!supabaseUrl || !supabaseAnonKey) {
//   console.error('Missing Supabase environment variables. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.');
// }

// Create mock Supabase client to prevent errors
export const supabase = mockClient;

// When you're ready to enable Supabase, uncomment this:
// export const supabase = createClient<Database>(supabaseUrl || '', supabaseAnonKey || '');
