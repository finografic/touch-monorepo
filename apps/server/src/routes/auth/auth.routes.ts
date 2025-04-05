import { envShared } from '@fino/config/envShared';
import { APIError } from 'better-auth/api';
import { auth } from 'lib/auth';
import { createRouter } from 'lib/create-app';

const router = createRouter();

// Login route
router.post('/auth/login', async (c) => {
  try {
    const body = await c.req.json();
    const result = await auth.api.signInEmail({
      body: {
        email: body.email,
        password: body.password,
      },
    });
    return c.json(result);
  } catch (error) {
    console.error('Auth error:', error);
    if (error instanceof APIError) {
      return c.json({
        error: error.message,
        status: error.status,
      });
    }
    return c.json({ error: 'Authentication failed' }, 401);
  }
});

// Signup route
router.post('/auth/signup', async (c) => {
  try {
    const body = await c.req.json();
    const result = await auth.api.signUpEmail({
      body: {
        email: body.email,
        password: body.password,
        name: body.name,
      },
    });
    return c.json(result);
  } catch (error) {
    console.error('Signup error:', error);
    if (error instanceof APIError) {
      return c.json({
        error: error.message,
        status: error.status,
      });
    }
    return c.json({ error: 'Registration failed' }, 400);
  }
});

// Other auth routes
router.on(['GET', 'POST'], '/auth/*', async (c) => {
  if (c.req.path === `${envShared.API_BASE_PATH}/auth/login`) return;
  console.log('Other auth route hit:', c.req.path);

  return auth.handler(c.req.raw);
});

export default router;
