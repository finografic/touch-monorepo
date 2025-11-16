# 🔐 Better Auth Setup Guide

📅 Oct 4, 2025

This document outlines the **PROPER** configuration for Better Auth in your Hono.js server, including the `betterAuth()` initialization, routing, and response formatting.

## 🎯 **Key Success Factors**

After extensive debugging, these are the **critical** elements that make Better Auth work correctly:

1. **`basePath: '/api/auth'`** - Must match Hono's route mounting
2. **`auth.api.getSession()`** for `/session` endpoint - NOT `auth.handler()`
3. **`httpOnly: true`** for session cookies - Security requirement
4. **Proper response conversion** from Better Auth's Response to Hono Response

---

## 1. `betterAuth()` Configuration (`apps/server/src/lib/auth.ts`)

The `betterAuth` instance should be configured as follows. Pay close attention to `basePath`, `session` cookie settings, and `debug` mode.

```typescript
import { betterAuth } from '@better-auth/hono';
import { drizzleAdapter } from '@better-auth/drizzle-adapter';
import { db } from 'db/db';
import { account, session, user, verification } from 'db/schemas/auth_session.schema';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'sqlite', // Or 'postgresql', 'mysql', etc.
    schema: { user, account, session, verification },
  }),

  // 🔥 CRITICAL: This must match the Hono route prefix
  // If Hono mounts at '/api' and router handles '/auth/*', then basePath = '/api/auth'
  basePath: '/api/auth',

  debug: true, // Set to `false` in production

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 32,
    sendResetPassword: async ({ user, url, token }, request) => {
      console.log('Reset password requested for:', user.email);
      console.log('Reset URL:', url, token, request);
      // TODO: Implement actual email sending for password reset
    },
  },

  emailVerification: {
    enabled: false, // Disable for development, enable and implement for production
    sendVerificationEmail: async ({ user, url, token }, request) => {
      console.log('Verification email requested for:', user.email);
      console.log('Verification URL:', url, token, request);
      // TODO: Implement actual email sending for email verification
    },
  },

  session: {
    cookie: {
      name: 'auth_token', // The name of your session cookie
      httpOnly: true, // 🔥 CRITICAL: Must be true for security
      sameSite: 'lax', // Recommended for most use cases
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      path: '/', // Cookie valid for all paths
      maxAge: 60 * 60 * 24 * 7, // 1 week
    },
  },

  // Add other plugins like JWT if you are using them
  // plugins: [jwtPlugin({ secret: 'YOUR_JWT_SECRET' })],
});
```

**🔥 Critical Configuration Points:**
- **`basePath: '/api/auth'`**: This MUST match how Hono mounts your auth routes
- **`session.cookie.httpOnly: true`**: Essential for security - prevents client-side access
- **`session.cookie.name: 'auth_token'`**: Must match what your client expects

---

## 2. Proper Routing (`apps/server/src/routes/auth/auth.routes.ts`)

Better Auth handles its own internal routing. The Hono router should pass requests to Better Auth's handler, but for the `/session` endpoint, we use `auth.api.getSession()` for direct access and proper response formatting.

```typescript
import { auth } from 'lib/auth';
import { createRouter } from 'lib/create-app';

const router = createRouter();

// 🔥 CRITICAL: Specific session endpoint using Better Auth API
// This is the KEY to making session refresh work properly
router.get('/auth/session', async (context) => {
  console.log('Session route hit:', context.req.path);
  try {
    // Use Better Auth's session API instead of handler for direct session retrieval
    const session = await auth.api.getSession({
      headers: context.req.header(), // Pass all request headers, including cookies
    });

    console.log('Better Auth session API result:', session);

    // Return the session data in the expected JSON format
    return context.json({
      user: session?.user || null,
      session: session?.session || null,
    });
  } catch (error) {
    console.error('Session error:', error);
    // Return a consistent error response
    return context.json({ user: null, session: null }, 500);
  }
});

// Let BetterAuth handle ALL other auth routes (e.g., /sign-in, /sign-up, /sign-out)
router.all('/auth/*', async (context) => {
  console.log('Auth route hit:', context.req.path);
  try {
    const response = await auth.handler(context.req.raw);
    console.log('Better Auth handler response:', response);

    // 🔥 CRITICAL: Convert Better Auth's standard Response object to Hono-compatible Response
    if (response instanceof Response) {
      const body = await response.text(); // Read the response body
      console.log('Better Auth handler response body:', body);

      return new Response(body, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      });
    }

    // If Better Auth returns something else (e.g., a direct JSON object), return it
    return response;
  } catch (error) {
    console.error('Better Auth handler error:', error);
    return context.json({ error: 'Authentication error' }, 500);
  }
});

export default router;
```

**🔥 Critical Routing Points:**
- **`/auth/session` specific route**: Use `auth.api.getSession()` NOT `auth.handler()`
- **Response conversion**: Always convert Better Auth's Response to Hono-compatible Response
- **Error handling**: Always return consistent JSON format for errors

---

## 3. Mounting Auth Routes in `app.ts`

Ensure your main Hono application (`apps/server/src/app.ts`) mounts the auth routes correctly under the `/api` prefix.

```typescript
// apps/server/src/app.ts (relevant snippet)
import authRoutes from 'routes/auth/auth.routes'; // Import your auth routes

// ... other imports and app setup ...

// Mount the auth routes under the API_BASE_PATH
app.route(envShared.API_BASE_PATH, authRoutes);

// ... other routes and app setup ...
```

**🔥 Critical Mounting Points:**
- **`envShared.API_BASE_PATH`**: Should be `/api`
- **Route mounting**: `app.route('/api', authRoutes)` makes routes accessible at `/api/auth/*`

---

## 4. Client-Side Initialization (`apps/client/src/App.tsx`)

On the client-side, ensure you are using the `AuthProviderWithInitialization` to automatically refresh the session on app startup.

```typescript
// apps/client/src/App.tsx (relevant snippet)
import { AuthProviderWithInitialization } from 'providers/AuthProvider';

// ... other imports ...

const AppBaseLayout = () => (
  <ErrorBoundary>
    <Global styles={cssGlobal} />
    <AppConfigProvider>
      {/* 🔥 CRITICAL: Use AuthProviderWithInitialization for automatic session refresh */}
      <AuthProviderWithInitialization>
        <SessionProvider>
          <ScreenClassProvider>
            <Suspense fallback={<Spinner size="3" />}>
              <Outlet />
            </Suspense>
          </ScreenClassProvider>
        </SessionProvider>
      </AuthProviderWithInitialization>
    </AppConfigProvider>
  </ErrorBoundary>
);
```

**🔥 Critical Client Points:**
- **`AuthProviderWithInitialization`**: Automatically calls `refreshSession()` on mount
- **Session refresh**: Resolves browser refresh authentication issues

---

## 5. Expected Response Formats

### Session Endpoint (`/api/auth/session`)

**No Active Session:**

```json
{
  "user": null,
  "session": null
}
```

**Active Session:**

```json
{
  "user": {
    "id": "71892e7b-64d0-4bb4-9241-0e7919adc560",
    "email": "admin@example.com",
    "name": "Admin User",
    "image": null,
    "emailVerified": false,
    "createdAt": "2025-10-03T21:06:57.000Z",
    "updatedAt": "2025-10-03T21:06:57.000Z"
  },
  "session": {
    "id": "session-id",
    "userId": "71892e7b-64d0-4bb4-9241-0e7919adc560",
    "expiresAt": "2025-10-10T21:06:57.000Z",
    "token": "session-token"
  }
}
```

---

## 6. Testing & Verification

After implementing this setup:

1. **Test Session Endpoint:**

   ```bash
   curl -v http://localhost:4040/api/auth/session
   # Should return: HTTP/1.1 200 OK with {"user":null,"session":null}
   ```

2. **Test with Cookie:**

   ```bash
   curl -v -H "Cookie: auth_token=YOUR_TOKEN" http://localhost:4040/api/auth/session
   # Should return user and session data if token is valid
   ```

3. **Test Browser Login:**
   - Login through browser
   - Refresh page
   - Authentication state should persist

---

## 7. Common Pitfalls & Solutions

### ❌ **What Doesn't Work:**

- Using `auth.handler()` for `/session` endpoint
- Setting `httpOnly: false` for session cookies
- Mismatched `basePath` between Better Auth and Hono routing
- Not converting Better Auth Response to Hono Response

### ✅ **What Works:**

- Using `auth.api.getSession()` for `/session` endpoint
- Setting `httpOnly: true` for session cookies
- Matching `basePath: '/api/auth'` with Hono route mounting
- Proper Response conversion with status, headers, and body

---

## 8. Debugging Tips

1. **Enable debug mode:** `debug: true` in `betterAuth()` config
2. **Add console logs:** Log `auth.api.getSession()` results
3. **Check server logs:** Look for Better Auth response details
4. **Use verbose curl:** `curl -v` to see full request/response headers
5. **Restart server:** Always restart after config changes

---

This setup ensures that:
- ✅ Better Auth is correctly initialized with the right `basePath` and secure cookie settings
- ✅ The Hono server correctly forwards requests to Better Auth's handler
- ✅ The `/api/auth/session` endpoint specifically uses `auth.api.getSession()` for accurate session retrieval
- ✅ Client-side `AuthProviderWithInitialization` automatically fetches the session on load
- ✅ Browser refresh maintains authentication state
- ✅ All authentication flows work seamlessly

**🎉 Success! Your authentication system is now properly configured!**
