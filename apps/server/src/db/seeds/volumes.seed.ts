import { db } from '../db.adapter';
import { volumes } from '../schemas';

export async function seed() {
  console.log('Seeding volumes...');

  try {
    // Check if volumes already exist
    const existing = await db.select().from(volumes).limit(1);
    if (existing.length > 0) {
      console.log('✓ Volumes already seeded, skipping...');
      return;
    }

    // From the presentation, we have these volume options
    const insertedVolumes = await db.insert(volumes).values([
      { name: '2L', valueInMl: 2000, sortOrder: 1, coolingFactor: 1.2 },
      { name: '1.5L', valueInMl: 1500, sortOrder: 2, coolingFactor: 1.15 },
      { name: '1.25L', valueInMl: 1250, sortOrder: 3, coolingFactor: 1.1 },
      { name: '1L', valueInMl: 1000, sortOrder: 4, coolingFactor: 1.0 },
      { name: '75cl', valueInMl: 750, sortOrder: 5, coolingFactor: 0.9 },
      { name: '50cl', valueInMl: 500, sortOrder: 6, coolingFactor: 0.8 },
      { name: '33cl', valueInMl: 330, sortOrder: 7, coolingFactor: 0.7 },
      { name: '25cl', valueInMl: 250, sortOrder: 8, coolingFactor: 0.6 },
    ]);

    console.log('✅ Volumes seed completed successfully!');
    return insertedVolumes;
  } catch (error) {
    console.error('❌ Error seeding volumes:', error);
    throw error;
  }
}
