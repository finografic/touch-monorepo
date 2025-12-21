# 🗺️ Master Roadmap - Touch Monorepo Modernization

📅 Nov 15, 2025

> **Last Updated:** 2025-11-15
> **Status:** Planning Phase

---

## 📋 Overview

This roadmap outlines the strategic modernization of the Touch Monorepo, focusing on:

1. Dependency upgrades (Zod, BetterAuth)
2. Modern TypeScript patterns (Standard Schema)
3. API endpoint architecture consolidation

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
- [ ] **API Endpoint Architecture:** Three overlapping endpoint systems (`EndpointHelper`, `FetchEndpointHelper`, `api/endpoints/` folder) causing confusion and duplication

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

---

## 📅 Phase 4: API Endpoint Architecture Consolidation

**Timeline:** Can be done anytime (not blocking other phases)
**Priority:** 🟡 Medium
**Effort:** ~2-3 days
**Impact:** 🧹 Code cleanup and consistency

### Overview

The codebase currently has **9+ overlapping endpoint systems** causing significant fragmentation:

- Multiple endpoint helper patterns
- ~50+ files using direct `api` calls
- Experimental files still present
- Inconsistent error handling
- No single source of truth

**Current State:**

- `EndpointHelper` (underutilized - only 4 files)
- `api/endpoints/` folder (good pattern, limited usage)
- Direct `api` calls (~50+ files - most common, fragmented)
- Experimental systems (`FetchEndpointHelper`, `fetch-client.ts`)
- Specialized systems (`batch/`, `query-v2/`, `hooks/`)

**Critical Issues:**

- TranslationsPage: 100% direct calls (bypasses all helpers)
- TranslationsProductPage: Mixed patterns (inconsistent)
- No clear pattern for new developers

**See `TODO.ENDPOINTS.md` for detailed analysis and consolidation strategies.**

---

## 📅 Phase 5: Optional Enhancements

**Timeline:** After Phase 4 complete
**Priority:** 🔵 Nice-to-have

### 5.1 Optimistic Updates

- [ ] Implement optimistic mutations for React Query hooks:

  ```typescript
  const updateOrder = useUpdateOrder({
    onMutate: async (newData) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['orders'] });

      // Snapshot previous value
      const previous = queryClient.getQueryData(['orders']);

      // Optimistically update
      queryClient.setQueryData(['orders'], (old) =>
        old?.map(o => o.id === newData.id ? newData : o)
      );

      return { previous };
    },
    onError: (err, newData, context) => {
      // Rollback on error
      queryClient.setQueryData(['orders'], context?.previous);
    },
  });
  ```

### 5.2 Request Batching

- [ ] Implement request batching for multiple queries
- [ ] Monitor network tab for optimization opportunities

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
Phase 4 (API Endpoint Architecture Consolidation)
  ↓
Phase 5 (Optional Enhancements)
```

### Key Blockers

1. **BetterAuth dependency conflict** 🔴
   - Blocks Zod v4 upgrade
   - **Action:** Monitor BetterAuth GitHub issues

2. **Zod v4 ecosystem adoption** 🟡
   - React Hook Form support
   - Drizzle-Zod adapter
   - **Action:** Track library release notes

3. **Testing coverage** 🟡
   - Need good test coverage before major refactors
   - **Action:** Improve test suite first

---

## 📊 Risk Assessment

### Low Risk (Green)

- ✅ Standard Schema adoption (non-breaking, optional adapter)
- ✅ API endpoint consolidation (mostly cleanup)

### Medium Risk (Yellow)

- ⚠️ Zod v4 upgrade (breaking changes, but manageable)

### High Risk (Red)

- 🔴 BetterAuth upgrade (dependency conflicts unknown)

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

- ✅ Single clear pattern for endpoint usage
- ✅ No duplicate endpoint definitions
- ✅ All hooks use consistent pattern
- ✅ Improved code maintainability

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
- **React Query:** <https://tanstack.com/query/latest>

### Related Files

- `TYPESCRIPT_ECOSYSTEM_*.md` - Modern TypeScript patterns
- `.cursor/rules/14-modern-typescript-patterns.md` - AI assistance rules

---

## 📝 Notes

### Decision Log

**2024-11-15:**

- Decided to wait for BetterAuth compatibility before Zod v4 upgrade
- Standard Schema adoption is optional but recommended

**2025-12-14:**

- Identified API endpoint architecture duplication (3 overlapping systems)
- Documented consolidation strategy in Phase 4
- Decision: Keep `EndpointHelper` for queries, `api/endpoints/` for mutations
- Can be done incrementally

### Questions to Resolve

- [ ] What specific BetterAuth dependency is conflicting?
- [ ] Can we upgrade BetterAuth independently of Zod?
- [ ] Do we need OpenAPI docs for external consumers?

### Future Considerations

- Evaluate if relay status updates need WebSocket/SSE
- Consider moving to pnpm workspaces if not already
- Evaluate bundle size impact of API client libraries

---

**Last Reviewed:** 2025-12-14
**Next Review:** After BetterAuth compatibility resolved
**Owner:** @justin
