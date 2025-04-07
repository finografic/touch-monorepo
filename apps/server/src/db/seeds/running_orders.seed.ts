import { db } from '../db.adapter';
import { eq } from 'drizzle-orm';
import { running_orders, elements, drink_configs, drink_types, container_types, volumes } from '../schemas';

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

    // Get a beer config (33cl plastic)
    const [beer] = await db.select().from(drink_types).where(eq(drink_types.name, 'cerveza'));
    const [plastic] = await db.select().from(container_types).where(eq(container_types.name, 'plastico'));
    const [vol33cl] = await db.select().from(volumes).where(eq(volumes.name, '33cl'));

    if (!beer || !plastic || !vol33cl) {
      throw new Error('Required drink config reference data not found');
    }

    const [beerConfig] = await db
      .select()
      .from(drink_configs)
      .where(
        eq(drink_configs.drinkTypeId, beer.id) &&
          eq(drink_configs.containerTypeId, plastic.id) &&
          eq(drink_configs.volumeId, vol33cl.id),
      );

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
          drinkConfigId: beerConfig.id,
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
          drinkConfigId: beerConfig.id,
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
          drinkConfigId: beerConfig.id,
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
