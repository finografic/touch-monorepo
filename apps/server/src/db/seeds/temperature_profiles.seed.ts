import { db } from '../db.adapter';
import { cooling_profiles, temperature_profiles } from '../schemas';
import { randomUUID } from 'node:crypto';

export async function seed() {
  console.log('Seeding temperature_profiles...');

  try {
    // Clean existing data first
    console.log('Cleaning existing temperature profiles...');
    await db.delete(temperature_profiles);
    console.log('✓ Cleaned existing temperature profiles');

    // Get the cooling profiles
    const coolingProfiles = await db.select().from(cooling_profiles);
    const slowProfile = coolingProfiles.find((p) => p.name === 'slow');
    const mediumProfile = coolingProfiles.find((p) => p.name === 'medium');
    const fastProfile = coolingProfiles.find((p) => p.name === 'fast');

    if (!slowProfile || !mediumProfile || !fastProfile) {
      throw new Error('Required cooling profiles not found. Please seed cooling_profiles first.');
    }

    // Generate temperatures from 30 to -10 (41 values)
    const temperatures = Array.from({ length: 41 }, (_, i) => 30 - i);

    // Helper function to generate random time values
    const generateTimeValues = (baseTime: number) => {
      return temperatures.map((_, index) => {
        // Increase time as temperature decreases
        const progress = index / temperatures.length;
        return +(baseTime * (1 + progress)).toFixed(1);
      });
    };

    // Generate time values for each profile
    const slowTimes = generateTimeValues(12); // Slower cooling
    const mediumTimes = generateTimeValues(8); // Medium cooling
    const fastTimes = generateTimeValues(5); // Fast cooling

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
