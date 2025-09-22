import React, { createContext, useContext, useEffect, useState } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Session {
  user: User;
  session: any;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      try {
        const response = await fetch('http://localhost:4040/api/auth/session', {
          credentials: 'include',
        });
        if (response.ok) {
          const currentSession = await response.json();
          setSession(currentSession);
        } else {
          setSession(null);
        }
      } catch (error) {
        console.error('Failed to get session:', error);
        setSession(null);
      } finally {
        setIsLoading(false);
      }
    };

    getSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch('http://localhost:4040/api/auth/sign-in/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok && result.user) {
        // BetterAuth returns user data directly on successful login
        setSession(result);
        return { success: true };
      } else {
        return { success: false, error: result.error || 'Sign in failed' };
      }
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: 'Sign in failed' };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const response = await fetch('http://localhost:4040/api/auth/sign-up/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password, name }),
      });

      const result = await response.json();

      if (response.ok && result.user) {
        // BetterAuth returns user data directly on successful signup
        setSession(result);
        return { success: true };
      } else {
        return { success: false, error: result.error || 'Sign up failed' };
      }
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: 'Sign up failed' };
    }
  };

  const signOut = async () => {
    try {
      // For JWT, we can simply clear the client-side state
      // The token will expire naturally, or we can call the server to invalidate it
      setSession(null);

      // Clear any auth tokens from cookies/localStorage
      document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

      // Optional: Call server to invalidate token (if you want server-side invalidation)
      try {
        await fetch('http://localhost:4040/api/auth/sign-out', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({}),
        });
      } catch (serverError) {
        // Server error is not critical for JWT logout
        console.warn('Server sign-out failed, but client-side logout successful:', serverError);
      }
    } catch (error) {
      console.error('Sign out error:', error);
      // Even if there's an error, clear the session state
      setSession(null);
      document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }
  };

  const value: AuthContextType = {
    user: session?.user || null,
    session,
    isLoading,
    isAuthenticated: !!session?.user,
    isAdmin: false, // Remove role-based admin check for now
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
