import supabase from '../lib/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';

async function login(email: string, password: string): Promise<SupabaseUser | null> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error('Error signing in:', error);
    return null;
  }

  // Session will be automatically persisted and refreshed due to the client options.
  console.log('Successfully signed in:', data);
  return data.user || null;
}

async function register(email: string, password: string): Promise<SupabaseUser | null> {
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    console.error('Error signing up:', error);
    return null;
  }

  console.log('Successfully signed up:', data);
  return data.user || null;
}

export { login, register };
