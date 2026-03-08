import { authHandler } from '@hono/auth-js';
import { eq } from 'drizzle-orm';
import { StatusCodes as HttpStatusCodes } from 'http-status-codes';
import { env } from 'env.server';

import { db } from 'db';
import { user } from '../../db/schemas';
import { createRouter } from 'lib/create-app';
import { hashPassword } from 'utils/password.utils';

const { COOKIES, COOKIE_DELETE_ATTRIBUTES } = env;

const router = createRouter();

// ======================================================
// Custom: Sign Up (Auth.js doesn't handle registration)
// ======================================================

router.post('/auth/sign-up', async (c) => {
  try {
    const { email, password, name } = await c.req.json<{
      email: string;
      password: string;
      name: string;
    }>();

    if (!email || !password || !name) {
      return c.json({ error: 'Email, password, and name are required' }, HttpStatusCodes.BAD_REQUEST);
    }

    if (password.length < 4 || password.length > 32) {
      return c.json({ error: 'Password must be 4–32 characters' }, HttpStatusCodes.BAD_REQUEST);
    }

    const [existing] = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.email, email))
      .limit(1);

    if (existing) {
      return c.json({ error: 'Email already registered' }, HttpStatusCodes.CONFLICT);
    }

    const hashedPassword = await hashPassword(password);
    const now = new Date();

    const [created] = await db
      .insert(user)
      .values({
        name,
        email,
        hashedPassword,
        emailVerified: false,
        role: 'user',
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return c.json({
      user: {
        id: created.id,
        name: created.name,
        email: created.email,
        role: created.role,
      },
    }, HttpStatusCodes.CREATED);
  } catch (error) {
    console.error('Sign-up error:', error);
    return c.json({ error: 'Registration failed' }, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
});

// ======================================================
// Custom: Nuclear cookie clear (debugging/dev tool)
// ======================================================

router.post('/auth/clear-all-cookies', async (c) => {
  const response = c.json({ success: true, message: 'All cookies cleared' });

  const allPossibleCookieNames = [
    COOKIES.TOKEN_COOKIE,
    COOKIES.DATA_COOKIE,
    `__Secure-${COOKIES.TOKEN_COOKIE}`,
    `__Secure-${COOKIES.DATA_COOKIE}`,
    `__Host-${COOKIES.TOKEN_COOKIE}`,
    `__Host-${COOKIES.DATA_COOKIE}`,
    `${COOKIES.COOKIE_PREFIX}.auth_token`,
    `${COOKIES.COOKIE_PREFIX}.session`,
  ];

  const deletionAttributes = [
    COOKIE_DELETE_ATTRIBUTES,
    'Max-Age=0; Path=/; HttpOnly; SameSite=Lax',
    'Max-Age=0; Path=/; HttpOnly; SameSite=None; Secure',
  ];

  allPossibleCookieNames.forEach((cookieName) => {
    deletionAttributes.forEach((attrs) => {
      response.headers.append('Set-Cookie', `${cookieName}=; ${attrs}`);
    });
  });

  return response;
});

// ======================================================
// Auth.js handler — catches all standard auth routes:
//   GET  /auth/session
//   GET  /auth/csrf
//   GET  /auth/providers
//   GET  /auth/signin
//   POST /auth/signin/:provider
//   POST /auth/callback/:provider
//   POST /auth/signout
// ======================================================

router.use('/auth/*', authHandler());

export default router;
