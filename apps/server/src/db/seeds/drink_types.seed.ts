import { db } from '../db.adapter';
import { drink_types, drink_subtypes } from '../schemas';

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
          defaultConsumptionTemp: 3,
          defaultFreezeTemp: -2,
        },
        {
          name: 'vino',
          displayName: 'Vino',
          hasSubtypes: true,
          defaultConsumptionTemp: 15,
          defaultFreezeTemp: 12,
        },
        {
          name: 'cava',
          displayName: 'Cava',
          hasSubtypes: false,
          defaultConsumptionTemp: 8,
          defaultFreezeTemp: 6,
        },
        {
          name: 'licor',
          displayName: 'Licor',
          hasSubtypes: false,
          defaultConsumptionTemp: 18,
          defaultFreezeTemp: 16,
        },
        {
          name: 'zumo',
          displayName: 'Zumo',
          hasSubtypes: false,
          defaultConsumptionTemp: 4,
          defaultFreezeTemp: 2,
        },
        {
          name: 'refresco',
          displayName: 'Refresco',
          hasSubtypes: false,
          defaultConsumptionTemp: 4,
          defaultFreezeTemp: 2,
        },
        {
          name: 'agua',
          displayName: 'Agua',
          hasSubtypes: false,
          defaultConsumptionTemp: 4,
          defaultFreezeTemp: 2,
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
        consumptionTemp: 3,
        freezeTemp: -2,
      },
      {
        name: 'negra',
        displayName: 'Negra',
        drinkTypeId: beerTypeId,
        consumptionTemp: 3,
        freezeTemp: -6,
      },
      {
        name: 'tinto',
        displayName: 'Tinto',
        drinkTypeId: wineTypeId,
        consumptionTemp: 15,
        freezeTemp: 12,
      },
      {
        name: 'blanco',
        displayName: 'Blanco',
        drinkTypeId: wineTypeId,
        consumptionTemp: 12,
        freezeTemp: 8,
      },
    ]);

    console.log('✅ Drink types seed completed successfully!');
    return insertedTypes;
  } catch (error) {
    console.error('❌ Error seeding drink types:', error);
    throw error;
  }
}
