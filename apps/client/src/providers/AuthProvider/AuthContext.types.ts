import type { ReactNode } from 'react';

import type { Session } from 'better-auth/types';

import type { User } from 'types/models/auth.model';
import type { CreateSettersType } from 'utils/zustand';

import type { AuthReturnParams, AuthSignInParams, AuthSignUpParams } from './auth.types';
import type { AuthKeys, SETTER_PREFIX } from './AuthContext';

export interface AuthValues {
  [AuthKeys.user]: User | null;
  [AuthKeys.session]: (Omit<Session, 'user'> & { user: User }) | null;
  [AuthKeys.isLoading]: boolean;
  [AuthKeys.isAuthenticated]: boolean;
  [AuthKeys.role]: 'public' | 'user' | 'admin';
  [AuthKeys.isLoginDialogOpen]: boolean;
}

type AuthSetters = CreateSettersType<AuthValues, typeof SETTER_PREFIX>;

type AuthActions = AuthSetters & {
  signUp: (params: AuthSignUpParams) => Promise<AuthReturnParams>;
  signIn: (params: AuthSignInParams) => Promise<AuthReturnParams>;
  signOut: () => Promise<AuthReturnParams>;
  setSession: (session: Session | null) => void;
  setLoading: (isLoading: boolean) => void;
  refreshSession: () => Promise<void>;
  openLoginDialog: () => void;
  closeLoginDialog: () => void;
};

export interface AuthStore extends AuthValues {
  actions: AuthActions;
}

export interface AuthProviderProps {
  initialValue?: Partial<AuthValues>;
  children: ReactNode;
}
