import { auth } from 'lib/auth';
import { createRouter } from 'lib/create-app';

const router = createRouter();

// Let BetterAuth handle all auth routes
router.all('/*', async (context) => {
  console.log('Auth route hit:', context.req.path);
  return auth.handler(context.req.raw);
});

export default router;
