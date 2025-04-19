import { envShared } from '@fino/config/envShared';
import { APIError } from 'better-auth/api';
import { auth } from 'lib/auth';
import { createRouter } from 'lib/create-app';

const router = createRouter();

// Login route
router.post('/auth/login', async (context) => {
  try {
    const body = await context.req.json();
    const result = await auth.api.signInEmail({
      body: {
        email: body.email,
        password: body.password,
      },
    });
    return context.json(result);
  } catch (error) {
    console.error('Auth error:', error);
    if (error instanceof APIError) {
      return context.json({
        error: error.message,
        status: error.status,
      });
    }
    return context.json({ error: 'Authentication failed' }, 401);
  }
});

// Signup route
router.post('/auth/signup', async (context) => {
  try {
    const body = await context.req.json();
    const result = await auth.api.signUpEmail({
      body: {
        email: body.email,
        password: body.password,
        name: body.name,
      },
    });
    return context.json(result);
  } catch (error) {
    console.error('Signup error:', error);
    if (error instanceof APIError) {
      return context.json({
        error: error.message,
        status: error.status,
      });
    }
    return context.json({ error: 'Registration failed' }, 400);
  }
});

// Other auth routes
router.on(['GET', 'POST'], '/auth/*', async (context) => {
  if (context.req.path === `${envShared.API_BASE_PATH}/auth/login`) return;
  console.log('Other auth route hit:', context.req.path);

  return auth.handler(context.req.raw);
});

export default router;
