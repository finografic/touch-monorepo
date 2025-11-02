import { db } from '../db.adapter';
import { container_types, drink_subtypes, drink_types, modes, orders, volumes } from '../schemas';
import { TEMPERATURE_RANGES } from 'config/temperature.config';

// ======================================================================== //
// CONFIGURABLE CONSTANTS
// ======================================================================== //

const DRINK_TYPE_NUM_ENTRIES = 4; // Base number of entries for drink types without subtypes
const DRINK_TYPE_VARIATION = 2; // Random variation range for drink types
const DRINK_SUBTYPE_NUM_ENTRIES = 8; // Base number of entries for each subtype
const DRINK_SUBTYPE_VARIATION = 4; // Random variation range for subtypes

// ======================================================================== //
// HELPER FUNCTIONS
// ======================================================================== //

/**
 * Generate a random number with variation around a base value
 * @param baseValue - The base number of entries
 * @param variation - The maximum variation range
 * @returns A random integer with positive or negative variation
 */
function getRandomVariation(baseValue: number, variation: number): number {
  const randomVariation = Math.floor(Math.random() * (variation + 1)); // 0 to variation
  const multiplier = Math.random() < 0.5 ? 1 : -1; // Randomly positive or negative
  const result = baseValue + randomVariation * multiplier;
  return Math.max(1, result); // Ensure minimum of 1 entry
}

function getRandomSample<T>(arr: T[], n: number): T[] {
  const result = [];
  const used = new Set<number>();
  while (result.length < n && used.size < arr.length) {
    const idx = Math.floor(Math.random() * arr.length);
    if (!used.has(idx)) {
      used.add(idx);
      result.push(arr[idx]);
    }
  }
  return result;
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function seed() {
  console.log('Seeding orders...');

  try {
    // Check if orders already exist
    const existing = await db.select().from(orders).limit(1);
    if (existing.length > 0) {
      console.log('✓ Orders already seeded, skipping...');
      return;
    }

    // Fetch all reference data
    const drinkTypes = await db.select().from(drink_types);
    const subtypes = await db.select().from(drink_subtypes);
    const allVolumes = await db.select().from(volumes);
    const allContainers = await db.select().from(container_types);
    const allModes = await db.select().from(modes);

    if (allModes.length === 0) {
      throw new Error('No modes found. Please seed modes first.');
    }

    function getRandomModeId(): string {
      const idx = Math.floor(Math.random() * allModes.length);
      return allModes[idx].id;
    }

    const orderRows = [];

    for (const type of drinkTypes) {
      const typeSubtypes = subtypes.filter((s) => s.drinkTypeId === type.id);

      if (typeSubtypes.length === 0) {
        // No subtypes: create entries with random variation
        const numEntries = getRandomVariation(DRINK_TYPE_NUM_ENTRIES, DRINK_TYPE_VARIATION);
        console.log(
          `🍺 ${type.name}: No subtypes, creating ${numEntries} entries (base: ${DRINK_TYPE_NUM_ENTRIES} ± ${DRINK_TYPE_VARIATION})`,
        );

        for (let i = 0; i < numEntries; i++) {
          const volumes = getRandomSample(allVolumes, 3);
          const containers = getRandomSample(allContainers, 2);
          for (const volume of volumes) {
            for (const container of containers) {
              orderRows.push({
                modeId: getRandomModeId(),
                drinkTypeId: type.id,
                drinkSubtypeId: null,
                volumeId: volume.id,
                containerTypeId: container.id,
                defaultTempConsume: getRandomInt(
                  TEMPERATURE_RANGES.CONSUMPTION.MIN,
                  TEMPERATURE_RANGES.CONSUMPTION.MAX,
                ),
                defaultTempFreeze: getRandomInt(
                  TEMPERATURE_RANGES.FREEZING.MIN,
                  TEMPERATURE_RANGES.FREEZING.MAX,
                ),
              });
            }
          }
        }
      } else {
        // Has subtypes: for each subtype, create entries with random variation
        console.log(`🍷 ${type.name}: Has ${typeSubtypes.length} subtypes`);

        for (const subtype of typeSubtypes) {
          const numEntries = getRandomVariation(DRINK_SUBTYPE_NUM_ENTRIES, DRINK_SUBTYPE_VARIATION);
          console.log(
            `  └─ ${subtype.name}: Creating ${numEntries} entries (base: ${DRINK_SUBTYPE_NUM_ENTRIES} ± ${DRINK_SUBTYPE_VARIATION})`,
          );

          for (let i = 0; i < numEntries; i++) {
            const volumes = getRandomSample(allVolumes, 3);
            const containers = getRandomSample(allContainers, 2);
            for (const volume of volumes) {
              for (const container of containers) {
                orderRows.push({
                  modeId: getRandomModeId(),
                  drinkTypeId: type.id,
                  drinkSubtypeId: subtype.id,
                  volumeId: volume.id,
                  containerTypeId: container.id,
                  defaultTempConsume: getRandomInt(
                    TEMPERATURE_RANGES.CONSUMPTION.MIN,
                    TEMPERATURE_RANGES.CONSUMPTION.MAX,
                  ),
                  defaultTempFreeze: getRandomInt(
                    TEMPERATURE_RANGES.FREEZING.MIN,
                    TEMPERATURE_RANGES.FREEZING.MAX,
                  ),
                });
              }
            }
          }
        }
      }
    }

    if (orderRows.length === 0) {
      throw new Error('No orders to insert! Check your seed logic.');
    }

    await db.insert(orders).values(orderRows);
    console.log('\n📊 Order Generation Summary:');
    console.log(`   Total orders created: ${orderRows.length}`);
    console.log(
      `   Drink types without subtypes: ${drinkTypes.filter((t) => !subtypes.some((s) => s.drinkTypeId === t.id)).length}`,
    );
    console.log(
      `   Drink types with subtypes: ${drinkTypes.filter((t) => subtypes.some((s) => s.drinkTypeId === t.id)).length}`,
    );
    console.log(`   Total subtypes: ${subtypes.length}`);
    console.log(`✅ Inserted ${orderRows.length} orders!`);
    return orderRows;
  } catch (error) {
    console.error('❌ Error seeding orders:', error);
    throw error;
  }
}
