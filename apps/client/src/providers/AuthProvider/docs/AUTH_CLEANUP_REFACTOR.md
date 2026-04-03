# Auth context cleanup & auth client

📅 Updated Apr 2026

Historical notes from consolidating auth around **Auth.js** (`@hono/auth-js`) and a typed **`auth-client`** (`apps/client/src/lib/auth-client.ts`) used by `AuthContext`.

## What changed (summary)

1. **Central client** — Sign-in, sign-up, sign-out, and session refresh go through `auth-client` instead of ad hoc `fetch` except where the Auth.js flow requires manual `fetch` (e.g. form POST + redirect handling).
2. **Errors** — Prefer handling `error` results from the client instead of duplicate try/catch in both context and UI when the client does not throw.
3. **Return shape** — Methods return a small `{ success, message?, error? }` style result where that pattern is used.

## Benefits

- Fewer duplicated error paths
- Cookie/session behaviour aligned with Auth.js
- Easier testing of the auth client in isolation

## Type handling

Session user may include `role` from JWT callbacks. Tighten types when `AuthRoles` and the DB role enum are fully aligned (see `TODO_AUTH.P1.md`).

## Testing checklist

- Login, logout, session refresh, wrong password, protected routes.

## Future improvements

1. Remove unnecessary `as` casts once session/user types match Auth.js output.
2. Optional: OAuth providers, email verification, password reset — via Auth.js providers and pages.
3. Optional: admin-only features using role checks already in session data.

## Resources

- [Auth.js](https://authjs.dev/)
- [@hono/auth-js](https://github.com/honojs/auth-js) — Hono adapter
- `README.auth.md` in this folder — cookies and session details
