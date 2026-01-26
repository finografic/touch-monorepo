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
    sendResetPassword: async ({ user, url, token }) => {
      console.log('Reset password requested for:', user.email);
      console.log('Reset URL:', url, token);
    },
  },

  session: {
    expiresIn: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },

  advanced: {
    cookiePrefix: env.COOKIES.COOKIE_PREFIX,

    useSecureCookies: false, // REQUIRED for HTTP on LAN

    database: {
      generateId: () => crypto.randomUUID(),
    },

    cookies: {
      sessionToken: {
        name: env.COOKIES.TOKEN_COOKIE,
        attributes: {
          httpOnly: true,
          sameSite: 'lax',
          secure: false, // MUST be false without HTTPS
          path: '/',
        },
      },
    },
  },

  plugins,
} satisfies BetterAuthOptions;

export const auth = betterAuth(betterAuthConfig);
export type Session = typeof auth.$Infer.Session;
