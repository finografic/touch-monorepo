import { db } from '../db.adapter';
import { container_types } from '../schemas';

export async function seed() {
  console.log('Seeding container_types...');

  try {
    // Check if container types already exist
    const existing = await db.select().from(container_types).limit(1);
    if (existing.length > 0) {
      console.log('✓ Container types already seeded, skipping...');
      return;
    }

    // Insert the container types
    const insertedTypes = await db.insert(container_types).values([
      {
        name: 'plastico',
        displayName: 'Plástico',
        thermalConductivity: 20, // Lower conductivity
      },
      {
        name: 'vidrio',
        displayName: 'Vidrio',
        thermalConductivity: 50, // Medium conductivity
      },
      {
        name: 'metal',
        displayName: 'Metal',
        thermalConductivity: 90, // High conductivity
      },
    ]);

    console.log('✅ Container types seed completed successfully!');
    return insertedTypes;
  } catch (error) {
    console.error('❌ Error seeding container types:', error);
    throw error;
  }
}
