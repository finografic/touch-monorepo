# Orders Table Foreign Key Migration

📅 Jun 30, 2025

## Problem

Current `orders` table uses string-based foreign keys referencing `name` fields instead of proper `id` fields:
- `drink_type_name` → `drink_types.name` ❌
- `drink_subtype_name` → `drink_subtypes.name` ❌
- `volume_name` → `volumes.name` ❌
- `container_type_name` → `container_types.name` ❌

## Solution

Convert to proper ID-based foreign keys:
- `drink_type_id` → `drink_types.id` ✅
- `drink_subtype_id` → `drink_subtypes.id` ✅
- `volume_id` → `volumes.id` ✅
- `container_type_id` → `container_types.id` ✅

## Migration Steps (External)

### 1. Backup Current Data

```sql
-- Create backup table with current structure
CREATE TABLE orders_backup AS SELECT * FROM orders;

-- Verify backup
SELECT COUNT(*) FROM orders_backup;
```

### 2. Drop Current Orders Table

```sql
-- Drop the problematic table
DROP TABLE IF EXISTS orders;
```

### 3. Create New Orders Table Structure

```sql
CREATE TABLE orders (
  id TEXT PRIMARY KEY NOT NULL,

  -- Proper ID-based foreign keys
  drink_type_id TEXT NOT NULL,
  drink_subtype_id TEXT,
  volume_id TEXT NOT NULL,
  container_type_id TEXT NOT NULL,
  temperature_profile_id TEXT NOT NULL,

  -- Temperature fields
  default_temp_consume INTEGER NOT NULL,
  default_temp_freeze INTEGER NOT NULL,

  -- Meta fields
  is_active INTEGER DEFAULT 1 NOT NULL,
  created_at INTEGER,
  updated_at INTEGER,

  -- Foreign key constraints
  FOREIGN KEY (drink_type_id) REFERENCES drink_types(id) ON DELETE CASCADE,
  FOREIGN KEY (drink_subtype_id) REFERENCES drink_subtypes(id) ON DELETE SET NULL,
  FOREIGN KEY (volume_id) REFERENCES volumes(id) ON DELETE CASCADE,
  FOREIGN KEY (container_type_id) REFERENCES container_types(id) ON DELETE CASCADE,
  FOREIGN KEY (temperature_profile_id) REFERENCES temperature_profiles(id) ON DELETE CASCADE
);
```

### 4. Migrate Data with Proper ID Mapping

```sql
-- Insert data from backup with proper ID lookups
INSERT INTO orders (
  id,
  drink_type_id,
  drink_subtype_id,
  volume_id,
  container_type_id,
  temperature_profile_id,
  default_temp_consume,
  default_temp_freeze,
  is_active,
  created_at,
  updated_at
)
SELECT
  ob.id,
  dt.id as drink_type_id,
  ds.id as drink_subtype_id,
  v.id as volume_id,
  ct.id as container_type_id,
  ob.temperature_profile_id,
  ob.default_temp_consume,
  ob.default_temp_freeze,
  ob.is_active,
  ob.created_at,
  ob.updated_at
FROM orders_backup ob
LEFT JOIN drink_types dt ON dt.name = ob.drink_type_name
LEFT JOIN drink_subtypes ds ON ds.name = ob.drink_subtype_name
LEFT JOIN volumes v ON v.name = ob.volume_name
LEFT JOIN container_types ct ON ct.name = ob.container_type_name
WHERE dt.id IS NOT NULL
  AND v.id IS NOT NULL
  AND ct.id IS NOT NULL;
```

### 5. Create Human-Readable View

```sql
-- Create a view that shows readable names alongside IDs
CREATE VIEW orders_readable AS
SELECT
  o.id,
  o.is_active,
  o.created_at,
  o.updated_at,

  -- IDs (for proper relationships)
  o.drink_type_id,
  o.drink_subtype_id,
  o.volume_id,
  o.container_type_id,
  o.temperature_profile_id,

  -- Human-readable names (what you want to see!)
  dt.name as drink_type_name,
  ds.name as drink_subtype_name,
  v.name as volume_name,
  ct.name as container_type_name,

  -- Temperature settings
  o.default_temp_consume,
  o.default_temp_freeze,

  -- Additional useful info
  v.value_in_ml,
  ct.thermal_conductivity

FROM orders o
LEFT JOIN drink_types dt ON dt.id = o.drink_type_id
LEFT JOIN drink_subtypes ds ON ds.id = o.drink_subtype_id
LEFT JOIN volumes v ON v.id = o.volume_id
LEFT JOIN container_types ct ON ct.id = o.container_type_id;
```

### 6. Verify Migration

```sql
-- Check record counts match
SELECT 'Backup' as source, COUNT(*) as count FROM orders_backup
UNION ALL
SELECT 'New' as source, COUNT(*) as count FROM orders;

-- Verify using the readable view (much easier!)
SELECT * FROM orders_readable LIMIT 5;

-- Or verify foreign key relationships manually
SELECT
  o.id,
  dt.name as drink_type,
  ds.name as drink_subtype,
  v.name as volume,
  ct.name as container_type
FROM orders o
JOIN drink_types dt ON dt.id = o.drink_type_id
LEFT JOIN drink_subtypes ds ON ds.id = o.drink_subtype_id
JOIN volumes v ON v.id = o.volume_id
JOIN container_types ct ON ct.id = o.container_type_id
LIMIT 5;
```

### 6. Update Application Code

The schema has been updated in `apps/server/src/db/schemas/orders.schema.ts` with:
- ✅ `orders_backup` table definition
- ✅ New `orders` table with ID-based FKs
- ✅ Updated relations
- ✅ Updated Zod schemas

### 7. Update API Handlers (if needed)

Check and update any API handlers that reference:
- `drinkTypeName` → `drinkTypeId`
- `drinkSubtypeName` → `drinkSubtypeId`
- `volumeName` → `volumeId`
- `containerTypeName` → `containerTypeId`

## Benefits After Migration

✅ **Proper Database Design**: ID-based relationships
✅ **Performance**: Integer/UUID lookups vs string comparisons
✅ **Data Integrity**: Names can change without breaking relationships
✅ **Referential Integrity**: Proper cascading deletes
✅ **Query Efficiency**: Better join performance

## Rollback Plan

If issues arise:

```sql
-- Drop new table
DROP TABLE orders;

-- Restore from backup
CREATE TABLE orders AS SELECT * FROM orders_backup;

-- Recreate old foreign keys
-- (Add original FK constraints as needed)
```

## Alternative Approaches

### Option A: Hybrid Approach (Keep Both IDs and Names)

If you want maximum readability without views:

```sql
-- Add name columns alongside ID columns (denormalized but readable)
ALTER TABLE orders ADD COLUMN drink_type_name TEXT;
ALTER TABLE orders ADD COLUMN drink_subtype_name TEXT;
ALTER TABLE orders ADD COLUMN volume_name TEXT;
ALTER TABLE orders ADD COLUMN container_type_name TEXT;

-- Update with current names
UPDATE orders SET
  drink_type_name = (SELECT name FROM drink_types WHERE id = orders.drink_type_id),
  drink_subtype_name = (SELECT name FROM drink_subtypes WHERE id = orders.drink_subtype_id),
  volume_name = (SELECT name FROM volumes WHERE id = orders.volume_id),
  container_type_name = (SELECT name FROM container_types WHERE id = orders.container_type_id);
```

**Pros:** Always readable, no JOIN needed
**Cons:** Data duplication, sync complexity

### Option B: Database Views Only (Recommended)

Use the `orders_readable` view created above.

**Pros:** Clean schema, readable data, no duplication
**Cons:** Extra view to maintain

## Files Changed

- ✅ `apps/server/src/db/schemas/orders.schema.ts` - Updated schema
- ✅ Database migration - Creates `orders_readable` view
- 🔄 API handlers (may need updates for new field names)
- 🔄 Frontend components (may need updates for new field names)
