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

    // Insert the container types with JSON translations
    const insertedTypes = await db.insert(container_types).values([
      {
        name: 'plastico',
        name_en_gb: 'Plastic',
        name_es_es: 'Plástico',
        name_ca_es: 'Plàstic',
        translations: {
          'en-GB': 'Plastic',
          'es-ES': 'Plástico',
          'ca-ES': 'Plàstic',
        },
        thermalConductivity: 20, // Lower conductivity
      },
      {
        name: 'vidrio',
        name_en_gb: 'Glass',
        name_es_es: 'Vidrio',
        name_ca_es: 'Vidre',
        translations: {
          'en-GB': 'Glass',
          'es-ES': 'Vidrio',
          'ca-ES': 'Vidre',
        },
        thermalConductivity: 50, // Medium conductivity
      },
      {
        name: 'metal',
        name_en_gb: 'Metal',
        name_es_es: 'Metal',
        name_ca_es: 'Metall',
        translations: {
          'en-GB': 'Metal',
          'es-ES': 'Metal',
          'ca-ES': 'Metall',
        },
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
