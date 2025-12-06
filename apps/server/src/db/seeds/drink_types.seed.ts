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
        name: 'cerveza--rubia',
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
        name: 'cerveza--negra',
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
        name: 'vino--tinto',
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
        name: 'vino--blanco',
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
