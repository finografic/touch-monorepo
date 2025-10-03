import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { customSession } from 'better-auth/plugins';
import { db } from 'db';
import { account, session, user, verification } from '../db/schemas';
import { env } from '../env.server';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { findProjectRoot } from '@finografic/project-scripts/utils';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectRoot = findProjectRoot(__dirname);
const rootPackageJson = JSON.parse(readFileSync(join(projectRoot, 'package.json'), 'utf-8'));

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'sqlite',
    schema: { user, account, session, verification },
  }),
  basePath: '/auth', // No /api prefix since we're mounting directly
  debug: true,
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 32,
    sendResetPassword: async ({ user, url, token }, request) => {
      console.log('Reset password requested for:', user.email);
      console.log('Reset URL:', url, token, request);
      // TODO: Implement email sending
    },
  },
  emailVerification: {
    enabled: false, // Disable email verification for development
    sendVerificationEmail: async ({ user, url, token }, request) => {
      console.log('Verification email requested for:', user.email);
      console.log('Verification URL:', url, token, request);
      // TODO: Implement email sending
    },
  },
  session: {
    expiresIn: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
    cookieName: 'auth_token',
    cookieCache: {
      enabled: false, // Disable cookie cache for JWT
      maxAge: 5 * 60,
    },
  },
  advanced: {
    cookiePrefix: rootPackageJson.name,
    useSecureCookies: env.NODE_ENV === 'production',
    database: {
      generateId: () => crypto.randomUUID(),
    },
    cookies: {
      sessionToken: {
        name: 'auth_token',
        attributes: {
          httpOnly: true, // Should be true for security
          sameSite: 'lax',
          path: '/',
        },
      },
    },
  },
  plugins: [
    // Removed customSession plugin - BetterAuth will handle session data
  ],
});

export type Session = typeof auth.$Infer.Session;
