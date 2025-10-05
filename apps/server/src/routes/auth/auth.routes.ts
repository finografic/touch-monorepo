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

    // Explicitly delete the session cookie
    // This ensures the browser removes it even if BetterAuth's Set-Cookie doesn't work
    response.headers.set(
      'Set-Cookie',
      'touch-monorepo.session_token=; Max-Age=0; Path=/; HttpOnly; SameSite=None; Secure',
    );

    return response;
  } catch (error) {
    console.error('❌ Sign out error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      error,
    });

    // Even on error, try to clear the cookie
    const response = context.json({ error: 'Sign out failed' }, 500);
    response.headers.set(
      'Set-Cookie',
      'touch-monorepo.session_token=; Max-Age=0; Path=/; HttpOnly; SameSite=None; Secure',
    );

    return response;
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
