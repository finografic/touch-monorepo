# Possible TODOs

Observations and recommendations from the BetterAuth → Auth.js + Zod → Valibot migration.

---

## 1. Improve `auth-client.ts`

The current auth client works but has several rough edges worth cleaning up:

### Use the shared `api` fetch client instead of raw `fetch`

`auth-client.ts` uses raw `fetch()` with manual `credentials: 'include'` everywhere, while `fetch.client.ts` already provides an `api` object that handles credentials, timeouts, error normalization, and base URL resolution. The sign-up call could use `api.post()` directly. The Auth.js CSRF + callback flow requires `x-www-form-urlencoded` which the `api` client doesn't handle out of the box, but `getSession` and `signUp` are plain JSON and should use it.

### Cache the CSRF token

Every `signIn` and `signOut` makes a separate `GET /auth/csrf` call before the actual action. The CSRF token could be fetched once and cached (with a short TTL or per-session), reducing one round-trip per auth action.

### Remove dead `AuthSessionData` fields

`AuthContext.ts` still creates `{ redirect: false, token: '' }` on session objects — those are BetterAuth artifacts. Auth.js JWT sessions don't produce these fields. The `AuthSessionData` type and all consumers should drop `redirect` and `token`. The session shape is just `{ user, expires }`.

### Type the response instead of casting

`signIn.email` casts `result.data.user as AuthUser` — the `AuthSession` interface in `auth-client.ts` already has the correct shape. A generic return type on `signIn` would eliminate the cast.

### Auto-refresh on mount

`refreshSession` in `AuthContext` calls `getSession` but there's no automatic trigger on app mount or tab re-focus. Consider adding a `useEffect` in the provider that calls `refreshSession` on mount and on `visibilitychange`, so stale sessions are caught early.

### Consider a thin wrapper class

Instead of the object-literal pattern with nested `.signIn.email()`, a class with `signIn(email, password)`, `signUp(email, password, name)`, `signOut()`, `getSession()` would be simpler to type, test, and mock.

---

## 2. `@workspace/shared` vs `@workspace/core` — what goes where

### The dividing line

| | `@workspace/core` | `@workspace/shared` |
|---|---|---|
| **Scope** | Framework-agnostic, reusable across any project | Specific to this project's domain |
| **Dependencies** | Generic (lodash, http-status-codes) | Can depend on `@workspace/core` |
| **Changes when** | HTTP standards change, utility patterns evolve | Business requirements change |
| **Examples** | Error codes, fetch utils, type utils, hooks | Temperature config, auth roles, model interfaces |

### What should move to `@workspace/shared`

**Model interfaces** — The client's `types/models/*.model.ts` files define project-specific domain types (DrinkType, Volume, ContainerType, Order, etc.). These are consumed by both client and server (the server already has them as Drizzle inferences). Moving them to `@workspace/shared/models` would:

- Give both apps a single source of truth for the *API contract* shape
- Allow the server to validate that its Drizzle-inferred types satisfy the shared interface
- Eliminate the need for `@workspace/server/models` exports (which required build tooling workarounds)

**Auth types** — `AuthUser`, `AuthSession`, `AuthRoles`, `AuthSignInParams`, `AuthSignUpParams` are domain-specific. They define the contract between client and server. `@workspace/shared/auth` is a natural home.

**Temperature constants** — Already in shared. Correct placement.

**Domain constants** — Things like role enums (`'public' | 'user' | 'admin'`), cookie name prefixes, supported language codes — anything that both apps reference and is specific to *this* product.

### What should stay in `@workspace/core`

**Error codes / messages** — `ERROR_CODES`, `ERROR_MESSAGES`, `VALIDATION_ERROR_CODES` are generic HTTP and validation concepts. They belong in core. They'd be the same in any project using this stack.

**Fetch utilities** — `buildUrl`, `normalizeResponse`, `FetchError`, `transformFetchError` are framework-agnostic. Core.

**Type utilities** — `OverridePropTypes`, casing utils, enum utils — generic TypeScript helpers. Core.

**React hooks** — `useBoundingRect`, `useKeyPress` — generic UI hooks. Core.

### Suggested `@workspace/shared` structure

```
packages/shared/src/
├── constants/
│   └── temperature.config.ts    (already exists)
├── models/
│   ├── index.ts                 (barrel)
│   ├── auth.model.ts            (AuthUser, AuthSession, AuthRoles)
│   ├── drink-type.model.ts      (DrinkType, DrinkSubtype)
│   ├── volume.model.ts          (DrinkVolume)
│   ├── container.model.ts       (ContainerType)
│   ├── order.model.ts           (OrderModel, OrdersReadableView)
│   ├── mode.model.ts            (ModeModel)
│   └── ...
├── auth/
│   ├── index.ts
│   └── auth.types.ts            (AuthSignInParams, AuthSignUpParams, AuthSessionData)
└── index.ts
```

---

## 3. Other things noticed during refactoring

### `hashedPassword` leaks in the users API

`GET /api/users` returns `hashedPassword` in the response (visible in the browser screenshot). The users route should select specific columns or strip `hashedPassword` before returning. This is a security issue.

### Deprecated aliases still in core

`validation-errors.ts` still exports `ZOD_ERROR_CODES` and `ZOD_ERROR_MESSAGES` as deprecated aliases. Since Zod is fully removed, these can be deleted. Same for `transformAxiosError` in `api.utils.ts` (deprecated alias for `transformFetchError`).

### `error.types.ts` has a duplicate `ErrorResponse`

Both `error.types.ts` and `error.schema.ts` export an `ErrorResponse` interface with different shapes. The `error.types.ts` version (`{ message, code, status, details }`) is a simpler flat shape, while `error.schema.ts` has the structured API response shape (`{ success: false, error: { ... } }`). One should be renamed (e.g., `SimpleErrorResponse` or `ApiErrorResponse`) to avoid confusion and potential import conflicts.

### Pre-existing client type errors (88 total)

The client has ~88 `tsc` errors unrelated to the migration — `ColumnDef` mismatches, missing exports (`SlotItem`, `DevLayer`, `ToastSystem`), stray `log` references, `SlotType | SlotSpecial` union issues, and Dialog size/variant literals. These predate the migration but will block strict CI.

### `auth_session` / `auth_account` / `auth_verification` tables are dormant

With JWT sessions and Credentials-only provider, these three tables are never read or written. They could be dropped from the schema (and the DB) unless you plan to add OAuth providers or database sessions later. Keeping them isn't harmful, but it's dead schema.

### `valibot` dependency in `@workspace/core`

`core/package.json` still lists `valibot` as a dependency, but after removing the schemas from `error.schema.ts`, nothing in core imports Valibot. It can be removed from core's `dependencies`.

---

## 4. Model interfaces: ownership and architecture

### Hand-authored interfaces > schema derivation

API response types should be hand-authored plain interfaces, not derived from Drizzle schemas via `Omit`/`Pick`. The reasons:

- **Opt-in vs opt-out** — hand-authored interfaces only expose what's explicitly listed. Schema derivation exposes everything unless you remember to `Omit` it (e.g., `hashedPassword` leaking because nobody added it to the `Omit` list).
- **Decoupled from DB** — DB column renames, new internal columns, or type changes don't silently change the API contract.
- **Readable** — the interface is a self-documenting spec of exactly what the client receives, without needing to mentally resolve `Omit<Pick<Partial<...>>>` chains.

### Ownership: `@workspace/shared` (neutral territory)

The interfaces should live in `@workspace/shared/models`, not in server or client:

```
@workspace/shared/models    ← the contract (defines it)
        ↑              ↑
    server              client
  (implements)        (consumes)
```

- **Shared** defines the contract — pure types, no runtime deps on Drizzle/Valibot/React/Hono.
- **Server** imports from shared and validates its Drizzle-inferred types satisfy the contract.
- **Client** imports from shared to type fetch responses and UI props.
- Neither app depends on the other's build output — no `.d.ts` generation issues.

This is the same pattern as a `.proto` file in gRPC or an OpenAPI spec — the schema lives in neutral territory.

### Compile-time drift detection

The server can add a type-level check to catch schema drift without runtime cost:

```typescript
import type { DrinkType } from '@workspace/shared/models';
import type { DrinkTypeModel } from './db/schemas/drink_types.schema';

// Fails at compile time if Drizzle schema no longer satisfies the API contract
type _check = DrinkTypeModel extends DrinkType ? true : never;
```
