# Consolidation Plan for Translations Pages

## Analysis Summary

### ✅ **Can Be Consolidated:**

1. **`useTranslationsTableForm.ts`** - ~90% identical
   - Both use `useFieldArray` with same pattern
   - Differences:
     - `remove` signature: `(key: string)` vs `(index: number)`
     - `isDirtyLastItem`: checks `key` vs `name`
     - Change detection: sophisticated vs JSON.stringify
   - **Solution**: Make `remove` and `isDirtyLastItem` configurable via options

2. **`useTranslationsTableHandlers.ts`** - ~85% identical
   - Both have same save/reset logic
   - Differences:
     - `handleDelete` signature: `(key: string)` vs `(index: number)`
     - Confirmation message: uses `item.key` vs `item.name`
     - Product version has optional `drinkTypeId` parameter
   - **Solution**: Make delete handler accept both key and index, detect which to use

3. **`TranslationsRow.tsx`** - ~70% identical
   - Both render same structure (key column, language columns, delete button)
   - Differences:
     - Field name: `key` vs `name`
     - Auto-sync: `regenerateSegment` vs `regenerateSlug`
     - Display: `<pre>` with formatted key vs `<Input>` readonly
     - Props: TranslationsPage has `domain`, `group`, `translationKey`
   - **Solution**: Create shared base component with configurable field name and display

### ❌ **Cannot Be Consolidated (Fundamental Differences):**

1. **Type Definitions**
   - `TranslationsPage`: Uses `key: string` (dot-notation)
   - `TranslationsProductPage`: Uses `name: string` (slug)
   - These are different data models

2. **Table Components**
   - `TranslationsTable.tsx` (Page): Has divider rows, grouping logic
   - `TranslationsTable.tsx` (Product): Has expandable rows, different structure
   - Different rendering needs

## Recommended Consolidation Steps

### Step 1: Consolidate `useTranslationsTableForm.ts`

**Location**: `TranslationsSHARED/hooks/useTranslationsTableForm.ts`

**Changes**:

- Accept `fieldName: 'key' | 'name'` option
- Accept `removeStrategy: 'key' | 'index'` option
- Make `isDirtyLastItem` check configurable field
- Use sophisticated change detection (better than JSON.stringify)

### Step 2: Consolidate `useTranslationsTableHandlers.ts`

**Location**: `TranslationsSHARED/hooks/useTranslationsTableHandlers.ts`

**Changes**:

- Accept `fieldName: 'key' | 'name'` option
- Accept `removeStrategy: 'key' | 'index'` option
- Make `handleDelete` work with both strategies
- Support optional `drinkTypeId` parameter

### Step 3: Create Shared `TranslationsRowBase.tsx`

**Location**: `TranslationsSHARED/components/TranslationsRowBase.tsx`

**Changes**:

- Accept `fieldName: 'key' | 'name'` prop
- Accept `displayComponent: 'pre' | 'input'` prop
- Accept `autoSyncFunction: 'segment' | 'slug'` prop
- Keep all shared logic (dirty fields, editing state, language columns)

### Step 4: Keep Wrapper Components

- `TranslationsPage/TranslationsRow.tsx` - Thin wrapper with `fieldName="key"`, `displayComponent="pre"`
- `TranslationsProductPage/TranslationsRow.tsx` - Thin wrapper with `fieldName="name"`, `displayComponent="input"`

## Benefits

1. **Single source of truth** for form logic
2. **Easier maintenance** - fix bugs once
3. **Consistent behavior** across both pages
4. **Type safety** maintained with generics
5. **Backward compatible** - existing code continues to work

## Estimated Impact

- **Lines of code reduced**: ~200-300 lines
- **Files consolidated**: 3 hooks/components
- **Maintenance burden**: Significantly reduced
- **Risk**: Low (changes are additive, existing code remains)
