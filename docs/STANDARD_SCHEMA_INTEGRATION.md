# Standard Schema Integration Guide

📅 Nov 23, 2025

## Overview

Standard Schema is a library-agnostic validation interface that allows you to use different validation libraries (Zod, Valibot, ArkType) through a common API. Better-auth has moved to Standard Schema internally, but you can continue using Zod while gaining the benefits of a universal interface.

## Key Concepts

### 1. **Standard Schema Doesn't Replace Zod**

- **Zod** = Your schemas (source of truth)
- **Standard Schema** = Universal wrapper/adapter layer
- **Better-auth** = Uses Standard Schema internally, but accepts Zod schemas via adapters

### 2. **Dual Export Pattern**

You can export both Zod and Standard Schema versions of the same schema:

```typescript
// apps/server/src/db/schemas/orders.schema.ts
import { z } from 'zod';
import { toStandardSchema } from '@standard-schema/zod';

// Your existing Zod schema (unchanged)
export const OrderInsertSchema = z.object({
  modeId: z.number().min(1),
  drinkType: z.string(),
  // ... rest of schema
});

// Export Standard Schema version (for forms)
export const OrderInsertStandardSchema = toStandardSchema(OrderInsertSchema);

// Keep exporting Zod version (for API validation)
export const orderSchemas = {
  insert: OrderInsertSchema,
  select: createSelectSchema(orders),
  patch: OrderInsertSchema.partial(),
} as const;
```

## Integration Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Your Monorepo                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Zod Schemas (Source of Truth)                          │
│  ├── apps/server/src/db/schemas/*.schema.ts            │
│  └── apps/client/src/**/*.schema.ts                    │
│         ↓                                               │
│  Standard Schema Adapter                                │
│  ├── toStandardSchema(zodSchema)                       │
│  └── Export both versions                               │
│         ↓                                               │
│  Usage Layers                                           │
│  ├── API Validation (Hono) → Use Zod directly          │
│  ├── Form Validation (RHF) → Use Standard Schema       │
│  └── Better-auth → Uses Standard Schema internally      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Current State vs. With Standard Schema

### **Current (Zod Only)**

```typescript
// Form component
import { zodResolver } from '@hookform/resolvers/zod';
import { ORDER_FORM_SCHEMA } from './OrdersForm.schema';

const form = useForm({
  resolver: zodResolver(ORDER_FORM_SCHEMA),
});
```

### **With Standard Schema**

```typescript
// Schema file (dual export)
import { z } from 'zod';
import { toStandardSchema } from '@standard-schema/zod';

export const ORDER_FORM_SCHEMA = z.object({ /* ... */ });
export const ORDER_FORM_STANDARD_SCHEMA = toStandardSchema(ORDER_FORM_SCHEMA);

// Form component
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { ORDER_FORM_STANDARD_SCHEMA } from './OrdersForm.schema';

const form = useForm({
  resolver: standardSchemaResolver(ORDER_FORM_STANDARD_SCHEMA),
});
```

## Benefits

### ✅ **1. Future-Proof**

If you want to switch from Zod to Valibot or ArkType later:
- Change the adapter: `toStandardSchema(valibotSchema)`
- Forms don't need changes (they use Standard Schema interface)

### ✅ **2. Better-auth Compatibility**

- Better-auth uses Standard Schema internally
- Your Zod schemas work via adapters
- No breaking changes to your existing schemas

### ✅ **3. Consistent Validation Interface**

- Same validation API across all forms
- Easier to maintain and test
- Library-agnostic validation logic

### ✅ **4. No Zod Replacement Needed**

- Keep all your Zod schemas
- Just add Standard Schema adapters
- Use Standard Schema for forms, Zod for APIs

## Migration Strategy

### **Phase 1: Install Dependencies**

```bash
# Add Standard Schema adapter for Zod
pnpm add @standard-schema/zod --filter @workspace/client
pnpm add @standard-schema/zod --filter @workspace/server

# Update React Hook Form resolvers (if needed)
pnpm add @hookform/resolvers@latest --filter @workspace/client
```

### **Phase 2: Update Schema Files (Gradual)**

For each schema file, add Standard Schema export:

```typescript
// Before
export const OrderSchema = z.object({ /* ... */ });

// After
export const OrderSchema = z.object({ /* ... */ });
export const OrderStandardSchema = toStandardSchema(OrderSchema);
```

### **Phase 3: Update Forms (One at a Time)**

```typescript
// Before
import { zodResolver } from '@hookform/resolvers/zod';
resolver: zodResolver(OrderSchema)

// After
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
resolver: standardSchemaResolver(OrderStandardSchema)
```

### **Phase 4: API Validation (Keep Zod)**

```typescript
// Server-side API validation (unchanged)
import { OrderSchema } from 'db/schemas';

app.post('/orders', async (c) => {
  const data = OrderSchema.parse(c.req.json()); // Still use Zod
  // ...
});
```

## Impact on Your Monorepo

### **What Changes:**

1. **Schema Files**: Add Standard Schema exports alongside Zod
2. **Form Components**: Switch from `zodResolver` to `standardSchemaResolver`
3. **Better-auth**: Already compatible (uses Standard Schema internally)

### **What Stays the Same:**

1. **Zod Schemas**: All your existing schemas remain unchanged
2. **API Validation**: Continue using Zod directly (Hono, Drizzle)
3. **Type Inference**: Still get full TypeScript types from Zod

### **What You Gain:**

1. **Flexibility**: Can switch validators in the future without changing forms
2. **Better-auth Compatibility**: Aligns with Better-auth's direction
3. **Consistency**: Universal validation interface across forms

## Example: Complete Integration

### **Schema File**

```typescript
// apps/server/src/db/schemas/orders.schema.ts
import { z } from 'zod';
import { toStandardSchema } from '@standard-schema/zod';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const orders = sqliteTable(/* ... */);

// Zod schemas (unchanged)
const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const orderSchemas = {
  select: createSelectSchema(orders),
  insert: insertOrderSchema,
  patch: insertOrderSchema.partial(),
} as const;

// Standard Schema exports (new)
export const orderStandardSchemas = {
  select: toStandardSchema(orderSchemas.select),
  insert: toStandardSchema(orderSchemas.insert),
  patch: toStandardSchema(orderSchemas.patch),
} as const;
```

### **Form Component**

```typescript
// apps/client/src/admin/pages/AdminOrdersPage/OrdersForm/OrdersForm.tsx
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { orderStandardSchemas } from '@workspace/server/db/schemas';

const form = useForm({
  resolver: standardSchemaResolver(orderStandardSchemas.insert),
  // ... rest of config
});
```

### **API Handler (Unchanged)**

```typescript
// apps/server/src/routes/orders/orders.handlers.ts
import { orderSchemas } from 'db/schemas'; // Still use Zod

export const create = async (c) => {
  const data = orderSchemas.insert.parse(c.req.json()); // Zod validation
  // ...
};
```

## Better-auth Integration

Better-auth now uses Standard Schema internally, but:

- **You can still pass Zod schemas** (they get converted internally)
- **Or use Standard Schema directly** for better type inference
- **No breaking changes** to your auth setup

## Recommendations

### **✅ Do:**

1. Add Standard Schema adapters gradually
2. Start with new forms, migrate old ones over time
3. Keep Zod for API validation (simpler, direct)
4. Use Standard Schema for form validation (future-proof)

### **❌ Don't:**

1. Don't replace Zod entirely (it's still great for APIs)
2. Don't migrate everything at once (gradual is better)
3. Don't change existing API validation (Zod works fine there)

## Next Steps

1. **Test in one form first** (e.g., OrdersForm)
2. **Verify Better-auth compatibility** (should work out of the box)
3. **Gradually migrate other forms** as you touch them
4. **Keep Zod for APIs** (no need to change there)

## Resources

- **Standard Schema**: https://github.com/standard-schema/standard-schema
- **Zod Adapter**: `@standard-schema/zod`
- **React Hook Form**: `@hookform/resolvers/standard-schema`
- **Better-auth Docs**: https://www.better-auth.com/docs

