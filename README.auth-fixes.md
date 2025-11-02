# Better Auth Configuration Fix

## Problem

The auth session endpoint was returning `404 Not Found` when the client attempted to fetch the session:

```
GET /api/get-session → 404 Not Found
```

## Root Cause

**Path Mismatch between Client and Server**

The issue stemmed from how Better Auth generates routes and how they're mounted in Hono:

1. **Server Side** (`apps/server/src/lib/auth.ts`):
   - Better Auth was configured with `basePath: '/auth'`
   - Auth routes were mounted at `/api` via Hono in `app.ts`
   - Final server paths: `/api/auth/session`, `/api/auth/sign-in/email`, etc.

2. **Client Side** (`apps/client/src/lib/auth-client.ts`):
   - Used `baseURL: process.env.API_URL` which equals `http://localhost:4040/api`
   - Better Auth client was generating paths like `/get-session` instead of `/auth/session`
   - Final client requests: `/api/get-session` ❌

## Solution

### 1. Update Server `basePath` to Include Full Path

**File:** `apps/server/src/lib/auth.ts`

```typescript
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'sqlite',
    schema: { user, account, session, verification },
  }),
  basePath: '/api/auth', // ✅ Full path including /api prefix from Hono mounting
  debug: true,
  // ... rest of config
});
```

**Before:** `basePath: '/auth'`
**After:** `basePath: '/api/auth'`

### 2. Update Client `baseURL` to Use Base Server URL

**File:** `apps/client/src/lib/auth-client.ts`

```typescript
import { createAuthClient } from 'better-auth/client';
import { adminClient } from 'better-auth/client/plugins';

// Use API_BASE_URL (http://localhost:4040) instead of API_URL (http://localhost:4040/api)
// because Better Auth adds /auth path itself based on server's basePath config
export const authClient = createAuthClient({
  baseURL: process.env.API_BASE_URL, // ✅ Without /api suffix
  plugins: [adminClient()],
});
```

**Before:** `baseURL: process.env.API_URL` (`http://localhost:4040/api`)
**After:** `baseURL: process.env.API_BASE_URL` (`http://localhost:4040`)

## How It Works

### Better Auth Path Resolution

Better Auth client and server coordinate paths through the `basePath` configuration:

1. **Server defines** `basePath: '/api/auth'`
2. **Client queries** the server for available endpoints
3. **Client generates** full URLs by combining `baseURL` + `basePath`:
   - `http://localhost:4040` + `/api/auth/session` = `http://localhost:4040/api/auth/session` ✅

### Environment Variables

From `env.shared.ts`:

```typescript
{
  API_URL: `${API_PROTOCOL}://${API_HOST}:${API_PORT}${API_BASE_PATH}`,
  // Example: "http://localhost:4040/api"

  API_BASE_URL: `${API_PROTOCOL}://${API_HOST}:${API_PORT}`,
  // Example: "http://localhost:4040"
}
```

- **`API_URL`**: Used for REST API calls (axios, fetch) → includes `/api` prefix
- **`API_BASE_URL`**: Used for Better Auth client → excludes `/api` prefix

## Final Configuration

### Server Routes (Hono)

All routes in `app.ts` are mounted at `/api`:

```typescript
routes.forEach((route) => {
  app.route(envShared.API_BASE_PATH, route); // /api
});
```

### Auth Endpoints

| Endpoint | Route Definition | Final URL |
|----------|-----------------|-----------|
| Get Session | `router.get('/auth/session', ...)` | `GET /api/auth/session` |
| Sign Out | `router.post('/auth/sign-out', ...)` | `POST /api/auth/sign-out` |
| Sign In | `router.all('/auth/*', ...)` | `POST /api/auth/sign-in/email` |
| Sign Up | `router.all('/auth/*', ...)` | `POST /api/auth/sign-up/email` |

### Client Requests

Better Auth client now correctly generates:

```typescript
authClient.getSession()      → GET  http://localhost:4040/api/auth/session
authClient.signIn.email()    → POST http://localhost:4040/api/auth/sign-in/email
authClient.signUp.email()    → POST http://localhost:4040/api/auth/sign-up/email
authClient.signOut()         → POST http://localhost:4040/api/auth/sign-out
```

## Verification

Test the session endpoint:

```bash
# Should return user session or null
curl -s http://localhost:4040/api/auth/session

# Expected response:
# {"user":null,"session":null}
# or
# {"user":{...},"session":{...}}
```

## Key Takeaways

1. **Better Auth `basePath` must include the full routing path**, including any prefixes added by your HTTP framework (Hono, Express, etc.)

2. **Better Auth client `baseURL` should be the base server URL** without any API prefixes, as the client will append the server's `basePath` automatically.

3. **Use `API_BASE_URL` for Better Auth, `API_URL` for REST APIs** to maintain correct path resolution.

## Comparison with Working Version

The working version (`touch-monorepo_MASTER_SESSION`) already had this configuration:

```typescript
// Server
basePath: '/api/auth'

// Client
baseURL: `${env.API_PROTOCOL}://${env.API_HOST}:${env.API_PORT}`
```

This fix aligns the current project with the working configuration pattern.

