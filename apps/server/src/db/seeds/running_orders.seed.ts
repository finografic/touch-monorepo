import { db } from '../db.adapter';
import { eq } from 'drizzle-orm';
import { running_orders, elements, beverage_configs } from '../schemas';

export async function seed() {
  console.log('Seeding running_orders...');

  try {
    // Check if orders already exist
    const existing = await db.select().from(running_orders).limit(1);
    if (existing.length > 0) {
      console.log('✓ Running orders already seeded, skipping...');
      return;
    }

    // Get references to existing data
    const [element1] = await db.select().from(elements).where(eq(elements.elementNumber, 1));
    const [element5] = await db.select().from(elements).where(eq(elements.elementNumber, 5));
    const [element10] = await db.select().from(elements).where(eq(elements.elementNumber, 10));

    // Get a beer config (33cl can)
    const [beerConfig] = await db.select().from(beverage_configs).limit(1); // We'll take the first config (33cl beer can)

    if (!element1 || !element5 || !element10 || !beerConfig) {
      throw new Error('Required reference data not found');
    }

    // Insert some example orders in different states
    const insertedOrders = await db
      .insert(running_orders)
      .values([
        // Completed order on element 1
        {
          elementId: element1.id,
          beverageConfigId: beerConfig.id,
          startTemp: 22,
          targetTemp: beerConfig.defaultConsumptionTemp,
          lastTemp: beerConfig.defaultConsumptionTemp,
          startedAt: new Date(Date.now() - 1000 * 60 * 15), // 15 mins ago
          estimatedMinutes: 12,
          actualMinutes: 12,
          completedAt: new Date(Date.now() - 1000 * 60 * 3), // 3 mins ago
          status: 'completed',
        },
        // Running order on element 5
        {
          elementId: element5.id,
          beverageConfigId: beerConfig.id,
          startTemp: 24,
          targetTemp: beerConfig.defaultConsumptionTemp,
          lastTemp: 8, // Partially cooled
          startedAt: new Date(Date.now() - 1000 * 60 * 5), // 5 mins ago
          estimatedMinutes: 10,
          status: 'running',
        },
        // Failed order on element 10
        {
          elementId: element10.id,
          beverageConfigId: beerConfig.id,
          startTemp: 25,
          targetTemp: beerConfig.defaultConsumptionTemp,
          lastTemp: 15, // Stopped halfway
          startedAt: new Date(Date.now() - 1000 * 60 * 20), // 20 mins ago
          estimatedMinutes: 8,
          actualMinutes: 4,
          completedAt: new Date(Date.now() - 1000 * 60 * 16), // 16 mins ago
          status: 'failed',
          errorMessage: 'Temperature probe disconnected',
        },
      ])
      .returning();

    // Update the elements to reflect their current orders
    await db
      .update(elements)
      .set({
        isInUse: true,
        currentOrderId: insertedOrders[1].id, // Only element 5 is currently in use
        remainingSeconds: (insertedOrders[1].estimatedMinutes - 5) * 60, // 5 mins elapsed
      })
      .where(eq(elements.id, element5.id));

    console.log('✅ Running orders seed completed successfully!');
    return insertedOrders;
  } catch (error) {
    console.error('❌ Error seeding running orders:', error);
    throw error;
  }
}
