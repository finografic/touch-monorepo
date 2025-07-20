import { db } from '../db.adapter';
import { drink_types, modes, orders, temperature_profiles } from '../schemas';
import { randomUUID } from 'node:crypto';

// Define the type for our temperature profile rows
type TemperatureProfileRow = typeof temperature_profiles.$inferInsert;

// ======================================================================== //
// CONFIGURABLE CONSTANTS
// ======================================================================== //

const TEMPERATURE_RANGE = [25, 15, 8, 2];
const TIME_FACTORS = [1.0, 1.25, 1.6];
const MIN_TIME = 30;
const MAX_TIME = 240;
const TIME_INCREMENT = 30; // Seconds to add between temperature points

// ======================================================================== //
// HELPER FUNCTIONS
// ======================================================================== //

/**
 * Generate temperature profiles for a specific drink type
 * Each drink type gets its own temperature and time progression
 */
function generateProfilesForDrinkType(
  drinkTypeId: string,
  orderIds: string[],
  modeId: string,
  drinkTypeIndex: number,
): TemperatureProfileRow[] {
  const rows: TemperatureProfileRow[] = [];

  // Calculate base time for this drink type
  // Each drink type starts with MIN_TIME and progresses
  const baseTimeForDrinkType = MIN_TIME + drinkTypeIndex * TIME_INCREMENT;

  // Process temperatures in DESC order (25°C → 15°C → 8°C → 2°C)
  // Times increase in ASC order (MIN_TIME → MAX_TIME)
  TEMPERATURE_RANGE.forEach((temp, tempIndex) => {
    // Calculate time progression: base time increases for each temperature point
    const timeA = Math.min(MAX_TIME, baseTimeForDrinkType + tempIndex * TIME_INCREMENT);
    const timeB = Math.round(timeA * TIME_FACTORS[1]); // 1.25x
    const timeC = Math.round(timeA * TIME_FACTORS[2]); // 1.6x

    console.log(
      `  Drink Type ${drinkTypeIndex}: ${temp}°C → timeA=${timeA}s, timeB=${timeB}s, timeC=${timeC}s`,
    );

    // Create profiles for all orders of this drink type
    orderIds.forEach((orderId) => {
      rows.push({
        id: randomUUID(),
        orderId,
        modeId,
        temperature: temp,
        timeA,
        timeB,
        timeC,
      });
    });
  });

  return rows;
}

/**
 * Generate all temperature profiles grouped by drink type
 */
async function generateAllProfiles(): Promise<TemperatureProfileRow[]> {
  const rows: TemperatureProfileRow[] = [];

  // Get a mode
  const [mode] = await db.select().from(modes).limit(1);
  if (!mode) {
    throw new Error('No mode found. Please seed modes first.');
  }

  // Get all orders with their drink types
  const allOrders = await db.select().from(orders);
  if (allOrders.length === 0) {
    throw new Error('No orders found. Please seed orders first.');
  }

  // Group orders by drink type
  const ordersByDrinkType = allOrders.reduce(
    (acc, order) => {
      if (!acc[order.drinkTypeId]) {
        acc[order.drinkTypeId] = [];
      }
      acc[order.drinkTypeId].push(order.id);
      return acc;
    },
    {} as Record<string, string[]>,
  );

  // Generate profiles for each drink type
  Object.entries(ordersByDrinkType).forEach(([drinkTypeId, orderIds], drinkTypeIndex) => {
    console.log(`\n🍺 Generating profiles for Drink Type ${drinkTypeIndex} (${drinkTypeId}):`);
    console.log(`   Orders: ${orderIds.length}`);
    console.log(`   Base time: ${MIN_TIME + drinkTypeIndex * TIME_INCREMENT}s`);
    console.log('   Expected pattern:');
    TEMPERATURE_RANGE.forEach((temp, tempIndex) => {
      const baseTime = MIN_TIME + drinkTypeIndex * TIME_INCREMENT;
      const timeA = Math.min(MAX_TIME, baseTime + tempIndex * TIME_INCREMENT);
      const timeB = Math.round(timeA * TIME_FACTORS[1]);
      const timeC = Math.round(timeA * TIME_FACTORS[2]);
      console.log(`     ${temp}°C → ${timeA}s / ${timeB}s / ${timeC}s`);
    });

    const drinkTypeProfiles = generateProfilesForDrinkType(drinkTypeId, orderIds, mode.id, drinkTypeIndex);
    rows.push(...drinkTypeProfiles);
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

    // Generate all profiles grouped by drink type
    const allProfiles = await generateAllProfiles();

    // Insert all profiles
    await db.insert(temperature_profiles).values(allProfiles);
    console.log(`✅ Inserted ${allProfiles.length} temperature profiles!`);

    // Get orders for summary logging
    const allOrders = await db.select().from(orders);

    // Log summary by drink type
    const profilesByDrinkType = allProfiles.reduce(
      (acc, profile) => {
        const order = allOrders.find((o: any) => o.id === profile.orderId);
        const drinkTypeId = order?.drinkTypeId || 'unknown';
        if (!acc[drinkTypeId]) acc[drinkTypeId] = 0;
        acc[drinkTypeId]++;
        return acc;
      },
      {} as Record<string, number>,
    );

    console.log('📊 Profiles by drink type:', profilesByDrinkType);

    return allProfiles;
  } catch (error) {
    console.error('❌ Error seeding temperature profiles:', error);
    throw error;
  }
}
