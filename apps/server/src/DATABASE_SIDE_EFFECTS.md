# Database Side Effects & Cleanup Methods

📅 Dec 14, 2025

This document catalogs all database side effect and cleanup utilities that are triggered automatically when certain API operations occur. These methods ensure data consistency, cascade deletions, and maintain referential integrity across related tables.

---

## 📁 `utils/drink-type.utils.ts`

Side effects for drink types and subtypes operations.

### `synchronizeDrinkTypeHasSubtypes(drinkTypeId: string): Promise<boolean>`

**Purpose**: Synchronizes the `hasSubtypes` flag for a specific drink type based on actual active subtype count.

**When Called**:
- After creating a subtype
- After deleting a subtype
- After updating a subtype (e.g., if `isActive` changed)

**What It Does**:
- Counts active subtypes for the drink type
- Updates `hasSubtypes` to `true` if count > 0, `false` otherwise
- Only updates if state has changed

**Returns**: `true` if updated, `false` if already correct

---

### `synchronizeAllDrinkTypesHasSubtypes(): Promise<number>`

**Purpose**: Batch synchronization of `hasSubtypes` flag for all drink types.

**When Called**:
- Manual cleanup/maintenance operations
- Data migration scripts

**What It Does**:
- Loops through all drink types
- Calls `synchronizeDrinkTypeHasSubtypes()` for each
- Returns count of updated drink types

**Returns**: Number of drink types that were updated

---

### `handleDrinkTypeDeletion(drinkTypeId: string): Promise<void>`

**Purpose**: Handles cascade deletion side effects when a drink type is deleted.

**When Called**: Before deleting a drink type (in `drink-type.handlers.ts` → `remove`)

**What It Does**:
1. Deletes all subtypes for this drink type
2. Deletes all orders rows that reference this drink type (complete row deletion)

**Affected Tables**:
- `drink_subtypes` - All subtypes deleted
- `orders` - All related orders deleted

---

### `handleSubtypeDeletion(drinkTypeId: string, subtypeId: string): Promise<void>`

**Purpose**: Handles side effects when a subtype is deleted.

**When Called**: After deleting a subtype (in `drink-subtypes.handlers.ts` → `remove`)

**What It Does**:
1. Clears `drinkSubtypeId` column in orders (sets to `NULL`, does NOT delete rows)
2. Synchronizes parent drink type's `hasSubtypes` flag

**Affected Tables**:
- `orders` - `drinkSubtypeId` set to `NULL` where it matched
- `drink_types` - `hasSubtypes` flag updated

---

### `handleSubtypeCreation(drinkTypeId: string): Promise<void>`

**Purpose**: Handles side effects when a subtype is created.

**When Called**: After creating a subtype (in `drink-subtypes.handlers.ts` → `create`)

**What It Does**:
- Synchronizes parent drink type's `hasSubtypes` flag (sets to `true` if first subtype)

**Affected Tables**:
- `drink_types` - `hasSubtypes` flag updated

---

### `handleSubtypeUpdate(drinkTypeId: string): Promise<void>`

**Purpose**: Handles side effects when a subtype is updated (PATCH).

**When Called**: After updating a subtype (in `drink-subtypes.handlers.ts` → `patch`)

**What It Does**:
- Synchronizes parent drink type's `hasSubtypes` flag (e.g., if `isActive` changed from `true` to `false`)

**Affected Tables**:
- `drink_types` - `hasSubtypes` flag updated if needed

---

## 📁 `utils/translation-columns.utils.ts`

Side effects for translation cleanup when languages are deleted.

### `removeTranslationColumns(languageCode: string): Promise<void>`

**Purpose**: Removes a language key from all JSON translation columns when a supported language is deleted.

**When Called**: After deleting a supported language (in `supported-language.handlers.ts` → `remove`)

**What It Does**:
- Loops through all translatable tables
- For each row, removes the language code key from the `translations` JSON object
- Updates rows with cleaned translations

**Affected Tables**:
- `drink_types` - Removes language key from `translations` JSON
- `drink_subtypes` - Removes language key from `translations` JSON
- `volumes` - Removes language key from `translations` JSON
- `container_types` - Removes language key from `translations` JSON

**Example**:
```json
// Before deletion of "es-ES":
{ "es-ES": "Cerveza", "en-GB": "Beer", "ca-ES": "Cervesa" }

// After deletion:
{ "en-GB": "Beer", "ca-ES": "Cervesa" }
```

---

## 🔄 Integration Points

### Drink Type Handlers
- **`drink-type.handlers.ts`** → `remove` calls `handleDrinkTypeDeletion()`

### Drink Subtype Handlers
- **`drink-subtypes.handlers.ts`** → `create` calls `handleSubtypeCreation()`
- **`drink-subtypes.handlers.ts`** → `patch` calls `handleSubtypeUpdate()`
- **`drink-subtypes.handlers.ts`** → `remove` calls `handleSubtypeDeletion()`

### Supported Language Handlers
- **`supported-language.handlers.ts`** → `remove` calls `removeTranslationColumns()`

---

## 📊 Side Effects Summary

| Operation | Trigger | Side Effects |
|-----------|---------|--------------|
| **DELETE drink type** | `drink-type.handlers.ts` | Deletes all subtypes, deletes all related orders |
| **CREATE subtype** | `drink-subtypes.handlers.ts` | Updates parent `hasSubtypes` flag |
| **UPDATE subtype** | `drink-subtypes.handlers.ts` | Updates parent `hasSubtypes` flag (if `isActive` changed) |
| **DELETE subtype** | `drink-subtypes.handlers.ts` | Clears `drinkSubtypeId` in orders, updates parent `hasSubtypes` flag |
| **DELETE language** | `supported-language.handlers.ts` | Removes language key from all translation JSON columns |

---

## 🎯 Design Principles

1. **Automatic**: Side effects are triggered automatically, no manual intervention needed
2. **Safe**: Operations are idempotent where possible, errors are logged but don't block main operations
3. **Precise**: Each function has a single, well-defined responsibility
4. **Logged**: All operations log progress for debugging and monitoring
5. **Transactional**: Side effects run in the same transaction context as the main operation (where applicable)

---

## 🔍 Testing

When testing these side effects:

1. **Drink Type Deletion**: Verify subtypes and orders are deleted
2. **Subtype Operations**: Verify `hasSubtypes` flag stays in sync
3. **Subtype Deletion**: Verify orders have `drinkSubtypeId` set to `NULL` (not deleted)
4. **Language Deletion**: Verify language keys are removed from all translation JSON objects

---

**Last Updated**: 2025-12-14

