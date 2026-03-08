# Migration Example: Valibot + hono-openapi

> Proof-of-concept showing the **exact syntax change** for one route entity (`drink-volume`).
> Shows: DB schema, route definitions, handler, router wiring, and supporting files.
> Nothing in this file is applied yet — review and confirm before executing.

---

## Packages required

```bash
# Add
pnpm add valibot hono-openapi @hono/standard-validator @valibot/to-json-schema

# Remove later (after all routes migrated)
pnpm remove @hono/zod-openapi drizzle-zod
```

---

## Supporting files (new / rewritten)

### `apps/server/src/lib/valibot.utils.ts`
> Replaces `zod.utils.ts`. Only `sqliteBooleanField` is needed here —
> the other utils (`transformSqliteBooleans`, `createSqliteBooleanPatchSchema`, etc.)
> were Zod-specific helpers and are no longer needed with the new schema pattern.

```ts
import * as v from 'valibot';

/**
 * Accepts boolean, integer (0|1), or string ('0'|'1'|'true'|'false').
 * Normalises everything to 0 or 1 for SQLite storage.
 */
export function sqliteBooleanField(defaultValue?: boolean) {
  const base = v.pipe(
    v.union([
      v.boolean(),
      v.pipe(v.number(), v.integer(), v.minValue(0), v.maxValue(1)),
      v.literal('true'),
      v.literal('false'),
      v.literal('1'),
      v.literal('0'),
    ]),
    v.transform((value): 0 | 1 => {
      if (typeof value === 'boolean') return value ? 1 : 0;
      if (value === 'true' || value === '1') return 1;
      if (value === 'false' || value === '0') return 0;
      return value as 0 | 1;
    }),
  );

  return defaultValue !== undefined
    ? v.optional(base, defaultValue ? 1 : 0)
    : base;
}
```

---

### `apps/server/src/lib/valibot.errors.ts`
> Replaces `zod.errors.ts`. Removes the dependency on stoker's
> `createMessageObjectSchema` (which was Zod-specific).

```ts
import * as v from 'valibot';
import * as HttpStatusPhrases from 'stoker/http-status-phrases';
import { TEMPERATURE_RANGES } from 'config/temperature.config';

export const ERROR_MESSAGES = {
  REQUIRED:                      'Required',
  EXPECTED_NUMBER:               'Expected number, received nan',
  NO_UPDATES:                    'No updates provided',
  TEMPERATURE_CONSUMPTION_RANGE: `Temperature consumption must be between ${TEMPERATURE_RANGES.CONSUMPTION.MIN}°C and ${TEMPERATURE_RANGES.CONSUMPTION.MAX}°C`,
  TEMPERATURE_FREEZING_RANGE:    `Temperature freeze must be between ${TEMPERATURE_RANGES.FREEZING.MIN}°C and ${TEMPERATURE_RANGES.FREEZING.MAX}°C`,
};

export const ERROR_CODES = {
  INVALID_UPDATES: 'invalid_updates',
};

// Simple message object schema — replaces stoker's createMessageObjectSchema()
export const notFoundSchema = v.object({
  message: v.literal(HttpStatusPhrases.NOT_FOUND),
});

// Generic validation error shape — replaces stoker's createErrorSchema()
export const validationErrorSchema = v.object({
  success: v.literal(false),
  error: v.object({
    issues: v.array(
      v.object({
        code:    v.string(),
        path:    v.array(v.union([v.string(), v.number()])),
        message: v.string(),
      }),
    ),
    name: v.string(),
  }),
});
```

---

### `apps/server/src/schemas/id-cuid-params.schema.ts`
> Before: used `z` re-exported from `@hono/zod-openapi`.
> After: pure Valibot using the existing `isCuid` utility.

**Before**
```ts
import { z } from '@hono/zod-openapi';
import { isCuid } from 'utils/cuid-validation';

export const IdCuidParamsSchema = z.object({
  id: z
    .string()
    .openapi({ description: 'Resource identifier (CUID)', example: 'clh8k6w3f0003mp5hf1qdqn8q' })
    .refine((val) => isCuid(val), { message: 'Invalid ID format - must be a valid CUID' }),
});
```

**After**
```ts
import * as v from 'valibot';
import { isCuid } from 'utils/cuid-validation';

export const IdCuidParamsSchema = v.object({
  id: v.pipe(
    v.string(),
    v.check((val) => isCuid(val), 'Invalid ID format - must be a valid CUID'),
  ),
});
```

---

### `apps/server/src/lib/openapi.helpers.ts` *(new file)*
> Tiny helpers that replace stoker's `jsonContent` / `jsonContentRequired`.
> Keeps route files readable without repeating the `resolver()` wrapper everywhere.

```ts
import { resolver } from 'hono-openapi';
import type * as v from 'valibot';

type AnyValibotSchema = v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>;

/** Equivalent of stoker's jsonContent() */
export const json = (schema: AnyValibotSchema, description: string) => ({
  description,
  content: {
    'application/json': { schema: resolver(schema) },
  },
});

/** Equivalent of stoker's jsonContentRequired() — marks body as required in OpenAPI spec */
export const jsonRequired = (schema: AnyValibotSchema, description: string) => ({
  ...json(schema, description),
  required: true,
});
```

---

### `apps/server/src/lib/create-app.ts`
> Before: `OpenAPIHono` with `defaultHook` for global Zod validation errors.
> After: plain `Hono`. Validation errors are now handled per-route via the
> optional hook arg in `validator('json', schema, (result, c) => {...})`.

**Before**
```ts
import { OpenAPIHono } from '@hono/zod-openapi';
import { notFound, onError, serveEmojiFavicon } from 'stoker/middlewares';
import { defaultHook } from 'stoker/openapi';
import type { AppBindings, AppOpenAPI } from 'types/app.types';

export function createRouter() {
  return new OpenAPIHono<AppBindings>({ strict: false, defaultHook });
}
```

**After**
```ts
import { Hono } from 'hono';
import { notFound, onError, serveEmojiFavicon } from 'stoker/middlewares';
import type { AppBindings } from 'types/app.types';

export function createRouter() {
  return new Hono<AppBindings>({ strict: false });
}
```

---

### `apps/server/src/types/app.types.ts`
> `AppRouteHandler` and `AppOpenAPI` were tied to `@hono/zod-openapi` types.
> With `hono-openapi` the handler is just a standard Hono `Handler`.

**Before**
```ts
import type { OpenAPIHono, RouteConfig, RouteHandler } from '@hono/zod-openapi';

export type AppOpenAPI = OpenAPIHono<AppBindings>;
export type AppRouteHandler<R extends RouteConfig> = RouteHandler<R, AppBindings>;
```

**After**
```ts
import type { Hono, Handler, Context } from 'hono';

export type AppOpenAPI = Hono<AppBindings>;
// Handlers are plain Hono handlers — no route type parameter needed
export type AppHandler = Handler<AppBindings>;
// If you still want per-handler typing, Context works:
export type AppContext = Context<AppBindings>;
```

> **Note:** This means the `// @ts-nocheck` comments in handler files can be removed —
> handler type inference becomes simpler with plain Hono.

---

## The drink-volume entity — before / after

### `apps/server/src/db/schemas/volumes.schema.ts`

**Before** (`drizzle-zod`)
```ts
import createCuid from '@bugsnag/cuid';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { sqliteBooleanField } from '../../lib/zod.utils';

export const volumes = sqliteTable('volumes', { /* ... */ });

const insertVolumeSchema = createInsertSchema(volumes, {
  name:          (schema) => schema.name.min(1).max(20),
  valueInMl:     (schema) => schema.valueInMl.min(1).max(5000),
  sortOrder:     (schema) => schema.sortOrder.min(0),
  coolingFactor: (schema) => schema.coolingFactor.min(0.1).max(5),
  isActive:      () => sqliteBooleanField(),
})
  .required({ name: true, valueInMl: true, sortOrder: true })
  .omit({ id: true, createdAt: true, updatedAt: true });

const patchVolumeSchema = insertVolumeSchema.partial().extend({
  translations: createSelectSchema(volumes).shape.translations.optional(),
  isActive:     sqliteBooleanField().optional(),
});

export const volumeSchemas = {
  select: createSelectSchema(volumes, {
    translations: (schema) => schema.translations.optional(),
  }),
  insert: insertVolumeSchema,
  patch:  patchVolumeSchema,
} as const;
```

**After** (`drizzle-orm/valibot`)
```ts
import createCuid from '@bugsnag/cuid';
import * as v from 'valibot';
import { createInsertSchema, createSelectSchema } from 'drizzle-orm/valibot'; // ← only import changes
import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { sqliteBooleanField } from '../../lib/valibot.utils'; // ← new util file

// Drizzle table definition is IDENTICAL — no changes needed
export const volumes = sqliteTable('volumes', {
  id:           text('id').primaryKey().$defaultFn(() => createCuid()),
  name:         text('name').notNull().unique(),
  translations: text('translations', { mode: 'json' }).$type<Record<string, string>>().notNull().default({ 'en-GB': '' }),
  valueInMl:    integer('value_in_ml').notNull(),
  sortOrder:    integer('sort_order').notNull(),
  coolingFactor: real('cooling_factor').notNull().default(1),
  isActive:     integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt:    integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt:    integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).$onUpdate(() => new Date()),
});

// Field overrides: pass Valibot schemas directly (no callback wrapper)
const insertVolumeSchema = v.omit(
  createInsertSchema(volumes, {
    name:          v.pipe(v.string(), v.minLength(1), v.maxLength(20)),
    valueInMl:     v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(5000)),
    sortOrder:     v.pipe(v.number(), v.integer(), v.minValue(0)),
    coolingFactor: v.pipe(v.number(), v.minValue(0.1), v.maxValue(5)),
    isActive:      sqliteBooleanField(),
  }),
  ['id', 'createdAt', 'updatedAt'], // omit auto-generated fields
);

// Valibot equivalent of .partial().extend({ ... })
const patchVolumeSchema = v.partial(
  v.object({
    ...v.omit(insertVolumeSchema, ['translations']).entries,
    translations: v.optional(v.record(v.string(), v.string())),
    isActive:     v.optional(sqliteBooleanField()),
  }),
);

export const volumeSchemas = {
  select: createSelectSchema(volumes, {
    translations: v.optional(v.record(v.string(), v.string())),
  }),
  insert: insertVolumeSchema,
  patch:  patchVolumeSchema,
} as const;
```

> **Key syntax differences:**
> - `createInsertSchema` override callbacks change from `(schema) => schema.min(1)` → just the Valibot schema directly
> - `.omit()` / `.partial()` / `.extend()` are free functions: `v.omit(schema, keys)` / `v.partial(schema)`
> - `.entries` spread lets you destructure a Valibot object schema into another `v.object()` call

---

### `apps/server/src/routes/drink-volume/drink-volume.routes.ts`

**Before** (`@hono/zod-openapi` — `createRoute`)
```ts
import { createRoute, z } from '@hono/zod-openapi';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers';
import { createErrorSchema, IdParamsSchema } from 'stoker/openapi/schemas';
import { volumeSchemas } from 'db/schemas/volumes.schema';
import { notFoundSchema } from 'lib/zod.errors';
import { IdCuidParamsSchema } from 'schemas/id-cuid-params.schema';

const tags = ['DrinkVolumes'];

export const list = createRoute({
  path: '/drink-volumes',
  method: 'get',
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(volumeSchemas.select.pick({ id: true, name: true, translations: true, valueInMl: true, sortOrder: true, coolingFactor: true, isActive: true })),
      'List of available drink volumes',
    ),
  },
});

export const getOne = createRoute({
  path: '/drink-volumes/{id}',
  method: 'get',
  request: { params: IdCuidParamsSchema },
  tags,
  responses: {
    [HttpStatusCodes.OK]:                   jsonContent(volumeSchemas.select, 'The requested drink volume'),
    [HttpStatusCodes.NOT_FOUND]:            jsonContent(notFoundSchema, 'Drink volume not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(IdParamsSchema), 'Invalid id error'),
  },
});

export const create = createRoute({
  path: '/drink-volumes',
  method: 'post',
  request: { body: jsonContentRequired(volumeSchemas.insert, 'The drink volume to create') },
  tags,
  responses: {
    [HttpStatusCodes.OK]:                   jsonContent(volumeSchemas.select, 'The created drink volume'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(volumeSchemas.insert), 'The validation error(s)'),
  },
});

export const patch = createRoute({
  path: '/drink-volumes/{id}',
  method: 'patch',
  request: {
    params: IdCuidParamsSchema,
    body: jsonContentRequired(volumeSchemas.patch, 'The drink volume updates'),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]:                   jsonContent(volumeSchemas.select, 'The updated drink volume'),
    [HttpStatusCodes.NOT_FOUND]:            jsonContent(notFoundSchema, 'Drink volume not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(volumeSchemas.patch).or(createErrorSchema(IdParamsSchema)), 'The validation error(s)'),
  },
});

export const remove = createRoute({
  path: '/drink-volumes/{id}',
  method: 'delete',
  request: { params: IdCuidParamsSchema },
  tags,
  responses: {
    [HttpStatusCodes.NO_CONTENT]: { description: 'Drink volume deleted' },
    [HttpStatusCodes.NOT_FOUND]:  jsonContent(notFoundSchema, 'Drink volume not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(IdParamsSchema), 'Invalid id error'),
  },
});

export type ListRoute   = typeof list;
export type CreateRoute = typeof create;
export type GetOneRoute = typeof getOne;
export type PatchRoute  = typeof patch;
export type RemoveRoute = typeof remove;
```

**After** (`hono-openapi` — `describeRoute`)
```ts
import * as HttpStatusCodes from 'stoker/http-status-codes'; // still just numbers — unchanged
import { describeRoute } from 'hono-openapi';
import * as v from 'valibot';

import { volumeSchemas } from 'db/schemas/volumes.schema';
import { notFoundSchema, validationErrorSchema } from 'lib/valibot.errors';
import { json } from 'lib/openapi.helpers'; // our tiny helper (see above)

const tags = ['DrinkVolumes'];

export const list = describeRoute({
  tags,
  description: 'List of available drink volumes',
  responses: {
    [HttpStatusCodes.OK]: json(
      v.array(v.pick(volumeSchemas.select, ['id', 'name', 'translations', 'valueInMl', 'sortOrder', 'coolingFactor', 'isActive'])),
      'List of available drink volumes',
    ),
  },
});

export const getOne = describeRoute({
  tags,
  description: 'Get a single drink volume by id',
  responses: {
    [HttpStatusCodes.OK]:                   json(volumeSchemas.select, 'The requested drink volume'),
    [HttpStatusCodes.NOT_FOUND]:            json(notFoundSchema, 'Drink volume not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: json(validationErrorSchema, 'Invalid id error'),
  },
});

export const create = describeRoute({
  tags,
  description: 'Create a new drink volume',
  responses: {
    [HttpStatusCodes.OK]:                   json(volumeSchemas.select, 'The created drink volume'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: json(validationErrorSchema, 'The validation error(s)'),
  },
});

export const patch = describeRoute({
  tags,
  description: 'Update a drink volume',
  responses: {
    [HttpStatusCodes.OK]:                   json(volumeSchemas.select, 'The updated drink volume'),
    [HttpStatusCodes.NOT_FOUND]:            json(notFoundSchema, 'Drink volume not found'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: json(validationErrorSchema, 'The validation error(s)'),
  },
});

export const remove = describeRoute({
  tags,
  description: 'Delete a drink volume',
  responses: {
    [HttpStatusCodes.NO_CONTENT]: { description: 'Drink volume deleted' },
    [HttpStatusCodes.NOT_FOUND]:  json(notFoundSchema, 'Drink volume not found'),
  },
});

// No type exports needed — handlers are plain Hono handlers, no RouteConfig generics
```

> **Key differences:**
> - `createRoute({ path, method, request, ... })` → `describeRoute({ description, responses, ... })`
> - `path` and `method` are no longer in the route definition — they live in `index.ts` on `router.get/post/etc`
> - `request.params` / `request.body` are gone — validation is declared inline in `index.ts` via `validator()`
> - Route type exports (`ListRoute`, `CreateRoute`, etc.) are no longer needed
> - `stoker/openapi/helpers` helpers replaced by our tiny `json()` helper

---

### `apps/server/src/routes/drink-volume/drink-volume.handlers.ts`

The handlers are **mostly unchanged**. Only two things need updating:

1. Remove `// @ts-nocheck` — no longer needed (plain Hono types are simpler)
2. Rename `ZodError` → `ValidationError` in the empty-patch guard
3. Import from `valibot.errors` instead of `zod.errors`

```ts
// @ts-nocheck ← REMOVE this line
import { eq } from 'drizzle-orm';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import * as HttpStatusPhrases from 'stoker/http-status-phrases';

import { db } from 'db';
import { volumes } from 'db/schemas/volumes.schema';
import { ERROR_CODES, ERROR_MESSAGES } from 'lib/valibot.errors'; // ← renamed import
import type { AppHandler } from 'types/app.types';              // ← simplified type

// list, getOne, create — IDENTICAL, no changes needed

export const patch: AppHandler = async (context) => {
  const { id } = context.req.valid('param');
  const updates = context.req.valid('json');

  if (Object.keys(updates).length === 0) {
    return context.json(
      {
        success: false,
        error: {
          issues: [{ code: ERROR_CODES.INVALID_UPDATES, path: [], message: ERROR_MESSAGES.NO_UPDATES }],
          name: 'ValidationError', // ← was 'ZodError'
        },
      },
      HttpStatusCodes.UNPROCESSABLE_ENTITY,
    );
  }

  // ... rest of handler IDENTICAL
};

// remove — IDENTICAL
```

---

### `apps/server/src/routes/drink-volume/index.ts`

**Before** (`.openapi()` wiring on `OpenAPIHono`)
```ts
import { createRouter } from 'lib/create-app';
import * as handlers from './drink-volume.handlers';
import * as routes from './drink-volume.routes';

export default createRouter()
  .openapi(routes.list,   handlers.list)
  .openapi(routes.getOne, handlers.getOne)
  .openapi(routes.create, handlers.create)
  .openapi(routes.patch,  handlers.patch)
  .openapi(routes.remove, handlers.remove);
```

**After** (standard `Hono` with chained middleware)
```ts
import { validator } from 'hono-openapi';
import { createRouter } from 'lib/create-app';

import { volumeSchemas } from 'db/schemas/volumes.schema';
import { IdCuidParamsSchema } from 'schemas/id-cuid-params.schema';
import * as handlers from './drink-volume.handlers';
import * as routes from './drink-volume.routes';

const router = createRouter();

router.get('/drink-volumes',
  routes.list,
  handlers.list,
);

router.get('/drink-volumes/:id',
  routes.getOne,
  validator('param', IdCuidParamsSchema),
  handlers.getOne,
);

router.post('/drink-volumes',
  routes.create,
  validator('json', volumeSchemas.insert),
  handlers.create,
);

router.patch('/drink-volumes/:id',
  routes.patch,
  validator('param', IdCuidParamsSchema),
  validator('json', volumeSchemas.patch),
  handlers.patch,
);

router.delete('/drink-volumes/:id',
  routes.remove,
  validator('param', IdCuidParamsSchema),
  handlers.remove,
);

export default router;
```

> **Key differences:**
> - `.openapi(routeDef, handler)` → `.get/post/patch/delete(path, ...middlewares, handler)`
> - Path goes here now (was in `createRoute({ path })`)
> - `validator('json' | 'param', schema)` middleware replaces `request.body` / `request.params` from `createRoute`
> - Route order: `describeRoute` first → `validator` → handler
> - `c.req.valid('json')` and `c.req.valid('param')` in handlers **still work identically**

---

## OpenAPI spec endpoint

The `app.doc()` call on `OpenAPIHono` is replaced by `openAPIRouteHandler` from `hono-openapi`.

**Before** (somewhere in `apps/server/src/index.ts`)
```ts
app.doc('/docs', {
  openapi: '3.0.0',
  info: { title: 'Touch API', version: '1.0.0' },
});
```

**After**
```ts
import { openAPIRouteHandler } from 'hono-openapi';

app.get('/docs', openAPIRouteHandler(app, {
  documentation: {
    openapi: '3.0.0',
    info: { title: 'Touch API', version: '1.0.0' },
  },
}));
```

---

## Entity interfaces + client Model types

### What they are today

`apps/server/src/types/entities/` holds manually-maintained snake_case interfaces that
mirror the raw SQLite column shapes:

```ts
// apps/server/src/types/entities/volume.entity.ts
export interface VolumeEntity {
  id: string;
  name: string;
  translations: string;
  value_in_ml: number;   // raw DB column name
  sort_order: number;
  cooling_factor: number;
  is_active: number;     // stored as 0|1 integer
  created_at: number;
  updated_at: number;
}
```

**These do not change in this migration.** The DB schema is untouched.

---

### Why the migration makes this better

The entity interfaces represent the **raw SQLite layer** (pre-Drizzle mapping).
What the API actually returns — and what the client needs — is the **Drizzle-mapped camelCase shape**.

Today you'd have to maintain a separate `VolumeModel` interface by hand (and keep it in sync).
With `drizzle-orm/valibot`, that model type is derived automatically and can never drift:

```ts
// apps/server/src/db/schemas/volumes.schema.ts

export const volumeSchemas = {
  select: createSelectSchema(volumes, { ... }),
  insert: insertVolumeSchema,
  patch:  patchVolumeSchema,
} as const;

// ✅ Exact camelCase shape of what the API returns — derived, never drifts
export type VolumeModel  = v.InferOutput<typeof volumeSchemas.select>;
export type VolumeInsert = v.InferOutput<typeof volumeSchemas.insert>;
export type VolumePatch  = v.InferOutput<typeof volumeSchemas.patch>;
```

`VolumeModel` will look like:

```ts
// auto-derived — no manual maintenance
{
  id:            string;
  name:          string;
  translations:  Record<string, string> | undefined;
  valueInMl:     number;     // camelCase ✓
  sortOrder:     number;
  coolingFactor: number;
  isActive:      0 | 1;      // after sqliteBooleanField transform
  createdAt:     Date | null;
  updatedAt:     Date | null;
}
```

---

### Recommended approach

**Per schema file** — export the three model types alongside the schemas:

```ts
// bottom of volumes.schema.ts
export type VolumeModel  = v.InferOutput<typeof volumeSchemas.select>;
export type VolumeInsert = v.InferOutput<typeof volumeSchemas.insert>;
export type VolumePatch  = v.InferOutput<typeof volumeSchemas.patch>;
```

**Future step** (not this migration) — move to `packages/shared`:

```ts
// packages/shared/src/models/volume.model.ts
// Re-export from server schema OR duplicate the v.InferOutput definition
export type { VolumeModel, VolumeInsert, VolumePatch } from '@workspace/server/db/schemas/volumes.schema';
```

Once in `packages/shared`, the client imports the exact same types the server validates against —
no separate interface maintenance, no drift.

**The existing entity interfaces** (`VolumeEntity`, etc.) can remain as documentation of the raw
DB layer — useful if you ever write raw SQL that bypasses Drizzle. They don't conflict with
the new `VolumeModel` types; they just describe a different layer (pre-mapping vs post-mapping).

---

## Summary: what changes per route entity

| File | Change |
|------|--------|
| `*.schema.ts` | Import path only (`drizzle-zod` → `drizzle-orm/valibot`), override syntax (no callback wrapper), `.omit()` / `.partial()` become free functions |
| `*.routes.ts` | `createRoute()` → `describeRoute()`, remove `path`/`method`/`request` fields, swap `jsonContent` for `json()` helper |
| `*.handlers.ts` | Remove `// @ts-nocheck`, rename `ZodError` → `ValidationError`, update error import |
| `index.ts` | `.openapi(route, handler)` → `.get/.post/.patch/.delete(path, describeRoute, validator, handler)` |

Files that change **once** for the whole server (not per-route):

| File | Change |
|------|--------|
| `lib/create-app.ts` | `OpenAPIHono` → `Hono`, remove `defaultHook` |
| `lib/zod.utils.ts` | Replace with `lib/valibot.utils.ts` |
| `lib/zod.errors.ts` | Replace with `lib/valibot.errors.ts` |
| `lib/openapi.helpers.ts` | New file — `json()` / `jsonRequired()` helpers |
| `types/app.types.ts` | Remove `@hono/zod-openapi` types, use plain `Hono`/`Handler` |
| `schemas/id-cuid-params.schema.ts` | Zod → Valibot |
| `schemas/id-uuid-params.schema.ts` | Zod → Valibot |
| `schemas/params.schema.ts` | Zod → Valibot |
| `schemas/responses/error.schema.ts` | Zod → Valibot (absorbed into `valibot.errors.ts`) |
