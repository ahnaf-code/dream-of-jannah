import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Only initialize Supabase if the environment variables are present and look valid
const isValidKey = supabaseAnonKey && supabaseAnonKey.length > 50; // JWT keys are long

export const supabase = supabaseUrl && isValidKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

if (supabase) {
  console.log('🌟 Connected successfully to Cloud Supabase Database! (Production Mode)');
  console.log('📊 Supabase URL:', supabaseUrl);
  console.log('🔑 Key length:', supabaseAnonKey?.length, 'characters');
} else {
  console.log('💻 Supabase keys not detected or invalid. Using Local SQLite API Server. (Development Mode)');
  if (supabaseAnonKey) {
    console.warn('⚠️ Warning: Supabase key exists but looks too short (', supabaseAnonKey.length, 'chars). Expected 100+ chars for a valid JWT token.');
    console.warn('⚠️ Please check your VITE_SUPABASE_ANON_KEY in the .env file or Vercel environment variables.');
  }
}
