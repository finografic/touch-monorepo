import { auth } from 'lib/auth';
import { createRouter } from 'lib/create-app';
import { APIError } from 'better-auth/api';

const router = createRouter();

router.get('/auth/session', async (context) => {
  try {
    const session = await auth.api.getSession({
      headers: context.req.raw.headers,
    });

    console.log('Better Auth session API result:', session);

    return context.json({
      user: session?.user || null,
      session: session?.session || null,
    });
  } catch (error) {
    // console.error('Session error:', error);
    // return context.json({ user: null, session: null });
    console.error('Session error:', error);
    if (error instanceof APIError) {
      return context.json({
        error: error.message,
        status: error.status,
      });
    }
    return context.json({ error: 'Authentication failed' }, 401);
  }
});

// Signout route
router.post('/auth/sign-out', async (context) => {
  try {
    // ✅ Use Better Auth's session API instead of handler
    const session = await auth.api.signOut({
      headers: context.req.raw.headers,
    });

    console.log('Better Auth session API result:', session);

    // ✅ Return the session data in the expected format
    // return context.json({
    //   success: session?.success || null,
    // });

    return context.json({ ...session });
  } catch (error) {
    console.error('Session error:', error);
    // return context.json({ success: false });
    if (error instanceof APIError) {
      return context.json({
        error: error.message,
        status: error.status,
      });
    }
    return context.json({ error: 'Authentication failed' }, 401);
  }
});

// ✅ Let BetterAuth handle ALL other auth routes
router.all('/auth/*', async (context) => {
  console.log('Better Auth route hit:', context.req.path);
  return auth.handler(context.req.raw);
});

export default router;
