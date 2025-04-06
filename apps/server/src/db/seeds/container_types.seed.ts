import { db } from '../db.adapter';
import { containerTypes } from '../schemas';

export async function seed() {
  console.log('Seeding container_types...');

  try {
    // Check if container types already exist
    const existing = await db.select().from(containerTypes).limit(1);
    if (existing.length > 0) {
      console.log('✓ Container types already seeded, skipping...');
      return;
    }

    // From the presentation, we have these container types
    const insertedTypes = await db.insert(containerTypes).values([
      {
        name: 'Botella',
        displayName: 'Botella',
        thermalConductivity: 1.0,
      },
      {
        name: 'Lata',
        displayName: 'Lata',
        thermalConductivity: 0.8,
      },
      {
        name: 'Barril',
        displayName: 'Barril',
        thermalConductivity: 1.5,
      },
    ]);

    console.log('✅ Container types seed completed successfully!');
    return insertedTypes;
  } catch (error) {
    console.error('❌ Error seeding container types:', error);
    throw error;
  }
}
