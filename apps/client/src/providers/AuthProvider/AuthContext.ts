import { createSetters, createZustandContext } from '@finografic/zustand-context-creator';
import { sleep } from '@workspace/core/utils';

import { createStore, type StoreApi, useStore } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';
import { authClient } from 'lib/auth-client';

import type {
  AuthSessionData,
  AuthSignInParams,
  AuthSignUpParams,
  AuthUser,
} from './auth.types';
import type { AuthStore, AuthValues } from './AuthContext.types';

export const DISPLAY_NAME = 'Auth';
export const SETTER_PREFIX = '';

export enum AuthKeys {
  user = 'user',
  session = 'session',
  isLoading = 'isLoading',
  isAuthenticated = 'isAuthenticated',
  role = 'role',
  isLoginDialogOpen = 'isLoginDialogOpen',
  isConfirmLogoutOpen = 'isConfirmLogoutOpen',
}

export const defaultValue: AuthValues = {
  user: null,
  session: null,
  isLoading: false,
  isAuthenticated: false,
  role: null,
  isLoginDialogOpen: false,
  isConfirmLogoutOpen: false,
};

export const AuthContext = createZustandContext(({ initialValue }) => {
  return createStore<AuthStore>()(
    subscribeWithSelector(
      (set, _get): AuthStore => ({
        ...defaultValue,
        ...initialValue,
        actions: {
          ...createSetters({ set, defaultValue, prefix: SETTER_PREFIX }),
          signUp: async ({ email, password, name }: AuthSignUpParams) => {
            const { data, error } = await authClient.signUp.email({
              email,
              password,
              name,
            });

            if (data?.user) {
              // After sign-up, sign in automatically
              const signInResult = await authClient.signIn.email({ email, password });

              if (signInResult.data?.user) {
                const user = signInResult.data.user as AuthUser;
                set({
                  session: { user },
                  user,
                  isAuthenticated: true,
                  role: user.role || 'user',
                  isLoading: false,
                });
                return { success: true, message: 'Account created successfully' };
              }

              set({ isLoading: false });
              return { success: true, message: 'Account created. Please sign in.' };
            }

            set({ isLoading: false });
            return { success: false, error: error?.message || 'Sign up failed' };
          },
          signIn: async ({ email, password }: AuthSignInParams) => {
            const result = await authClient.signIn.email({ email, password });

            await sleep(100);
            set({ isLoading: false });

            if (result.data?.user) {
              const user = result.data.user as AuthUser;

              const session: AuthSessionData = { user };

              set({
                session,
                user,
                isAuthenticated: true,
                role: user.role || 'user',
                isLoading: false,
              });

              return { success: true, message: 'Signed in successfully' };
            }

            return result.error
              ? { success: false, error: result.error.message, message: 'Sign in failed' }
              : { success: false, message: 'Unknown error' };
          },
          signOut: async () => {
            const result = await authClient.signOut();

            await sleep(100);
            set({ isLoading: false });

            if (result.data?.success) {
              set({ ...defaultValue });
              return { success: true, message: 'Signed out successfully' };
            }

            return result.error
              ? { success: false, error: result.error.message, message: 'Sign out failed' }
              : { success: false, message: 'Unknown error' };
          },
          setLoading: (isLoading: boolean) => set({ isLoading }),
          refreshSession: async () => {
            set({ isLoading: true });

            const session = await authClient.getSession();

            if (session?.user) {
              const user = session.user as AuthUser;
              set({
                session: { user },
                user,
                isAuthenticated: true,
                role: user.role || 'user',
                isLoading: false,
              });
            } else {
              set({ ...defaultValue });
            }
          },
          openLoginDialog: async () => {
            set({ isLoginDialogOpen: true });
            await sleep(100);
          },
          closeLoginDialog: async () => {
            set({ isLoginDialogOpen: false });
            await sleep(100);
          },
          openConfirmLogout: async () => {
            set({ isConfirmLogoutOpen: true });
            await sleep(100);
          },
          closeConfirmLogout: async () => {
            set({ isConfirmLogoutOpen: false });
            await sleep(100);
          },
        },
      }),
    ),
  );
});

type AuthReturn = Omit<AuthStore, 'actions'> & AuthStore['actions'];

export const useAuth = (): AuthReturn => {
  const store = AuthContext.useContext();
  if (!store) {
    throw new Error(`use${SETTER_PREFIX} must be used within a ${DISPLAY_NAME}Provider`);
  }

  return useStore<StoreApi<AuthStore>, AuthReturn>(
    store,
    useShallow(({ actions, ...state }) => ({
      ...state,
      ...actions,
    })),
  );
};
