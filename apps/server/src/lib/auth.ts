import { betterAuth } from 'better-auth';
import type { BetterAuthOptions, BetterAuthPlugin } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin } from 'better-auth/plugins';
import { env } from 'env.server';

import { db } from 'db';
import { account, session, user, verification } from '../db/schemas';

const plugins = [
  admin({
    defaultRole: 'user',
    adminRoles: ['admin'],
  }) as BetterAuthPlugin,
];

const betterAuthConfig = {
  database: drizzleAdapter(db, {
    provider: 'sqlite',
    schema: { user, account, session, verification },
  }),
  basePath: '/api/auth',
  trustedOrigins: [env.CLIENT_ORIGIN],
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 4,
    maxPasswordLength: 32,
    sendResetPassword: async ({ user, url, token }, request) => {
      console.log('Reset password requested for:', user.email);
      console.log('Reset URL:', url, token, request);
      // TODO: Implement email sending
    },
  },
  session: {
    expiresIn: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
    cookieCache: {
      enabled: true, // Enable cookie cache for performance (reduces DB lookups)
      maxAge: 5 * 60, // 5 minutes - short-lived for security
    },
  },
  advanced: {
    cookiePrefix: env.COOKIES.COOKIE_PREFIX,
    useSecureCookies: env.NODE_ENV === 'production',
    database: {
      generateId: () => crypto.randomUUID(),
    },
    cookies: {
      sessionToken: {
        name: env.COOKIES.TOKEN_COOKIE,
        attributes: {
          httpOnly: true, // Prevent JavaScript access (XSS protection)
          sameSite: env.NODE_ENV === 'production' ? 'lax' : 'lax', // Use 'lax' for consistency
          secure: env.NODE_ENV === 'production', // HTTPS only in production
          path: '/', // Available across entire domain
        },
      },
    },
  },
  plugins,
} satisfies BetterAuthOptions;

export const auth = betterAuth(betterAuthConfig);

export type Session = typeof auth.$Infer.Session;
