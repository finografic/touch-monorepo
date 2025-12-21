# API Endpoint Consolidation - Execution Plan

📅 **Started:** Dec 21, 2025
🎯 **Goal:** Single, unified endpoint pattern - eliminate boundary erosion

---

## 🏗️ **Architecture Decision**

**Pattern:** Modified Option B - Full Consolidation to `api/endpoints/`
**Queries Location:** Keep separate at `src/queries/` (cache management layer)

### Structure

```
src/
├── api/                                # Transport layer (pure)
│   ├── fetch-client.ts                # Base HTTP client
│   ├── endpoints/                     # ALL endpoint definitions
│   │   ├── {resource}.endpoints.ts
│   │   └── index.ts
│   └── batch/
│
└── queries/                           # React Query layer (consumption)
    └── {resource}/
```

### Rules

1. **ALL** server calls go through `api/endpoints/{resource}.endpoints.ts`
2. **NO** direct `api` calls in hooks (except during migration)
3. **ZERO** React imports in `api/` folder
4. **ONE** pattern only - no exceptions

---

## 📋 **Phases**

### ✅ Phase 0: Delete Noise & Rename Client (30 min) - COMPLETE

**Goal:** Remove experimental code, establish base client

- [x] Delete `api/endpoints.fetch.ts`
- [x] Delete `api/fetch-client.ts`
- [x] Delete `api/_example.endpoints.fetch.ts`
- [x] Delete `queries/drink-types/useGetDrinkType-NEW.ts`
- [x] Delete `api/query-v2/` folder
- [x] Rename `api/fetch.ts` → `api/fetch-client.ts`
- [x] Update all imports of `api/fetch.ts`
- [x] **COMMIT:** "refactor(api): remove experimental files, rename fetch.ts to fetch-client.ts"

---

### ✅ Phase 1: Establish The Pattern (1-2 hours) - COMPLETE

**Goal:** Create rules document and reference implementation

- [x] Create `.cursor/rules/15-api-endpoint-pattern.md`
- [x] Choose reference resource (container-types)
- [x] Create complete `container-types.endpoints.ts` following pattern
- [x] Update all `container-types` hooks to use endpoints
- [x] Update `api/endpoints/index.ts` to export new structure
- [x] Document pattern with comprehensive examples
- [x] **COMMIT:** "docs(api): establish unified endpoint pattern with reference implementation"

---

### ⏳ Phase 2: Migrate High-Value Resources (3-4 hours)

**Goal:** Migrate most fragmented resources

**Priority Order:**
1. [x] translations-ui (all direct calls) ✅
2. [x] orders (complex, high-usage) ✅
3. [x] slot-configurations ✅
4. [x] modes ✅
5. [x] relays (endpoints created, hooks need migration)
6. [x] sounds (endpoints created, hooks need migration)
7. [ ] supported-languages
8. [ ] countries

**For each:**
- Create/update `{resource}.endpoints.ts`
- Update all hooks to use endpoints
- Test basic functionality
- Move to next

- [ ] **COMMIT:** "refactor(api): migrate [resources] to unified endpoint pattern"

---

### ⏳ Phase 3: Final Cleanup (1 hour)

**Goal:** Remove old systems completely

- [ ] Migrate content from `api.endpoints.ts` to individual endpoint files
- [ ] Delete `api.endpoints.ts`
- [ ] Update any remaining imports
- [ ] Update `api/endpoints/index.ts` to export all
- [ ] Verify no direct `api` calls remain in hooks
- [ ] **COMMIT:** "refactor(api): complete endpoint consolidation, remove EndpointHelper"

---

## 📊 **Progress Tracking**

- **Phase 0:** ✅ Complete
- **Phase 1:** ✅ Complete
- **Phase 2:** ⏳ In Progress
- **Phase 3:** ⏳ Not started

---

## 🎯 **Success Criteria**

- [ ] Single pattern documented in `.cursor/rules/`
- [ ] All endpoints in `api/endpoints/{resource}.endpoints.ts`
- [ ] Zero direct `api` calls in query hooks
- [ ] All experimental files deleted
- [ ] Pattern is obvious and unambiguous

---

## 📝 **Notes**

- If work must pause, current phase is clearly marked
- Each commit is atomic and can be reverted if needed
- Phase 2 can be done incrementally (one resource at a time)
- Remaining resources can be migrated in Part II

---

**Last Updated:** Dec 21, 2025

