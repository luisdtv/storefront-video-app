import React, { createContext, useState, useContext } from 'react';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import supabase from '../lib/supabase';

interface AuthContextProps {
  session: Session | null;
  user: SupabaseUser | null;
  setUser: (user: SupabaseUser | null) => void;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  session: null,
  user: null,
  setUser: () => {},
  isLoading: false,
  signOut: async () => {},
});

export function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = React.useState<Session | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  async function signOut() {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  React.useEffect(() => {
    async function getCurrentSession() {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();

      setSession(session);

      if (session) {
        setUser(session?.user || null);
      }
    
      setIsLoading(false);
    }

    getCurrentSession();

    supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user || null);
    });
  }, []);

  const value = {
    session,
    user,
    setUser,
    isLoading,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
