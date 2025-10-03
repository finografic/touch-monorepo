import { auth } from 'lib/auth';
import { createRouter } from 'lib/create-app';

const router = createRouter();

// Specific session endpoint using Better Auth API
router.get('/auth/session', async (context) => {
  console.log('Session route hit:', context.req.path);
  try {
    // Use Better Auth's session API instead of handler
    const session = await auth.api.getSession({
      headers: context.req.header(),
    });

    console.log('Better Auth session API result:', session);

    // Return the session data in the expected format
    return context.json({
      user: session?.user || null,
      session: session?.session || null,
    });
  } catch (error) {
    console.error('Session error:', error);
    return context.json({ user: null, session: null });
  }
});

// Let BetterAuth handle ALL other auth routes
router.all('/auth/*', async (context) => {
  console.log('Auth route hit:', context.req.path);
  return auth.handler(context.req.raw);
});

export default router;
