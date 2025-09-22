import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { customSession } from 'better-auth/plugins';
import { db } from 'db';
import { account, session, user, verification } from '../db/schemas';
import { env } from '../env.server';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'sqlite',
    schema: { user, account, session, verification },
  }),
  basePath: '/api/auth',
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
  // onRequest: (req: Request) => {
  //   console.log('3 - Better-auth received request:', {
  //     url: req.url,
  //     method: req.method,
  //     headers: Object.fromEntries(req.headers),
  //     path: new URL(req.url).pathname,
  //   });
  // },
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
    cookiePrefix: 'iox',
    useSecureCookies: env.NODE_ENV === 'production',
    generateId: () => crypto.randomUUID(),
    cookies: {
      session_token: {
        name: 'auth_token',
        attributes: {
          httpOnly: false, // Allow client-side access for JWT
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
