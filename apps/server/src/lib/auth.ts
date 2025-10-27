import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin } from 'better-auth/plugins';
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
      enabled: true, // Enable cookie cache for performance (reduces DB lookups)
      maxAge: 5 * 60, // 5 minutes - short-lived for security
    },
  },
  advanced: {
    cookiePrefix: rootPackageJson.name, // "touch-monorepo" -> cookies named "touch-monorepo.session_token"
    useSecureCookies: env.NODE_ENV === 'production',
    database: {
      generateId: () => crypto.randomUUID(),
    },
    // CORS configuration for cross-origin requests (dev: localhost:3000 -> localhost:4040)
    cors: {
      enabled: true,
      allowedOrigins: [
        'http://localhost:3000', // Vite dev server
        ...(env.NODE_ENV === 'production'
          ? ['http://localhost:3000', 'https://your-production-domain.com']
          : []),
      ],
      credentials: true, // Required for cookie-based authentication
    },
    // Cookie configuration
    cookies: {
      sessionToken: {
        name: 'auth_token', // Combined with cookiePrefix -> "touch-monorepo.session_token"
        attributes: {
          httpOnly: true, // Prevent JavaScript access (XSS protection)
          sameSite: env.NODE_ENV === 'production' ? 'lax' : 'lax', // Use 'lax' for consistency
          secure: env.NODE_ENV === 'production', // HTTPS only in production
          path: '/', // Available across entire domain
        },
      },
    },
  },
  plugins: [
    admin({
      defaultRole: 'user',
      adminRoles: ['admin'],
    }),
  ],
});

export type Session = typeof auth.$Infer.Session;
