import {
  signInWithEmail,
  signOut,
  signUpWithEmail,
} from '@/services/authService';
import { supabase } from '@/services/supabase';
import { AuthResult } from '@/types/interfaces';
import { Session } from '@supabase/supabase-js';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

interface AuthContextType {
  session: Session | null;
  user: any;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ) => Promise<AuthResult>;
  logout: () => Promise<AuthResult>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session?.user?.email || 'none');
      setSession(session);
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log(
        'Auth state changed:',
        _event,
        session?.user?.email || 'none'
      );
      setSession(session);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (
    email: string,
    password: string
  ): Promise<AuthResult> => {
    setIsLoading(true);
    const result = await signInWithEmail(email, password);
    setIsLoading(false);
    return result;
  };

  const signUp = async (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ): Promise<AuthResult> => {
    setIsLoading(true);
    const result = await signUpWithEmail(email, password, firstName, lastName);
    setIsLoading(false);
    return result;
  };

  const logout = async (): Promise<AuthResult> => {
    setIsLoading(true);
    const result = await signOut();
    setIsLoading(false);
    return result;
  };

  const value: AuthContextType = {
    session,
    user: session?.user || null,
    isLoading,
    signIn,
    signUp,
    logout,
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

export default AuthProvider;
