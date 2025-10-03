import { auth } from 'lib/auth';
import { createRouter } from 'lib/create-app';

const router = createRouter();

// Specific session endpoint using Better Auth
router.get('/auth/session', async (context) => {
  console.log('Session route hit:', context.req.path);
  try {
    const response = await auth.handler(context.req.raw);
    console.log('Better Auth response:', response);

    if (response instanceof Response) {
      const body = await response.text();
      console.log('Better Auth response body:', body);

      return new Response(body, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      });
    }

    return response;
  } catch (error) {
    console.error('Session error:', error);
    return context.json({ user: null, session: null });
  }
});

// Let BetterAuth handle specific auth routes only
router.all('/auth/*', async (context) => {
  console.log('Auth route hit:', context.req.path);
  return auth.handler(context.req.raw);
});

export default router;
