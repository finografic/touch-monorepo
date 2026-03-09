# Possible TODOs

Observations and recommendations from the BetterAuth → Auth.js + Zod → Valibot migration.

---

## Legend

- ✅ Done
- 🔴 Do it — clear bug or security issue
- 🟡 Do it — worthwhile cleanup, low effort
- 🔵 Do it later — good idea, higher effort / separate concern
- ⚪ Skip — marginal benefit, or style preference

---

## 1. Improve `auth-client.ts`

### ⚪ Use the shared `api` fetch client instead of raw `fetch`

`auth-client.ts` uses raw `fetch()` with manual `credentials: 'include'` everywhere. The `signIn` flow **must** stay on raw `fetch` — it uses `x-www-form-urlencoded` + `redirect: 'manual'` which the `api` client doesn't support. `getSession` and `signUp` are plain JSON and could use `api`, but the surface area is small enough that the consistency of "auth-client always uses raw fetch" is worth more than the refactor. Skip.

### ✅ Cache the CSRF token

- [x] Module-level cache with 30s TTL added to `auth-client.ts`. Cache is invalidated on `signOut`. One fewer round-trip per auth action.

### ✅ Remove dead `AuthSessionData` fields (`redirect`, `token`)

- [x] `AuthContext.ts` constructs `{ user, redirect: false, token: '' }` in three places (lines 62, 88–91, 131). These are BetterAuth artifacts — Auth.js JWT sessions don't have these fields. They're hardcoded dead values.
- [x] `AuthSessionData` in `auth.types.ts` still declares `redirect: boolean` and `token: string`. Drop them.
- [x] The session shape should just be `{ user: AuthUser | null }`.

### ⚪ Type the `signIn` return instead of casting

Blocked by `AuthRoles = 'public' | 'admin'` missing `'user'`. The cast `as AuthUser` exists to bridge this mismatch — the DB schema allows `'user'` but `AuthRoles` doesn't. Fixing the cast properly requires fixing `AuthRoles` first (a route-guard change). Skip for now.

### ✅ Auto-refresh session on mount

- [x] `AuthInitializer` already calls `refreshSession()` on mount via `useEffect`.
- [x] Added `visibilitychange` listener — refreshes session when tab becomes visible again.

### ⚪ Consider a thin wrapper class

Object-literal pattern with nested `.signIn.email()` etc. is fine and already consistent. No benefit to refactoring to a class.

---

## 2. `@workspace/shared` vs `@workspace/core` — what goes where

> This is architectural housekeeping, not auth cleanup. Worth doing but as a separate session.

### 🔵 Move model interfaces to `@workspace/shared/models`

The client's `types/models/*.model.ts` files (DrinkType, Volume, Order, Mode, etc.) define the API contract shape. Server infers them from Drizzle. Neither owns the contract. `@workspace/shared/models` is the right neutral home — both sides import from there, server optionally validates drift at compile time.

Suggested structure (unchanged from original):
```
packages/shared/src/
├── constants/
│   └── temperature.config.ts    (already exists)
├── models/
│   ├── index.ts
│   ├── auth.model.ts            (AuthUser, AuthSession, AuthRoles)
│   ├── drink-type.model.ts
│   ├── volume.model.ts
│   ├── container.model.ts
│   ├── order.model.ts
│   ├── mode.model.ts
│   └── ...
├── auth/
│   ├── index.ts
│   └── auth.types.ts            (AuthSignInParams, AuthSignUpParams, AuthSessionData)
└── index.ts
```

Compile-time drift detection pattern (add to server after migration):
```typescript
type _check = DrinkTypeModel extends DrinkType ? true : never;
```

### 🔵 Move auth types to `@workspace/shared/auth`

`AuthUser`, `AuthSession`, `AuthRoles`, `AuthSignInParams`, `AuthSignUpParams` are domain-specific and consumed by both client and server. Currently they live in `apps/client/src/providers/AuthProvider/auth.types.ts` — wrong layer. Move to shared after the model migration above.

---

## 3. Other things noticed during refactoring

### ✅ `hashedPassword` leaks in the users API

- [x] `GET /api/users` (and `GET /api/users/:id`, `PATCH /api/users/:id`) returns the full Drizzle row including `hashedPassword`. Fixed with `columns: { hashedPassword: false }` on all three handlers. `patch` now does a post-update fetch instead of `.returning()` to avoid the leak.

### ✅ Remove deprecated aliases from `@workspace/core`

- [x] Deleted `ZOD_ERROR_CODES` and `ZOD_ERROR_MESSAGES` from `validation-errors.ts`.
- [x] Deleted `transformAxiosError` from `fetch.utils.ts`, `api.utils.ts`, and its re-export from `api/index.ts`.

### ✅ Fix duplicate `ErrorResponse` export name

- [x] `ErrorResponse` in `error.types.ts` was unused (not re-exported via `index.ts`, not imported anywhere in apps). Deleted it. `ErrorResponse` from `error.schema.ts` remains the canonical export.

### ✅ Remove `valibot` from `@workspace/core` dependencies

- [x] Removed `"valibot": "1.2.0"` from `packages/core/package.json`. Nothing in core imports it.

### 🔵 Consider dropping dormant auth tables

`auth_session`, `auth_account`, and `auth_verification` tables are never read or written (JWT sessions + Credentials-only provider). Not harmful to keep, but dead schema. Hold off until the auth approach is confirmed stable — if OAuth providers are added later, these become useful again. Revisit in a dedicated DB cleanup session.

---

## 4. Model interfaces: ownership and architecture

> Covered under §2 above. Detailed rationale preserved here for reference.

### Hand-authored interfaces > schema derivation

API response types should be hand-authored plain interfaces, not derived via `Omit`/`Pick` from Drizzle schemas. Opt-in is safer than opt-out (`hashedPassword` leak is a direct consequence of opt-out derivation). Interfaces also decouple the API contract from internal DB column changes.

### Ownership: `@workspace/shared` (neutral territory)

```
@workspace/shared/models    ← defines the contract
        ↑              ↑
    server              client
  (implements)        (consumes)
```

Neither app depends on the other's build output. Pure types, no runtime deps on Drizzle/Valibot/React/Hono.
