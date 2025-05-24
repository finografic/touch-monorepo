import { db } from '../db.adapter';
import { cooling_profiles } from '../schemas';
import { randomUUID } from 'node:crypto';

export async function seed() {
  console.log('Seeding cooling_profiles...');

  try {
    // Check if already seeded
    const existing = await db.select().from(cooling_profiles).limit(1);
    if (existing.length > 0) {
      console.log('✓ Cooling profiles already seeded, skipping...');
      return;
    }

    // Insert the three basic cooling profiles
    const insertedProfiles = await db
      .insert(cooling_profiles)
      .values([
        {
          id: randomUUID(),
          name: 'slow',
          description: 'Slow cooling profile - gentler temperature reduction',
        },
        {
          id: randomUUID(),
          name: 'medium',
          description: 'Medium cooling profile - balanced temperature reduction',
        },
        {
          id: randomUUID(),
          name: 'fast',
          description: 'Fast cooling profile - rapid temperature reduction',
        },
      ])
      .returning();

    console.log('✅ Cooling profiles seed completed successfully!');
    return insertedProfiles;
  } catch (error) {
    console.error('❌ Error seeding cooling profiles:', error);
    throw error;
  }
}
