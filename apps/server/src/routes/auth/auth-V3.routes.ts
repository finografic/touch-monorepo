import { auth } from 'lib/auth';
import { createRouter } from 'lib/create-app';

const router = createRouter();

// Let BetterAuth handle ALL auth routes including session
router.all('/auth/*', async (context) => {
  console.log('Auth route hit:', context.req.path);

  try {
    // Create a new request with the path stripped to what Better Auth expects
    const originalUrl = new URL(context.req.url);
    const pathWithoutPrefix = originalUrl.pathname.replace('/api/auth', '/auth');
    const modifiedUrl = `${originalUrl.protocol}//${originalUrl.host}${pathWithoutPrefix}${originalUrl.search}`;

    console.log('Original URL:', context.req.url);
    console.log('Modified URL for Better Auth:', modifiedUrl);

    // Create a new request with the modified URL
    const modifiedRequest = new Request(modifiedUrl, {
      method: context.req.method,
      headers: context.req.header(),
      body: context.req.method !== 'GET' ? await context.req.text() : undefined,
    });

    const response = await auth.handler(modifiedRequest);
    console.log('Better Auth response:', response);

    // Convert Better Auth Response to Hono response
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
    console.error('Better Auth error:', error);
    return context.json({ error: 'Authentication error' }, 500);
  }
});

export default router;
