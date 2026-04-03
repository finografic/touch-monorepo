# Authentication System

📅 Updated Apr 2026 (Auth.js)

The Touch monorepo uses **Auth.js** with the official **Hono adapter** (`@hono/auth-js`): credentials (email/password), JWT sessions, and HTTP-only cookies. The client uses a small **`auth-client`** wrapper around the Auth.js HTTP routes plus React context for UI state.

## Features

- **Auth.js + Hono** — Server config in `apps/server/src/lib/auth.ts`; routes under `/api/auth/*`.
- **Dual login surfaces** — Main and admin login flows; route protection for authenticated and admin areas.
- **Session** — JWT session strategy; cookie name/config from server env (see `auth.ts`).

## Layout (main files)

```
apps/client/src/
├── lib/auth-client.ts              # Client calls to /api/auth/*
└── providers/AuthProvider/       # React context, session state

apps/server/src/
├── lib/auth.ts                   # Auth.js AuthConfig (credentials, JWT, cookies)
├── routes/auth/                  # Auth route wiring
└── db/schemas/auth_*.schema.ts   # User / auth-related tables
```

## Route protection

- **Public** — Marketing/main app and login pages as configured.
- **Authenticated** — Areas that require a valid session.
- **Admin** — `/admin/*` (and similar) gated by role; see route config and `useAuth()` helpers.

## Security notes

- **HTTP-only session cookie** — Token not readable from JavaScript; sent automatically with `credentials: 'include'` on API calls.
- **CSRF** — Follow Auth.js / `@hono/auth-js` guidance for your deployment; the auth client performs the expected CSRF steps for sign-in/sign-out.
- **Passwords** — Hashed on the server; never returned to the client.

## API examples (dev server)

See `docs/auth/auth-calls-with-curl.md` or use the routes documented next to `apps/server/src/routes/auth/`.

## Future enhancements (optional)

- OAuth providers via Auth.js providers.
- Email verification and password reset flows.
- Stricter role typing end-to-end (see `TODO_AUTH.P1.md`).

## Related

- `apps/client/src/providers/AuthProvider/docs/README.auth.md` — Session and cookie behaviour in depth.
- [Auth.js documentation](https://authjs.dev/)
- [Hono adapter](https://github.com/honojs/auth-js) (`@hono/auth-js`)
