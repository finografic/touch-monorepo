# API Endpoint Architecture Consolidation Plan

📅 Dec 21, 2025

> **Status:** Planning Phase
> **Priority:** 🟡 Medium
> **Effort:** ~2-3 days
> **Impact:** 🧹 Code cleanup and consistency

---

## 📋 Overview

The codebase currently has **9+ overlapping endpoint systems** causing confusion, duplication, and maintenance burden. This document outlines the fragmentation problem and proposes consolidation strategies.

**Goal:** Standardize on a single, consistent pattern that works for both React Query hooks and React Router loaders.

---

## 🚨 Current State: Fragmentation Analysis

### System Inventory

#### 1. **`api/api.endpoints.ts` - `EndpointHelper`** ✅ (Active, Production-Ready)

- **Location:** `apps/client/src/api/api.endpoints.ts`
- **Client:** Uses `api` from `api/fetch.ts` (env-based URLs)
- **Pattern:** Centralized helper with `createEndpoints()` wrapper
- **Usage:**
  - `useGetDrinkTypes` ✅
  - `useGetDrinkType` ✅
  - `useGetSupportedLanguages` ✅
  - React Router loaders (`loader.data.ts`) ✅
- **Pros:**
  - ✅ Works with loaders (direct function calls)
  - ✅ Centralized error handling
  - ✅ Type-safe
  - ✅ Production-ready (env-based URLs)
- **Cons:**
  - ⚠️ Only used by 3-4 hooks
  - ⚠️ Not used by most queries

#### 2. **`api/endpoints.fetch.ts` - `FetchEndpointHelper`** ❌ (Experimental, Deprecated)

- **Location:** `apps/client/src/api/endpoints.fetch.ts`
- **Client:** Uses `fetchClient` from `api/fetch-client.ts` (hardcoded localhost)
- **Pattern:** Similar to `EndpointHelper` but with different client
- **Usage:**
  - `useGetDrinkType-NEW.ts` ❌ (experimental, should be deleted)
- **Pros:** None (experimental, not production-ready)
- **Cons:**
  - ❌ Hardcoded `http://localhost:4040/api`
  - ❌ Not production-ready
  - ❌ Duplicate of `EndpointHelper`
  - ❌ Should be deleted

#### 3. **`api/endpoints/` Folder - Individual Endpoint Files** ✅ (Active, Good Pattern)

- **Location:** `apps/client/src/api/endpoints/*.endpoints.ts`
- **Client:** Uses `api` from `api/fetch.ts`
- **Files:**
  - `drink-type.endpoints.ts`
  - `drink-subtype.endpoints.ts`
  - `volume.endpoints.ts`
  - `container-type.endpoints.ts`
  - `index.ts` (re-exports)
- **Usage:**
  - `api/hooks/useTranslations.ts` ✅
  - `useUpdateDrinkSubtype` ✅
  - Product translation mutations ✅
- **Pros:**
  - ✅ Good organization per resource
  - ✅ Includes transformation logic
  - ✅ Works well for mutations
  - ✅ Type-safe
- **Cons:**
  - ⚠️ Only used for product translations
  - ⚠️ Not used by most queries

#### 4. **Direct `api.get/post/patch/delete` Calls** ⚠️ (Fragmented, Most Common)

- **Location:** Scattered across ~50+ files
- **Client:** Uses `api` from `api/fetch.ts`
- **Usage:**
  - `useGetDrinkSubtypes` ⚠️
  - `useGetTranslations` (TranslationsPage) ⚠️
  - `useSaveTranslations` (TranslationsPage) ⚠️
  - `useDeleteTranslations` (TranslationsPage) ⚠️
  - `useDeleteProductTranslation` (TranslationsProductPage) ⚠️
  - All `translations-ui` hooks ⚠️
  - ~47 other query/mutation hooks ⚠️
- **Pros:**
  - ✅ Simple, direct
  - ✅ Flexible
- **Cons:**
  - ❌ No centralized error handling
  - ❌ Inconsistent patterns
  - ❌ Hard to refactor
  - ❌ Duplicate endpoint definitions
  - ❌ No single source of truth

#### 5. **`api/fetch.ts` - Native Fetch Client** ✅ (Base Client)

- **Location:** `apps/client/src/api/fetch.ts`
- **Status:** Active (production-ready, env-based)
- **Exports:** `api` object with `get/post/patch/delete` methods
- **Notes:** Used by most systems above

#### 6. **`api/fetch-client.ts` - Alternative Fetch Client** ❌ (Experimental, Deprecated)

- **Location:** `apps/client/src/api/fetch-client.ts`
- **Status:** Experimental (hardcoded localhost)
- **Exports:** `fetchClient` object
- **Notes:** Only used by `FetchEndpointHelper`, should be deleted

#### 7. **`api/query-v2/` - Query Builder System** ❓ (Unclear Usage)

- **Location:** `apps/client/src/api/query-v2/`
- **Status:** Exists but usage unclear
- **Files:**
  - `builder.ts` - QueryBuilder class
  - `types.ts` - Query types
  - `index.ts` - Exports
- **Notes:** Appears to be for query string building, but not actively used

#### 8. **`api/batch/` - Batch Operations** ✅ (Specialized, Active)

- **Location:** `apps/client/src/api/batch/batch-translations.ts`
- **Status:** Active
- **Usage:** `api/hooks/useTranslations.ts` (`useBatchUpdateTranslations`)
- **Notes:** Specialized batch endpoint, uses `api` directly

#### 9. **`api/hooks/useTranslations.ts` - Specialized Hook** ✅ (Active)

- **Location:** `apps/client/src/api/hooks/useTranslations.ts`
- **Status:** Active
- **Uses:** `api/endpoints/*.endpoints.ts` files
- **Notes:** Product translation hooks, uses endpoint files

---

## 📊 Usage Statistics

### By Pattern

- **Direct `api` calls:** ~50+ files (most common, fragmented)
- **`EndpointHelper`:** 4 files (underutilized)
- **`api/endpoints/*.endpoints.ts`:** 5+ files (good pattern, limited usage)
- **`FetchEndpointHelper`:** 1 file (experimental, should be deleted)
- **Batch endpoints:** 1 file (specialized, acceptable)

### By Feature Area

**TranslationsPage:**

- ❌ 100% direct `api` calls (bypasses all helpers)
- ❌ No error handling consistency
- ❌ No endpoint reuse

**TranslationsProductPage:**

- ✅ Queries use `api/endpoints/*.endpoints.ts` (good)
- ❌ Deletes use direct `api.delete()` calls (inconsistent)
- ⚠️ Mixed patterns

**Other Hooks:**

- ❌ ~47 hooks use direct `api` calls
- ✅ 4 hooks use `EndpointHelper`
- ✅ 5+ hooks use `api/endpoints/*.endpoints.ts`

---

## 🎯 Consolidation Strategies

### Option A: Hybrid Approach (Recommended) ⭐

**Pattern:** Keep `EndpointHelper` for queries + `api/endpoints/` for mutations

**Structure:**

```
apps/client/src/api/
├── fetch.ts                    # Base client (keep)
├── api.endpoints.ts            # EndpointHelper for GET queries
├── endpoints/                  # Individual files for mutations
│   ├── drink-type.endpoints.ts
│   ├── drink-subtype.endpoints.ts
│   ├── volume.endpoints.ts
│   ├── container-type.endpoints.ts
│   ├── translations.endpoints.ts      # NEW: For TranslationsPage
│   ├── translations-ui.endpoints.ts   # NEW: For translations-ui hooks
│   └── index.ts
└── batch/                      # Keep specialized batch ops
    └── batch-translations.ts
```

**Rules:**

- **Queries (GET):** Use `EndpointHelper` in `api.endpoints.ts`
  - Works for both hooks and React Router loaders
  - Centralized error handling
  - Type-safe
- **Mutations (POST/PATCH/DELETE):** Use `api/endpoints/` folder
  - More complex transformations
  - Entity-specific logic
  - Better organization per resource

**Example Usage:**

```typescript
// ✅ Query (GET) - Use EndpointHelper
import { EndpointHelper } from 'api/api.endpoints';

export const useGetDrinkTypes = () => {
  return useQuery({
    queryKey: ['drinkTypes'],
    queryFn: EndpointHelper.getDrinkTypes,
  });
};

// ✅ Mutation (POST/PATCH/DELETE) - Use endpoints/ folder
import { translationsEndpoints } from 'api/endpoints';

export const useSaveTranslations = () => {
  return useMutation({
    mutationFn: (data) => translationsEndpoints.createTranslation(data),
  });
};
```

**Migration Steps:**

1. Migrate all GET queries to `EndpointHelper`
2. Create `api/endpoints/translations.endpoints.ts` for TranslationsPage
3. Create `api/endpoints/translations-ui.endpoints.ts` for translations-ui hooks
4. Migrate all mutations to `api/endpoints/` folder
5. Delete `api/endpoints.fetch.ts` and `api/fetch-client.ts`
6. Delete `useGetDrinkType-NEW.ts`
7. Document pattern in `.cursor/rules`

**Pros:**

- ✅ Clear separation: queries vs mutations
- ✅ Works with React Router loaders
- ✅ Maintains existing good patterns
- ✅ Incremental migration possible
- ✅ Low risk

**Cons:**

- ⚠️ Two patterns to learn (but clear rules)
- ⚠️ Some duplication between `EndpointHelper` and `endpoints/` folder

---

### Option B: Full Consolidation to `api/endpoints/` Folder

**Pattern:** Move everything to `api/endpoints/` folder, one file per resource

**Structure:**

```
apps/client/src/api/
├── fetch.ts                    # Base client (keep)
├── endpoints/                  # All endpoints here
│   ├── drink-types.endpoints.ts
│   ├── drink-subtypes.endpoints.ts
│   ├── volumes.endpoints.ts
│   ├── container-types.endpoints.ts
│   ├── translations.endpoints.ts
│   ├── translations-ui.endpoints.ts
│   ├── supported-languages.endpoints.ts
│   ├── orders.endpoints.ts
│   ├── modes.endpoints.ts
│   ├── slots.endpoints.ts
│   ├── relays.endpoints.ts
│   ├── sounds.endpoints.ts
│   └── index.ts                # Re-export all
└── batch/                      # Keep specialized batch ops
    └── batch-translations.ts
```

**Rules:**

- All endpoints (queries + mutations) in `api/endpoints/` folder
- One file per resource/domain
- Export from `api/endpoints/index.ts`
- Loaders import from `api/endpoints/` folder

**Example Usage:**

```typescript
// ✅ All endpoints from endpoints/ folder
import { drinkTypesEndpoints, translationsEndpoints } from 'api/endpoints';

// Query
export const useGetDrinkTypes = () => {
  return useQuery({
    queryKey: ['drinkTypes'],
    queryFn: drinkTypesEndpoints.getDrinkTypes,
  });
};

// Mutation
export const useSaveTranslations = () => {
  return useMutation({
    mutationFn: (data) => translationsEndpoints.createTranslation(data),
  });
};

// Loader
export const loader = drinkTypesEndpoints.getDrinkTypes;
```

**Migration Steps:**

1. Move `EndpointHelper` functions to `api/endpoints/` folder
2. Create endpoint files for all resources
3. Update all imports
4. Delete `api.endpoints.ts`
5. Delete `api/endpoints.fetch.ts` and `api/fetch-client.ts`
6. Delete `useGetDrinkType-NEW.ts`
7. Document pattern

**Pros:**

- ✅ Single pattern for everything
- ✅ Better organization per resource
- ✅ Easier to find endpoint definitions
- ✅ Consistent structure

**Cons:**

- ⚠️ More files to manage
- ⚠️ Larger migration effort
- ⚠️ Need to ensure loaders work (they need direct function calls)

---

### Option C: Consolidate to Single `EndpointHelper` (Not Recommended)

**Pattern:** Move everything to `api.endpoints.ts` as one large `EndpointHelper`

**Structure:**

```
apps/client/src/api/
├── fetch.ts                    # Base client (keep)
├── api.endpoints.ts            # All endpoints here (large file)
└── batch/                      # Keep specialized batch ops
    └── batch-translations.ts
```

**Rules:**

- All endpoints in single `EndpointHelper` object
- Grouped by resource: `EndpointHelper.drinkTypes.get()`, `EndpointHelper.drinkTypes.create()`, etc.

**Example Usage:**

```typescript
import { EndpointHelper } from 'api/api.endpoints';

// Query
export const useGetDrinkTypes = () => {
  return useQuery({
    queryKey: ['drinkTypes'],
    queryFn: EndpointHelper.drinkTypes.getAll,
  });
};

// Mutation
export const useSaveTranslations = () => {
  return useMutation({
    mutationFn: (data) => EndpointHelper.translations.create(data),
  });
};
```

**Pros:**

- ✅ Single file, single pattern
- ✅ Easy to find all endpoints

**Cons:**

- ❌ Very large file (hard to maintain)
- ❌ Poor organization
- ❌ Hard to navigate
- ❌ Merge conflicts likely
- ❌ Not scalable

**Verdict:** ❌ Not recommended - file would be too large and unmaintainable

---

## 📋 Recommended Strategy: Option A (Hybrid Approach)

### Rationale

1. **Clear separation of concerns:** Queries are simpler (GET), mutations are more complex (POST/PATCH/DELETE with transformations)
2. **Works with loaders:** `EndpointHelper` provides direct function calls needed by React Router loaders
3. **Maintains good patterns:** Keeps existing `api/endpoints/` folder pattern that works well
4. **Incremental migration:** Can migrate one resource at a time
5. **Low risk:** Doesn't break existing working code

### Implementation Plan

#### Phase 1: Cleanup (1-2 hours)

- [ ] Delete `api/endpoints.fetch.ts`
- [ ] Delete `api/fetch-client.ts`
- [ ] Delete `useGetDrinkType-NEW.ts`
- [ ] Delete `api/_example.endpoints.fetch.ts` (if exists)

#### Phase 2: Create New Endpoint Files (2-3 hours)

- [ ] Create `api/endpoints/translations.endpoints.ts` for TranslationsPage
- [ ] Create `api/endpoints/translations-ui.endpoints.ts` for translations-ui hooks
- [ ] Add to `api/endpoints/index.ts`

#### Phase 3: Migrate TranslationsPage (2-3 hours)

- [ ] Update `useGetTranslations` to use `EndpointHelper.getTranslations` (or create if needed)
- [ ] Update `useSaveTranslations` to use `translationsEndpoints.create/update`
- [ ] Update `useDeleteTranslations` to use `translationsEndpoints.delete`
- [ ] Test thoroughly

#### Phase 4: Migrate TranslationsProductPage (1-2 hours)

- [ ] Update `useDeleteProductTranslation` to use endpoint files
- [ ] Ensure consistency with existing mutation patterns
- [ ] Test thoroughly

#### Phase 5: Migrate Remaining Queries (4-6 hours)

- [ ] Migrate `useGetDrinkSubtypes` to `EndpointHelper.getDrinkSubtypes`
- [ ] Migrate all other GET queries to `EndpointHelper`
- [ ] Update React Router loaders if needed
- [ ] Test thoroughly

#### Phase 6: Migrate Remaining Mutations (4-6 hours)

- [ ] Create endpoint files for remaining resources (orders, modes, slots, relays, sounds)
- [ ] Migrate all mutations to `api/endpoints/` folder
- [ ] Test thoroughly

#### Phase 7: Documentation (1 hour)

- [ ] Add comment in `api.endpoints.ts` explaining pattern
- [ ] Add comment in `api/endpoints/index.ts` explaining pattern
- [ ] Update `.cursor/rules` with endpoint usage guidelines
- [ ] Add example in codebase showing correct usage

**Total Estimated Time:** ~15-20 hours (2-3 days)

---

## 🎯 Success Criteria

- [ ] Single clear pattern for endpoint usage
- [ ] No duplicate endpoint definitions
- [ ] All hooks use consistent pattern
- [ ] All loaders use consistent pattern
- [ ] No hardcoded URLs
- [ ] Type safety maintained
- [ ] Error handling consistent
- [ ] Documentation updated
- [ ] Experimental files deleted

---

## 🚧 Constraints to Consider

- ✅ **React Router loaders** need direct function calls (no hooks)
- ✅ **Mutations** often need entity-specific transformations
- ✅ **Queries** are simpler and can use shared helpers
- ⚠️ **Type safety** must be maintained
- ⚠️ **Error handling** should be consistent
- ⚠️ **Backward compatibility** during migration

---

## 📝 Files to Delete (After Migration)

```
apps/client/src/api/
  - endpoints.fetch.ts          ❌ Delete (experimental, hardcoded localhost)
  - fetch-client.ts             ❌ Delete (unused, hardcoded localhost)
  - _example.endpoints.fetch.ts ❌ Delete (example file)

apps/client/src/queries/drink-types/
  - useGetDrinkType-NEW.ts      ❌ Delete (experimental)
```

---

## 🔍 Migration Checklist Template

For each resource:

- [ ] Identify all hooks using direct `api` calls
- [ ] Determine if query (GET) or mutation (POST/PATCH/DELETE)
- [ ] If query: Add to `EndpointHelper` in `api.endpoints.ts`
- [ ] If mutation: Create/update file in `api/endpoints/`
- [ ] Update hook to use new endpoint
- [ ] Update React Router loader if applicable
- [ ] Test thoroughly
- [ ] Remove old direct `api` calls

---

## 📚 Example Endpoint File Structure

### Query Endpoint (in `api.endpoints.ts`)

```typescript
export const EndpointHelper = createEndpoints({
  // ... existing endpoints ...

  // NEW: Translations endpoints
  getTranslations: async (domain: string) =>
    await api.get<TranslationsModel[]>(`/i18n/translations/${domain}`),
});
```

### Mutation Endpoint File (in `api/endpoints/translations.endpoints.ts`)

```typescript
import { api } from 'api';
import { transformFetchError } from '@workspace/core/api';
import type { TranslationsModel } from 'types/models/translations.model';

export interface CreateTranslationInput {
  key: string;
  translations: Record<string, string>;
  description?: string;
  isActive?: boolean;
}

export interface UpdateTranslationInput {
  key?: string;
  translations?: Record<string, string>;
  description?: string;
}

export const translationsEndpoints = {
  createTranslation: async (domain: string, data: CreateTranslationInput) => {
    try {
      return await api.post<TranslationsModel>(`/translations/${domain}`, data);
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  updateTranslation: async (domain: string, id: string, data: UpdateTranslationInput) => {
    try {
      return await api.patch<TranslationsModel>(`/translations/${domain}/${id}`, data);
    } catch (error) {
      throw transformFetchError(error);
    }
  },

  deleteTranslation: async (domain: string, id: string) => {
    try {
      await api.delete<void>(`/translations/${domain}/${id}`);
    } catch (error) {
      throw transformFetchError(error);
    }
  },
};
```

---

## 🎓 Pattern Guidelines

### When to Use `EndpointHelper` (Queries)

- ✅ Simple GET requests
- ✅ No complex transformations needed
- ✅ Used by React Router loaders
- ✅ Shared across multiple hooks

### When to Use `api/endpoints/` Folder (Mutations)

- ✅ POST/PATCH/DELETE requests
- ✅ Complex transformations needed
- ✅ Entity-specific logic
- ✅ Better organization per resource

### When to Use Direct `api` Calls

- ❌ **Never** (after migration)
- ✅ Only during migration period (temporary)

---

## 📊 Migration Priority

**High Priority (Most Fragmented):**

1. TranslationsPage hooks (100% direct calls)
2. TranslationsProductPage deletes (inconsistent)
3. translations-ui hooks (all direct calls)

**Medium Priority:**
4. Other query hooks using direct calls
5. Other mutation hooks using direct calls

**Low Priority:**
6. Cleanup experimental files
7. Documentation updates

---

## 🔗 Related Files

- `TODO.MASTER.md` - Main roadmap (Phase 4 references this)
- `apps/client/src/api/api.endpoints.ts` - Current `EndpointHelper`
- `apps/client/src/api/endpoints/` - Current endpoint files
- `.cursor/rules/` - Should be updated with endpoint guidelines

---

## 📝 Notes

- This consolidation is **not blocking** for other phases
- Can be done incrementally (one resource at a time)
- Low risk (mostly cleanup and reorganization)
- Improves code maintainability significantly
- Makes onboarding easier for new developers
- Prevents future fragmentation

---

**Last Updated:** 2024-12-14
**Owner:** @justin
