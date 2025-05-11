import { db } from '../db.adapter';
import { eq } from 'drizzle-orm';
import { container_types, drink_types, elements, orders, volumes } from '../schemas';
import type drinkType from 'routes/drink-type';

export async function seed() {
  console.log('Seeding orders...');

  try {
    // Check if orders already exist
    const existing = await db.select().from(orders).limit(1);
    if (existing.length > 0) {
      console.log('✓ Running orders already seeded, skipping...');
      return;
    }

    // Get a beer config (33cl plastic)
    const [beer] = await db.select().from(drink_types).where(eq(drink_types.name, 'cerveza'));
    const [plastic] = await db.select().from(container_types).where(eq(container_types.name, 'plastico'));
    const [vol33cl] = await db.select().from(volumes).where(eq(volumes.name, '33cl'));

    if (!beer || !plastic || !vol33cl) {
      throw new Error('Required drink config reference data not found');
    }

    // Insert some example orders in different states
    const insertedOrders = await db
      .insert(orders)
      .values([
        // Completed order on element 1
        {
          drinkTypeName: 'cerveza',
          containerTypeName: 'plastico',
          volumeName: '33cl',
        },
        // Running order on element 5
        {
          drinkTypeName: 'cerveza',
          containerTypeName: 'plastico',
          volumeName: '33cl',
        },
        // Failed order on element 10
        {
          drinkTypeName: 'cerveza',
          containerTypeName: 'plastico',
          volumeName: '33cl',
        },
      ])
      .returning();

    console.log('✅ Running orders seed completed successfully!');
    return insertedOrders;
  } catch (error) {
    console.error('❌ Error seeding running orders:', error);
    throw error;
  }
}
