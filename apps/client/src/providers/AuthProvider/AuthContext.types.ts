import type { ReactNode } from 'react';
import type { AuthKeys, SETTER_PREFIX } from './AuthContext';
import type { CreateSettersType } from 'utils/zustand';

export interface User {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthSession {
  user: User;
  session: any;
}

export interface AuthValues {
  [AuthKeys.user]: User | null;
  [AuthKeys.session]: AuthSession | null;
  [AuthKeys.isLoading]: boolean;
  [AuthKeys.isAuthenticated]: boolean;
  [AuthKeys.isAdmin]: boolean;
}

type AuthSetters = CreateSettersType<AuthValues, typeof SETTER_PREFIX>;

type AuthActions = AuthSetters & {
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  setSession: (session: AuthSession | null) => void;
  setLoading: (isLoading: boolean) => void;
  refreshSession: () => Promise<void>;
};

export interface AuthStore extends AuthValues {
  actions: AuthActions;
}

export interface AuthProviderProps {
  initialValue?: Partial<AuthValues>;
  children: ReactNode;
}
