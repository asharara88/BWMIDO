import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useSupabase } from './SupabaseContext';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isDemo: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any; data: any }>;
  signOut: () => Promise<void>;
  startDemo: () => void;
}

// Demo user with a valid UUID
const DEMO_USER: User = {
  id: '00000000-0000-0000-0000-000000000000',
  email: 'demo@example.com',
  phone: '',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  last_sign_in_at: new Date().toISOString(),
  role: 'authenticated',
  app_metadata: {},
  user_metadata: {},
  aud: 'authenticated',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { supabase } = useSupabase();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    };

    if (!isDemo) {
      initializeAuth();
    }

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      if (!isDemo) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [supabase, isDemo]);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ 
      email, 
      password,
      options: {
        redirectTo: 'https://leznzqfezoofngumpiqf.supabase.co/auth/v1/callback'
      }
    });
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        redirectTo: 'https://leznzqfezoofngumpiqf.supabase.co/auth/v1/callback'
      }
    });
    return { data, error };
  };

  const signOut = async () => {
    if (!isDemo) {
      await supabase.auth.signOut();
    }
    setIsDemo(false);
    setUser(null);
    setSession(null);
  };

  const startDemo = () => {
    setIsDemo(true);
    setUser(DEMO_USER);
    setLoading(false);
  };

  const value = {
    user: isDemo ? DEMO_USER : user,
    session,
    loading,
    isDemo,
    signIn,
    signUp,
    signOut,
    startDemo,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { AuthContext }