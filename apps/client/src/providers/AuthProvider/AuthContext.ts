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

import { createStore, type StoreApi, useStore } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';

import { createSetters, createZustandContext } from 'utils/zustand';

import type { AuthStore, AuthValues } from './AuthContext.types';
import type { AuthSession, AuthSignInParams, AuthSignUpParams } from './auth.types';

import { cleanupDialogBodyAttributes } from 'utils/ui.utils';

export const DISPLAY_NAME = 'Auth';
export const SETTER_PREFIX = '';

export enum AuthKeys {
  user = 'user',
  session = 'session',
  isLoading = 'isLoading',
  isAuthenticated = 'isAuthenticated',
  isAdmin = 'isAdmin',
}

export const defaultValue: AuthValues = {
  user: null,
  session: null,
  isLoading: false,
  isAuthenticated: false,
  isAdmin: false,
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
            try {
              const response = await fetch('http://localhost:4040/api/auth/sign-up/email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, password, name }),
              });

              const result = await response.json();

              if (response.ok && result.user) {
                const isAdmin = result.user.role === 'admin';
                set({ session: result, user: result.user, isAuthenticated: true, isAdmin, isLoading: false });
                return { success: true };
              } else {
                set({ isLoading: false });
                return { success: false, error: result.error || 'Sign up failed' };
              }
            } catch (error) {
              set({ isLoading: false });
              return { success: false, error: 'Sign up failed' };
            }
          },
          signIn: async ({ email, password }: AuthSignInParams) => {
            try {
              const response = await fetch('http://localhost:4040/api/auth/sign-in/email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
              });

              const result = await response.json();

              if (response.ok && result.user) {
                const isAdmin = result.user.role === 'admin';
                set({
                  session: result,
                  user: result.user,
                  isAuthenticated: true,
                  isAdmin,
                  isLoading: false,
                });

                return { success: true };
              } else {
                set({ isLoading: false });

                return { success: false, error: result.error || 'Sign in failed' };
              }
            } catch (error) {
              console.error('Sign in error:', error);
              set({ isLoading: false });

              return { success: false, error };
            }
          },
          signOut: async () => {
            try {
              // Call server to invalidate session in database
              // Server will clear the HttpOnly cookie via Set-Cookie headers
              const response = await fetch('http://localhost:4040/api/auth/sign-out', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({}),
              });

              // Clear client-side state after successful server response
              if (response.ok) {
                set({ ...defaultValue });
                console.log('✅ Sign out successful - session cleared');

                // Redirect to home page
                // const redirectUrl = String(location.pathname.startsWith('/admin') ? '/admin' : '/');
                // window.location.assign('redirectUrl');

                return { success: true };
              } else {
                console.warn('⚠️ Server sign-out failed, clearing client-side state anyway');
                // Still clear client state even if server fails
                set({ ...defaultValue });

                // Still redirect on error
                // window.location.assign('/');

                return { success: false, error: 'Sign out failed' };
              }
            } catch (error) {
              console.error('Sign out error:', error);
              // Even if there's an error, clear the session state
              set({ ...defaultValue });

              // Redirect anyway
              // window.location.assign('/');

              return { success: false, error: 'Sign out failed' };
            }
          },
          setSession: (session: AuthSession | null) => {
            const isAdmin = session?.user?.role === 'admin';
            set({
              session,
              user: session?.user || null,
              isAuthenticated: !!session?.user,
              isAdmin,
              isLoading: false,
            });
          },
          setLoading: (isLoading: boolean) => {
            set({ isLoading });
          },
          refreshSession: async () => {
            try {
              set({ isLoading: true });
              const response = await fetch('http://localhost:4040/api/auth/session', {
                credentials: 'include',
              });

              if (response.ok) {
                const currentSession = await response.json();
                const isAdmin = currentSession?.user?.role === 'admin';
                set({
                  session: currentSession,
                  user: currentSession?.user || null,
                  isAuthenticated: !!currentSession?.user,
                  isAdmin,
                  isLoading: false,
                });
              } else {
                set({ ...defaultValue });
              }
            } catch (error) {
              console.error('Failed to refresh session:', error);
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
