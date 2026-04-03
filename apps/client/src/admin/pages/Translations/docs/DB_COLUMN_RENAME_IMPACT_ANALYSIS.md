# Database Column Rename Impact Analysis: `name` → `key`

## Executive Summary

**Proposed Change**: Rename `name` column to `key` in:
- `drink_types` table
- `drink_subtypes` table
- `volumes` table
- `container_types` table

**Impact Level**: **HIGH** - Affects database schema, views, API endpoints, and extensive frontend code

**Estimated Effort**: 4-6 hours of development + testing

**Risk Level**: **MEDIUM** - Requires database migration and coordinated frontend/backend changes

---

## 1. Database Layer Impact

### 1.1 Schema Changes Required

**Files to Modify:**
- `apps/server/src/db/schemas/drink_types.schema.ts` (line 12)
- `apps/server/src/db/schemas/drink_subtypes.schema.ts` (line 16)
- `apps/server/src/db/schemas/volumes.schema.ts` (line 11)
- `apps/server/src/db/schemas/container_types.schema.ts` (line 11)

**Changes:**
```typescript
// Before
name: text('name').notNull().unique()

// After
key: text('key').notNull().unique()
```

### 1.2 Valibot schema updates

**Files to Modify:**
- All 4 schema files above (validation schemas reference `name`)

**Changes:** Update field overrides from `name` to `key` in the Valibot insert/select schemas (same min/max rules as today).

### 1.3 Database View Updates

**File:** `apps/server/src/db/views/orders_readable.sql`

**Current:**
```sql
dt.name AS drink_type,
dst.name AS drink_subtype,
v.name AS volume,
ct.name AS container_type,
```

**After:**
```sql
dt.key AS drink_type,
dst.key AS drink_subtype,
v.key AS volume,
ct.key AS container_type,
```

### 1.4 Database Migration Required

**Action:** Create migration script to:
1. Rename column `name` → `key` in all 4 tables
2. Update `orders_readable` view
3. Preserve all existing data

**Risk:** Medium - Requires careful migration to avoid data loss

---

## 2. Server-Side API Impact

### 2.1 Entity Types

**Files to Check:**
- `apps/server/src/types/entities/drink-type.entity.ts`
- Similar files for other entities

**Impact:** Update interface definitions if they explicitly define `name` property

### 2.2 API Handlers

**Files to Check:**
- `apps/server/src/routes/drink-type/drink-type.handlers.ts`
- `apps/server/src/routes/drink-subtypes/drink-subtypes.handlers.ts`
- `apps/server/src/routes/container-type/container-type.handlers.ts`
- Volume-related handlers

**Impact:** Any code that references `entity.name` needs updating

### 2.3 Seed Data

**File:** `apps/server/src/db/seeds/translatable_entities.seed.ts`

**Impact:** Update seed data to use `key` instead of `name`

---

## 3. Frontend Type Definitions

### 3.1 Model Types

**Files to Modify:**
- `apps/client/src/types/models/drink-type.model.ts`
- `apps/client/src/types/models/volume.model.ts`
- `apps/client/src/types/models/container.model.ts`

**Impact:** TypeScript interfaces need `name` → `key` change

### 3.2 DTOs

**Files to Modify:**
- `apps/client/src/queries/drink-types/DrinkTypes.dto.ts` (line 15: `name: drinkType.name`)
- Similar DTOs for other entities

**Impact:** Data transformation logic needs updating

---

## 4. Frontend Component Impact

### 4.1 TranslationsProductPage (HIGH IMPACT)

**Files Affected:**
- `apps/client/src/admin/pages/TranslationsProductPage/translationsProduct.types.ts` (lines 13, 20)
- `apps/client/src/admin/pages/TranslationsProductPage/TranslationsTable/hooks/useTranslationsTableForm.ts` (line 84)
- `apps/client/src/admin/pages/TranslationsProductPage/TranslationsTable/hooks/useTranslationsTableHandlers.ts` (line 50)
- `apps/client/src/admin/pages/TranslationsProductPage/TranslationsTable/components/TranslationsRow.tsx` (lines 38, 54, 104)
- `apps/client/src/admin/pages/TranslationsProductPage/TranslationsTable/components/TranslationsRowExpanded.tsx` (lines 37, 49)
- `apps/client/src/admin/pages/TranslationsProductPage/TranslationsTable/TranslationsTableExpandable.tsx` (lines 76, 85)
- `apps/client/src/admin/pages/TranslationsProductPage/utils/translationsProduct.dto.ts` (lines 15, 38)
- `apps/client/src/admin/pages/TranslationsProductPage/hooks/useSaveProductTranslations.ts` (8 occurrences)

**Total:** ~15-20 file changes

### 4.2 AdminProductsPage (HIGH IMPACT)

**Files Affected:**
- `apps/client/src/admin/pages/AdminProductsPage/OrdersForm/orders-form.utils.ts` (line 86: `dt.name === formDrinkType`)
- `apps/client/src/admin/pages/AdminProductsPage/OrdersForm/useAddNewItemHandlers.ts` (lines 60, 87, 156, 196)
- `apps/client/src/admin/pages/AdminProductsPage/OrdersForm/orders-form.submission.ts` (multiple `findIdByName` calls)
- `apps/client/src/admin/pages/AdminProductsPage/OrdersTable/useTableLabelMappings.ts` (lines 64-66, 69, 86, 110)
- `apps/client/src/admin/pages/AdminProductsPage/OrdersTable/OrdersTable.tsx` (display logic)

**Total:** ~10-15 file changes

### 4.3 Utilities & Hooks (MEDIUM IMPACT)

**Files Affected:**
- `apps/client/src/utils/filters/filters.utils.ts` (lines 92, 94, 96, 98)
- `apps/client/src/utils/filters/__tests__/filters.utils.test.ts` (multiple test cases)
- `apps/client/src/utils/filters/__tests__/filtering-simple.test.ts` (multiple test cases)
- `apps/client/src/hooks/useSmartFallback.ts` (lines 55-58, 63-66)
- `apps/client/src/hooks/useDataPoolProxy.ts` (lines 69-72)
- `apps/client/src/dev-tools/mocks/MockOrdersButton/useGenerateRealMockData.ts` (multiple occurrences)

**Total:** ~8-10 file changes

### 4.4 Configuration Files (LOW IMPACT)

**Files Affected:**
- `apps/client/src/config/app/filters.constants.ts` (API filter keys - may not need changes)
- `apps/client/src/config/ui/pads-ui.config.ts` (filter API keys)

**Total:** ~2-3 file changes

---

## 5. Testing Impact

### 5.1 Unit Tests

**Files to Update:**
- All test files in `apps/client/src/utils/filters/__tests__/`
- Any component tests that mock these entities

### 5.2 Integration Tests

**Impact:**
- API endpoint tests
- Form submission tests
- Translation save/load tests

### 5.3 Manual Testing Required

**Areas:**
- ✅ Orders form (create/edit)
- ✅ Orders table (filtering, display)
- ✅ Product translations (all tabs)
- ✅ Translation save/load
- ✅ Add new items functionality
- ✅ Filter navigation

---

## 6. Migration Strategy

### Phase 1: Database Migration
1. Create migration script
2. Test on development database
3. Backup production database
4. Execute migration

### Phase 2: Backend Updates
1. Update all schema files
2. Update API handlers
3. Update entity types
4. Test API endpoints

### Phase 3: Frontend Updates
1. Update type definitions
2. Update DTOs
3. Update components (TranslationsProductPage)
4. Update components (AdminProductsPage)
5. Update utilities and hooks
6. Update tests

### Phase 4: Testing & Validation
1. Run all unit tests
2. Run integration tests
3. Manual testing of all affected features
4. Verify data integrity

---

## 7. Benefits of This Change

### 7.1 Code Consolidation
- ✅ Unifies data model (`key` used everywhere)
- ✅ Enables full consolidation of translation hooks/components
- ✅ Reduces code duplication
- ✅ Simplifies type system

### 7.2 Semantic Clarity
- ✅ `key` is more accurate (it's a unique identifier/slug)
- ✅ Aligns with translation system terminology
- ✅ Better reflects actual usage (not a display name)

### 7.3 Future Maintenance
- ✅ Single source of truth for field name
- ✅ Easier to understand codebase
- ✅ Reduced cognitive load

---

## 8. Risks & Considerations

### 8.1 Data Migration Risk
- **Risk:** Data loss if migration fails
- **Mitigation:** Comprehensive backup, test migration on copy first

### 8.2 Breaking Changes
- **Risk:** Any external integrations using `name` field
- **Mitigation:** Check for external API consumers, version API if needed

### 8.3 Coordination Required
- **Risk:** Frontend and backend must be updated simultaneously
- **Mitigation:** Deploy as coordinated release, feature flag if possible

### 8.4 Testing Coverage
- **Risk:** Missed edge cases
- **Mitigation:** Comprehensive test suite, manual QA pass

---

## 9. Estimated File Changes Summary

| Category | Files | Lines Changed (est.) |
|----------|-------|---------------------|
| Database Schemas | 4 | ~20 |
| Database Views | 1 | ~4 |
| Server API | 5-8 | ~30-50 |
| Frontend Types | 3-5 | ~15-25 |
| TranslationsProductPage | 8-10 | ~50-70 |
| AdminProductsPage | 10-15 | ~60-80 |
| Utilities/Hooks | 8-10 | ~40-60 |
| Tests | 5-8 | ~30-50 |
| **TOTAL** | **44-59** | **~280-400** |

---

## 10. Recommendation

### ✅ **PROCEED** with the rename, but:

1. **Do it in a dedicated branch** with comprehensive testing
2. **Create migration script first** and test thoroughly
3. **Update backend first**, then frontend (or coordinate deployment)
4. **Run full test suite** before merging
5. **Manual QA pass** on all affected features

### Alternative: Gradual Migration

If the risk is too high, consider:
1. Add `key` column alongside `name`
2. Update code to use `key` where possible
3. Migrate data gradually
4. Remove `name` column later

However, this adds complexity and technical debt.

---

## 11. Next Steps (If Approved)

1. Create database migration script
2. Update all schema files
3. Update backend API handlers
4. Update frontend types
5. Update frontend components (systematic file-by-file)
6. Update tests
7. Create PR with comprehensive testing notes
8. Coordinate deployment

---

**Report Generated:** Based on codebase analysis
**Last Updated:** Current date
**Status:** Ready for review

