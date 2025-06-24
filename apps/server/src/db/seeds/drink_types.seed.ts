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

    // Insert drink types
    const insertedTypes = await db
      .insert(drink_types)
      .values([
        {
          name: 'cerveza',
          name_en_gb: 'Beer',
          name_es_es: 'Cerveza',
          name_ca_es: 'Cervesa',
          hasSubtypes: true,
          defaultTempConsume: 3,
          defaultTempFreeze: -2,
        },
        {
          name: 'vino',
          name_en_gb: 'Wine',
          name_es_es: 'Vino',
          name_ca_es: 'Vi',
          hasSubtypes: true,
          defaultTempConsume: 15,
          defaultTempFreeze: 12,
        },
        {
          name: 'cava',
          name_en_gb: 'Cava',
          name_es_es: 'Cava',
          name_ca_es: 'Cava',
          hasSubtypes: false,
          defaultTempConsume: 8,
          defaultTempFreeze: 6,
        },
        {
          name: 'licor',
          name_en_gb: 'Liquor',
          name_es_es: 'Licor',
          name_ca_es: 'Licor',
          hasSubtypes: false,
          defaultTempConsume: 18,
          defaultTempFreeze: 16,
        },
        {
          name: 'zumo',
          name_en_gb: 'Juice',
          name_es_es: 'Zumo',
          name_ca_es: 'Suc',
          hasSubtypes: false,
          defaultTempConsume: 4,
          defaultTempFreeze: 2,
        },
        {
          name: 'refresco',
          name_en_gb: 'Soda',
          name_es_es: 'Refresco',
          name_ca_es: 'Refresc',
          hasSubtypes: false,
          defaultTempConsume: 4,
          defaultTempFreeze: 2,
        },
        {
          name: 'agua',
          name_en_gb: 'Water',
          name_es_es: 'Agua',
          name_ca_es: 'Aigua',
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

    // Insert subtypes for beer and wine
    await db.insert(drink_subtypes).values([
      {
        name: 'rubia',
        name_en_gb: 'Blonde',
        name_es_es: 'Rubia',
        name_ca_es: 'Rossa',
        drinkTypeId: beerTypeId,
        defaultTempConsume: 3,
        defaultTempFreeze: -2,
      },
      {
        name: 'negra',
        name_en_gb: 'Dark',
        name_es_es: 'Negra',
        name_ca_es: 'Negra',
        drinkTypeId: beerTypeId,
        defaultTempConsume: 3,
        defaultTempFreeze: -6,
      },
      {
        name: 'tinto',
        name_en_gb: 'Red',
        name_es_es: 'Tinto',
        name_ca_es: 'Negre',
        drinkTypeId: wineTypeId,
        defaultTempConsume: 15,
        defaultTempFreeze: 12,
      },
      {
        name: 'blanco',
        name_en_gb: 'White',
        name_es_es: 'Blanco',
        name_ca_es: 'Blanc',
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
