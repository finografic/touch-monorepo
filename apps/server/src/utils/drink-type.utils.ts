import { db } from 'db';
import { drink_subtypes, drink_types, orders } from 'db/schemas';
import { and, eq, sql } from 'drizzle-orm';

/**
 * Synchronize hasSubtypes flag for a specific drink type based on actual subtype count
 * @param drinkTypeId - The ID of the drink type to synchronize
 * @returns Promise<boolean> - True if hasSubtypes was updated, false if already correct
 */
export async function synchronizeDrinkTypeHasSubtypes(drinkTypeId: string): Promise<boolean> {
  // Count active subtypes for this drink type
  const subtypeCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(drink_subtypes)
    .where(and(eq(drink_subtypes.drinkTypeId, drinkTypeId), eq(drink_subtypes.isActive, true)));

  const hasSubtypes = (subtypeCount[0]?.count ?? 0) > 0;

  // Get current state
  const [current] = await db
    .select({ hasSubtypes: drink_types.hasSubtypes })
    .from(drink_types)
    .where(eq(drink_types.id, drinkTypeId))
    .limit(1);

  if (!current) {
    console.warn(`⚠️ Drink type ${drinkTypeId} not found, skipping hasSubtypes sync`);
    return false;
  }

  // Only update if state has changed
  if (current.hasSubtypes !== hasSubtypes) {
    await db.update(drink_types).set({ hasSubtypes: hasSubtypes ? 1 : 0 }).where(eq(drink_types.id, drinkTypeId));
    console.log(
      `✅ Synchronized hasSubtypes for drink type ${drinkTypeId}: ${current.hasSubtypes} → ${hasSubtypes}`,
    );
    return true;
  }

  return false;
}

/**
 * Synchronize hasSubtypes flag for all drink types
 * Useful for batch operations or data cleanup
 * @returns Promise<number> - Number of drink types that were updated
 */
export async function synchronizeAllDrinkTypesHasSubtypes(): Promise<number> {
  const allDrinkTypes = await db.select({ id: drink_types.id }).from(drink_types);

  let updatedCount = 0;
  for (const drinkType of allDrinkTypes) {
    const wasUpdated = await synchronizeDrinkTypeHasSubtypes(drinkType.id);
    if (wasUpdated) {
      updatedCount++;
    }
  }

  console.log(`✅ Synchronized hasSubtypes for ${updatedCount} of ${allDrinkTypes.length} drink types`);
  return updatedCount;
}

/**
 * Handle side effects when a drink type is deleted
 * - Deletes all subtypes for this drink type
 * - Deletes all orders that reference this drink type (complete rows)
 * @param drinkTypeId - The ID of the drink type being deleted
 */
export async function handleDrinkTypeDeletion(drinkTypeId: string): Promise<void> {
  console.log(`🗑️ Handling side effects for drink type deletion: ${drinkTypeId}`);

  // 1. Delete all subtypes for this drink type
  const subtypesDeleted = await db
    .delete(drink_subtypes)
    .where(eq(drink_subtypes.drinkTypeId, drinkTypeId));

  console.log(`   ✅ Deleted ${subtypesDeleted.changes} subtypes`);

  // 2. Delete all orders that reference this drink type (complete rows)
  const ordersDeleted = await db.delete(orders).where(eq(orders.drinkTypeId, drinkTypeId));

  console.log(`   ✅ Deleted ${ordersDeleted.changes} orders`);

  console.log(`✅ Completed side effects for drink type deletion: ${drinkTypeId}`);
}

/**
 * Handle side effects when a subtype is deleted
 * - Synchronizes parent drink type's hasSubtypes flag
 * - Clears drinkSubtypeId column in orders (sets to NULL, does NOT delete rows)
 * @param drinkTypeId - The ID of the parent drink type
 * @param subtypeId - The ID of the subtype being deleted
 */
export async function handleSubtypeDeletion(drinkTypeId: string, subtypeId: string): Promise<void> {
  console.log(`🗑️ Handling side effects for subtype deletion: ${subtypeId} (parent: ${drinkTypeId})`);

  // 1. Clear drinkSubtypeId in orders (set to NULL, don't delete rows)
  const ordersUpdated = await db
    .update(orders)
    .set({ drinkSubtypeId: null })
    .where(and(eq(orders.drinkTypeId, drinkTypeId), eq(orders.drinkSubtypeId, subtypeId)));

  console.log(`   ✅ Cleared drinkSubtypeId in ${ordersUpdated.changes} orders`);

  // 2. Synchronize parent drink type's hasSubtypes flag
  await synchronizeDrinkTypeHasSubtypes(drinkTypeId);

  console.log(`✅ Completed side effects for subtype deletion: ${subtypeId}`);
}

/**
 * Handle side effects when a subtype is created
 * - Synchronizes parent drink type's hasSubtypes flag
 * @param drinkTypeId - The ID of the parent drink type
 */
export async function handleSubtypeCreation(drinkTypeId: string): Promise<void> {
  console.log(`➕ Handling side effects for subtype creation (parent: ${drinkTypeId})`);

  // Synchronize parent drink type's hasSubtypes flag
  await synchronizeDrinkTypeHasSubtypes(drinkTypeId);

  console.log(`✅ Completed side effects for subtype creation (parent: ${drinkTypeId})`);
}

/**
 * Handle side effects when a subtype is updated (PATCH)
 * - Synchronizes parent drink type's hasSubtypes flag (in case isActive changed)
 * @param drinkTypeId - The ID of the parent drink type
 */
export async function handleSubtypeUpdate(drinkTypeId: string): Promise<void> {
  console.log(`🔄 Handling side effects for subtype update (parent: ${drinkTypeId})`);

  // Synchronize parent drink type's hasSubtypes flag
  // (e.g., if isActive was changed from true to false, hasSubtypes might need to change)
  await synchronizeDrinkTypeHasSubtypes(drinkTypeId);

  console.log(`✅ Completed side effects for subtype update (parent: ${drinkTypeId})`);
}

