import supabase from '../lib/supabase';
import { User } from '../models/model';

async function login(email: string, password: string): Promise<User | null> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error('Error signing in:', error);
    return null;
  }

  // Session will be automatically persisted and refreshed due to the client options.
  console.log('Successfully signed in:', data);
  return data.user ? { ...data.user, email: data.user.email } : null;
}

async function register(email: string, password: string): Promise<User | null> {
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    console.error('Error signing up:', error);
    return null;
  }

  console.log('Successfully signed up:', data);
  return data.user ? { ...data.user, email: data.user.email } : null;
}

export { login, register };
