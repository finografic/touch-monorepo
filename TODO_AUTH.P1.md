# Auth.js — follow-ups

**Stack:** Auth.js via `@hono/auth-js`, JWT sessions, credentials provider.  
Legacy BetterAuth / Zod migration is complete; this file tracks only **remaining** improvements.

---

## Legend

| Tag | Meaning |
| --- | --- |
| ✅ | Done |
| ⬜ | Pending |
| 🔵 | Future / optional |

---

## Session handling

| Item | Status |
| --- | --- |
| CSRF token cache (TTL + invalidate on sign-out) | ✅ |
| Auto-refresh on mount | ✅ |
| Refresh when tab becomes visible (`visibilitychange`) | ✅ |
| Remove dead session fields (`redirect`, `token`) from types and `AuthContext` | ✅ |

---

## Pending

### ⬜ Tighten `signIn` typing (remove `as AuthUser` cast)

The cast exists because `AuthRoles` is `'public' \| 'admin'` while the DB allows `'user'`. Aligning the role union (and any route guards) lets the auth client return a properly typed user without assertions.

### 🔵 Move auth types to `@workspace/shared`

`AuthUser`, session shapes, and sign-in/up params are shared contract types. Long-term home: `packages/shared` (see `TODO_VALIDATION.P2.md` for the same pattern for domain models).

### 🔵 Dormant auth tables (`auth_session`, `auth_account`, `auth_verification`)

Unused with JWT + credentials-only flow. Safe to keep for a future OAuth / DB-session switch. Revisit during a dedicated DB cleanup if you confirm you will not use them.

---

## Skipped / intentional

- **Raw `fetch` in `auth-client.ts`:** Sign-in uses `x-www-form-urlencoded` and `redirect: 'manual'`; the shared `api` client does not support that flow. Keeping raw `fetch` for auth is consistent and acceptable.
