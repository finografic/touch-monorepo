import { db } from '../db.adapter';
import { modes, orders, temperature_profiles } from '../schemas';
import { randomUUID } from 'node:crypto';

// Define the type for our temperature profile rows
type TemperatureProfileRow = typeof temperature_profiles.$inferInsert;

// Helper function to generate temperature profile rows for an order
function generateProfilesForOrder(orderId: string, modeId: string): TemperatureProfileRow[] {
  const rows: TemperatureProfileRow[] = [];

  // Generate 4 temperature points by default
  const temperatures = [30, 20, 10, 0];

  temperatures.forEach((temp, i) => {
    // Calculate base time value (increases by 3 for each temperature point)
    const baseTime = i * 3;

    rows.push({
      id: randomUUID(),
      orderId,
      modeId,
      temperature: temp,
      timeA: Math.round(baseTime * 1.0), // Type A: base rate
      timeB: Math.round(baseTime * 1.25), // Type B: 25% longer
      timeC: Math.round(baseTime * 1.6), // Type C: 60% longer
    });
  });

  return rows;
}

export async function seed() {
  console.log('Seeding temperature_profiles...');

  try {
    // Clean existing data first
    console.log('Cleaning existing temperature profiles...');
    await db.delete(temperature_profiles);
    console.log('✓ Cleaned existing temperature profiles');

    // Get a mode
    const [mode] = await db.select().from(modes).limit(1);
    if (!mode) {
      throw new Error('No mode found. Please seed modes first.');
    }

    // Get all orders
    const allOrders = await db.select().from(orders);
    if (allOrders.length === 0) {
      throw new Error('No orders found. Please seed orders first.');
    }

    // Generate profiles for each order
    const allProfiles: TemperatureProfileRow[] = [];
    for (const order of allOrders) {
      const orderProfiles = generateProfilesForOrder(order.id, mode.id);
      allProfiles.push(...orderProfiles);
    }

    // Insert all profiles
    await db.insert(temperature_profiles).values(allProfiles);
    console.log(`✅ Inserted ${allProfiles.length} temperature profiles for ${allOrders.length} orders!`);
    return allProfiles;
  } catch (error) {
    console.error('❌ Error seeding temperature profiles:', error);
    throw error;
  }
}
