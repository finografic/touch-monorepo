# 🔄 Migration Plan: BetterAuth + Zod → Auth.js + Valibot

> **Created:** 2026-03-01
> **Status:** Planning
> **Monorepo:** Touch Dashboard / CMS
> **Risk Level:** Low (personal hobby project, no production users)

---

## Why We're Doing This

### The BetterAuth + Zod Problem

BetterAuth is stuck in a two-way Zod compatibility trap that has persisted for over a year:

- **BetterAuth 1.3+** migrated internally to `import * as z from 'zod/v4'` (Zod's subpath versioning).
- **If you stay on Zod 3:** BetterAuth 1.3.10+ breaks — `z.coerce.b... is not a function` errors because BA internals now call Zod 4 APIs.
- **If you upgrade to Zod 4:** The `zod/v4` subpath imports conflict with other packages that import from `"zod"` directly, causing bundler confusion (especially with pnpm strict hoisting + Vite/Rollup). Production errors like `Class2 is not a constructor`.
- **The CLI is also broken:** `@better-auth/cli` fails with `Package subpath './v4' is not defined by "exports"` depending on which Zod version gets hoisted.

**Result:** We're pinned at `better-auth@1.3.6` + `zod@^3.25.76`. Can't upgrade either. This blocks the entire dependency upgrade chain: BetterAuth → Zod → drizzle-zod → @hono/zod-openapi → @hono/zod-validator.

### 2.1 What Auth.js Provides

- Official Hono adapter: `@hono/auth-js`
- Drizzle adapter with SQLite support (uses `better-sqlite3` driver)
- React client: `SessionProvider` + `useSession` from `@hono/auth-js/react`
- 50+ OAuth providers via `@auth/core/providers`
- JWT or database session strategy
- No Zod dependency — uses its own internal validation

### 2.2 Key Differences from BetterAuth

| Concept | BetterAuth | Auth.js |
|---------|-----------|---------|
| Server setup | `betterAuth({...})` returns handler | `initAuthConfig()` + `authHandler()` middleware |
| Session access | `auth.api.getSession({ headers })` | `c.get('authUser')` via `verifyAuth()` middleware |
| Client hooks | `createAuthClient()` custom client | `SessionProvider` + `useSession` (React standard) |
| DB schema | BA-specific tables (user, session, account, verification) | Auth.js-specific tables (user, session, account, verificationToken) — different column names |
| Plugin system | BA plugins (`better-auth/plugins`) | Auth.js providers + callbacks + events |
| Email/password | Built-in via `emailAndPassword: { enabled: true }` | Via `CredentialsProvider` — more manual but more flexible |

### 2.3 Migration Steps — Ordered

- [ ] **Install Auth.js packages:** `pnpm add @hono/auth-js @auth/core @auth/drizzle-adapter`
- [ ] **Create new Drizzle schema for Auth.js tables**
  - Auth.js expects: `user`, `account`, `session`, `verificationToken` tables
  - Column names differ from BetterAuth — refer to `@auth/drizzle-adapter` SQLite docs
  - Create a migration that transforms existing BA tables → Auth.js tables
  - ⚠️ **Back up your SQLite database before running migration**
- [ ] **Write data migration script**
  - Map existing BetterAuth user records to Auth.js user table
  - Map session records (different column schema)
  - Map account/OAuth records
  - Handle password hashes — verify hash algorithm compatibility (BA uses Argon2/bcrypt, Auth.js `CredentialsProvider` lets you bring your own)
- [ ] **Configure Auth.js server**

  ```ts
  // Approximate shape — adapt to your actual Hono app structure
  import { initAuthConfig, authHandler, verifyAuth } from '@hono/auth-js';
  import { DrizzleAdapter } from '@hono/auth-js';

  app.use('*', initAuthConfig((c) => ({
    adapter: DrizzleAdapter(db, { /* table mappings */ }),
    secret: c.env.AUTH_SECRET,
    providers: [ /* your providers */ ],
    session: { strategy: 'jwt' }, // or 'database'
  })));

  app.use('/api/auth/*', authHandler());
  app.use('/api/*', verifyAuth());
  ```

- [ ] **Update session middleware**
  - BetterAuth: `auth.api.getSession({ headers: c.req.raw.headers })`
  - Auth.js: `c.get('authUser')` after `verifyAuth()` middleware
  - Update all route handlers that access the session
- [ ] **Update React client**
  - Remove BetterAuth client: `createAuthClient()` and related hooks
  - Add Auth.js React provider:

    ```tsx
    import { SessionProvider, useSession } from '@hono/auth-js/react';
    ```

  - Replace all session-consuming components
- [ ] **Update login/signup forms**
  - Auth.js handles OAuth redirects via `/api/auth/signin`
  - For email/password: implement `CredentialsProvider` with your existing password verification logic
  - Update form actions to use Auth.js `signIn()` / `signOut()` client methods
- [ ] **Remove BetterAuth:** `pnpm remove better-auth better-call`
- [ ] **Test all auth flows**
  - [ ] Email/password login
  - [ ] Session persistence
  - [ ] Session expiry / refresh
  - [ ] Protected route access
  - [ ] Logout
  - [ ] Any OAuth providers you use
- [ ] **Verify no BetterAuth remnants:** `grep -r "better-auth" --include="*.ts" --include="*.tsx"`

---

## Risk Notes

- **Database migration is the highest-risk step.** BetterAuth and Auth.js use different table schemas. Back up your SQLite DB before running any migration scripts. Write the migration as a reversible script.
- **Password hash compatibility.** Verify that Auth.js `CredentialsProvider` can verify passwords hashed by BetterAuth. Both typically support bcrypt/Argon2, but the stored format may differ.
- **OpenAPI generation.** `@hono/zod-openapi` is tightly coupled to Zod. If you rely on auto-generated OpenAPI docs from your Hono routes, research `hono-openapi` Valibot support before removing Zod entirely. This may be the last piece to migrate.
- **`@scalar/hono-api-reference`** — check if this works independently of the Zod OpenAPI integration, or if it's coupled to it.
- **Session strategy.** BetterAuth defaults to database sessions. Auth.js defaults to JWT. Decide which strategy you want and configure explicitly — don't accidentally change session behavior during migration.

---

## Portfolio Value

This migration demonstrates:

- **Dependency triage skills** — identifying when a library's upstream issues justify switching, not just working around
- **Standard Schema understanding** — using the interop spec, not just swapping one library for another
- **Auth architecture knowledge** — migrating between auth systems while preserving user data and session continuity
- **Monorepo dependency management** — resolving cascading version conflicts across workspace packages

---

**In Summary**

- Set up `@hono/auth-js` + `@auth/drizzle-adapter`
- Create new Drizzle schema for Auth.js tables
- Write data migration script (users, sessions, accounts) + back up SQLite DB
- Verify password hash compatibility
- Swap client hooks (`createAuthClient()` → `SessionProvider` + `useSession`)
- Update login/signup forms
- Remove BetterAuth
