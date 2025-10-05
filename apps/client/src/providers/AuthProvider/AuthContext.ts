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
 * Usage:
 * ```tsx
 * // Wrap your app with the provider (from AuthProvider.tsx)
 * <AuthProviderWithInitialization>
 *   <App />
 * </AuthProviderWithInitialization>
 *
 * // Use in components
 * const { user, isAuthenticated, signIn, signOut } = useAuth();
 * ```
 *
 * Note: The automatic session initialization is handled by AuthProvider.tsx,
 * not by this store file. This file only contains the store logic.
 */

import { createStore, type StoreApi, useStore } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import { createSetters, createZustandContext } from 'utils/zustand';
import type { AuthSession, AuthSignOutParams, AuthStore, AuthValues } from './AuthContext.types';
import { subscribeWithSelector } from 'zustand/middleware';

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
  isLoading: true,
  isAuthenticated: false,
  isAdmin: false,
};

export const AuthContext = createZustandContext(({ initialValue }) => {
  return createStore<AuthStore>()(
    subscribeWithSelector(
      (set, get): AuthStore => ({
        ...defaultValue,
        ...initialValue,
        actions: {
          ...createSetters({ set, defaultValue, prefix: SETTER_PREFIX }),
          signIn: async (email: string, password: string) => {
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
                set({
                  session: result,
                  user: result.user,
                  isAuthenticated: true,
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
              return { success: false, error: 'Sign in failed' };
            }
          },
          signUp: async (email: string, password: string, name: string) => {
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
                set({
                  session: result,
                  user: result.user,
                  isAuthenticated: true,
                  isLoading: false,
                });
                return { success: true };
              } else {
                set({ isLoading: false });
                return { success: false, error: result.error || 'Sign up failed' };
              }
            } catch (error) {
              console.error('Sign up error:', error);
              set({ isLoading: false });
              return { success: false, error: 'Sign up failed' };
            }
          },
          signOut: async ({ onSuccess, onError }: AuthSignOutParams) => {
            try {
              // Call server to invalidate session in database
              const response = await fetch('http://localhost:4040/api/auth/sign-out', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({}),
              });

              // Clear client-side state after successful server response
              if (response.ok) {
                set({
                  session: null,
                  user: null,
                  isAuthenticated: false,
                  isLoading: false,
                });

                // Clear the actual cookie name used by BetterAuth
                // The cookie prefix comes from package.json name: "touch-monorepo"
                document.cookie =
                  'touch-monorepo.session_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

                console.log('✅ Sign out successful - session cleared');
                onSuccess?.();
              } else {
                console.warn('⚠️ Server sign-out failed, clearing client-side state anyway');
                // Still clear client state even if server fails
                set({
                  session: null,
                  user: null,
                  isAuthenticated: false,
                  isLoading: false,
                });
                document.cookie =
                  'touch-monorepo.session_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
              }
            } catch (error) {
              console.error('Sign out error:', error);
              // Even if there's an error, clear the session state
              set({
                session: null,
                user: null,
                isAuthenticated: false,
                isLoading: false,
              });
              document.cookie =
                'touch-monorepo.session_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
              onError?.();
            }
          },
          setSession: (session: AuthSession | null) => {
            set({
              session,
              user: session?.user || null,
              isAuthenticated: !!session?.user,
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
                set({
                  session: currentSession,
                  user: currentSession?.user || null,
                  isAuthenticated: !!currentSession?.user,
                  isLoading: false,
                });
              } else {
                set({
                  session: null,
                  user: null,
                  isAuthenticated: false,
                  isLoading: false,
                });
              }
            } catch (error) {
              console.error('Failed to refresh session:', error);
              set({
                session: null,
                user: null,
                isAuthenticated: false,
                isLoading: false,
              });
            }
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
