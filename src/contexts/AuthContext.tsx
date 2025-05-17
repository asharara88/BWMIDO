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
  refreshSession: () => Promise<void>;
  checkOnboardingStatus: () => Promise<boolean>;
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

  // Function to check if user has completed onboarding
  const checkOnboardingStatus = async (): Promise<boolean> => {
    if (!user) return false;
    if (isDemo) return true; // Demo users are considered onboarded
    
    try {
      // First check localStorage for saved profile data
      const savedUserData = localStorage.getItem('biowell-user-data');
      if (savedUserData) {
        const userData = JSON.parse(savedUserData);
        if (userData.firstName && userData.lastName) {
          return true;
        }
      }
      
      // If not in localStorage, check database
      const { data, error } = await supabase
        .from('profiles')
        .select('onboarding_completed, first_name, last_name')
        .eq('id', user.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error checking onboarding status:', error);
        return false;
      }
      
      // If no profile exists yet, create a default one
      if (!data) {
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email,
            onboarding_completed: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        
        if (insertError) {
          console.error('Error creating default profile:', insertError);
        }
        return false;
      }
      
      // If we have profile data in the database, save it to localStorage for future use
      if (data && (data.onboarding_completed || (data.first_name && data.last_name))) {
        localStorage.setItem('biowell-user-data', JSON.stringify({
          firstName: data.first_name,
          lastName: data.last_name,
          email: user.email
        }));
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Unexpected error checking onboarding status:', err);
      return false;
    }
  };

  // Function to refresh the session
  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('Error refreshing session:', error);
        
        // If the error is about invalid refresh token, clear the session
        if (error.message.includes('Invalid Refresh Token') || 
            error.message.includes('Refresh Token Not Found')) {
          console.log('Invalid refresh token detected, clearing session');
          await supabase.auth.signOut();
          setUser(null);
          setSession(null);
          
          // Redirect to login page
          window.location.href = '/login';
        }
        return;
      }
      
      setSession(data.session);
      setUser(data.session?.user ?? null);
    } catch (err) {
      console.error('Unexpected error during session refresh:', err);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if we have saved user data in localStorage
        const savedUserData = localStorage.getItem('biowell-user-data');
        
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          return;
        }
        
        setSession(data.session);
        setUser(data.session?.user ?? null);
        
        // If session exists but is close to expiry, refresh it
        if (data.session) {
          const expiresAt = data.session.expires_at;
          const now = Math.floor(Date.now() / 1000);
          
          // If session expires in less than 5 minutes (300 seconds), refresh it
          if (expiresAt && expiresAt - now < 300) {
            await refreshSession();
          }
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
      } finally {
        setLoading(false);
      }
    };

    if (!isDemo) {
      initializeAuth();
    }

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // If the event is TOKEN_REFRESHED, update the session
        if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed successfully');
        }
        
        // If the event is SIGNED_OUT, clear the session
        if (event === 'SIGNED_OUT') {
          console.log('User signed out');
          setUser(null);
          setSession(null);
        }
      }
    );

    // Set up a timer to periodically check and refresh the session if needed
    const refreshInterval = setInterval(async () => {
      if (!isDemo && session) {
        const expiresAt = session.expires_at;
        const now = Math.floor(Date.now() / 1000);
        
        // If session expires in less than 5 minutes (300 seconds), refresh it
        if (expiresAt && expiresAt - now < 300) {
          console.log('Session expiring soon, refreshing...');
          await refreshSession();
        }
      }
    }, 60000); // Check every minute

    return () => {
      if (!isDemo) {
        authListener.subscription.unsubscribe();
      }
      clearInterval(refreshInterval);
    };
  }, [supabase, isDemo, session]);

  // Helper function to generate a captcha token
  const generateCaptchaToken = async () => {
    try {
      // In a real implementation, this would integrate with a captcha provider like hCaptcha or reCAPTCHA
      // For development purposes, we're using a dummy token
      const captchaSecretKey = import.meta.env.VITE_CAPTCHA_SECRET_KEY;
      
      if (!captchaSecretKey) {
        console.warn('Captcha secret key not found in environment variables');
        return null;
      }
      
      // Simulate a captcha verification request
      // In production, this would be a real API call to verify the captcha
      return `${captchaSecretKey}-${Date.now()}`;
    } catch (error) {
      console.error('Error generating captcha token:', error);
      return null;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Generate captcha token
      const captchaToken = await generateCaptchaToken();
      
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password,
        options: {
          captchaToken,
          redirectTo: 'https://leznzqfezoofngumpiqf.supabase.co/auth/v1/callback'
        }
      });
      
      if (error) {
        console.error('Sign in error:', error);
        return { error };
      }
      
      // Store session in memory
      setSession(data.session);
      setUser(data.user);
      
      // Try to load user data from localStorage
      const savedUserData = localStorage.getItem('biowell-user-data');
      if (!savedUserData && data.user) {
        // If no saved data, try to fetch from database
        const { data: profileData } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', data.user.id)
          .maybeSingle();
          
        if (profileData && profileData.first_name && profileData.last_name) {
          // Save to localStorage for future use
          localStorage.setItem('biowell-user-data', JSON.stringify({
            firstName: profileData.first_name,
            lastName: profileData.last_name,
            email: data.user.email
          }));
        }
      }
      
      return { error: null };
    } catch (err) {
      console.error('Unexpected error during sign in:', err);
      return { error: err };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      // Generate captcha token
      const captchaToken = await generateCaptchaToken();
      
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          captchaToken,
          redirectTo: 'https://leznzqfezoofngumpiqf.supabase.co/auth/v1/callback'
        }
      });
      
      if (error) {
        console.error('Sign up error:', error);
        return { data: null, error };
      }
      
      // Create default profile for new user
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: data.user.email,
            onboarding_completed: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        
        if (profileError) {
          console.error('Error creating default profile:', profileError);
        }
      }
      
      return { data, error: null };
    } catch (err) {
      console.error('Unexpected error during sign up:', err);
      return { data: null, error: err };
    }
  };

  const signOut = async () => {
    try {
      if (!isDemo) {
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.error('Sign out error:', error);
          throw error;
        }
      }
      setIsDemo(false);
      setUser(null);
      setSession(null);
      
      // Clear user data from localStorage
      localStorage.removeItem('biowell-user-data');
    } catch (err) {
      console.error('Unexpected error during sign out:', err);
      // Even if there's an error, we should still clear the local state
      setIsDemo(false);
      setUser(null);
      setSession(null);
      localStorage.removeItem('biowell-user-data');
    }
  };

  const startDemo = () => {
    setIsDemo(true);
    setUser(DEMO_USER);
    setLoading(false);
    
    // Save demo user data to localStorage
    localStorage.setItem('biowell-user-data', JSON.stringify({
      firstName: 'Demo',
      lastName: 'User',
      email: 'demo@example.com',
      mobile: '+971 (50) 123 4567',
      onboardingCompleted: true
    }));
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
    refreshSession,
    checkOnboardingStatus,
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