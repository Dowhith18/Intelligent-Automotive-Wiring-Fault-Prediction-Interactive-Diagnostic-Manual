import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js';

// Define the shape of the context
interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Create the context with a default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the AuthProvider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      const mockUser: User = {
        id: 'mock-user-id',
        app_metadata: { provider: 'email', providers: ['email'] },
        user_metadata: { name: 'Mock Technician' },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
        email: 'technician@example.com',
      };
      const mockSession: Session = {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        expires_in: 3600,
        token_type: 'bearer',
        user: mockUser,
      };
      setUser(mockUser);
      setSession(mockSession);
      setIsLoading(false);
      return;
    }

    // Check for an active session on initial load
    const getInitialSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
    }
    getInitialSession();


    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    // Unsubscribe from the listener when the component unmounts
    return () => {
      subscription?.unsubscribe();
    };
  }, []);
  
  // Login
  const login = async (email: string, pass: string) => {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) throw error;
  };

  // Register
  const register = async (email: string, pass: string, name: string) => {
     if (!isSupabaseConfigured) return;
     const { error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: {
            data: {
                name: name,
            }
        }
     });
     if (error) throw error;
  };

  // Logout
  const logout = async () => {
    if (!isSupabaseConfigured) {
        console.log("Logout is disabled when Supabase is not configured to prevent being locked out.");
        return;
    }
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const value = {
    session,
    user,
    isAuthenticated: !!session?.user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Create a custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};