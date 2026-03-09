import type { AuthConfig } from '@hono/auth-js';
import Credentials from '@auth/core/providers/credentials';
import { eq } from 'drizzle-orm';
import { env } from 'env.server';

import { db } from 'db';
import { user } from '../db/schemas';
import { verifyPassword } from 'utils/password.utils';

export function getAuthConfig(): AuthConfig {
  return {
    basePath: '/api/auth',
    secret: env.AUTH_SECRET,
    providers: [
      Credentials({
        name: 'credentials',
        credentials: {
          email: { label: 'Email', type: 'email' },
          password: { label: 'Password', type: 'password' },
        },
        authorize: async (credentials) => {
          const email = credentials?.email as string | undefined;
          const password = credentials?.password as string | undefined;
          if (!email || !password) return null;

          const [foundUser] = await db
            .select()
            .from(user)
            .where(eq(user.email, email))
            .limit(1);

          if (!foundUser?.hashedPassword) return null;

          const valid = await verifyPassword(password, foundUser.hashedPassword);
          if (!valid) return null;

          return {
            id: foundUser.id,
            name: foundUser.name,
            email: foundUser.email,
            image: foundUser.image,
            role: foundUser.role,
          };
        },
      }),
    ],
    session: {
      strategy: 'jwt',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    pages: {
      signIn: '/login',
    },
    callbacks: {
      jwt({ token, user: authUser }) {
        if (authUser) {
          token.id = authUser.id;
          token.role = (authUser as any).role;
        }
        return token;
      },
      session({ session, token }) {
        if (token) {
          session.user.id = token.id as string;
          (session.user as any).role = token.role;
        }
        return session;
      },
    },
    cookies: {
      sessionToken: {
        name: env.COOKIES.TOKEN_COOKIE,
        options: {
          httpOnly: true,
          sameSite: 'lax' as const,
          path: '/',
          secure: false, // Required for HTTP on LAN
        },
      },
    },
    trustHost: true,
  };
}

export type Session = {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    role: 'public' | 'user' | 'admin';
  };
  expires: string;
};
