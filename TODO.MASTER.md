# 🗺️ Master Roadmap - Touch Monorepo Modernization

📅 Nov 15, 2025

> **Last Updated:** 2025-11-15
> **Status:** Planning Phase

---

## 📋 Overview

This roadmap outlines the strategic modernization of the Touch Monorepo, focusing on:
1. Dependency upgrades (Zod, BetterAuth)
2. Modern TypeScript patterns (Standard Schema)
3. API layer transformation (tRPC)

---

## 🚦 Phase 0: Current State Assessment

### ✅ Current Tech Stack

- **Validation:** Zod v3.x
- **Auth:** BetterAuth (lower version due to dependency issues)
- **API Layer:** Hono + manual REST endpoints + manual React Query hooks
- **Database:** Drizzle ORM + SQLite
- **Frontend:** React + Vite + Emotion
- **Type Safety:** TypeScript + branded types

### ⚠️ Known Issues

- [ ] BetterAuth upgrade blocked by dependency conflicts
- [ ] Zod v4 not adopted (possibly related to BetterAuth)
- [ ] ~34 manual API hooks in `apps/client/src/queries/*`
- [ ] 3 files per API resource (routes, handlers, index)
- [ ] Type safety not enforced across client/server boundary

---

## 📅 Phase 1: Dependency Stabilization (Wait Period)

**Timeline:** TBD - monitor ecosystem
**Priority:** 🔴 Critical (blocker for next phases)

### 1.1 Monitor BetterAuth Updates

- [ ] Check BetterAuth GitHub for dependency resolution
  - **Repo:** <https://github.com/better-auth/better-auth>
  - **Issue Tracker:** Look for dependency conflict issues
- [ ] Test BetterAuth upgrade in a separate branch
- [ ] Document specific dependency conflicts (Zod? Drizzle? Hono?)
- [ ] Wait for official resolution/workaround

**Dependencies to investigate:**
- Zod version requirements
- Drizzle ORM compatibility
- Hono integration

### 1.2 Monitor Zod v4 Stability

- [ ] Track Zod v4 release status
  - **Current:** Beta/RC
  - **Repo:** <https://github.com/colinhacks/zod>
- [ ] Check ecosystem adoption:
  - [ ] React Hook Form support
  - [ ] tRPC compatibility
  - [ ] Drizzle-Zod adapter
  - [ ] BetterAuth compatibility ⚠️ **CRITICAL**
- [ ] Review breaking changes documentation
- [ ] Test Zod v4 in isolated branch

**Blockers:**
- BetterAuth must support Zod v4 before upgrade
- All form resolvers must be compatible

### 1.3 Dependency Compatibility Matrix

Create a test matrix:

```bash
# Test combinations
BetterAuth v? + Zod v3 + Drizzle vX → ✅/❌
BetterAuth v? + Zod v4 + Drizzle vX → ✅/❌
```

**Action Items:**
- [ ] Document current versions: `pnpm list zod better-auth drizzle-orm`
- [ ] Create compatibility test branch
- [ ] Run `pnpm why zod` to identify all Zod dependencies

---

## 📅 Phase 2: Zod v4 Migration (After BetterAuth Compatibility)

**Timeline:** After Phase 1 complete
**Priority:** 🟡 High

### 2.1 Pre-Migration Audit

- [ ] Audit all Zod schema usage
  - [ ] `apps/server/src/db/schemas/*.schema.ts`
  - [ ] `apps/client/src/**/*.schema.ts`
  - [ ] Form validation schemas
- [ ] Identify custom Zod extensions/transforms
- [ ] Review Zod v4 breaking changes
- [ ] Create migration checklist

### 2.2 Zod v4 Upgrade

- [ ] Update `package.json` dependencies

  ```bash
  pnpm update zod@^4.0.0
  ```

- [ ] Update related packages:
  - [ ] `@hookform/resolvers`
  - [ ] `drizzle-zod`
  - [ ] `@hono/zod-openapi`
- [ ] Run tests
- [ ] Fix breaking changes
- [ ] Update type definitions

### 2.3 Post-Migration Validation

- [ ] Run full test suite
- [ ] Test all forms (validation still works)
- [ ] Test all API endpoints (Hono OpenAPI still works)
- [ ] Test BetterAuth flows
- [ ] Manual QA on critical paths

---

## 📅 Phase 3: Standard Schema Integration (Optional but Recommended)

**Timeline:** After Phase 2 complete
**Priority:** 🟢 Medium
**Benefit:** Library-agnostic validation interface

### 3.1 Install Standard Schema Adapters

```bash
pnpm add @standard-schema/zod
pnpm add @hookform/resolvers@latest # Ensure Standard Schema support
```

### 3.2 Create Shared Schema Exports

Create a pattern for dual exports:

```typescript
// Example: apps/server/src/db/schemas/orders.schema.ts
import { z } from 'zod';
import { toStandardSchema } from '@standard-schema/zod';

export const OrderInsertSchema = z.object({ /* ... */ });

// Export both Zod and Standard Schema versions
export const OrderInsertStandardSchema = toStandardSchema(OrderInsertSchema);
```

### 3.3 Migrate Forms to Standard Schema

- [ ] Update React Hook Form setup:

  ```typescript
  import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';

  const form = useForm({
    resolver: standardSchemaResolver(OrderInsertStandardSchema),
  });
  ```

- [ ] Test form validation
- [ ] Update form documentation

### 3.4 Benefits Achieved

✅ Future-proof for switching validators (Valibot, ArkType)
✅ Consistent validation interface across forms
✅ No changes to Zod schemas (just add adapter layer)

---

## 📅 Phase 4: tRPC Implementation (Major Refactor)

**Timeline:** After Phase 3 complete (or Phase 2 if skipping Standard Schema)
**Priority:** 🟡 High
**Effort:** ~2-4 weeks (gradual migration)
**Impact:** 🚀 Transformative

### 4.1 Prerequisites

**Requirements:**
- ✅ Zod v4 stable and adopted
- ✅ BetterAuth compatible with current stack
- ✅ Hono + React Query working
- ✅ All tests passing

**Skills/Knowledge:**
- Understanding of tRPC concepts (procedures, routers)
- React Query hooks
- TypeScript type inference

### 4.2 Install tRPC Packages

```bash
# Server
pnpm add @trpc/server --filter @workspace/server

# Client
pnpm add @trpc/client @trpc/react-query --filter @workspace/client

# Shared (if creating separate package)
pnpm add @trpc/server --filter @workspace/api
```

### 4.3 Setup tRPC Infrastructure

- [ ] Create `apps/server/src/trpc/` folder structure:

  ```
  apps/server/src/trpc/
  ├── init.ts          # tRPC initialization
  ├── context.ts       # Request context (auth, db)
  ├── router.ts        # Root router
  └── routers/         # Feature routers
      ├── orders.router.ts
      ├── modes.router.ts
      ├── slots.router.ts
      └── relays.router.ts
  ```

- [ ] Create tRPC context:

  ```typescript
  // apps/server/src/trpc/context.ts
  export async function createTRPCContext(honoContext: Context) {
    return {
      db,
      userId: honoContext.get('userId'),
      req: honoContext.req,
    };
  }
  ```

- [ ] Initialize tRPC with context:

  ```typescript
  // apps/server/src/trpc/init.ts
  const t = initTRPC.context<TRPCContext>().create();
  export const router = t.router;
  export const publicProcedure = t.procedure;
  export const protectedProcedure = t.procedure.use(authMiddleware);
  ```

### 4.4 Mount tRPC in Hono

- [ ] Update `apps/server/src/app.ts`:

  ```typescript
  import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
  import { appRouter } from './trpc/router';

  app.all('/trpc/*', async (c) => {
    return fetchRequestHandler({
      endpoint: '/trpc',
      req: c.req.raw,
      router: appRouter,
      createContext: () => createTRPCContext(c),
    });
  });
  ```

- [ ] Test tRPC endpoint: `curl http://localhost:4040/trpc/`

### 4.5 Setup Client

- [ ] Create `apps/client/src/lib/trpc.ts`:

  ```typescript
  import { createTRPCReact } from '@trpc/react-query';
  import type { AppRouter } from '@workspace/server/trpc/router';

  export const trpc = createTRPCReact<AppRouter>();
  ```

- [ ] Wrap app with tRPC provider:

  ```typescript
  // apps/client/src/App.tsx
  const trpcClient = trpc.createClient({
    links: [httpBatchLink({ url: 'http://localhost:4040/trpc' })],
  });

  <trpc.Provider client={trpcClient} queryClient={queryClient}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </trpc.Provider>
  ```

### 4.6 Gradual Migration (Per Resource)

**Strategy:** Migrate one API resource at a time, keep both REST + tRPC during transition.

#### 4.6.1 Week 1: Orders API

- [ ] Create `apps/server/src/trpc/routers/orders.router.ts`:

  ```typescript
  export const ordersRouter = router({
    list: publicProcedure.query(() => { /* ... */ }),
    listReadable: publicProcedure.query(() => { /* ... */ }),
    getById: publicProcedure.input(z.string()).query(() => { /* ... */ }),
    create: publicProcedure.input(orderSchemas.insert).mutation(() => { /* ... */ }),
    update: publicProcedure.input(orderSchemas.patch).mutation(() => { /* ... */ }),
    delete: publicProcedure.input(z.string()).mutation(() => { /* ... */ }),
  });
  ```

- [ ] Mount in root router:

  ```typescript
  export const appRouter = router({
    orders: ordersRouter,
  });
  ```

- [ ] Update frontend components:

  ```typescript
  // ❌ OLD:
  const { data } = useGetOrdersReadable();

  // ✅ NEW:
  const { data } = trpc.orders.listReadable.useQuery();
  ```

- [ ] Test thoroughly
- [ ] Delete old hooks from `apps/client/src/queries/orders/`
- [ ] Keep REST endpoints (for now) as backup

**Files affected:**
- ✅ Create: `apps/server/src/trpc/routers/orders.router.ts`
- ❌ Delete: `apps/client/src/queries/orders/*.ts` (6 files)
- ⚠️ Keep (optional): `apps/server/src/routes/orders/*` (REST endpoints)

#### 4.6.2 Week 2: Modes API

- [ ] Create `apps/server/src/trpc/routers/modes.router.ts`
- [ ] Update frontend: `AdminModePage.tsx`
- [ ] Delete old hooks: `apps/client/src/queries/modes/*.ts` (5 files)

#### 4.6.3 Week 3: Slots Configuration API

- [ ] Create `apps/server/src/trpc/routers/slots.router.ts`
- [ ] Update frontend: `AdminSlotsConfigPage.tsx`
- [ ] Delete old hooks: `apps/client/src/queries/slot-configurations/*.ts` (7 files)

#### 4.6.4 Week 4: Remaining APIs

- [ ] Relays API (9 hooks)
- [ ] Sounds API (5 hooks)
- [ ] Temperature API (2 hooks)
- [ ] Translations API
- [ ] Countries API

### 4.7 Cleanup Phase

Once all resources migrated:

- [ ] Remove all `apps/client/src/queries/*` folders (~34 files total)
- [ ] Remove old REST routes (optional - or keep for external/public API)
- [ ] Update API documentation
- [ ] Remove unused dependencies (axios?)
- [ ] Update README with tRPC setup

### 4.8 Post-Migration Benefits

**Achieved:**
- ✅ ~34 manual hooks → Automatic tRPC hooks
- ✅ ~2000 lines of boilerplate → ~200 lines tRPC config
- ✅ End-to-end type safety (compile-time errors!)
- ✅ Autocomplete for all API calls
- ✅ Single source of truth (Zod schemas)
- ✅ Faster development (no manual API client code)
- ✅ Better DX (refactoring is safe!)

**Files removed:**

```
apps/client/src/queries/
  orders/            (6 files)
  modes/             (5 files)
  slot-configurations/ (7 files)
  relays/            (9 files)
  sounds/            (5 files)
  temperature/       (2 files)

Total: ~34 files deleted! 🎉
```

**New structure:**

```
apps/server/src/trpc/
  init.ts
  context.ts
  router.ts
  routers/
    orders.router.ts
    modes.router.ts
    slots.router.ts
    relays.router.ts
    sounds.router.ts

apps/client/src/lib/
  trpc.ts            (One 10-line setup file!)
```

---

## 📅 Phase 5: Optional Enhancements

**Timeline:** After Phase 4 complete
**Priority:** 🔵 Nice-to-have

### 5.1 tRPC + OpenAPI (Hybrid API)

If you need REST API for external consumers:

```bash
pnpm add trpc-openapi
```

- [ ] Generate OpenAPI spec from tRPC router
- [ ] Serve Swagger UI docs
- [ ] Maintain both tRPC (internal) + REST (external)

**Benefit:** One codebase, two API styles!

### 5.2 Optimistic Updates

- [ ] Implement optimistic mutations:

  ```typescript
  const updateOrder = trpc.orders.update.useMutation({
    onMutate: async (newData) => {
      // Cancel outgoing refetches
      await utils.orders.list.cancel();

      // Snapshot previous value
      const previous = utils.orders.list.getData();

      // Optimistically update
      utils.orders.list.setData(undefined, (old) =>
        old?.map(o => o.id === newData.id ? newData : o)
      );

      return { previous };
    },
    onError: (err, newData, context) => {
      // Rollback on error
      utils.orders.list.setData(undefined, context?.previous);
    },
  });
  ```

### 5.3 Request Batching

tRPC automatically batches requests made within 10ms:

```typescript
// These 3 queries → 1 HTTP request!
trpc.orders.list.useQuery();
trpc.modes.list.useQuery();
trpc.slots.list.useQuery();
```

- [ ] Enable batching in client config
- [ ] Monitor network tab (should see batched requests)

### 5.4 Server-Sent Events (SSE) / WebSocket

For real-time relay status updates:

```bash
pnpm add @trpc/server@next # For subscription support
```

- [ ] Implement subscriptions:

  ```typescript
  relays: router({
    onStatusChange: publicProcedure.subscription(() => {
      return observable<RelayStatus>((emit) => {
        // Emit relay status changes
      });
    }),
  });
  ```

- [ ] Use in frontend:

  ```typescript
  trpc.relays.onStatusChange.useSubscription(undefined, {
    onData: (status) => console.log('Relay status:', status),
  });
  ```

---

## 🚧 Blockers & Dependencies

### Critical Path

```
Phase 1 (BetterAuth + Zod stabilization)
  ↓
Phase 2 (Zod v4 upgrade)
  ↓
Phase 3 (Standard Schema - optional)
  ↓
Phase 4 (tRPC implementation)
  ↓
Phase 5 (Optimizations)
```

### Key Blockers

1. **BetterAuth dependency conflict** 🔴
   - Blocks Zod v4 upgrade
   - Blocks tRPC migration (requires stable Zod)
   - **Action:** Monitor BetterAuth GitHub issues

2. **Zod v4 ecosystem adoption** 🟡
   - React Hook Form support
   - Drizzle-Zod adapter
   - tRPC compatibility
   - **Action:** Track library release notes

3. **Testing coverage** 🟡
   - Need good test coverage before major refactors
   - **Action:** Improve test suite first

---

## 📊 Risk Assessment

### Low Risk (Green)

- ✅ Standard Schema adoption (non-breaking, optional adapter)
- ✅ tRPC gradual migration (can run parallel with REST)

### Medium Risk (Yellow)

- ⚠️ Zod v4 upgrade (breaking changes, but manageable)
- ⚠️ Deleting manual hooks (ensure tRPC fully working first)

### High Risk (Red)

- 🔴 BetterAuth upgrade (dependency conflicts unknown)
- 🔴 Rushing tRPC migration (risk of bugs if not tested)

**Mitigation:**
- Always test in separate branch first
- Keep backups (REST endpoints, old hooks)
- Migrate gradually, one resource at a time

---

## 📈 Success Metrics

### Phase 1-2 Success

- ✅ BetterAuth upgraded without conflicts
- ✅ Zod v4 running in production
- ✅ All tests passing
- ✅ No runtime errors

### Phase 4 Success

- ✅ All API calls using tRPC
- ✅ 34+ manual hooks deleted
- ✅ Full type safety across client/server
- ✅ Autocomplete working in IDE
- ✅ Faster development velocity

### Overall Success

- ✅ Modern, maintainable codebase
- ✅ Better developer experience
- ✅ Fewer runtime bugs (caught at compile-time)
- ✅ Easier onboarding for new developers

---

## 🔗 References

### Documentation

- **Zod:** <https://zod.dev/>
- **BetterAuth:** <https://github.com/better-auth/better-auth>
- **Standard Schema:** <https://github.com/standard-schema/standard-schema>
- **tRPC:** <https://trpc.io/>
- **tRPC + Hono:** <https://trpc.io/docs/server/adapters/fetch>
- **React Query:** <https://tanstack.com/query/latest>

### Related Files

- `TODO.tRPC.md` - Detailed tRPC explanation
- `TODO.tRPC+Hono.md` - Hono integration details
- `TYPESCRIPT_ECOSYSTEM_*.md` - Modern TypeScript patterns
- `.cursor/rules/14-modern-typescript-patterns.md` - AI assistance rules

---

## 📝 Notes

### Decision Log

**2024-11-15:**
- Decided to wait for BetterAuth compatibility before Zod v4 upgrade
- Agreed that tRPC is ideal for this monorepo structure
- Standard Schema adoption is optional but recommended
- Will migrate tRPC gradually (one resource per week)

### Questions to Resolve

- [ ] What specific BetterAuth dependency is conflicting?
- [ ] Can we upgrade BetterAuth independently of Zod?
- [ ] Should we keep REST endpoints after tRPC migration (for external API)?
- [ ] Do we need OpenAPI docs for external consumers?

### Future Considerations

- Consider separating tRPC router into its own package (`@workspace/api`)
- Evaluate if relay status updates need WebSocket/SSE
- Consider moving to pnpm workspaces if not already
- Evaluate bundle size impact of tRPC client

---

**Last Reviewed:** 2024-11-15
**Next Review:** After BetterAuth compatibility resolved
**Owner:** @justin

