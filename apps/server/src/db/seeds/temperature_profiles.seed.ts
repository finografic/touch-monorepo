import { db } from '../db.adapter';
import { cooling_profiles, temperature_profiles } from '../schemas';
import { randomUUID } from 'node:crypto';

export async function seed() {
  console.log('Seeding temperature_profiles...');

  try {
    // Check if already seeded
    const existing = await db.select().from(temperature_profiles).limit(1);
    if (existing.length > 0) {
      console.log('✓ Temperature profiles already seeded, skipping...');
      return;
    }

    // Get the cooling profiles
    const coolingProfiles = await db.select().from(cooling_profiles);
    const slowProfile = coolingProfiles.find((p) => p.name === 'slow');
    const mediumProfile = coolingProfiles.find((p) => p.name === 'medium');
    const fastProfile = coolingProfiles.find((p) => p.name === 'fast');

    if (!slowProfile || !mediumProfile || !fastProfile) {
      throw new Error('Required cooling profiles not found. Please seed cooling_profiles first.');
    }

    // Temperatures to seed
    const temperatures = [30, 29, 28, 27, 26, 25];

    // Example time values for each profile
    const slowTimes = [0, 3, 5, 7, 9, 11];
    const mediumTimes = [0, 2, 4, 5.5, 7.4, 8];
    const fastTimes = [0, 2.3, 4.7, 6.2, 8.1, 9.6];

    const rows = [];
    for (let i = 0; i < temperatures.length; i++) {
      // Slow profile points
      rows.push({
        id: randomUUID(),
        coolingProfileId: slowProfile.id,
        temperature: temperatures[i],
        timeA: slowTimes[i],
        timeB: slowTimes[i],
        timeC: slowTimes[i],
      });

      // Medium profile points
      rows.push({
        id: randomUUID(),
        coolingProfileId: mediumProfile.id,
        temperature: temperatures[i],
        timeA: mediumTimes[i],
        timeB: mediumTimes[i],
        timeC: mediumTimes[i],
      });

      // Fast profile points
      rows.push({
        id: randomUUID(),
        coolingProfileId: fastProfile.id,
        temperature: temperatures[i],
        timeA: fastTimes[i],
        timeB: fastTimes[i],
        timeC: fastTimes[i],
      });
    }

    await db.insert(temperature_profiles).values(rows);
    console.log('✅ Inserted temperature profiles!');
    return rows;
  } catch (error) {
    console.error('❌ Error seeding temperature profiles:', error);
    throw error;
  }
}
