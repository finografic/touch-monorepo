# Migration Plan: `name` → `key` Column Rename

## Overview

Migrate all product entity tables from using `name` column to `key` column for consistency with UI translation tables.

**Affected Tables:**

- `drink_types`
- `drink_subtypes`
- `volumes`
- `container_types`

**Current State:**

- UI translation tables (`translations_ui`, `translations_app`, `translations_admin`) use `key` ✅
- Product entity tables use `name` ❌
- Frontend forms use `key` but API expects `name` (handled via DTO mapping)

**Goal:**

- All tables use `key` column consistently
- Remove DTO mapping layer (`fromApiProduct`/`toApiProduct`)
- Simplify codebase

---

## Phase 1: Database Schema Migration (Backend)

### 1.1 Create Migration Script

**Estimated Time:** 2-3 hours

**Tasks:**

- [ ] Create migration script: `data/migrations/XXXX_rename_name_to_key.sql`
- [ ] For each table (`drink_types`, `drink_subtypes`, `volumes`, `container_types`):
  - [ ] Rename `name` column to `key`
  - [ ] Update unique constraints
  - [ ] Update indexes
  - [ ] Preserve all data

**SQL Example:**

```sql
-- For each table
ALTER TABLE drink_types RENAME COLUMN name TO key;
-- Update unique constraint
CREATE UNIQUE INDEX IF NOT EXISTS drink_types_key_unique ON drink_types(key);
DROP INDEX IF EXISTS drink_types_name_unique;
```

**Files to Create:**

- `data/migrations/XXXX_rename_name_to_key.sql`

**Testing:**

- [ ] Run migration on test database
- [ ] Verify all data preserved
- [ ] Verify constraints/indexes updated
- [ ] Test rollback procedure

---

### 1.2 Update Drizzle Schemas

**Estimated Time:** 1 hour

**Tasks:**

- [ ] Update `apps/server/src/db/schemas/drink_types.schema.ts`
  - [ ] Change `name: text('name')` → `key: text('key')`
  - [ ] Update Valibot schema validations
- [ ] Update `apps/server/src/db/schemas/drink_subtypes.schema.ts`
- [ ] Update `apps/server/src/db/schemas/volumes.schema.ts`
- [ ] Update `apps/server/src/db/schemas/container_types.schema.ts`

**Files to Modify:**

- `apps/server/src/db/schemas/drink_types.schema.ts`
- `apps/server/src/db/schemas/drink_subtypes.schema.ts`
- `apps/server/src/db/schemas/volumes.schema.ts`
- `apps/server/src/db/schemas/container_types.schema.ts`

**Testing:**

- [ ] Run type checks
- [ ] Verify schema matches database structure
- [ ] Test CRUD operations

---

## Phase 2: Backend API Updates

### 2.1 Update API Routes & Handlers

**Estimated Time:** 2-3 hours

**Tasks:**

- [ ] Search for all `name` field references in API handlers
- [ ] Update request/response DTOs to use `key` instead of `name`
- [ ] Update validation schemas
- [ ] Update error messages

**Files to Search/Modify:**

```bash
# Find all references
grep -r "\.name" apps/server/src/routes/
grep -r "name:" apps/server/src/routes/
grep -r "name\s" apps/server/src/routes/
```

**Key Areas:**

- Route handlers for drink-types, drink-subtypes, volumes, container-types
- Request validation schemas
- Response serialization
- Error handling

**Testing:**

- [ ] Test all CRUD endpoints
- [ ] Verify validation works
- [ ] Test error cases

---

### 2.2 Update Query/Mutation Hooks (Server-side)

**Estimated Time:** 1 hour

**Tasks:**

- [ ] Update any server-side query builders
- [ ] Update any internal utilities that reference `name`

**Files to Check:**

- `apps/server/src/queries/` (if any)
- `apps/server/src/utils/` (translation utilities)

---

## Phase 3: Frontend Updates

### 3.1 Update Type Definitions

**Estimated Time:** 30 minutes

**Tasks:**

- [ ] Update `apps/client/src/admin/pages/TranslationsProductPage/translations.types.ts`
  - [ ] Change `TranslationApiItem.name` → `TranslationApiItem.key`
  - [ ] Verify `TranslationFormItem.key` is correct (already uses `key`)

**Files to Modify:**

- `apps/client/src/admin/pages/TranslationsProductPage/translations.types.ts`

---

### 3.2 Update DTO to Remove Mapping

**Estimated Time:** 1 hour

**Tasks:**

- [ ] Update `apps/client/src/admin/utils/translations.dto.ts`
  - [ ] Merge `fromApiProduct` into `fromApi` (both use `key` now)
  - [ ] Merge `toApiProduct` into `toApi` (both use `key` now)
  - [ ] Remove product-specific methods
  - [ ] Update comments

**Files to Modify:**

- `apps/client/src/admin/utils/translations.dto.ts`

---

### 3.3 Update Hooks

**Estimated Time:** 1 hour

**Tasks:**

- [ ] Update `apps/client/src/admin/pages/TranslationsProductPage/hooks/useProductTranslationData.ts`
  - [ ] Change `TranslationsDto.fromApiProduct` → `TranslationsDto.fromApi`
- [ ] Update `apps/client/src/admin/pages/TranslationsProductPage/hooks/useSaveProductTranslations.ts`
  - [ ] Change `TranslationsDto.toApiProduct` → `TranslationsDto.toApi`
  - [ ] Change `payload.name` → `payload.key` (remove all TODO comments)

**Files to Modify:**

- `apps/client/src/admin/pages/TranslationsProductPage/hooks/useProductTranslationData.ts`
- `apps/client/src/admin/pages/TranslationsProductPage/hooks/useSaveProductTranslations.ts`

---

### 3.4 Update Form Components

**Estimated Time:** 1-2 hours

**Tasks:**

- [ ] Update `apps/client/src/admin/pages/TranslationsProductPage/TranslationsTable/components/TranslationsRow.tsx`
  - [ ] Change form field `items.${index}.name` → `items.${index}.key`
  - [ ] Update slug regeneration logic
- [ ] Update `apps/client/src/admin/pages/TranslationsProductPage/TranslationsTable/components/TranslationsRowExpanded.tsx`
  - [ ] Same changes as above
- [ ] Update `apps/client/src/admin/pages/TranslationsProductPage/TranslationsTable/hooks/useTranslationsTableForm.ts`
  - [ ] Update any `name` references to `key`

**Files to Modify:**

- `apps/client/src/admin/pages/TranslationsProductPage/TranslationsTable/components/TranslationsRow.tsx`
- `apps/client/src/admin/pages/TranslationsProductPage/TranslationsTable/components/TranslationsRowExpanded.tsx`
- `apps/client/src/admin/pages/TranslationsProductPage/TranslationsTable/hooks/useTranslationsTableForm.ts`
- `apps/client/src/admin/pages/TranslationsProductPage/TranslationsTable/hooks/useTranslationsTableHandlers.ts`

---

### 3.5 Update React Query Hooks

**Estimated Time:** 1 hour

**Tasks:**

- [ ] Search for all `name:` references in mutation/query hooks
- [ ] Update to use `key:` instead

**Files to Search:**

```bash
grep -r "name:" apps/client/src/queries/
```

**Key Files:**

- `apps/client/src/queries/drink-types.ts`
- `apps/client/src/queries/drink-volumes.ts`
- `apps/client/src/queries/container-types.ts`

---

## Phase 4: Testing & Validation

### 4.1 Integration Testing

**Estimated Time:** 2-3 hours

**Tasks:**

- [ ] Test all CRUD operations for each entity type
- [ ] Test translation editing in CMS
- [ ] Test form validation
- [ ] Test slug/key generation
- [ ] Test expandable subtypes table
- [ ] Verify no data loss

**Test Scenarios:**

1. Create new drink type → verify `key` is set correctly
2. Update existing drink type → verify `key` updates
3. Delete drink type → verify cascade works
4. Test subtypes (expandable table)
5. Test volumes and container types
6. Test translation editing for all entities

---

### 4.2 Regression Testing

**Estimated Time:** 1-2 hours

**Tasks:**

- [ ] Test UI translation pages (should be unaffected)
- [ ] Test product selection flows
- [ ] Test order creation flows
- [ ] Verify no breaking changes

---

## Phase 5: Cleanup

### 5.1 Remove TODO Comments

**Estimated Time:** 15 minutes

**Tasks:**

- [ ] Remove all `// TODO: After migration, change to payload.key` comments
- [ ] Remove `// TODO: After migration` comments from DTO

---

### 5.2 Documentation Updates

**Estimated Time:** 30 minutes

**Tasks:**

- [ ] Update API documentation
- [ ] Update architecture docs if needed
- [ ] Update any README files

---

## Rollback Plan

If issues arise, rollback steps:

1. **Database:** Run reverse migration (rename `key` → `name`)
2. **Code:** Revert git commits for affected files
3. **Deploy:** Rollback to previous version

**Rollback SQL:**

```sql
ALTER TABLE drink_types RENAME COLUMN key TO name;
-- Repeat for other tables
```

---

## Estimated Total Time

- **Phase 1:** 3-4 hours
- **Phase 2:** 3-4 hours
- **Phase 3:** 4-5 hours
- **Phase 4:** 3-5 hours
- **Phase 5:** 45 minutes

**Total:** ~14-19 hours (2-3 days of focused work)

---

## Risk Assessment

**Low Risk:**

- Database migration (SQLite supports column rename)
- Type updates (TypeScript will catch errors)

**Medium Risk:**

- API changes (need thorough testing)
- Form field updates (could break existing forms)

**Mitigation:**

- Test each phase thoroughly before proceeding
- Keep rollback plan ready
- Deploy to staging first
- Consider feature flag if needed

---

## Success Criteria

✅ All tables use `key` column
✅ DTO mapping layer removed
✅ No `name` references in product translation code
✅ All tests passing
✅ No data loss
✅ CMS fully functional

---

## Notes

- The generic DTO (`TranslationsDto`) currently handles both cases
- After migration, we can simplify to single `fromApi`/`toApi` methods
- Consider doing this migration during a low-traffic period
- May want to coordinate with team to avoid conflicts
