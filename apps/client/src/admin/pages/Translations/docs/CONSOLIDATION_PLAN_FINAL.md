# Final Consolidation Plan - Translations Pages

## Executive Summary

After analysis, **full consolidation is not feasible** due to fundamental differences:

- **TranslationsPage**: Uses immutable `key` (dot-notation like `admin.pages.dashboard.title`)
- **TranslationsProductPage**: Uses mutable `name` (slug that auto-updates from translations)
- Different rendering needs (dividers vs expandable rows)
- Different delete strategies (key-based vs index-based)

**However**, there are **small, valuable opportunities** for consolidation that will reduce duplication without forcing incompatible abstractions.

---

## ✅ What CAN Be Consolidated

### 1. **Utility Functions** (HIGH VALUE, LOW RISK)

**Location**: `TranslationsSHARED/utils/translationsTable.utils.ts`

**Functions to Extract:**

#### `isItemEmpty(item, languageKeys)`

- **Current**: Duplicated in both `useTranslationsTableForm.ts` files
- **Logic**: Identical - checks if all language fields are empty
- **Benefit**: Single source of truth, easier to maintain

```typescript
export const isItemEmpty = (
  item: { [key: string]: any },
  languageKeys: string[]
): boolean => {
  return languageKeys.every((key) => !item[key]?.trim());
};
```

#### `getLanguageKeys(supportedLanguages)`

- **Current**: `languagesCodeToKey` mapping duplicated
- **Logic**: Identical - converts `['es-ES', 'en-GB']` → `['esEs', 'enGb']`
- **Benefit**: Consistent language key generation

```typescript
export const getLanguageKeys = (supportedLanguages: RegionLocale[]): string[] => {
  return supportedLanguages.map(languagesCodeToKey);
};
```

**Impact**: ~10-15 lines consolidated, used in 4+ places

---

### 2. **Shared Constants** (MEDIUM VALUE, ZERO RISK)

**Location**: `TranslationsSHARED/constants/translationsTable.constants.ts`

**Constants to Extract:**

#### Empty Row Detection

```typescript
export const EMPTY_ROW_PLACEHOLDER = '--';
```

#### Form Field Defaults

```typescript
export const DEFAULT_SHOW_KEY_COLUMN = true; // For TranslationsPage
export const DEFAULT_SHOW_KEY_COLUMN_PRODUCT = true; // For TranslationsProductPage
```

**Impact**: Minimal, but improves consistency

---

### 3. **Type Utilities** (LOW VALUE, ZERO RISK)

**Location**: `TranslationsSHARED/types/translationsTable.types.ts`

**Types to Extract:**

#### Base Form Item Interface

```typescript
export interface BaseTranslationsFormItem {
  id: string;
  [key: string]: any; // For language fields (esEs, enGb, etc.)
}
```

**Note**: The actual `TranslationsFormItem` types will remain separate because:

- TranslationsPage: `{ id: string; key: string; ... }`
- TranslationsProductPage: `{ id: string; name: string; ... }`

**Impact**: Minimal, but provides shared base type

---

### 4. **Shared Row Cell Components** (MEDIUM VALUE, MEDIUM RISK)

**Location**: `TranslationsSHARED/components/TranslationsRowCell.tsx`

**Component to Extract:**

#### Language Input Cell

The language column rendering is **identical** in both row components:

```typescript
interface TranslationsRowCellProps {
  fieldPath: string;
  fieldKey: string;
  lang: RegionLocale;
  value: string;
  rowDirtyFields?: any;
  register: UseFormRegister<any>;
  watch: UseFormWatch<any>;
}

export const TranslationsRowCell: React.FC<TranslationsRowCellProps> = ({
  fieldPath,
  fieldKey,
  lang,
  value,
  rowDirtyFields,
  register,
  watch,
}) => {
  const fieldName = `${fieldPath}.${fieldKey}` as const;

  return (
    <td key={lang} className="col-value">
      <Input
        {...register(fieldName)}
        placeholder="--"
        className={clsx({
          'input-dirty': rowDirtyFields?.[fieldKey],
          'input-empty': !value,
        })}
      />
    </td>
  );
};
```

**Usage**: Both `TranslationsRow` components can use this instead of duplicating the language column logic.

**Impact**: ~15-20 lines consolidated per row component

---

### 5. **Shared Delete Button Component** (LOW VALUE, LOW RISK)

**Location**: `TranslationsSHARED/components/TranslationsDeleteButton.tsx`

**Component to Extract:**

The delete button is **identical** in both row components:

```typescript
interface TranslationsDeleteButtonProps {
  onDelete: () => void;
  isDeleting?: boolean;
}

export const TranslationsDeleteButton: React.FC<TranslationsDeleteButtonProps> = ({
  onDelete,
  isDeleting = false,
}) => {
  return (
    <td className="col-actions">
      <Button
        className="button button-delete"
        aria-label="Delete"
        variant="ghost"
        size="md"
        color="danger"
        onClick={onDelete}
        disabled={isDeleting}
      >
        <TrashIcon />
      </Button>
    </td>
  );
};
```

**Impact**: ~10-15 lines consolidated per row component

---

## ❌ What CANNOT Be Consolidated

### 1. **Row Components** (FUNDAMENTAL DIFFERENCES)

- **TranslationsPage**: Uses `key` field, immutable, formatted display
- **TranslationsProductPage**: Uses `name` field, auto-updates, different display
- **Different props**: TranslationsPage has `domain`, `group`, `translationKey`
- **Different behavior**: Auto-sync logic only in Product version

**Decision**: Keep separate

---

### 2. **Form Hooks** (DIFFERENT FIELD NAMES & LOGIC)

- **TranslationsPage**: `remove(key: string)` - finds by key
- **TranslationsProductPage**: `remove(index: number)` - direct index
- **Different field checks**: `isDirtyLastItem` checks `key` vs `name`
- **Different reset logic**: Change detection differs

**Decision**: Keep separate (too many differences to abstract cleanly)

---

### 3. **Handler Hooks** (DIFFERENT DELETE STRATEGIES)

- **TranslationsPage**: `handleDelete(key: string)` - finds item by key
- **TranslationsProductPage**: `handleDelete(index: number)` - uses index directly
- **Different confirmation messages**: Uses `item.key` vs `item.name`

**Decision**: Keep separate

---

### 4. **Table Components** (DIFFERENT RENDERING)

- **TranslationsPage**: Has divider rows, grouping logic
- **TranslationsProductPage**: Has expandable rows, different structure
- **Different props**: `domain`/`group` vs `sectionKey`

**Decision**: Keep separate

---

## Implementation Plan

### ✅ Phase 1: Utility Functions (COMPLETED)

1. ✅ Created `TranslationsSHARED/utils/translationsTable.utils.ts`
2. ✅ Extracted `isItemEmpty` and `getLanguageKeys`
3. ✅ Updated both `useTranslationsTableForm.ts` files to import from shared
4. **Completed**: ~30 minutes

### ✅ Phase 2: Shared Cell Components (COMPLETED)

1. ✅ Created `TranslationsSHARED/components/TranslationsRowCell.tsx`
2. ✅ Created `TranslationsSHARED/components/TranslationsDeleteButton.tsx`
3. ✅ Updated all `TranslationsRow` components to use shared cells:
   - `TranslationsPage/TranslationsRow.tsx`
   - `TranslationsProductPage/TranslationsRow.tsx`
   - `TranslationsProductPage/TranslationsRowExpanded.tsx`
4. **Completed**: ~1 hour

### ✅ Phase 3: Constants (COMPLETED)

1. ✅ Created `TranslationsSHARED/constants/translationsTable.constants.ts`
2. ✅ Extracted shared constants:
   - `EMPTY_ROW_PLACEHOLDER`
   - `DEFAULT_SHOW_KEY_COLUMN`
   - `DEFAULT_SHOW_KEY_COLUMN_PRODUCT`
3. ✅ Updated all table components to use shared constants:
   - `TranslationsPage/TranslationsTable.tsx`
   - `TranslationsProductPage/TranslationsTable.tsx`
   - `TranslationsProductPage/TranslationsTableExpandable.tsx`
4. **Completed**: ~15 minutes

### Phase 4: Type Utilities (Optional - NOT DONE)

1. Create `TranslationsSHARED/types/translationsTable.types.ts`
2. Extract base types if needed
3. **Estimated**: 15 minutes
4. **Status**: ⏭️ Skipped - not needed at this time

---

## ✅ Completed Benefits

### Code Reduction (ACHIEVED)

- **Utility functions**: ~10-15 lines ✅
- **Cell components**: ~30-40 lines ✅
- **Constants**: ~5-10 lines ✅
- **Total**: ~50-65 lines of duplication removed ✅

### Maintenance Benefits (ACHIEVED)

- ✅ Single source of truth for `isItemEmpty` logic
- ✅ Consistent language key generation
- ✅ Easier to update shared UI components
- ✅ Better type safety with shared utilities

### Risk Assessment (CONFIRMED)

- **Low Risk**: ✅ Utility functions and constants are pure, no side effects
- **Medium Risk**: ✅ Cell components work correctly with prop passing
- **No Breaking Changes**: ✅ All existing functionality preserved

---

## ✅ Files Created

```
TranslationsSHARED/
├── utils/
│   └── translationsTable.utils.ts          ✅ CREATED
├── components/
│   ├── TranslationsRowCell.tsx             ✅ CREATED
│   └── TranslationsDeleteButton.tsx        ✅ CREATED
├── constants/
│   └── translationsTable.constants.ts      ✅ CREATED
└── types/
    └── translationsTable.types.ts          ⏭️ SKIPPED (not needed)
```

---

## ✅ Files Updated

### TranslationsPage

- ✅ `hooks/useTranslationsTableForm.ts` - Now imports shared utilities
- ✅ `components/TranslationsRow.tsx` - Now uses shared cell components
- ✅ `TranslationsTable.tsx` - Now uses shared constants

### TranslationsProductPage

- ✅ `hooks/useTranslationsTableForm.ts` - Now imports shared utilities
- ✅ `components/TranslationsRow.tsx` - Now uses shared cell components
- ✅ `components/TranslationsRowExpanded.tsx` - Now uses shared cell components
- ✅ `TranslationsTable.tsx` - Now uses shared constants
- ✅ `TranslationsTableExpandable.tsx` - Now uses shared constants

---

## ✅ Implementation Status

**Phases 1-3 COMPLETED** ✅

- ✅ Clear value achieved (reduced duplication)
- ✅ Low risk confirmed (pure functions, simple components)
- ✅ Easy implementation (straightforward extraction)
- ✅ No breaking changes (all functionality preserved)

**Phase 4 SKIPPED** ⏭️

- Type differences are intentional and should remain separate
- No immediate need for shared base types

---

## ✅ Summary

**Total Consolidation Achieved**: ~50-65 lines of code removed ✅
**Actual Time**: ~2 hours
**Risk Level**: Low ✅ (no issues encountered)
**Value**: Medium-High ✅ (reduces duplication, improves maintainability)

### What Was Consolidated

1. ✅ **Utility Functions**: `isItemEmpty`, `getLanguageKeys` - used in both form hooks
2. ✅ **Cell Components**: `TranslationsRowCell`, `TranslationsDeleteButton` - used in all 3 row components
3. ✅ **Constants**: Placeholder and default values - used in all table components

### Result

This consolidation successfully extracted shared code while respecting the fundamental differences between the two pages. Both pages now use the same shared utilities and components, reducing duplication and improving maintainability.
