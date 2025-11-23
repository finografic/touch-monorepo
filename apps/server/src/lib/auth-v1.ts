import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin } from 'better-auth/plugins';
import { env } from 'env.server';

import { db } from 'db';
import { account, session, user, verification } from '../db/schemas';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'sqlite',
    schema: { user, account, session, verification },
  }),
  basePath: '/api/auth', // Full path including /api prefix from Hono mounting
  debug: true,
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 4, // Set to 4 for 4-digit PIN support
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
    cookieName: env.COOKIES.DATA_COOKIE, // auth_suffix
    cookieCache: {
      enabled: true, // Enable cookie cache for performance (reduces DB lookups)
      maxAge: 5 * 60, // 5 minutes - short-lived for security
    },
  },
  advanced: {
    cookiePrefix: env.COOKIES.COOKIE_PREFIX, // "touch-monorepo" -> cookies named "touch-monorepo.session_token"
    useSecureCookies: env.NODE_ENV === 'production',
    database: {
      generateId: () => crypto.randomUUID(),
    },
    // CORS configuration for cross-origin requests (dev: localhost:3000 -> localhost:4040)
    cors: {
      enabled: true,
      allowedOrigins: [
        env.CLIENT_ORIGIN,
        ...(env.NODE_ENV === 'production' ? [env.CLIENT_ORIGIN, 'https://your-production-domain.com'] : []),
      ],
      credentials: true, // Required for cookie-based authentication
    },
    cookies: {
      sessionToken: {
        name: env.COOKIES.TOKEN_COOKIE, // auth_token - Combined with cookiePrefix -> "touch-monorepo.session_token"
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
