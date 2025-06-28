import { db } from '../db.adapter';
import { drink_subtypes, drink_types } from '../schemas';

export async function seed() {
  console.log('Seeding drink_types...');

  try {
    // Check if types already exist
    const existing = await db.select().from(drink_types).limit(1);
    if (existing.length > 0) {
      console.log('✓ Drink types already seeded, skipping...');
      return;
    }

    // Insert drink types with JSON translations
    const insertedTypes = await db
      .insert(drink_types)
      .values([
        {
          name: 'cerveza',
          name_en_gb: 'Beer',
          name_es_es: 'Cerveza',
          name_ca_es: 'Cervesa',
          translations: {
            'en-GB': 'Beer',
            'es-ES': 'Cerveza',
            'ca-ES': 'Cervesa',
          },
          hasSubtypes: true,
          defaultTempConsume: 3,
          defaultTempFreeze: -2,
        },
        {
          name: 'vino',
          name_en_gb: 'Wine',
          name_es_es: 'Vino',
          name_ca_es: 'Vi',
          translations: {
            'en-GB': 'Wine',
            'es-ES': 'Vino',
            'ca-ES': 'Vi',
          },
          hasSubtypes: true,
          defaultTempConsume: 15,
          defaultTempFreeze: 12,
        },
        {
          name: 'cava',
          name_en_gb: 'Cava',
          name_es_es: 'Cava',
          name_ca_es: 'Cava',
          translations: {
            'en-GB': 'Cava',
            'es-ES': 'Cava',
            'ca-ES': 'Cava',
          },
          hasSubtypes: false,
          defaultTempConsume: 8,
          defaultTempFreeze: 6,
        },
        {
          name: 'licor',
          name_en_gb: 'Liquor',
          name_es_es: 'Licor',
          name_ca_es: 'Licor',
          translations: {
            'en-GB': 'Liquor',
            'es-ES': 'Licor',
            'ca-ES': 'Licor',
          },
          hasSubtypes: false,
          defaultTempConsume: 18,
          defaultTempFreeze: 16,
        },
        {
          name: 'zumo',
          name_en_gb: 'Juice',
          name_es_es: 'Zumo',
          name_ca_es: 'Suc',
          translations: {
            'en-GB': 'Juice',
            'es-ES': 'Zumo',
            'ca-ES': 'Suc',
          },
          hasSubtypes: false,
          defaultTempConsume: 4,
          defaultTempFreeze: 2,
        },
        {
          name: 'refresco',
          name_en_gb: 'Soda',
          name_es_es: 'Refresco',
          name_ca_es: 'Refresc',
          translations: {
            'en-GB': 'Soda',
            'es-ES': 'Refresco',
            'ca-ES': 'Refresc',
          },
          hasSubtypes: false,
          defaultTempConsume: 4,
          defaultTempFreeze: 2,
        },
        {
          name: 'agua',
          name_en_gb: 'Water',
          name_es_es: 'Agua',
          name_ca_es: 'Aigua',
          translations: {
            'en-GB': 'Water',
            'es-ES': 'Agua',
            'ca-ES': 'Aigua',
          },
          hasSubtypes: false,
          defaultTempConsume: 4,
          defaultTempFreeze: 2,
        },
      ])
      .returning();

    // Get parent type IDs
    const beerTypeId = insertedTypes.find((t) => t.name === 'cerveza')?.id;
    const wineTypeId = insertedTypes.find((t) => t.name === 'vino')?.id;

    if (!beerTypeId || !wineTypeId) {
      throw new Error('Parent drink types not found');
    }

    // Insert subtypes for beer and wine with JSON translations
    await db.insert(drink_subtypes).values([
      {
        name: 'rubia',
        name_en_gb: 'Blonde',
        name_es_es: 'Rubia',
        name_ca_es: 'Rossa',
        translations: {
          'en-GB': 'Blonde',
          'es-ES': 'Rubia',
          'ca-ES': 'Rossa',
        },
        drinkTypeId: beerTypeId,
        defaultTempConsume: 3,
        defaultTempFreeze: -2,
      },
      {
        name: 'negra',
        name_en_gb: 'Dark',
        name_es_es: 'Negra',
        name_ca_es: 'Negra',
        translations: {
          'en-GB': 'Dark',
          'es-ES': 'Negra',
          'ca-ES': 'Negra',
        },
        drinkTypeId: beerTypeId,
        defaultTempConsume: 3,
        defaultTempFreeze: -6,
      },
      {
        name: 'tinto',
        name_en_gb: 'Red',
        name_es_es: 'Tinto',
        name_ca_es: 'Negre',
        translations: {
          'en-GB': 'Red',
          'es-ES': 'Tinto',
          'ca-ES': 'Negre',
        },
        drinkTypeId: wineTypeId,
        defaultTempConsume: 15,
        defaultTempFreeze: 12,
      },
      {
        name: 'blanco',
        name_en_gb: 'White',
        name_es_es: 'Blanco',
        name_ca_es: 'Blanc',
        translations: {
          'en-GB': 'White',
          'es-ES': 'Blanco',
          'ca-ES': 'Blanc',
        },
        drinkTypeId: wineTypeId,
        defaultTempConsume: 12,
        defaultTempFreeze: 8,
      },
    ]);

    console.log('✅ Drink types seed completed successfully!');
    return insertedTypes;
  } catch (error) {
    console.error('❌ Error seeding drink types:', error);
    throw error;
  }
}
