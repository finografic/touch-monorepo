# tRCP in monorepo

📅 Nov 15, 2025 (approx)

## **Would tRPC Be a Good Choice for Your Project?**

### **✅ YES - You're an IDEAL candidate for tRPC!**

**Why?**

1. ✅ **Monorepo** - You have `apps/client` + `apps/server` in one repo
2. ✅ **TypeScript everywhere** - Both frontend & backend use TS
3. ✅ **Hono backend** - Has official tRPC adapter
4. ✅ **Already using Zod** - Server routes already use `@hono/zod-openapi`
5. ✅ **React Query setup** - You're already using `@tanstack/react-query`
6. ✅ **Internal API** - Not a public API for external consumers

**Your project checks ALL the boxes!** 🎯

---

## **What Would tRPC Replace in Your Repo?**

### **Current Architecture**

```
┌─────────────────────────────────────────────────────────┐
│  apps/server/                                           │
│                                                         │
│  routes/orders/orders.routes.ts                        │
│    - Hono routes with Zod schemas                      │
│    - OpenAPI spec definitions                          │
│                                                         │
│  routes/orders/orders.handlers.ts                      │
│    - Handler implementations                           │
│                                                         │
│  routes/orders/index.ts                                │
│    - .openapi(routes.list, handlers.list)             │
│    - .openapi(routes.create, handlers.create)         │
└─────────────────────────────────────────────────────────┘
            ↓ HTTP (REST API)
┌─────────────────────────────────────────────────────────┐
│  apps/client/                                           │
│                                                         │
│  queries/orders/useGetOrdersReadable.ts                │
│    - Manual React Query hook                           │
│    - Manual axios call                                 │
│    - Manual error handling                             │
│                                                         │
│  queries/orders/useDeleteOrder.ts                      │
│    - Manual mutation hook                              │
│    - Manual types (imported separately)                │
└─────────────────────────────────────────────────────────┘
```

---

### **With tRPC Architecture**

```
┌─────────────────────────────────────────────────────────┐
│  apps/server/                                           │
│                                                         │
│  trpc/router.ts                                        │
│    export const appRouter = t.router({                 │
│      orders: t.router({                                │
│        list: t.procedure                               │
│          .query(() => db.query.orders.findMany()),     │
│        create: t.procedure                             │
│          .input(orderSchema)                           │
│          .mutation(({ input }) => ...),                │
│      }),                                               │
│    });                                                 │
│                                                         │
│    export type AppRouter = typeof appRouter;           │
└─────────────────────────────────────────────────────────┘
            ↓ Type-safe RPC (only types cross boundary)
┌─────────────────────────────────────────────────────────┐
│  apps/client/                                           │
│                                                         │
│  AdminOrdersListPage.tsx                               │
│    const { data } = trpc.orders.list.useQuery();      │
│    const deleteMutation = trpc.orders.delete.useMutation(); │
│                                                         │
│    // ✅ Full autocomplete                              │
│    // ✅ Type safety                                    │
│    // ✅ No manual hooks needed!                        │
└─────────────────────────────────────────────────────────┘
```

---

## **What Gets Replaced (File by File)**

### **❌ REMOVE (or drastically simplify)**

#### **1. All `queries/*` folders → Replaced by tRPC client**

```typescript
// ❌ DELETE: apps/client/src/queries/orders/useGetOrdersReadable.ts
export const useGetOrdersReadable = () => {
  return useQuery({
    queryKey: ORDERS_READABLE_QUERY_KEYS.lists(),
    queryFn: async (): Promise<OrderReadableModel[]> => {
      try {
        const response = await api.get('/orders-readable');
        return response.data;
      } catch (error) {
        throw transformAxiosError(error);
      }
    },
    staleTime: 5 * 60 * 1000,
  });
};

// ✅ REPLACE WITH: Just use tRPC directly in components
const { data } = trpc.orders.listReadable.useQuery();
```

#### **2. All manual API hooks → One tRPC client**

**Current structure (REMOVE):**

```
apps/client/src/queries/
  ├─ orders/                    # ~6 files → DELETE
  │   ├─ useGetOrdersReadable.ts
  │   ├─ useGetOrderReadableById.ts
  │   ├─ useCreateOrder.ts
  │   ├─ useDeleteOrder.ts
  │   ├─ useUpdateOrder.ts
  │   └─ useUpdateTemperatureProfiles.ts
  ├─ modes/                     # ~5 files → DELETE
  ├─ slot-configurations/       # ~7 files → DELETE
  ├─ relays/                    # ~9 files → DELETE
  ├─ sounds/                    # ~5 files → DELETE
  └─ temperature/               # ~2 files → DELETE
```

**Total removed:** ~34 files! 😮

**Replaced by:**

```
apps/client/src/lib/trpc.ts   # One 10-line setup file
```

---

#### **3. Server route structure (SIMPLIFY)**

**Current (3 files per resource):**

```
apps/server/src/routes/orders/
  ├─ orders.routes.ts     # ~200 lines - OpenAPI specs
  ├─ orders.handlers.ts   # ~220 lines - Implementation
  └─ index.ts             # ~13 lines - Wiring
```

**With tRPC (1 file per resource):**

```
apps/server/src/trpc/routers/
  └─ orders.router.ts     # ~80 lines - Everything in one place!
```

**Example - Before vs After:**

```typescript
// ❌ CURRENT: orders.routes.ts (200 lines)
export const list = createRoute({
  path: '/orders',
  method: 'get',
  tags: ['DrinkOrders'],
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(orderSchemas.select.pick({ /* ... */ })),
      'List of available drink orders',
    ),
  },
});

// ❌ CURRENT: orders.handlers.ts (220 lines)
export const list: AppRouteHandler<ListRoute> = async (context) => {
  const drinkOrders = await db.query.orders.findMany({
    where: (fields, operators) => operators.eq(fields.isActive, true),
    columns: { /* ... */ },
  });
  return context.json(drinkOrders);
};

// ❌ CURRENT: index.ts (13 lines)
export default createRouter()
  .openapi(routes.list, handlers.list)
  .openapi(routes.create, handlers.create)
  // ...
```

```typescript
// ✅ WITH tRPC: orders.router.ts (80 lines total!)
export const ordersRouter = t.router({
  list: t.procedure
    .query(async () => {
      return await db.query.orders.findMany({
        where: (fields, ops) => ops.eq(fields.isActive, true),
      });
    }),

  listReadable: t.procedure
    .query(async () => {
      return await db.all(`SELECT * FROM orders_readable WHERE is_active = 1`);
    }),

  create: t.procedure
    .input(orderSchemas.insert)
    .mutation(async ({ input }) => {
      const [order] = await db.insert(orders).values(input).returning();
      return order;
    }),

  delete: t.procedure
    .input(z.string())
    .mutation(async ({ input: id }) => {
      await db.delete(temperature_profiles).where(eq(temperature_profiles.orderId, id));
      await db.delete(orders).where(eq(orders.id, id));
    }),

  // All CRUD in one file!
});
```

---

### **✅ KEEP (but enhance)**

#### **1. Zod schemas → Reuse in tRPC!**

```typescript
// ✅ KEEP: apps/server/src/db/schemas/orders.schema.ts
export const orderSchemas = {
  select: z.object({ /* ... */ }),
  insert: z.object({ /* ... */ }),
  patch: z.object({ /* ... */ }),
};

// ✅ USE IN tRPC:
export const ordersRouter = t.router({
  create: t.procedure
    .input(orderSchemas.insert)  // ✅ Reuse existing Zod schemas!
    .mutation(({ input }) => db.insert(orders).values(input)),
});
```

#### **2. Database layer → No changes**

```typescript
// ✅ KEEP: All Drizzle ORM code stays the same
const drinkOrders = await db.query.orders.findMany({ /* ... */ });
```

#### **3. React Query setup → Enhanced**

```typescript
// ✅ KEEP: QueryClientProvider (same setup)
// ✅ ENHANCE: Wrap with tRPC provider

<trpc.Provider client={trpcClient} queryClient={queryClient}>
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
</trpc.Provider>
```

---

## **tRPC + Zod + Standard Schema: Can They Coexist?**

### **✅ YES - They Work Beautifully Together!**

```
┌─────────────────────────────────────────────────────────┐
│                    Your Tech Stack                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Zod                    (Validation layer)              │
│    ↓                                                    │
│  Standard Schema        (Universal interface)           │
│    ↓                                                    │
│  tRPC                   (Type-safe API layer)           │
│    ↓                                                    │
│  React Query            (Caching & state)               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

### **How They Work Together**

#### **1. Zod → tRPC (Native Support)**

```typescript
import { z } from 'zod';

const OrderSchema = z.object({
  customerId: z.number(),
  items: z.array(z.number()),
});

export const ordersRouter = t.router({
  create: t.procedure
    .input(OrderSchema)  // ✅ tRPC uses Zod natively!
    .mutation(({ input }) => {
      // input is fully typed from Zod schema
      return db.insert(orders).values(input);
    }),
});
```

---

#### **2. Zod → Standard Schema (for forms)**

```typescript
import { toStandardSchema } from '@standard-schema/zod';

const OrderSchema = z.object({ /* ... */ });

// Use in React Hook Form
const form = useForm({
  resolver: standardSchemaResolver(toStandardSchema(OrderSchema)),
});
```

---

#### **3. All Together**

```typescript
// ─────────────────────────────────────────────────────
// apps/server/src/trpc/routers/orders.router.ts
// ─────────────────────────────────────────────────────
import { z } from 'zod';
import { orderSchemas } from 'db/schemas/orders.schema';

export const ordersRouter = t.router({
  create: t.procedure
    .input(orderSchemas.insert)  // Zod schema
    .mutation(({ input }) => {
      return db.insert(orders).values(input);
    }),
});

// ─────────────────────────────────────────────────────
// apps/client/src/admin/pages/AdminOrdersPage.tsx
// ─────────────────────────────────────────────────────
import { toStandardSchema } from '@standard-schema/zod';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { orderSchemas } from '@workspace/server/db/schemas/orders.schema';

function AdminOrderEditPage() {
  // 1. tRPC for API calls
  const createOrder = trpc.orders.create.useMutation();

  // 2. Standard Schema for form validation (same Zod schema!)
  const form = useForm({
    resolver: standardSchemaResolver(toStandardSchema(orderSchemas.insert)),
  });

  // 3. Both use the same Zod schema - single source of truth!
  const onSubmit = (data) => {
    createOrder.mutate(data);
  };

  return <form onSubmit={form.handleSubmit(onSubmit)}>...</form>;
}
```

**Benefits:**
- ✅ **One Zod schema** for both API validation & form validation
- ✅ **Standard Schema** makes forms library-agnostic
- ✅ **tRPC** provides end-to-end type safety
- ✅ **All work together** seamlessly!

---

## **Migration Path (If You Decide to Adopt tRPC)**

### **Phase 1: Setup (1 hour)**

1. Install tRPC packages
2. Create base tRPC setup
3. Add one router (e.g., `orders`)

### **Phase 2: Migrate Gradually (resource by resource)**

**Week 1:** Migrate `orders` endpoints
**Week 2:** Migrate `modes` endpoints
**Week 3:** Migrate `slots` endpoints
etc.

**Both systems can coexist!** You can have:
- `/api/orders` (REST - old)
- `/trpc/orders.list` (tRPC - new)

Side-by-side during migration.

### **Phase 3: Remove Old Code**

Once all resources migrated:
- Delete `queries/*` folders (34+ files)
- Delete `routes/*/routes.ts` files
- Delete `routes/*/handlers.ts` files
- Keep Zod schemas (reuse in tRPC)

**Estimated time saved:** ~2000 lines of boilerplate code! 🎉

---

## **Summary**

### **1. Would tRPC be good for your project?**

**✅ ABSOLUTELY - You're a perfect fit!**

### **2. What would it replace?**

| Current | Replaced By |
|---------|-------------|
| **34+ manual React Query hooks** | `trpc.*.useQuery()` - auto-generated |
| **3 files per API resource** (routes, handlers, index) | **1 file** (tRPC router) |
| **Manual type imports** | Type inference from server |
| **Manual error handling** | Built into tRPC |
| **~2000 lines of boilerplate** | ~200 lines of tRPC config |

### **3. Would it fit with Standard Schema?**

**✅ YES - Perfect combo:**

```
Zod (validation)
  ↓
Standard Schema (form validation)
  ↓
tRPC (API layer)
  ↓
React Query (caching)
```

### **4. Can you use Zod + Standard Schema + tRPC together?**

**✅ YES - They're designed to work together!**

- **Zod** = Your schemas (single source of truth)
- **Standard Schema** = Universal validator interface (for forms)
- **tRPC** = Type-safe API (uses Zod natively)

**Example:**

```typescript
const OrderSchema = z.object({ /* ... */ });

// Use in tRPC
.input(OrderSchema)

// Use in forms
resolver: standardSchemaResolver(toStandardSchema(OrderSchema))

// Same schema, multiple uses!
```

---

## **My Recommendation**

**For your project:** tRPC would be **transformative**! 🚀

**Benefits you'd see:**
1. ✅ **Delete ~34 manual hook files**
2. ✅ **Reduce server code by 60%** (3 files → 1 per resource)
3. ✅ **Full type safety** (catch bugs at compile-time)
4. ✅ **Autocomplete everywhere** (better DX)
5. ✅ **Faster development** (no manual API client code)
6. ✅ **Keep your Zod schemas** (reuse in tRPC)
7. ✅ **Standard Schema works great** with it

**When to migrate:**
- ⚠️ **After BetterAuth is stable** (don't mix big migrations)
- ⚠️ **After Zod v3/v4 decision** (wait for ecosystem stability)
- ✅ **Good for "next phase"** of your project

**Want me to create a migration plan or proof-of-concept for one resource (e.g., orders)?** 🎯
