# tRCP + Hono in monorepo

📅 Nov 15, 2025 (approx)

## **Does tRPC Replace Hono?**

### **❌ NO - They work together!**

**tRPC is NOT a server framework** - it's an **API layer** that runs **on top of** server frameworks like:
- Hono
- Express
- Fastify
- Next.js
- etc.

Think of it like this:

```
┌─────────────────────────────────────────────────────┐
│  Hono (HTTP Server)                                 │
│    - Handles HTTP requests                          │
│    - Routing                                        │
│    - Middleware (CORS, auth, logging)               │
│    - Serving static files                           │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │  tRPC (API Layer)                             │  │
│  │    - Type-safe procedures                     │  │
│  │    - Input/output validation                  │  │
│  │    - Mounted at /trpc/*                       │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │  REST API (Optional - can coexist!)           │  │
│  │    - /api/health                              │  │
│  │    - /api/public/*                            │  │
│  │    - For external consumers                   │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

---

## **How tRPC Integrates with Hono**

### **Current Hono Setup (Your Project)**

```typescript
// apps/server/src/app.ts
import createApp from 'lib/create-app';
import orders from 'routes/orders';

const app = createApp(); // Returns Hono instance

// CORS middleware
app.use('/*', cors({ /* ... */ }));

// Mount REST routes
app.route('/api', orders);

export default app;
```

---

### **With tRPC Added (Hono + tRPC)**

```typescript
// apps/server/src/app.ts
import createApp from 'lib/create-app';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from './trpc/router';
import orders from 'routes/orders'; // ✅ Can keep REST routes!

const app = createApp(); // Still using Hono!

// ✅ CORS middleware (same as before)
app.use('/*', cors({ /* ... */ }));

// ✅ tRPC endpoint (new!)
app.all('/trpc/*', (c) => {
  return fetchRequestHandler({
    endpoint: '/trpc',
    req: c.req.raw,
    router: appRouter,
    createContext: () => ({ /* auth, db, etc. */ }),
  });
});

// ✅ REST routes (can coexist!)
app.route('/api', orders);

// ✅ Health check (keep for monitoring)
app.get('/health', (c) => c.json({ status: 'ok' }));

export default app;
```

**Key points:**
1. ✅ **Hono still handles HTTP** - routing, middleware, CORS, etc.
2. ✅ **tRPC is mounted at `/trpc/*`** - just another route!
3. ✅ **REST routes can coexist** - `/api/*` for public/external APIs
4. ✅ **All Hono middleware works** - auth, logging, rate limiting, etc.

---

## **Request Flow**

### **tRPC Request**

```
Client: trpc.orders.list.useQuery()
  ↓
GET http://localhost:4040/trpc/orders.list
  ↓
Hono receives request
  ↓
CORS middleware (Hono)
  ↓
Auth middleware (Hono) - optional
  ↓
Routes to /trpc/* handler
  ↓
tRPC fetchRequestHandler
  ↓
Executes orders.list procedure
  ↓
Returns typed response
```

### **REST Request (if you keep some)**

```
Client: fetch('/api/health')
  ↓
GET http://localhost:4040/api/health
  ↓
Hono receives request
  ↓
CORS middleware (Hono)
  ↓
Routes to /api/health
  ↓
Returns response
```

**Both go through Hono first!** 🎯

---

## **Integration Code (Detailed)**

### **Step 1: Install tRPC Packages**

```bash
pnpm add @trpc/server @trpc/client @trpc/react-query
```

---

### **Step 2: Create tRPC Context (Optional but Recommended)**

```typescript
// apps/server/src/trpc/context.ts
import type { Context } from 'hono';
import { db } from 'db';

export async function createTRPCContext(honoContext: Context) {
  // Pass Hono context data to tRPC
  return {
    db,
    userId: honoContext.get('userId'), // From auth middleware
    req: honoContext.req,
  };
}

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;
```

---

### **Step 3: Initialize tRPC**

```typescript
// apps/server/src/trpc/init.ts
import { initTRPC } from '@trpc/server';
import type { TRPCContext } from './context';

const t = initTRPC.context<TRPCContext>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

// Protected procedure (checks auth)
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({ ctx: { ...ctx, userId: ctx.userId } });
});
```

---

### **Step 4: Create Routers**

```typescript
// apps/server/src/trpc/routers/orders.router.ts
import { router, publicProcedure } from '../init';
import { orderSchemas } from 'db/schemas/orders.schema';
import { z } from 'zod';

export const ordersRouter = router({
  list: publicProcedure
    .query(async ({ ctx }) => {
      return await ctx.db.query.orders.findMany({
        where: (fields, ops) => ops.eq(fields.isActive, true),
      });
    }),

  listReadable: publicProcedure
    .query(async ({ ctx }) => {
      return await ctx.db.all(`
        SELECT * FROM orders_readable WHERE is_active = 1
      `);
    }),

  create: publicProcedure
    .input(orderSchemas.insert)
    .mutation(async ({ ctx, input }) => {
      const [order] = await ctx.db.insert(orders).values(input).returning();
      return order;
    }),

  delete: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input: id }) => {
      await ctx.db.delete(temperature_profiles)
        .where(eq(temperature_profiles.orderId, id));
      await ctx.db.delete(orders).where(eq(orders.id, id));
    }),
});
```

---

### **Step 5: Combine Routers**

```typescript
// apps/server/src/trpc/router.ts
import { router } from './init';
import { ordersRouter } from './routers/orders.router';
import { modesRouter } from './routers/modes.router';
import { slotsRouter } from './routers/slots.router';

export const appRouter = router({
  orders: ordersRouter,
  modes: modesRouter,
  slots: slotsRouter,
  // etc.
});

export type AppRouter = typeof appRouter;
```

---

### **Step 6: Mount tRPC in Hono**

```typescript
// apps/server/src/app.ts
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from './trpc/router';
import { createTRPCContext } from './trpc/context';

const app = createApp();

// ✅ CORS (applies to tRPC too!)
app.use('/*', cors({
  origin: [envShared.CLIENT_ORIGIN || ''],
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

// ✅ Auth middleware (applies to tRPC via context!)
app.use('*', async (c, next) => {
  const session = await getSession(c);
  c.set('userId', session?.userId);
  await next();
});

// ✅ tRPC handler
app.all('/trpc/*', async (c) => {
  return fetchRequestHandler({
    endpoint: '/trpc',
    req: c.req.raw,
    router: appRouter,
    createContext: () => createTRPCContext(c), // Pass Hono context!
  });
});

// ✅ Keep REST routes (optional)
app.route('/api', orders);

// ✅ Health check
app.get('/health', (c) => c.json({ status: 'ok' }));

export default app;
```

---

## **What You Can Keep from Hono**

### **✅ Keep These Hono Features**

1. **CORS middleware** - Applies to tRPC automatically
2. **Auth middleware** - Pass to tRPC via context
3. **Logging middleware** - Tracks all requests (including tRPC)
4. **Rate limiting** - Protect tRPC endpoints
5. **Static file serving** - For React build
6. **Health checks** - For monitoring
7. **Public REST endpoints** - For external consumers

### **Example: Complete Integration**

```typescript
// apps/server/src/app.ts
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from './trpc/router';
import { createTRPCContext } from './trpc/context';

const app = new Hono();

// ═══════════════════════════════════════════════════════
// HONO MIDDLEWARE (applies to everything)
// ═══════════════════════════════════════════════════════
app.use('/*', cors({ /* ... */ }));
app.use('/*', logger());

app.use('*', async (c, next) => {
  // Auth middleware
  const session = await getSession(c);
  c.set('userId', session?.userId);
  await next();
});

// ═══════════════════════════════════════════════════════
// tRPC (Internal API - Type-Safe)
// ═══════════════════════════════════════════════════════
app.all('/trpc/*', async (c) => {
  return fetchRequestHandler({
    endpoint: '/trpc',
    req: c.req.raw,
    router: appRouter,
    createContext: () => createTRPCContext(c),
  });
});

// ═══════════════════════════════════════════════════════
// REST API (External/Public - Optional)
// ═══════════════════════════════════════════════════════
app.get('/api/health', (c) => c.json({ status: 'ok' }));

// Public webhook endpoint
app.post('/api/webhooks/payment', async (c) => {
  const payload = await c.req.json();
  // Handle webhook
  return c.json({ received: true });
});

// ═══════════════════════════════════════════════════════
// STATIC FILES (React App)
// ═══════════════════════════════════════════════════════
app.get('/*', serveStatic({ root: './public' }));

export default app;
```

---

## **Benefits of Hono + tRPC Together**

### **1. Best of Both Worlds**

| Feature | Provided By |
|---------|-------------|
| HTTP handling | Hono |
| Middleware (CORS, auth) | Hono |
| Type-safe API | tRPC |
| Request validation | tRPC (Zod) |
| Static file serving | Hono |
| WebSocket support | Hono |
| OpenAPI docs (optional) | Hono |

---

### **2. Gradual Migration**

You can **keep both** during migration:

```typescript
// ✅ Old REST endpoint (keep during migration)
app.get('/api/orders', async (c) => {
  const orders = await db.query.orders.findMany();
  return c.json(orders);
});

// ✅ New tRPC endpoint (migrate gradually)
const appRouter = router({
  orders: router({
    list: procedure.query(() => db.query.orders.findMany()),
  }),
});
```

**Frontend can use either:**

```typescript
// Old way (during migration)
const response = await fetch('/api/orders');

// New way (after migration)
const orders = await trpc.orders.list.query();
```

---

### **3. Hybrid API Strategy**

**Internal API** (type-safe, for your frontend):

```typescript
app.all('/trpc/*', tRPCHandler);
```

**Public API** (REST + OpenAPI, for external consumers):

```typescript
app.route('/api/v1', publicApiRoutes);
```

**Example use case:**
- Your React app uses tRPC (type-safe, fast)
- Mobile app uses REST API (OpenAPI docs available)
- Webhooks use REST endpoints (standard HTTP)

---

## **Performance Comparison**

### **Hono + REST**

```
Request → Hono → Route handler → Response
~1-2ms overhead
```

### **Hono + tRPC**

```
Request → Hono → tRPC handler → Procedure → Response
~1-3ms overhead (slightly more due to validation)
```

**Difference:** Negligible (~1ms) - **type safety is worth it!** ✅

---

## **OpenAPI Integration (Bonus)**

You can **keep OpenAPI docs** even with tRPC using `trpc-openapi`:

```typescript
import { generateOpenApiDocument } from 'trpc-openapi';

// Generate OpenAPI spec from tRPC router
const openApiDocument = generateOpenApiDocument(appRouter, {
  title: 'Touch API',
  version: '1.0.0',
  baseUrl: 'https://api.example.com',
});

// Serve with Hono
app.get('/api/docs', (c) => c.json(openApiDocument));
```

**Result:** You get **both**:
- tRPC for internal use (type-safe)
- REST + OpenAPI for external use (standard)

---

## **Summary**

### **Does tRPC Replace Hono?**

**❌ NO - tRPC runs ON TOP OF Hono**

```
┌─────────────────────────────────┐
│        Hono (HTTP Server)       │
│  ┌──────────┐    ┌──────────┐   │
│  │   tRPC   │    │   REST   │   │
│  │ /trpc/*  │    │  /api/*  │   │
│  └──────────┘    └──────────┘   │
└─────────────────────────────────┘
```

### **What Hono Still Does**

1. ✅ HTTP server
2. ✅ Routing
3. ✅ Middleware (CORS, auth, logging)
4. ✅ Static file serving
5. ✅ WebSocket support
6. ✅ Request/response handling

### **What tRPC Adds**

1. ✅ Type-safe procedures
2. ✅ Input/output validation
3. ✅ Automatic React Query hooks
4. ✅ End-to-end type safety

### **Integration**

**One line of code:**

```typescript
app.all('/trpc/*', (c) => fetchRequestHandler({ /* ... */ }));
```

**That's it!** tRPC is just another Hono route. 🎯

---

**Does this clarify the relationship?** Let me know if you want to see more integration examples! 😊
