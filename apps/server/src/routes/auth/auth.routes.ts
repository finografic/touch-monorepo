import { auth } from 'lib/auth';
import { createRouter } from 'lib/create-app';

const router = createRouter();

// ============================================
// Explicit Auth Routes (Required for Hono routing)
// ============================================

/**
 * Get current session
 * Uses BetterAuth API instead of handler for better control
 */
router.get('/auth/session', async (context) => {
  try {
    const session = await auth.api.getSession({
      headers: context.req.raw.headers,
    });

    return context.json({
      user: session?.user || null,
      session: session?.session || null,
    });
  } catch (error) {
    console.error('Session error:', error);
    return context.json({ user: null, session: null });
  }
});

/**
 * Sign out current user
 * Uses BetterAuth API for session invalidation
 */
router.post('/auth/sign-out', async (context) => {
  try {
    const result = await auth.api.signOut({
      headers: context.req.raw.headers,
    });

    return context.json(result);
  } catch (error) {
    console.error('Sign out error:', error);
    return context.json({ error: 'Sign out failed' }, 500);
  }
});

// ============================================
// BetterAuth Handler for other routes
// ============================================

/**
 * Catch-all for remaining BetterAuth endpoints:
 * - POST /auth/sign-in/email
 * - POST /auth/sign-up/email
 * - POST /auth/reset-password
 * - POST /auth/verify-email
 * - etc.
 */
router.all('/auth/*', async (context) => {
  return auth.handler(context.req.raw);
});

export default router;
