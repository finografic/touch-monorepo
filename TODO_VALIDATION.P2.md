# Valibot, OpenAPI, and API contracts

**Stack:** Valibot, `hono-openapi`, `drizzle-valibot`, Standard Schema on the client.  
The previous validator stack on the server is fully removed from runtime code.

---

## Migration status (complete)

Server and client are migrated. High-level checklist (historical):

- Packages: `valibot`, `hono-openapi`, `@hono/standard-validator`, `@valibot/to-json-schema`, `drizzle-valibot`.
- DB schemas use `createInsertSchema` / `createSelectSchema` from `drizzle-valibot`.
- Routes use `describeRoute`, `validator`, and `lib/openapi.helpers` (`json` / `jsonRequired`).
- Client forms use `standardSchemaResolver` with Valibot schemas.
- Validator packages updated in `package.json` and overrides; any stray mentions in third-party tooling are dev-only, not app runtime.

**Code references (prefer these over copying old migration snippets):**

- `apps/server/src/lib/valibot.utils.ts` — SQLite boolean helpers.
- `apps/server/src/lib/valibot.errors.ts` — shared error shapes.
- `apps/server/src/lib/openapi.helpers.ts` — OpenAPI JSON response helpers.
- Example entity wiring: `apps/server/src/routes/drink-volume/`.

---

## Pending cleanup

| Item | Notes |
| --- | --- |
| ⬜ **Shared models** | Move API contract interfaces from `apps/client/src/types/models/` and auth types from `AuthProvider` into `@workspace/shared` so client and server share one contract. Server can add compile-time checks (`type _check = DrizzleModel extends SharedModel ? true : never`). |
| ⬜ **Hand-authored API shapes** | Prefer explicit interfaces for public API responses over “pick everything from Drizzle” to avoid accidental field leaks (same idea as the old `hashedPassword` issue). |

---

## Future / optional

- **OpenAPI / docs:** Keep `hono-openapi` and Scalar (or your docs route) aligned when you add or rename routes.
- **Dormant auth tables:** See `TODO_AUTH.P1.md`.

---

## Related

- `docs/STANDARD_SCHEMA_INTEGRATION.md` — Standard Schema usage where relevant.
- `docs/endpoints/TODO.ENDPOINTS.md` — client API / React Query consolidation (separate effort).
