import { env } from 'env.server';

import { auth } from 'lib/auth';
import { createRouter } from 'lib/create-app';

const { COOKIES, COOKIE_DELETE_ATTRIBUTES } = env;

const router = createRouter();

// ======================================================
// Explicit Auth Routes (Required for Hono routing)
// ======================================================

/**
 * Get current session
 * Uses BetterAuth API instead of handler for better control
 */
router.get('/auth/session', async (context) => {
  try {
    const session = await auth.api.getSession({
      headers: context.req.raw.headers,
    });

    if (process.env.NODE_ENV === 'development') {
      console.log('🔐 Session check:', {
        hasUser: !!session?.user,
        userId: (session?.user as any)?.id,
        sessionId: (session?.session as any)?.id,
      });
    }

    return context.json({
      user: session?.user || null,
      session: session?.session || null,
    });
  } catch (error) {
    console.error('❌ Session error:', error);
    return context.json({ user: null, session: null });
  }
});

/**
 * NOTE: The Two Cookies
 *
 * touch-monorepo.session_token
 * - The actual authentication JWT token
 * - Long-lived (30 days in your config)
 * - Used for authentication
 * - HttpOnly, Secure (in production)
 *
 * touch-monorepo.session_data
 * - Cached session data (user info, roles, etc.)
 * - Short-lived (5 minutes in your config)
 * - Reduces database lookups for better performance
 * - Automatically refreshed when expired
 */

/**
 * Sign out current user
 * Uses BetterAuth API for session invalidation + explicit cookie deletion
 */
router.post('/auth/sign-out', async (context) => {
  try {
    const result = await auth.api.signOut({
      headers: context.req.raw.headers,
    });

    if (process.env.NODE_ENV === 'development') {
      console.log('🔐 Sign out successful:', result);
    }

    // Create response with explicit cookie deletion
    const response = context.json(result);

    // Delete ALL Better Auth cookie variations (including __Secure- and __Host- prefixes)
    const cookieNamesToDelete = [
      COOKIES.TOKEN_COOKIE,
      COOKIES.DATA_COOKIE,
      `__Secure-${COOKIES.TOKEN_COOKIE}`,
      `__Secure-${COOKIES.DATA_COOKIE}`,
      `__Host-${COOKIES.TOKEN_COOKIE}`,
      `__Host-${COOKIES.DATA_COOKIE}`,
    ];

    // Delete each cookie variation
    cookieNamesToDelete.forEach((cookieName) => {
      response.headers.append('Set-Cookie', `${cookieName}=; ${COOKIE_DELETE_ATTRIBUTES}`);
    });

    if (process.env.NODE_ENV === 'development') {
      console.log('🍪 Deleted cookies:', cookieNamesToDelete);
    }

    return response;
  } catch (error) {
    console.error('❌ Sign out error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      error,
    });

    // Even on error, try to clear all cookie variations
    const response = context.json({ error: 'Sign out failed' }, 500);

    const cookieNamesToDelete = [
      COOKIES.TOKEN_COOKIE,
      COOKIES.DATA_COOKIE,
      `__Secure-${COOKIES.TOKEN_COOKIE}`,
      `__Secure-${COOKIES.DATA_COOKIE}`,
      `__Host-${COOKIES.TOKEN_COOKIE}`,
      `__Host-${COOKIES.DATA_COOKIE}`,
    ];

    cookieNamesToDelete.forEach((cookieName) => {
      response.headers.append('Set-Cookie', `${cookieName}=; ${COOKIE_DELETE_ATTRIBUTES}`);
    });

    return response;
  }
});

/**
 * Nuclear option: Delete ALL cookies
 * Use this endpoint when sign-out fails or cookies persist
 * This is a safety net for development/debugging
 */
router.post('/auth/clear-all-cookies', async (context) => {
  console.log('🧨 [NUCLEAR] Clearing all authentication cookies...');

  const response = context.json({ success: true, message: 'All cookies cleared' });

  // Every possible cookie name variation
  const allPossibleCookieNames = [
    // Standard names
    COOKIES.TOKEN_COOKIE,
    COOKIES.DATA_COOKIE,
    // With __Secure- prefix
    `__Secure-${COOKIES.TOKEN_COOKIE}`,
    `__Secure-${COOKIES.DATA_COOKIE}`,
    // With __Host- prefix
    `__Host-${COOKIES.TOKEN_COOKIE}`,
    `__Host-${COOKIES.DATA_COOKIE}`,
    // Legacy/alternative names
    `${COOKIES.COOKIE_PREFIX}.auth_token`,
    `${COOKIES.COOKIE_PREFIX}.session`,
    `__Secure-${COOKIES.COOKIE_PREFIX}.auth_token`,
    `__Secure-${COOKIES.COOKIE_PREFIX}.session`,
  ];

  // Delete with all possible attribute combinations
  const deletionAttributes = [
    COOKIE_DELETE_ATTRIBUTES,
    'Max-Age=0; Path=/; HttpOnly; SameSite=Lax',
    'Max-Age=0; Path=/; HttpOnly; SameSite=None; Secure',
    'Max-Age=0; Path=/; HttpOnly; SameSite=Strict; Secure',
  ];

  allPossibleCookieNames.forEach((cookieName) => {
    deletionAttributes.forEach((attrs) => {
      response.headers.append('Set-Cookie', `${cookieName}=; ${attrs}`);
    });
  });

  console.log(
    `🧨 [NUCLEAR] Attempted to delete ${allPossibleCookieNames.length * deletionAttributes.length} cookie variations`,
  );

  return response;
});

// ============================================
// BetterAuth Handler for other routes
// ============================================

/**
 * Catch-all for remaining BetterAuth endpoints:
 * - POST /auth/sign-in/email (mounted at /api/auth/sign-in/email)
 * - POST /auth/sign-up/email (mounted at /api/auth/sign-up/email)
 * - POST /auth/reset-password (mounted at /api/auth/reset-password)
 * - POST /auth/verify-email (mounted at /api/auth/verify-email)
 * - etc.
 */
router.all('/auth/*', async (context) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('🔐 BetterAuth handler:', context.req.method, context.req.path);
  }

  try {
    const response = await auth.handler(context.req.raw);

    if (process.env.NODE_ENV === 'development') {
      console.log('✅ BetterAuth response:', {
        status: response.status,
        statusText: response.statusText,
      });
    }

    return response;
  } catch (error) {
    console.error('❌ BetterAuth handler error:', {
      path: context.req.path,
      method: context.req.method,
      message: error instanceof Error ? error.message : 'Unknown error',
      error,
    });
    return context.json({ error: 'Authentication error' }, 500);
  }
});

export default router;
