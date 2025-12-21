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

### ✅ Phase 2: Migrate High-Value Resources (3-4 hours) - COMPLETE

**Goal:** Migrate most fragmented resources

**Priority Order:**

1. [x] translations-ui (all direct calls) ✅
2. [x] orders (complex, high-usage) ✅
3. [x] slot-configurations ✅
4. [x] modes ✅
5. [x] relays ✅
6. [x] sounds ✅
7. [x] supported-languages (uses EndpointHelper - will migrate in Phase 3)
8. [x] countries (uses external API - no migration needed)

**Results:**

- 6 resources fully migrated (48+ hooks)
- All endpoint files created
- Zero direct api calls in migrated hooks
- All linter checks passing

- [x] **COMMIT:** "refactor(api): migrate [resources] to unified endpoint pattern"

---

### ✅ Phase 3: Final Cleanup (1 hour) - COMPLETE

**Goal:** Remove old systems completely

- [x] Create `supported-languages.endpoints.ts` with all operations
- [x] Add compatibility aliases to `drink-type.endpoints.ts`
- [x] Migrate supported-languages hooks to use endpoints
- [x] Migrate drink-types hooks to use endpoints
- [x] Update React Router loaders to use individual endpoints
- [x] Delete `api.endpoints.ts` (EndpointHelper completely removed)
- [x] Verify zero linter errors
- [x] **COMMIT:** "refactor(api): complete endpoint consolidation, remove EndpointHelper"

---

## 📊 **Progress Tracking**

- **Phase 0:** ✅ Complete
- **Phase 1:** ✅ Complete
- **Phase 2:** ✅ Complete
- **Phase 3:** ✅ Complete

🎉 **ALL PHASES COMPLETE!**

---

## 🎯 **Success Criteria**

- [x] Single pattern documented in `.cursor/rules/` ✅
- [x] All endpoints in `api/endpoints/{resource}.endpoints.ts` ✅
- [x] Zero direct `api` calls in query hooks ✅
- [x] All experimental files deleted ✅
- [x] Pattern is obvious and unambiguous ✅
- [x] EndpointHelper completely removed ✅
- [x] All linter checks passing ✅

**🎉 ALL SUCCESS CRITERIA MET!**

---

## 📝 **Notes**

- If work must pause, current phase is clearly marked
- Each commit is atomic and can be reverted if needed
- Phase 2 can be done incrementally (one resource at a time)
- Remaining resources can be migrated in Part II

---

**Last Updated:** Dec 21, 2025
