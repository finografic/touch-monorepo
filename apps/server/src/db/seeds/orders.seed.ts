import { db } from '../db.adapter';
import {
  container_types,
  drink_subtypes,
  drink_types,
  orders,
  temperature_profiles,
  volumes,
} from '../schemas';
import { TEMPERATURE_RANGES } from '../../lib/constants';

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

// Generate random mode with specified distribution: 50% A, 25% B, 25% C
function getRandomMode(): number {
  const rand = Math.random();
  if (rand < 0.5) return 4; // 50% chance
  if (rand < 0.6) return 1; // 25% chance (0.5 to 0.75)
  if (rand < 0.8) return 2; // 25% chance (0.75 to 0.9)
  if (rand < 0.9) return 3; // 25% chance (0.9 to 0.95)
  return 5; // 5% chance (0.95 to 1.0)
}

// Helper function to determine appropriate temperature profile based on drink characteristics
function determineTemperatureProfile(
  drinkType: string,
  drinkSubtype: string | null,
  volume: string,
  container: string,
  profiles: Array<{ id: string; coolingProfileId: string }>,
): string {
  // Extract numeric temperature from profile ID (e.g., "temp_+30.0" -> 30)
  const getTemp = (profileId: string): number => {
    const match = profileId.match(/temp_([+-]\d+\.\d+)/);
    return match ? Number.parseFloat(match[1]) : 0;
  };

  // Sort profiles by temperature
  const sortedProfiles = [...profiles].sort((a, b) => getTemp(a.id) - getTemp(b.id));

  // Base temperature ranges for different drink types
  const tempRanges = {
    cerveza: {
      rubia: { min: 2, max: 8 }, // Light beer: cool to cold
      negra: { min: 6, max: 12 }, // Dark beer: slightly warmer
    },
  };

  // Container temperature adjustments
  const containerAdjustments = {
    vidrio: 0, // Glass: neutral
    plastico: +1, // Plastic: slightly warmer
    metal: -1, // Metal: slightly colder
  };

  // Volume temperature adjustments (larger volumes stay cold longer)
  const volumeAdjustments = {
    '33cl': 0,
    '50cl': -0.5,
    '75cl': -1,
    '1L': -1.5,
    '1.25L': -2,
    '2L': -2.5,
  };

  // Get base temperature range
  let baseTemp = 4; // Default temperature
  if (drinkType === 'cerveza') {
    baseTemp = tempRanges.cerveza[drinkSubtype as 'rubia' | 'negra']?.min ?? 4;
  }

  // Apply adjustments
  const containerAdj = containerAdjustments[container as keyof typeof containerAdjustments] || 0;
  const volumeAdj = volumeAdjustments[volume as keyof typeof volumeAdjustments] || 0;

  const targetTemp = baseTemp + containerAdj + volumeAdj;

  // Find the closest matching temperature profile
  let closestProfile = sortedProfiles[0];
  let minDiff = Math.abs(getTemp(sortedProfiles[0].id) - targetTemp);

  for (const profile of sortedProfiles) {
    const diff = Math.abs(getTemp(profile.id) - targetTemp);
    if (diff < minDiff) {
      minDiff = diff;
      closestProfile = profile;
    }
  }

  return closestProfile.id;
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
    const profiles = await db.select().from(temperature_profiles);

    const orderRows = [];

    for (const type of drinkTypes) {
      const typeSubtypes = subtypes.filter((s) => s.drinkTypeId === type.id);
      if (typeSubtypes.length === 0) {
        // No subtypes: create 2 entries
        for (let i = 0; i < 2; i++) {
          const volumes = getRandomSample(allVolumes, 3);
          const containers = getRandomSample(allContainers, 2);
          for (const volume of volumes) {
            for (const container of containers) {
              orderRows.push({
                mode: getRandomMode(),
                drinkTypeId: type.id,
                drinkSubtypeId: null,
                volumeId: volume.id,
                containerTypeId: container.id,
                defaultTempConsume: getRandomInt(
                  TEMPERATURE_RANGES.CONSUMPTION.MIN,
                  TEMPERATURE_RANGES.CONSUMPTION.MAX,
                ),
                temperatureProfileId: determineTemperatureProfile(
                  type.name,
                  null,
                  volume.name,
                  container.name,
                  profiles,
                ),
              });
            }
          }
        }
      } else {
        // Has subtypes: for each subtype, create 4 entries
        for (const subtype of typeSubtypes) {
          for (let i = 0; i < 4; i++) {
            const volumes = getRandomSample(allVolumes, 3);
            const containers = getRandomSample(allContainers, 2);
            for (const volume of volumes) {
              for (const container of containers) {
                orderRows.push({
                  mode: getRandomMode(),
                  drinkTypeId: type.id,
                  drinkSubtypeId: subtype.id,
                  volumeId: volume.id,
                  containerTypeId: container.id,
                  defaultTempConsume: getRandomInt(
                    TEMPERATURE_RANGES.CONSUMPTION.MIN,
                    TEMPERATURE_RANGES.CONSUMPTION.MAX,
                  ),
                  temperatureProfileId: determineTemperatureProfile(
                    type.name,
                    subtype.name,
                    volume.name,
                    container.name,
                    profiles,
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
    console.log(`✅ Inserted ${orderRows.length} orders!`);
    return orderRows;
  } catch (error) {
    console.error('❌ Error seeding orders:', error);
    throw error;
  }
}
