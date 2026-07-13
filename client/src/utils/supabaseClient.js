import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Only initialize Supabase if the environment variables are present
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

if (supabase) {
  console.log('🌟 Connected successfully to Cloud Supabase Database! (Production Mode)');
} else {
  console.log('💻 Supabase keys not detected. Using Local SQLite API Server. (Development Mode)');
}
