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

    // From the presentation, we have these volume options with JSON translations
    const insertedVolumes = await db.insert(volumes).values([
      {
        name: '2L',
        translations: {
          'en-GB': '2 Liters',
          'es-ES': '2 Litros',
          'ca-ES': '2 Litres',
        },
        valueInMl: 2000,
        sortOrder: 1,
        coolingFactor: 1.2,
      },
      {
        name: '1.5L',
        translations: {
          'en-GB': '1.5 Liters',
          'es-ES': '1.5 Litros',
          'ca-ES': '1.5 Litres',
        },
        valueInMl: 1500,
        sortOrder: 2,
        coolingFactor: 1.15,
      },
      {
        name: '1.25L',
        translations: {
          'en-GB': '1.25 Liters',
          'es-ES': '1.25 Litros',
          'ca-ES': '1.25 Litres',
        },
        valueInMl: 1250,
        sortOrder: 3,
        coolingFactor: 1.1,
      },
      {
        name: '1L',
        translations: {
          'en-GB': '1 Liter',
          'es-ES': '1 Litro',
          'ca-ES': '1 Litre',
        },
        valueInMl: 1000,
        sortOrder: 4,
        coolingFactor: 1.0,
      },
      {
        name: '75cl',
        translations: {
          'en-GB': '75cl',
          'es-ES': '75cl',
          'ca-ES': '75cl',
        },
        valueInMl: 750,
        sortOrder: 5,
        coolingFactor: 0.9,
      },
      {
        name: '50cl',
        translations: {
          'en-GB': '50cl',
          'es-ES': '50cl',
          'ca-ES': '50cl',
        },
        valueInMl: 500,
        sortOrder: 6,
        coolingFactor: 0.8,
      },
      {
        name: '33cl',
        translations: {
          'en-GB': '33cl',
          'es-ES': '33cl',
          'ca-ES': '33cl',
        },
        valueInMl: 330,
        sortOrder: 7,
        coolingFactor: 0.7,
      },
      {
        name: '25cl',
        translations: {
          'en-GB': '25cl',
          'es-ES': '25cl',
          'ca-ES': '25cl',
        },
        valueInMl: 250,
        sortOrder: 8,
        coolingFactor: 0.6,
      },
    ]);

    console.log('✅ Volumes seed completed successfully!');
    return insertedVolumes;
  } catch (error) {
    console.error('❌ Error seeding volumes:', error);
    throw error;
  }
}
