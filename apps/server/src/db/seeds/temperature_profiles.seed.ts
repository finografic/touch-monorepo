import { db } from '../db.adapter';
import { temperature_profiles } from '../schemas';
import { randomUUID } from 'node:crypto';

export async function seed() {
  console.log('Seeding temperature_profiles...');

  try {
    // Check if already seeded
    const existing = await db.select().from(temperature_profiles).limit(1);
    if (existing.length > 0) {
      console.log('✓ temperature_profiles already seeded, skipping...');
      return;
    }

    // Example profile IDs
    const slowProfileId = randomUUID();
    const mediumProfileId = randomUUID();
    const fastProfileId = randomUUID();

    // Temperatures to seed
    const temperatures = [30, 29, 28, 27, 26, 25];

    // Example time values for each profile
    const slowTimes = [0, 3, 5, 7, 9, 11];
    const mediumTimes = [0, 2, 4, 5.5, 7.4, 8];
    const fastTimes = [0, 2.3, 4.7, 6.2, 8.1, 9.6];

    const rows = [];
    for (let i = 0; i < temperatures.length; i++) {
      rows.push({
        id: randomUUID(),
        profileId: slowProfileId,
        temperature: temperatures[i],
        timeA: slowTimes[i],
        timeB: slowTimes[i],
        timeC: slowTimes[i],
      });
      rows.push({
        id: randomUUID(),
        profileId: mediumProfileId,
        temperature: temperatures[i],
        timeA: mediumTimes[i],
        timeB: mediumTimes[i],
        timeC: mediumTimes[i],
      });
      rows.push({
        id: randomUUID(),
        profileId: fastProfileId,
        temperature: temperatures[i],
        timeA: fastTimes[i],
        timeB: fastTimes[i],
        timeC: fastTimes[i],
      });
    }

    await db.insert(temperature_profiles).values(rows);
    console.log('✅ Inserted temperature_profiles!');
    return rows;
  } catch (error) {
    console.error('❌ Error seeding temperature_profiles:', error);
    throw error;
  }
}
