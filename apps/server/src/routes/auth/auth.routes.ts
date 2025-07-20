import { envShared } from '@workspace/config/envShared';
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

// Session route
router.get('/auth/session', async (context) => {
  console.log('Session route hit:', context.req.path);
  return auth.handler(context.req.raw);
});

// Signout route
router.post('/auth/signout', async (context) => {
  console.log('Signout route hit:', context.req.path);
  return auth.handler(context.req.raw);
});

// Signin route (BetterAuth internal)
router.post('/auth/signin', async (context) => {
  console.log('Signin route hit:', context.req.path);
  return auth.handler(context.req.raw);
});

// Verify route
router.post('/auth/verify', async (context) => {
  console.log('Verify route hit:', context.req.path);
  return auth.handler(context.req.raw);
});

// Reset password route
router.post('/auth/reset-password', async (context) => {
  console.log('Reset password route hit:', context.req.path);
  return auth.handler(context.req.raw);
});

export default router;
