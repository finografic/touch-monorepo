/**
 * AuthContext - Zustand-based authentication store
 *
 * This file contains the core Zustand store implementation for authentication.
 * It provides Better Auth + JWT integration with the following features:
 *
 * - User session management
 * - Sign in/up/out functionality
 * - Session refresh capabilities
 * - Loading states
 * - Type-safe state management
 *
 */

import { sleep } from '@workspace/core/utils';

import { createStore, type StoreApi, useStore } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';

import { authClient } from 'lib/auth-client';
import { clearAuthSessionToken } from 'utils/storage.utils';
import { createSetters, createZustandContext } from 'utils/zustand';

import { STORAGE_KEYS } from 'config';
import type { AuthSignInParams, AuthSignUpParams } from './auth.types';
import type { AuthStore, AuthValues } from './AuthContext.types';

export const DISPLAY_NAME = 'Auth';
export const SETTER_PREFIX = '';

export enum AuthKeys {
  user = 'user',
  session = 'session',
  isLoading = 'isLoading',
  isAuthenticated = 'isAuthenticated',
  isAdmin = 'isAdmin',
  role = 'role',
  isLoginDialogOpen = 'isLoginDialogOpen',
}

export const defaultValue: AuthValues = {
  user: null,
  session: null,
  isLoading: false,
  isAuthenticated: false,
  role: null,
  isLoginDialogOpen: false,
};

export const AuthContext = createZustandContext(({ initialValue }) => {
  return createStore<AuthStore>()(
    subscribeWithSelector(
      (set, get): AuthStore => ({
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
              const userRole = (data.user as any).role || 'user';
              set({
                session: data as any, // Better Auth session structure
                user: { ...data.user, role: userRole } as any,
                isAuthenticated: true,
                role: userRole as 'admin' | 'user',
                isLoading: false,
              });

              return { success: true, message: 'Account created successfully' };
            } else {
              set({ isLoading: false });
              return { success: false, error: error?.message || 'Sign up failed' };
            }
          },
          signIn: async ({ email, password }: AuthSignInParams) => {
            clearAuthSessionToken(); // remove session cookie, if still remains..
            await sleep(300);

            const result = await authClient.signIn.email({ email, password });
            await sleep(300);

            if (result.data?.user) {
              // Better Auth returns user without role by default, we need to cast/transform
              const userRole = (result.data.user as any).role || 'user';
              set({
                session: result.data as any, // Better Auth session structure
                user: { ...result.data.user, role: userRole } as any,
                isAuthenticated: true,
                role: userRole as 'admin' | 'user',
                isLoading: false,
              });

              return { success: true, message: 'Signed in successfully' };
            } else {
              set({ isLoading: false });
              return { success: false, error: result.error?.message || 'Sign in failed' };
            }
          },
          signOut: async () => {
            // ✅ Use Better Auth client
            const result = await authClient.signOut();
            // await sleep(300);

            if (result.error && !result.data?.success) {
              return { success: false, error: result.error.message || 'Sign out failed' };
            }
            await sleep(200);
            // clearAuthSessionToken(); // remove session cookie, if still remains..
            set({ ...defaultValue });
            // await sleep(300);

            return { success: true, message: 'Signed out successfully' };
          },
          setLoading: (isLoading: boolean) => set({ isLoading }),
          refreshSession: async () => {
            set({ isLoading: true });

            // ✅ Use Better Auth client
            const { data } = await authClient.getSession();

            if (data?.user) {
              // Better Auth returns user without role by default, we need to cast/transform
              const userRole = (data.user as any).role || 'user';
              const isAdmin = userRole === 'admin';

              set({
                session: data as any,
                user: { ...data.user, role: userRole } as any,
                isAuthenticated: true,
                role: userRole as 'admin' | 'user',
                isLoading: false,
              });
            } else {
              set({ ...defaultValue });
            }
          },
          openLoginDialog: () => {
            set({ isLoginDialogOpen: true });
          },
          closeLoginDialog: () => {
            set({ isLoginDialogOpen: false });
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
