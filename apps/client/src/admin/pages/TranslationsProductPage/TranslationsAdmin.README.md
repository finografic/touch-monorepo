# Product Translations Page - Architecture Documentation

📅 Dec 14, 2025

## Overview

The Product Translations page provides an admin interface for managing multilingual translations of product-related entities (drink types, subtypes, volumes, container types). The implementation uses **React Hook Form (RHF)** for form state management and **TanStack Query** for data fetching and caching.

---

## 📁 Folder Structure

```
TranslationsProductPage/
├── README.md                          # This file
├── TranslationsProductPage.tsx        # Main page component (tabs, routing)
├── TranslationsProductPage.styles.ts  # Page-level styles
│
├── hooks/                             # Page-level orchestration hooks
│   ├── useProductTranslationData.ts  # Fetches and transforms data for all sections
│   ├── useSaveProductTranslations.ts # Orchestrates CREATE/UPDATE operations
│   └── useDeleteProductTranslation.ts # Orchestrates DELETE operations
│
├── TranslationsTable/                 # Table components and shared logic
│   ├── TranslationsTable.tsx          # Standard table (drinkTypes, volumes, containerTypes)
│   ├── TranslationsTableExpandable.tsx # Expandable table (drinkSubtypes)
│   ├── TranslationsTable.styles.ts    # Shared table styles
│   ├── translations-table.config.ts   # Table configuration constants
│   │
│   ├── components/                    # Row components
│   │   ├── TranslationsRow.tsx        # Standard row with slug auto-generation
│   │   └── TranslationsRowExpanded.tsx # Expandable row (same logic, different layout)
│   │
│   └── hooks/                         # Shared table logic
│       ├── useTranslationsTableForm.ts    # RHF setup, form reset, empty row detection
│       └── useTranslationsTableHandlers.ts # Delete, save, reset handlers
│
├── TableFormButtons/                  # Action buttons component
│   ├── TableFormButtons.tsx
│   └── TableFormButtons.styles.ts
│
├── utils/                             # Utility functions
│   └── language.utils.ts              # Language code conversion, slug generation
│
├── translations.types.ts              # TypeScript type definitions
└── translations.dto.ts                # Data transformation (form ↔ API)
```

---

## 🏗️ Architecture Layers

### Layer Separation

| Layer | Responsibility | What It Does NOT Do |
|-------|---------------|---------------------|
| **RHF Table** | Add/edit/remove rows, track dirty state, auto-slug generation | API calls, state management |
| **Save Hook** | Diff items, route to mutations (CREATE/UPDATE) | Form logic, UI state |
| **Delete Hook** | Handle DELETE operations | Form logic, UI state |
| **Query Hooks** | Actual API calls (POST/PATCH/DELETE) | Business logic, form state |
| **DTO** | Transform form ↔ API format | Validation, side effects |

### Data Flow

```
User Input → RHF (tracks changes) → Save Handler → Query Hooks → API
                                                      ↓
                                              Cache Invalidation
                                                      ↓
                                              Refetch → Update UI
```

---

## 🔑 Critical Technical Details

### 1. CUID vs RHF Internal ID

**The Problem**: RHF's `useFieldArray` auto-generates an `id` property for internal tracking, which can conflict with our database CUID stored in `item.id`.

**The Solution**: Use `keyName: 'fieldId'` to separate IDs:

```ts
const { fields, remove, append } = useFieldArray({
  control,
  name: 'items',
  keyName: 'fieldId', // 🔑 CRITICAL: RHF uses 'fieldId', leaving 'id' free for CUID
});
```

**ID Structure**:

```ts
// ✅ CORRECT (with keyName)
field = {
  fieldId: "abc123xyz",           // ← RHF's internal ID (for React keys)
  id: "cmizjuot50000ug7npq6uhyfm", // ← Our actual database CUID ✅
  name: "cerveza",
  esEs: "Cerveza",
}

// ❌ WRONG (without keyName)
field = {
  id: "abc123xyz",  // ← RHF's auto-generated ID (NOT a CUID!)
  // Missing our actual CUID
}
```

**When to Use Which ID**:

| Context | Use | Example |
|---------|-----|---------|
| **React keys** | `field.fieldId` | `<Row key={field.fieldId} />` |
| **API requests** | `item.id` | `PATCH /drink-types/${item.id}` |
| **Tracking in refs** | `item.id` | `initialItemsRef.current.map(i => i.id)` |

**Safeguards**:

- ✅ `keyName: 'fieldId'` prevents ID conflicts
- ✅ TypeScript types ensure correct usage
- ✅ API calls always use `item.id` (CUID)
- ✅ React keys always use `field.fieldId` (RHF internal)

---

### 2. Form Reset & Dirty State Management

**The Challenge**: After saving, the form must reset to reflect server data without marking everything as dirty.

**The Solution**: Use `keepDefaultValues: false` when resetting:

```ts
methods.reset({ items }, {
  keepValues: false,
  keepDefaultValues: false, // ⚠️ CRITICAL: Updates defaultValues to new items
  keepDirty: false
});
```

**Why This Matters**:

- Without `keepDefaultValues: false`, RHF compares current values against **old** defaults
- This makes everything appear dirty even after a successful save
- With `keepDefaultValues: false`, new items become the new defaults, clearing dirty state

**Reset Flow**:

1. User saves → API call succeeds
2. `invalidateReferenceDataQueries` triggers refetch
3. `items` prop updates with fresh server data
4. `useEffect` detects change and resets form
5. Form state matches server data, dirty flags cleared

---

### 3. Auto-Slug Generation

The `name` field (slug) is automatically generated from the first populated language field:

**Priority Order**: `es-ES` → `en-GB` → `ca-ES`

**Implementation**:

- Uses `regenerateSlug()` utility (200ms debounce)
- Updates `name` field with `shouldDirty: false` to prevent marking slug as dirty on initial render
- Slug is read-only in the UI (display only)

**Example**:

```
User types "Cerveza" in es-ES field
  ↓
Slug auto-updates to "cerveza"
  ↓
On save: { name: "cerveza", translations: { "es-ES": "Cerveza" } }
```

---

## 🔄 Save & Delete Flow

### Save Flow

1. **User clicks Save** → `handleSave` (from `useTranslationsTableHandlers`)
2. **Filter empty rows** → Remove items with all language fields empty
3. **Filter dirty/new items** → Only send items that changed or are new (`temp-*` IDs)
4. **Transform to API format** → `TranslationsDto.toApi()` converts RHF format to API format
5. **Route to mutations** → `useSaveProductTranslations` routes to correct mutation hook
6. **API calls** → POST for new items, PATCH for existing items
7. **Invalidate queries** → `invalidateReferenceDataQueries` clears all related caches
8. **Refetch** → Fresh data loads, form resets automatically

### Delete Flow

1. **User clicks Delete** → `handleDelete` (from `useTranslationsTableHandlers`)
2. **Confirmation dialog** → Native browser `confirm()` dialog
3. **API call** → `useDeleteProductTranslation` calls DELETE endpoint
4. **Remove from form** → `remove(index)` removes row from RHF field array
5. **Invalidate queries** → `invalidateReferenceDataQueries` clears caches
6. **Refetch** → Fresh data loads, deleted item disappears

---

## 🎣 Shared Hooks

### `useTranslationsTableForm`

**Purpose**: Centralized RHF form setup, reset logic, and empty row detection.

**Returns**:

- `methods` - RHF form methods
- `fields`, `remove`, `append` - Field array operations
- `watchedItems` - Current form values
- `languageKeys` - Converted language keys (`esEs`, `enGb`, `caEs`)
- `hasEmptyRow` - Boolean indicating if any row is empty
- `isDirtyLastItem` - Boolean indicating if last item has a name
- `isItemEmpty` - Helper function to check if an item is empty

**Used by**: Both `TranslationsTable` and `TranslationsTableExpandable`

---

### `useTranslationsTableHandlers`

**Purpose**: Shared handlers for delete, save, and reset operations.

**Returns**:

- `handleDelete` - Delete handler with confirmation
- `handleSave` - Save handler (filters empty/dirty items)
- `handleReset` - Reset form to default values

**Features**:

- ✅ Handles both regular and expandable tables (supports optional `drinkTypeId`)
- ✅ Filters empty rows before save
- ✅ Only sends dirty/new items to API
- ✅ Updates `initialItemsRef` after successful delete

**Used by**: Both `TranslationsTable` and `TranslationsTableExpandable`

---

## 📊 Table Components

### `TranslationsTable`

**Purpose**: Standard table for simple entity types (drinkTypes, volumes, containerTypes).

**Features**:

- Standard `<thead>` with language columns
- Simple row rendering
- Add new row at the end
- Delete button per row

**Props**:

- `sectionKey` - Entity type identifier
- `items` - Array of translation items
- `supportedLanguages` - Array of language codes
- `onSave` - Save callback
- `onDelete` - Delete callback
- `isSaving` - Loading state
- `isDeleting` - Loading state

---

### `TranslationsTableExpandable`

**Purpose**: Expandable table for drink subtypes, grouped by parent drink type.

**Features**:

- Groups subtypes by drink type
- Expand/collapse groups (only one open at a time)
- Add new subtype to expanded group
- Group header shows subtype count
- Blue subheader row when expanded (mimics `<thead>`)

**Differences from `TranslationsTable`**:

- Requires expanded group to add new items
- Uses `ExpandedSubtypeRow` component (adds empty cell for chevron alignment)
- Groups items by `drinkTypeId`
- Passes `drinkTypeId` to delete handler

---

## 🔧 Query Key Architecture

Following the established pattern: **One distinct query key per HTTP method + endpoint**.

```ts
// Example from queries/drink-types/index.ts
export const GET_DRINK_TYPES_QUERYKEY = ['get-drink-types'] as const;
export const POST_DRINK_TYPE_QUERYKEY = ['post-drink-type'] as const;
export const PATCH_DRINK_TYPE_QUERYKEY = ['patch-drink-type'] as const;
export const DELETE_DRINK_TYPE_QUERYKEY = ['delete-drink-type'] as const;
```

**Why This Matters**:

- ✅ Granular cache invalidation
- ✅ Prevents stale data
- ✅ Explicit dependencies
- ✅ Easier debugging

**Invalidation Strategy**:
After every successful mutation, invalidate **ALL** related query keys:

```ts
await invalidateReferenceDataQueries(queryClient);
// Invalidates: GET, POST, PATCH, DELETE for all entity types
// Then refetches GET queries to ensure immediate UI updates
```

---

## 🎨 Styling & Visual Feedback

### Dynamic CSS Classes

The table applies dynamic classes based on form state:

- **`row-editing`** - Row has focus (being edited)
- **`row-dirty`** - Row has unsaved changes (orange border)
- **`input-dirty`** - Input field has unsaved changes (orange background)
- **`input-empty`** - Input field is empty (orange text)

### Visual States

| State | Visual Indicator |
|-------|-----------------|
| **Editing** | Row has light background, inputs have border |
| **Dirty** | Orange left border on row, orange background on inputs |
| **Empty** | Orange text color, placeholder visible |
| **Saving** | "Saving..." text on save button, buttons disabled |

---

## 🚨 Common Pitfalls & Solutions

### ❌ Mistake 1: Using `field.id` for React Keys

```ts
// WRONG
fields.map((field) => <Row key={field.id} />)
```

**Why**: `field.id` is the CUID, which can change. React keys should be stable.

**Solution**:

```ts
// CORRECT
fields.map((field) => <Row key={field.fieldId} />)
```

---

### ❌ Mistake 2: Forgetting `keepDefaultValues: false`

```ts
// WRONG
methods.reset({ items }, { keepDefaultValues: true })
```

**Why**: Form compares against old defaults, everything appears dirty.

**Solution**:

```ts
// CORRECT
methods.reset({ items }, { keepDefaultValues: false })
```

---

### ❌ Mistake 3: Sending All Items on Save

```ts
// WRONG
await onSave({ items: data.items }) // Sends everything!
```

**Why**: Unnecessary API calls, poor performance.

**Solution**:

```ts
// CORRECT (already implemented in handleSave)
const changedItems = nonEmptyItems.filter((item, index) => {
  if (item.id.startsWith('temp-')) return true; // New items
  return Boolean(dirtyFields.items?.[index]); // Only dirty items
});
```

---

## 📝 Type Definitions

### `TranslationsFormItem`

```ts
interface TranslationsFormItem {
  id: string; // CUID or "temp-{cuid}" for new items
  name: string; // Slug (auto-generated, read-only)
  esEs: string; // Spanish translation
  enGb: string; // English translation
  caEs: string; // Catalan translation
  // ... entity-specific fields (hasSubtypes, valueInMl, etc.)
}
```

### `SectionKey`

```ts
type SectionKey = 'drinkTypes' | 'drinkSubtypes' | 'volumes' | 'containerTypes';
```

---

## ✅ Testing Checklist

When making changes, verify:

- [ ] Network requests use CUIDs (not RHF internal IDs)
- [ ] PATCH/DELETE use correct database IDs
- [ ] No 404 errors from invalid IDs
- [ ] Form resets correctly after save (no dirty state)
- [ ] Slug auto-generates from first populated language field
- [ ] Empty rows are filtered before save
- [ ] Only dirty/new items are sent to API
- [ ] Cache invalidation triggers refetch
- [ ] Visual feedback (dirty classes) works correctly
- [ ] Delete confirmation dialog appears
- [ ] Expandable table requires expanded group to add new items

---

## 🔗 Related Files

- `queries/invalidateReferenceData.ts` - Centralized cache invalidation
- `queries/drink-types/`, `queries/drink-volumes/`, `queries/container-types/` - Mutation hooks
- `admin/pages/TranslationsProductPage/translations.dto.ts` - Data transformation
- `admin/pages/TranslationsProductPage/translations.types.ts` - Type definitions

---

**Status**: ✅ **Production Ready**
**Last Updated**: 2025-12-14
