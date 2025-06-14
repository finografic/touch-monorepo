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
        nameEn: 'Plastic',
        nameEs: 'Plástico',
        nameCat: 'Plàstic',
        thermalConductivity: 20, // Lower conductivity
      },
      {
        name: 'vidrio',
        nameEn: 'Glass',
        nameEs: 'Vidrio',
        nameCat: 'Vidre',
        thermalConductivity: 50, // Medium conductivity
      },
      {
        name: 'metal',
        nameEn: 'Metal',
        nameEs: 'Metal',
        nameCat: 'Metall',
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
