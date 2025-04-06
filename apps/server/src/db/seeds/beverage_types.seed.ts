import { db } from '../db.adapter';
import { beverage_types, beverage_subtypes } from '../schemas';

export async function seed() {
  console.log('Seeding beverage_types...');

  try {
    // Check if types already exist
    const existing = await db.select().from(beverage_types).limit(1);
    if (existing.length > 0) {
      console.log('✓ Beverage types already seeded, skipping...');
      return;
    }

    // Insert beverage types
    const insertedTypes = await db
      .insert(beverage_types)
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
      throw new Error('Parent beverage types not found');
    }

    // Insert subtypes for beer and wine
    await db.insert(beverage_subtypes).values([
      {
        name: 'rubia',
        displayName: 'Rubia',
        beverageTypeId: beerTypeId,
        consumptionTemp: 3,
        freezeTemp: -2,
      },
      {
        name: 'negra',
        displayName: 'Negra',
        beverageTypeId: beerTypeId,
        consumptionTemp: 3,
        freezeTemp: -6,
      },
      {
        name: 'tinto',
        displayName: 'Tinto',
        beverageTypeId: wineTypeId,
        consumptionTemp: 15,
        freezeTemp: 12,
      },
      {
        name: 'blanco',
        displayName: 'Blanco',
        beverageTypeId: wineTypeId,
        consumptionTemp: 12,
        freezeTemp: 8,
      },
    ]);

    console.log('✅ Beverage types seed completed successfully!');
    return insertedTypes;
  } catch (error) {
    console.error('❌ Error seeding beverage types:', error);
    throw error;
  }
}
