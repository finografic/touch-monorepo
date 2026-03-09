import { getApiUrl } from '../api/fetch.client';

const authUrl = () => `${getApiUrl()}/auth`;

async function getCsrfToken(): Promise<string> {
  const res = await fetch(`${authUrl()}/csrf`, { credentials: 'include' });
  const data = await res.json();
  return data.csrfToken;
}

interface AuthSession {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    role: 'public' | 'user' | 'admin';
  };
  expires: string;
}

interface SignUpResult {
  user?: { id: string; name: string; email: string; role: string };
  error?: string;
}

export const authClient = {
  getSession: async (): Promise<AuthSession | null> => {
    try {
      const res = await fetch(`${authUrl()}/session`, { credentials: 'include' });
      if (!res.ok) return null;

      const data = await res.json();
      if (!data?.user?.email) return null;
      return data as AuthSession;
    } catch {
      return null;
    }
  },

  signIn: {
    email: async ({ email, password }: { email: string; password: string }) => {
      try {
        const csrfToken = await getCsrfToken();

        const res = await fetch(`${authUrl()}/callback/credentials`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            email,
            password,
            csrfToken,
          }),
          credentials: 'include',
          redirect: 'manual',
        });

        // Auth.js returns a redirect (302) on both success and failure.
        // With redirect: 'manual', we get an opaque redirect (type: 'opaqueredirect', status: 0).
        // The JWT cookie is set via Set-Cookie on the redirect response.
        // We check the session to determine success.
        if (res.type === 'opaqueredirect' || res.status === 302 || res.status === 0) {
          const session = await authClient.getSession();
          if (session?.user) {
            return {
              data: { user: session.user, redirect: false, token: '' },
              error: null,
            };
          }
          return { data: null, error: { message: 'Invalid credentials' } };
        }

        // Non-redirect response (unusual) — try JSON
        if (res.ok) {
          const session = await authClient.getSession();
          if (session?.user) {
            return {
              data: { user: session.user, redirect: false, token: '' },
              error: null,
            };
          }
        }

        return { data: null, error: { message: 'Invalid credentials' } };
      } catch (err) {
        return {
          data: null,
          error: { message: err instanceof Error ? err.message : 'Sign in failed' },
        };
      }
    },
  },

  signUp: {
    email: async ({ email, password, name }: { email: string; password: string; name: string }) => {
      try {
        const res = await fetch(`${authUrl()}/sign-up`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name }),
          credentials: 'include',
        });

        const data: SignUpResult = await res.json();

        if (!res.ok || data.error) {
          return { data: null, error: { message: data.error || 'Sign up failed' } };
        }

        return { data: { user: data.user }, error: null };
      } catch (err) {
        return {
          data: null,
          error: { message: err instanceof Error ? err.message : 'Sign up failed' },
        };
      }
    },
  },

  signOut: async () => {
    try {
      const csrfToken = await getCsrfToken();

      await fetch(`${authUrl()}/signout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ csrfToken }),
        credentials: 'include',
        redirect: 'manual',
      });

      return { data: { success: true }, error: null };
    } catch (err) {
      return {
        data: { success: false },
        error: { message: err instanceof Error ? err.message : 'Sign out failed' },
      };
    }
  },
};

export type AuthClient = typeof authClient;
