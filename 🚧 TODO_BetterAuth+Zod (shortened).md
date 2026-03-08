**Valibot Migration (Phase 1):**

- Replace Zod schemas across server, shared, core packages
- Swap `drizzle-zod` → `drizzle-orm/valibot`
- Swap `@hono/zod-validator` → `@hono/valibot-validator`
- Swap RHF `zodResolver` → `valibotResolver` or `standardSchemaResolver`
- Remove Zod from dependency tree

**Auth.js Migration (Phase 2):**

- Set up `@hono/auth-js` + `@auth/drizzle-adapter`
- Create new Drizzle schema for Auth.js tables
- Write data migration script (users, sessions, accounts) + back up SQLite DB
- Verify password hash compatibility
- Swap client hooks (`createAuthClient()` → `SessionProvider` + `useSession`)
- Update login/signup forms
- Remove BetterAuth
