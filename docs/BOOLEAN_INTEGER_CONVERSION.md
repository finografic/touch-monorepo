# Boolean/Integer Conversion for SQLite

## Problem Description

SQLite stores boolean values as integers (0 = false, 1 = true), but the frontend can send actual boolean values. This causes validation errors when the Zod schemas expect specific types.

**Error Example:**

```
ZodError: {
  code: "invalid_type",
  expected: "boolean",
  received: "number",
  path: ["hasSubtypes"]
}
```

## Solution Overview

Created a comprehensive solution that handles boolean/integer conversion automatically across all schemas using utility functions.

## Key Components

### 1. Zod Utility Functions (`apps/server/src/lib/zod-utils.ts`)

- **`sqliteBooleanField()`**: Creates flexible Zod schema that accepts:
  - `true`/`false` (boolean)
  - `1`/`0` (number)
  - `"true"`/`"false"` (string)
  - `"1"`/`"0"` (string)
  - Converts all to integers (1/0) for SQLite storage

- **`transformSqliteBooleans()`**: Transforms existing schemas to handle boolean fields
- **`createSqliteBooleanPatchSchema()`**: Creates PATCH-compatible schemas
- **`convertBooleansToIntegers()`**: Pre-processes request data in handlers

### 2. Updated Schemas

Applied the conversion to all schemas with boolean fields:

#### Affected Schemas

- `drink_types.schema.ts` - `hasSubtypes`, `isActive`
- `drink_subtypes.schema.ts` - `isActive`
- `volumes.schema.ts` - `isActive`
- `container_types.schema.ts` - `isActive`
- `orders.schema.ts` - `isActive`
- `supported_languages.schema.ts` - `isActive`, `isDefault`
- `translatable_entities.schema.ts` - `isActive`

#### Example Implementation

```typescript
// Before
const schema = createInsertSchema(table, {
  name: (schema) => schema.name.min(1).max(50),
})

// After
const schema = createInsertSchema(table, {
  name: (schema) => schema.name.min(1).max(50),
  isActive: () => sqliteBooleanField(), // Handles boolean/integer conversion
  hasSubtypes: () => sqliteBooleanField(), // Handles boolean/integer conversion
})

// Patch schema
const patchSchema = insertSchema.partial().extend({
  isActive: sqliteBooleanField().optional(),
  hasSubtypes: sqliteBooleanField().optional(),
})
```

### 3. Auto-Enable hasSubtypes Logic

Updated `drink-subtypes.handlers.ts` to automatically enable `hasSubtypes` when the first subtype is added:

```typescript
// If hasSubtypes is false, enable it when first subtype is added
if (!drinkType.hasSubtypes) {
  console.log(`🔄 Enabling hasSubtypes for drink type ${drinkTypeId}`);

  // Update hasSubtypes to true (1 for SQLite)
  await db.update(drink_types)
    .set({ hasSubtypes: 1 })
    .where(eq(drink_types.id, drinkTypeId));
}
```

## Benefits

1. **Flexible Input**: Accepts booleans, integers, or strings
2. **Consistent Storage**: Always stores as integers in SQLite
3. **Type Safety**: Maintains Zod validation
4. **Backwards Compatible**: Works with existing data
5. **Automatic Conversion**: No manual handling needed
6. **Reusable**: Can be applied to any boolean field

## Usage Examples

### Client-Side (can send any format)

```javascript
// All of these work:
{ hasSubtypes: true }      // boolean
{ hasSubtypes: 1 }         // number
{ hasSubtypes: "true" }    // string
{ hasSubtypes: "1" }       // string
```

### Server-Side (always receives integers)

```typescript
// Database always gets:
{ hasSubtypes: 1 }  // for true
{ hasSubtypes: 0 }  // for false
```

## Testing

The solution handles the specific case mentioned:
1. ✅ Adding first `drinkSubtype` automatically sets `hasSubtypes: true`
2. ✅ Boolean/integer conversion works for all PATCH operations
3. ✅ Validation accepts both boolean and integer values
4. ✅ Database stores consistent integer values

## Future Improvements

- Could be extended to handle more complex type conversions
- Could add middleware for automatic preprocessing
- Could add runtime type checking for additional safety
