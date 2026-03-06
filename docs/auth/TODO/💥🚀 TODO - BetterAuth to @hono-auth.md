Let me check the current state of the BetterAuth situation and what alternatives look like right now.OK, now I have a clear picture. Here's the situation and my recommendations.

## The BetterAuth Situation

Yes, do both at the same time. They're independent migrations that happen to unblock each other — Valibot frees you from the Zod dependency chain, and Auth.js frees you from BetterAuth's Zod dependency chain. Doing them together means you rip out both Zod-entangled packages in one pass rather than leaving a half-migrated state where BetterAuth is still pinning your Zod version.

The practical order I'd suggest:

**Valibot first** (maybe a weekend). It's the more mechanical migration — find/replace patterns, same concepts, different syntax. Once Valibot is in and Zod is gone from your own code, your dependency graph is already cleaner. You can validate that your Drizzle schemas, `.env` validation, Hono validators, and RHF forms all work before touching auth.

**Auth.js second** (another weekend or two). This is the more involved migration — different table schemas, different session model, different client hooks. But you're doing it against a codebase that's already on Valibot with a clean dependency tree, so you're not fighting two battles at once.

Given this is your hobby dashboard for exactly this kind of exploration, it's the ideal context. No production users to break, no team to coordinate with, and the learning value of setting up Auth.js from scratch with Hono + Drizzle + SQLite is real portfolio material. You've already lived with BetterAuth long enough to understand the tradeoffs — now you can articulate *why* you switched, which is more interesting in a professional context than just having picked one from the start.

## TLDR

The Zod issue is a mess, and it's actually a two-way problem that's left BetterAuth stuck in a no-man's-land:

BetterAuth 1.3 migrated to Zod 4 internally using `import * as z from 'zod/v4'` — Zod's recommended subpath versioning approach. The problem is this created breakage in *both* directions:

**If you stay on Zod 3** (like you're doing at `^3.25.76`): BetterAuth 1.3.10 and later doesn't work on Zod 3 projects, throwing errors like `z.coerce.b... is not a function` because BetterAuth internals now expect Zod 4 APIs.

**If you upgrade to Zod 4**: The `zod/v4` subpath imports in BetterAuth conflict with other packages that import from `"zod"` directly, causing bundler confusion — particularly with Vite/Rollup and pnpm's strict hoisting. People report `Class2 is not a constructor` errors in production because the bundler sees `zod` and `zod/v4` as separate module instances.

**The CLI is also broken**: The `@better-auth/cli` fails with `Package subpath './v4' is not defined by "exports"` depending on which version of Zod gets hoisted.

So you're pinned at `better-auth@1.3.6` + `zod@^3.25.76` — which works, but means you can't upgrade either dependency. BetterAuth is currently at 1.4.20 with a 1.5.0 beta in progress, but the core Zod interop issue persists across versions because it's fundamentally a bundler/module-resolution problem exacerbated by Zod's unusual subpath versioning strategy.

This is a legitimate reason to consider switching. The issue has been open for months, it's clearly widespread, and it's blocking your entire dependency upgrade chain (BetterAuth → Zod → drizzle-zod → `@hono/zod-openapi`).

---

# Alternatives

Given your stack (Hono + Drizzle + SQLite + React client), here are the realistic options:

### 1. Auth.js (formerly NextAuth.js) via `@hono/auth-js`

**The strongest alternative for your stack.** There's an official `@hono/auth-js` package with first-party Hono integration, including `initAuthConfig`, `verifyAuth`, and `authHandler` middleware. It supports Drizzle adapters with SQLite schemas and has a React client via `SessionProvider` and `useSession`.

**Pros**: Massive ecosystem (~25k GitHub stars), framework-agnostic core (`@auth/core`), official Hono adapter, Drizzle adapter works with `better-sqlite3`, dozens of OAuth providers built-in, no Zod dependency in core (it uses its own validation), active maintenance, very well documented.

**Cons**: Historically Next.js-centric (the "NextAuth" legacy), so some docs/examples assume Next.js patterns. The Hono integration is solid but less battle-tested than the Next.js path. Session strategy defaults to JWT (database sessions available but require more setup). The migration from BetterAuth's schema to Auth.js's schema will require a database migration — different table structures for users, sessions, accounts.

**Migration effort**: Medium. Your Hono routes stay mostly the same, you swap the auth handler mount, write new Drizzle schema tables matching Auth.js expectations, and migrate existing user data. The React client side is straightforward — swap BetterAuth's client hooks for `@hono/auth-js/react`.

### 2. Lucia Auth (now a learning resource / roll-your-own approach)

Lucia's author deprecated the library as a framework and repositioned it as an educational resource — it's now a "free online resource covering the various auth concepts in web applications" with companion libraries: **Oslo** (auth/crypto primitives) and **Arctic** (OAuth 2.0 client for 50+ providers).

**Pros**: Maximum control, zero magic, no framework coupling. You own every line — session table design, token lifecycle, middleware shape. The Oslo/Arctic libraries are excellent, minimal, and runtime-agnostic. Perfect for someone who understands auth and wants explicit architecture (which aligns with your general coding philosophy). No Zod dependency. Will never break because of someone else's dependency choices.

**Cons**: You're building auth infrastructure, not configuring it. Session management, CSRF protection, cookie handling, token rotation — all on you. The "learning resource" framing means less community support for implementation questions. It's more work upfront, but less ongoing dependency pain.

**Migration effort**: High initially, but you end up with something that's truly yours and will never be blocked by upstream decisions.

### 3. Stay on BetterAuth, but pin and isolate

Not an "alternative" per se, but worth considering: your current `better-auth@1.3.6` + `zod@^3.25.76` works. You could pin those exact versions, add `pnpm.overrides` to lock the Zod version, and treat auth as a frozen subsystem while upgrading everything else around it. The risk is that security patches to BetterAuth become harder to apply, and you're stuck on Zod 3 for the foreseeable future — which blocks your `@hono/zod-openapi` and `drizzle-zod` upgrades too.

## My recommendation

**Auth.js via `@hono/auth-js`** is the pragmatic choice. It gives you the same "easy setup, lots of providers, session management handled" experience that drew you to BetterAuth, but backed by a much larger community and without the Zod entanglement. The Hono integration is official and maintained by the Hono team. The Drizzle + SQLite path is documented. And critically, it frees your Zod version — you can upgrade to Zod 4 whenever you want because Auth.js doesn't depend on it.

If this is also a portfolio piece and you want to demonstrate deeper understanding, the Lucia/Oslo/Arctic approach is more impressive on a CV — it shows you understand auth at the protocol level, not just the configuration level. But it's a significant time investment that competes with your design system work.

Either way, the BetterAuth Zod situation shows no signs of clean resolution soon. The problem is structural — it's a collision between Zod's unconventional versioning strategy and how pnpm/bundlers resolve subpath exports. Even if BetterAuth fixes it, the underlying tension between `zod`, `zod/v4`, and `zod/v4/core` in the module graph will keep causing friction.
