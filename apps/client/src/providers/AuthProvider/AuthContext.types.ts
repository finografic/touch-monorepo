import type { ReactNode } from 'react';

import type { CreateSettersType } from 'utils/zustand';

import type { AuthKeys, SETTER_PREFIX } from './AuthContext';
import type { AuthSession, AuthSignUpParams, AuthReturnParams, AuthSignInParams, User } from './auth.types';

export interface AuthValues {
  [AuthKeys.user]: User | null;
  [AuthKeys.session]: AuthSession | null;
  [AuthKeys.isLoading]: boolean;
  [AuthKeys.isAuthenticated]: boolean;
  [AuthKeys.isAdmin]: boolean;
  isLoginDialogOpen: boolean;
}

type AuthSetters = CreateSettersType<AuthValues, typeof SETTER_PREFIX>;

type AuthActions = AuthSetters & {
  signUp: (params: AuthSignUpParams) => Promise<AuthReturnParams>;
  signIn: (params: AuthSignInParams) => Promise<AuthReturnParams>;
  signOut: () => Promise<AuthReturnParams>;
  setSession: (session: AuthSession | null) => void;
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
