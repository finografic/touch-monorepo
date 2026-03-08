# Migration Progress: Valibot + hono-openapi

> Replacing `@hono/zod-openapi` + `drizzle-zod` with `hono-openapi` + `drizzle-valibot` + `valibot`
> Reference: `MIGRATION_Valibot+HonoOpenAPI_EXAMPLE.md`

---

## Status Legend

- ✅ Done
- 🔄 In progress
- ⬜ Pending
- ❌ Blocked

---

## Phase 1 — Foundation (one-time files)

| File | Status | Notes |
|------|--------|-------|
| Install packages (`valibot`, `hono-openapi`, `@hono/standard-validator`, `@valibot/to-json-schema`, `drizzle-valibot`) | ✅ | |
| `lib/valibot.utils.ts` | ✅ | Replaces `lib/zod.utils.ts` |
| `lib/valibot.errors.ts` | ✅ | Replaces `lib/zod.errors.ts` |
| `lib/openapi.helpers.ts` | ✅ | `json()` / `jsonRequired()` replacing stoker helpers |
| `lib/create-app.ts` | ✅ | `OpenAPIHono` → `Hono`, removed `defaultHook` |
| `lib/configure-open-api.ts` | ✅ | `app.doc()` → `openAPIRouteHandler()` |
| `types/app.types.ts` | ✅ | `AppOpenAPI` = plain `Hono`, `AppHandler` replaces `AppRouteHandler<R>` |
| `schemas/id-cuid-params.schema.ts` | ✅ | Zod → Valibot |
| `schemas/id-uuid-params.schema.ts` | ✅ | |
| `schemas/id-cuid-params.schema.ts` (params.schema.ts alias) | ✅ | |
| `schemas/params.schema.ts` | ✅ | |
| `schemas/responses/message.schema.ts` | ✅ | |
| `schemas/responses/error.schema.ts` | ✅ | |
| `routes/auth/auth.routes.ts` | ✅ | Already plain Hono — no changes needed |

---

## Phase 2 — DB Schemas (drizzle-zod → drizzle-valibot)

| Schema | Status | Notes |
|--------|--------|-------|
| `db/schemas/volumes.schema.ts` | ✅ | First migrated — proof of concept |
| `db/schemas/container_types.schema.ts` | ✅ | |
| `db/schemas/drink_subtypes.schema.ts` | ✅ | |
| `db/schemas/drink_types.schema.ts` | ✅ | |
| `db/schemas/modes.schema.ts` | ✅ | |
| `db/schemas/orders.schema.ts` | ✅ | |
| `db/schemas/temperature_profiles.schema.ts` | ✅ | |
| `db/schemas/slot_configurations.schema.ts` | ✅ | No drizzle-zod — uses `$inferSelect`/`$inferInsert` only |
| `db/schemas/supported_languages.schema.ts` | ✅ | |
| `db/schemas/translations_ui.schema.ts` | ✅ | |
| `db/schemas/translations_app.schema.ts` | ✅ | |
| `db/schemas/translations_admin.schema.ts` | ✅ | |
| `db/schemas/app_configuration.schema.ts` | ✅ | No drizzle-zod — uses `$inferSelect`/`$inferInsert` only |
| `db/schemas/translatable_entities.schema.ts` | ✅ | Was missing from original list |
| `db/schemas/auth_user.schema.ts` | ✅ | |

---

## Phase 3 — Route Entities (createRoute → describeRoute, .openapi() → .get/post/etc())

> Each entity: 3 files — `*.routes.ts`, `*.handlers.ts`, `index.ts`

| Entity | routes.ts | handlers.ts | index.ts | Status |
|--------|-----------|-------------|----------|--------|
| `drink-volume` | ✅ | ✅ | ✅ | ✅ Done |
| `health-check` | ✅ | ✅ | ✅ | ✅ Done |
| `index.route.ts` | ✅ | — | — | ✅ Done |
| `app-configuration` | ✅ | ✅ | ✅ | ✅ Done |
| `container-type` | ✅ | ✅ | ✅ | ✅ Done |
| `drink-subtypes` | ✅ | ✅ | ✅ | ✅ Done |
| `drink-type` | ✅ | ✅ | ✅ | ✅ Done |
| `i18n` | ✅ | ✅ | ✅ | ✅ Done |
| `modes` | ✅ | ✅ | ✅ | ✅ Done |
| `orders` | ✅ | ✅ | ✅ | ✅ Done |
| `relay` | ✅ | ✅ | ✅ | ✅ Done |
| `slot-configurations` | ✅ | ✅ | ✅ | ✅ Done |
| `sounds` | ✅ | ✅ | ✅ | ✅ Done |
| `supported-language` | ✅ | ✅ | ✅ | ✅ Done |
| `temperature-profile` | ✅ | ✅ | ✅ | ✅ Done |
| `translations` | ✅ | ✅ | ✅ | ✅ Done |
| `users` | ✅ | ✅ | ✅ | ✅ Done |

---

## Phase 4 — Cleanup (server)

| Task | Status |
|------|--------|
| Remove `@hono/zod-openapi` from `apps/server` | ✅ |
| Remove `drizzle-zod` from `apps/server` | ✅ |
| Delete `lib/zod.utils.ts` | ✅ |
| Delete `lib/zod.errors.ts` | ✅ |
| `convertBooleansToIntegers` moved to `lib/valibot.utils.ts` | ✅ |
| `openapi/json-content.ts` stubbed (deprecated, remove later) | ✅ |
| TypeScript `tsc --noEmit` clean pass | ✅ **0 errors** |

---

## Phase 5 — Client + Cross-package Zod removal

| Task | Status | Notes |
|------|--------|-------|
| Create `types/models.types.ts` on server | ✅ | Re-exports all Valibot-inferred model types |
| Add `@workspace/server/models` export | ✅ | `package.json` exports field |
| Delete `types/entities/` folder | ✅ | 12 files removed (legacy snake_case interfaces) |
| Client: import models from `@workspace/server/models` | ✅ | All 12 model files updated |
| Client: remove `ConvertKeysToCamelCase` wrappers | ✅ | Server models already camelCase |
| Client: convert `OrdersForm.schema.ts` Zod → Valibot | ✅ | `z.coerce.number()` → `v.pipe(v.unknown(), v.transform(Number), v.number())` |
| Client: `zodResolver` → `standardSchemaResolver` | ✅ | Standard Schema — library-agnostic |
| Client: convert `translations-ui.schema.ts` Zod → Valibot | ✅ | Dynamic schema generation |
| Convert `config/env.shared.ts` Zod → Valibot | ✅ | `z.object().transform()` → `v.pipe(v.object(), v.transform())` |
| Convert `apps/server/env.server.ts` Zod → Valibot | ✅ | |
| Convert `apps/client/env.client.ts` Zod → Valibot | ✅ | |
| Convert `packages/core` error schemas → plain interfaces | ✅ | No schema lib needed |
| Rename `zod-errors` → `validation-errors` (client + core) | ✅ | |
| Replace `stoker` with `http-status-codes` | ✅ | Removed last Zod transitive dep from server |
| Inline stoker middlewares in `create-app.ts` | ✅ | `notFound`, `onError`, emoji favicon |
| Remove `zod` from all `package.json` files | ✅ | |
| Remove `zod` from `pnpm.overrides` | ✅ | |
| Remove `stoker` from server + core | ✅ | |
| `pnpm why zod` → ESLint plugin only (devDep) | ✅ | Zero runtime Zod |

---

## Key Syntax Reference

### Route definition

```ts
// BEFORE
export const list = createRoute({ path: '/items', method: 'get', tags, responses: { 200: jsonContent(schema, 'desc') } });

// AFTER
export const list = describeRoute({ tags, description: 'desc', responses: { 200: json(schema, 'desc') } });
```

### Handler type

```ts
// BEFORE
export const list: AppRouteHandler<ListRoute> = async (context) => { ... };

// AFTER
export const list: AppHandler = async (context) => { ... };
```

### Route registration

```ts
// BEFORE
createRouter().openapi(routes.list, handlers.list)

// AFTER
const router = createRouter();
router.get('/items', routes.list, handlers.list);
router.get('/items/:id', routes.getOne, validator('param', IdCuidParamsSchema), handlers.getOne);
router.post('/items', routes.create, validator('json', schema.insert), handlers.create);
```

### DB schema overrides

```ts
// BEFORE (drizzle-zod — callback wrapper)
createInsertSchema(table, { name: (schema) => schema.name.min(1) })

// AFTER (drizzle-valibot — direct Valibot schema)
createInsertSchema(table, { name: v.pipe(v.string(), v.minLength(1)) })
```

### Imports

```ts
// helpers
import { describeRoute, validator, resolver } from 'hono-openapi';
import * as v from 'valibot';
import { createInsertSchema, createSelectSchema } from 'drizzle-valibot';
import { json, jsonRequired } from 'lib/openapi.helpers';
import { notFoundSchema, validationErrorSchema, ERROR_CODES, ERROR_MESSAGES } from 'lib/valibot.errors';
import type { AppHandler } from 'types/app.types';
```
