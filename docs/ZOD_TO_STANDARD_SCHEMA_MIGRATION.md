# Phasing Out Zod: Standard Schema + Valibot Migration Guide

📅 Nov 23, 2025

## Overview

This guide shows how to completely replace Zod with **Valibot** (a lightweight, tree-shakeable alternative) while using **Standard Schema** as the universal validation interface. This approach gives you:

- ✅ **Smaller bundle size** (Valibot is ~1KB vs Zod's ~13KB)
- ✅ **Better tree-shaking** (only imports what you use)
- ✅ **Standard Schema compatibility** (works with Better-auth, RHF, etc.)
- ✅ **Similar API** (easy migration from Zod)

---

## 1. Schema Examples: Zod → Valibot + Standard Schema

### **Example 1: Drizzle Schema (orders.schema.ts)**

#### **Before (Zod):**

```typescript
// apps/server/src/db/schemas/orders.schema.ts
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const orders = sqliteTable('orders', {
  id: text('id').primaryKey(),
  modeId: text('mode_id').notNull(),
  drinkTypeId: text('drink_type_id').notNull(),
  defaultTempConsume: integer('default_temp_consume').notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  // ... more fields
});

const insertOrderSchema = createInsertSchema(orders, {
  modeId: (schema) => schema.min(1, 'Mode is required'),
  defaultTempConsume: (schema) =>
    schema
      .min(TEMPERATURE_RANGES.CONSUMPTION.MIN)
      .max(TEMPERATURE_RANGES.CONSUMPTION.MAX),
  isActive: () => sqliteBooleanField(),
})
  .required({
    modeId: true,
    drinkTypeId: true,
  })
  .omit({ id: true, createdAt: true, updatedAt: true });

export const orderSchemas = {
  select: createSelectSchema(orders),
  insert: insertOrderSchema,
  patch: insertOrderSchema.partial(),
} as const;
```

#### **After (Valibot + Standard Schema):**

```typescript
// apps/server/src/db/schemas/orders.schema.ts
import * as v from 'valibot';
import { toStandardSchema } from '@standard-schema/valibot';
import { drizzleToValibot } from 'drizzle-valibot'; // Custom helper (see below)

export const orders = sqliteTable('orders', {
  // ... same table definition
});

// Manual Valibot schema (drizzle-valibot doesn't exist, so we create manually)
const insertOrderSchemaBase = v.object({
  modeId: v.pipe(
    v.string(),
    v.minLength(1, 'Mode is required'),
  ),
  drinkTypeId: v.pipe(
    v.string(),
    v.minLength(1, 'Drink type is required'),
  ),
  defaultTempConsume: v.pipe(
    v.number(),
    v.minValue(TEMPERATURE_RANGES.CONSUMPTION.MIN),
    v.maxValue(TEMPERATURE_RANGES.CONSUMPTION.MAX),
  ),
  isActive: v.boolean(),
  // ... more fields
});

// Select schema (all fields from table)
const selectOrderSchema = v.object({
  id: v.string(),
  modeId: v.string(),
  drinkTypeId: v.string(),
  defaultTempConsume: v.number(),
  isActive: v.boolean(),
  createdAt: v.nullable(v.date()),
  updatedAt: v.nullable(v.date()),
  // ... all fields
});

// Export Valibot schemas
export const orderSchemas = {
  select: selectOrderSchema,
  insert: insertOrderSchemaBase,
  patch: v.partial(insertOrderSchemaBase),
} as const;

// Export Standard Schema versions (for Better-auth, RHF, etc.)
export const orderStandardSchemas = {
  select: toStandardSchema(orderSchemas.select),
  insert: toStandardSchema(orderSchemas.insert),
  patch: toStandardSchema(orderSchemas.patch),
} as const;
```

---

### **Example 2: Route Params Schema**

#### **Before (Zod):**

```typescript
// apps/server/src/schemas/id-cuid-params.schema.ts
import { z } from '@hono/zod-openapi';
import { isCuid } from 'utils/cuid-validation';

export const IdCuidParamsSchema = z.object({
  id: z
    .string()
    .openapi({
      description: 'Resource identifier (CUID)',
      example: 'clh8k6w3f0003mp5hf1qdqn8q',
    })
    .refine((val) => isCuid(val), {
      message: 'Invalid ID format - must be a valid CUID',
    }),
});
```

#### **After (Valibot + Standard Schema):**

```typescript
// apps/server/src/schemas/id-cuid-params.schema.ts
import * as v from 'valibot';
import { toStandardSchema } from '@standard-schema/valibot';
import { isCuid } from 'utils/cuid-validation';

// Valibot schema
export const IdCuidParamsSchema = v.object({
  id: v.pipe(
    v.string(),
    v.custom((val) => isCuid(val), 'Invalid ID format - must be a valid CUID'),
  ),
});

// Standard Schema version
export const IdCuidParamsStandardSchema = toStandardSchema(IdCuidParamsSchema);

// OpenAPI metadata (for Hono OpenAPI)
export const IdCuidParamsOpenApi = {
  ...IdCuidParamsSchema,
  openapi: {
    description: 'Resource identifier (CUID)',
    example: 'clh8k6w3f0003mp5hf1qdqn8q',
  },
};
```

---

## 2. Handler Changes: How Request Validation Works

### **Before (Zod with Hono):**

```typescript
// apps/server/src/routes/users/users.handlers.ts
import { AppRouteHandler } from 'types/app.types';
import type { PatchRoute } from './users.routes';

export const patch: AppRouteHandler<PatchRoute> = async (context) => {
  const { id } = context.req.valid('param'); // Zod-validated
  const updates = context.req.valid('json'); // Zod-validated

  // updates is typed from Zod schema
  const [updated] = await db.update(userSchema)
    .set(updates)
    .where(eq(userSchema.id, id))
    .returning();

  return context.json(updated, HttpStatusCodes.OK);
};
```

### **After (Valibot with Hono):**

```typescript
// apps/server/src/routes/users/users.handlers.ts
import * as v from 'valibot';
import { valibotValidator } from '@hono/valibot-validator';
import { AppRouteHandler } from 'types/app.types';
import type { PatchRoute } from './users.routes';
import { userSchemas } from 'db/schemas/auth_user.schema';

export const patch: AppRouteHandler<PatchRoute> = async (context) => {
  // Valibot validation (via Hono validator middleware)
  const { id } = context.req.valid('param'); // Valibot-validated
  const updates = context.req.valid('json'); // Valibot-validated

  // updates is typed from Valibot schema (same type inference)
  const [updated] = await db.update(userSchema)
    .set(updates)
    .where(eq(userSchema.id, id))
    .returning();

  return context.json(updated, HttpStatusCodes.OK);
};
```

**Note:** The handler code stays the same! Only the route definition changes (see section 3).

---

## 3. Route Definition Changes

### **Before (Zod OpenAPI):**

```typescript
// apps/server/src/routes/users/users.routes.ts
import { createRoute, z } from '@hono/zod-openapi';
import { userSchemas } from 'db/schemas/auth_user.schema';

export const patch = createRoute({
  path: '/users/{id}',
  method: 'patch',
  request: {
    params: IdCuidParamsSchema, // Zod schema
    body: jsonContentRequired(userSchemas.patch, 'The user updates'), // Zod schema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(userSchemas.select, 'The updated user'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(userSchemas.patch),
      'The validation error(s)',
    ),
  },
});
```

### **After (Valibot OpenAPI):**

```typescript
// apps/server/src/routes/users/users.routes.ts
import { createRoute } from '@hono/valibot-openapi'; // Changed package
import * as v from 'valibot';
import { userSchemas } from 'db/schemas/auth_user.schema';

export const patch = createRoute({
  path: '/users/{id}',
  method: 'patch',
  request: {
    params: IdCuidParamsSchema, // Valibot schema
    body: jsonContentRequired(userSchemas.patch, 'The user updates'), // Valibot schema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(userSchemas.select, 'The updated user'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(userSchemas.patch), // Helper converts Valibot errors
      'The validation error(s)',
    ),
  },
});
```

**Note:** If `@hono/valibot-openapi` doesn't exist, you may need to:
1. Use `@hono/valibot-validator` for validation
2. Manually define OpenAPI schemas using `valibotToJsonSchema` helper
3. Or contribute to Hono to add Valibot OpenAPI support

---

## 4. Package Replacements

### **Current Zod Packages:**

| Package | Purpose | Replacement |
|---------|---------|-------------|
| `zod` | Core validation library | `valibot` |
| `@hono/zod-openapi` | Hono OpenAPI integration | `@hono/valibot-openapi` (if exists) or manual OpenAPI |
| `@hono/zod-validator` | Hono request validation | `@hono/valibot-validator` |
| `drizzle-zod` | Drizzle schema generation | **Manual schemas** (no direct replacement) |

### **New Standard Schema Packages:**

| Package | Purpose |
|---------|---------|
| `@standard-schema/valibot` | Convert Valibot schemas to Standard Schema |
| `@hookform/resolvers` | React Hook Form resolver (already supports Standard Schema) |

### **Installation:**

```bash
# Remove Zod
pnpm remove zod @hono/zod-openapi @hono/zod-validator drizzle-zod

# Install Valibot + Standard Schema
pnpm add valibot @standard-schema/valibot --filter @workspace/server
pnpm add valibot @standard-schema/valibot --filter @workspace/client

# Install Hono Valibot support (if available)
pnpm add @hono/valibot-validator --filter @workspace/server

# Update React Hook Form (if needed)
pnpm add @hookform/resolvers@latest --filter @workspace/client
```

---

## 5. Drizzle Schema Generation: The Challenge

**Problem:** `drizzle-zod` automatically generates Zod schemas from Drizzle tables. There's **no equivalent** for Valibot.

### **Solution Options:**

#### **Option A: Manual Schema Creation (Recommended)**

Create Valibot schemas manually, matching your Drizzle table structure:

```typescript
// apps/server/src/db/schemas/orders.schema.ts
import * as v from 'valibot';
import { orders } from './orders.table'; // Drizzle table definition

// Manual Valibot schema matching the table
export const orderSchemas = {
  select: v.object({
    id: v.string(),
    modeId: v.string(),
    drinkTypeId: v.string(),
    // ... match all table columns
  }),
  insert: v.object({
    modeId: v.string(),
    drinkTypeId: v.string(),
    // ... omit id, timestamps
  }),
  patch: v.partial(/* insert schema */),
} as const;
```

**Pros:**
- ✅ Full control over validation
- ✅ Can add custom validators
- ✅ No dependency on auto-generation

**Cons:**
- ❌ Manual maintenance (must update when table changes)
- ❌ More boilerplate

#### **Option B: Create a Helper Function**

Create a utility that converts Drizzle table definitions to Valibot schemas:

```typescript
// apps/server/src/lib/drizzle-to-valibot.ts
import * as v from 'valibot';
import type { SQLiteTable } from 'drizzle-orm/sqlite-core';

export function drizzleToValibot<T extends SQLiteTable>(table: T) {
  // Inspect table.columns and generate Valibot schema
  // This is complex and may not support all Drizzle features
  // ... implementation
}
```

**Pros:**
- ✅ Automatic schema generation
- ✅ Stays in sync with table changes

**Cons:**
- ❌ Complex to implement
- ❌ May not support all Drizzle column types
- ❌ Maintenance burden

#### **Option C: Keep Zod for Drizzle, Use Valibot for Routes**

Hybrid approach:

```typescript
// Keep drizzle-zod for schema generation
import { createInsertSchema } from 'drizzle-zod';
import { toStandardSchema } from '@standard-schema/zod';

// Generate Zod schema
const insertOrderSchemaZod = createInsertSchema(orders);

// Convert to Standard Schema
export const insertOrderSchema = toStandardSchema(insertOrderSchemaZod);

// Use Standard Schema everywhere (forms, Better-auth)
// But still have Zod as a dependency (smaller impact)
```

**Pros:**
- ✅ Minimal changes
- ✅ Automatic schema generation
- ✅ Standard Schema interface everywhere

**Cons:**
- ❌ Still depends on Zod (but only for Drizzle)
- ❌ Not a complete Zod removal

---

## 6. Migration Strategy

### **Phase 1: Install Dependencies**

```bash
pnpm add valibot @standard-schema/valibot --filter @workspace/server
pnpm add valibot @standard-schema/valibot --filter @workspace/client
```

### **Phase 2: Create Valibot Schemas (One File at a Time)**

Start with simple schemas (route params, simple forms):

```typescript
// 1. Convert id-cuid-params.schema.ts
// 2. Convert simple form schemas
// 3. Convert complex Drizzle schemas last
```

### **Phase 3: Update Route Definitions**

```typescript
// Replace @hono/zod-openapi with @hono/valibot-validator
// Update createRoute calls
// Test each route
```

### **Phase 4: Update Forms**

```typescript
// Replace zodResolver with standardSchemaResolver
// Use Standard Schema versions of schemas
```

### **Phase 5: Remove Zod**

```bash
pnpm remove zod @hono/zod-openapi @hono/zod-validator drizzle-zod
```

---

## 7. Key Differences: Zod vs Valibot

| Feature | Zod | Valibot |
|---------|-----|---------|
| **Bundle Size** | ~13KB | ~1KB (tree-shakeable) |
| **API Style** | Method chaining | Pipe-based |
| **Type Inference** | ✅ Excellent | ✅ Excellent |
| **OpenAPI Support** | ✅ Built-in | ⚠️ Manual or community |
| **Drizzle Integration** | ✅ `drizzle-zod` | ❌ Manual only |
| **Standard Schema** | ✅ `@standard-schema/zod` | ✅ `@standard-schema/valibot` |

### **API Comparison:**

```typescript
// Zod
z.string().min(1).max(50).email()

// Valibot
v.pipe(
  v.string(),
  v.minLength(1),
  v.maxLength(50),
  v.email(),
)
```

---

## 8. Recommendations

### **✅ Do:**

1. **Start Small**: Convert route params and simple schemas first
2. **Use Standard Schema**: Export both Valibot and Standard Schema versions
3. **Test Thoroughly**: Valibot has different error messages than Zod
4. **Consider Hybrid**: Keep Zod for Drizzle if manual schemas are too much work

### **❌ Don't:**

1. **Don't Migrate Everything at Once**: Gradual migration is safer
2. **Don't Remove Zod Until Ready**: Keep both during migration
3. **Don't Skip Testing**: Valibot errors may differ from Zod

---

## 9. Alternative: Keep Zod, Use Standard Schema

If complete Zod removal is too complex, consider:

- ✅ Keep Zod for Drizzle schemas and API validation
- ✅ Use Standard Schema adapters for forms and Better-auth
- ✅ Get Standard Schema benefits without full migration

This is the approach recommended in `docs/STANDARD_SCHEMA_INTEGRATION.md`.

---

## Resources

- **Valibot**: https://valibot.dev/
- **Standard Schema**: https://github.com/standard-schema/standard-schema
- **Valibot Adapter**: `@standard-schema/valibot`
- **Hono Valibot**: Check Hono docs for latest support

