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
          displayName: 'Cerveza',
          hasSubtypes: true,
          defaultTempConsume: 3,
          // defaultTempFreeze: -2,
        },
        {
          name: 'vino',
          displayName: 'Vino',
          hasSubtypes: true,
          defaultTempConsume: 15,
          // defaultTempFreeze: 12,
        },
        {
          name: 'cava',
          displayName: 'Cava',
          hasSubtypes: false,
          defaultTempConsume: 8,
          // defaultTempFreeze: 6,
        },
        {
          name: 'licor',
          displayName: 'Licor',
          hasSubtypes: false,
          defaultTempConsume: 18,
          // defaultTempFreeze: 16,
        },
        {
          name: 'zumo',
          displayName: 'Zumo',
          hasSubtypes: false,
          defaultTempConsume: 4,
          // defaultTempFreeze: 2,
        },
        {
          name: 'refresco',
          displayName: 'Refresco',
          hasSubtypes: false,
          defaultTempConsume: 4,
          // defaultTempFreeze: 2,
        },
        {
          name: 'agua',
          displayName: 'Agua',
          hasSubtypes: false,
          defaultTempConsume: 4,
          // defaultTempFreeze: 2,
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
        displayName: 'Rubia',
        drinkTypeId: beerTypeId,
        defaultTempConsume: 3,
        // defaultTempFreeze: -2,
      },
      {
        name: 'negra',
        displayName: 'Negra',
        drinkTypeId: beerTypeId,
        defaultTempConsume: 3,
        // defaultTempFreeze: -6,
      },
      {
        name: 'tinto',
        displayName: 'Tinto',
        drinkTypeId: wineTypeId,
        defaultTempConsume: 15,
        // defaultTempFreeze: 12,
      },
      {
        name: 'blanco',
        displayName: 'Blanco',
        drinkTypeId: wineTypeId,
        defaultTempConsume: 12,
        // defaultTempFreeze: 8,
      },
    ]);

    console.log('✅ Drink types seed completed successfully!');
    return insertedTypes;
  } catch (error) {
    console.error('❌ Error seeding drink types:', error);
    throw error;
  }
}
