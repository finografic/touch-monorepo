import { auth } from 'lib/auth';
import { createRouter } from 'lib/create-app';

const router = createRouter();

router.get('/auth/session', async (context) => {
  try {
    // ✅ Use Better Auth's session API instead of handler
    const session = await auth.api.getSession({
      // headers: context.req.header(),
      headers: context.req.raw.headers,
    });

    console.log('Better Auth session API result:', session);

    // ✅ Return the session data in the expected format
    return context.json({
      user: session?.user || null,
      session: session?.session || null,
    });
  } catch (error) {
    console.error('Session error:', error);
    return context.json({ user: null, session: null });
  }
});

// ✅ Let BetterAuth handle ALL other auth routes
router.all('/auth/*', async (context) => {
  console.log('Better Auth route hit:', context.req.path);
  return auth.handler(context.req.raw);
});

export default router;
