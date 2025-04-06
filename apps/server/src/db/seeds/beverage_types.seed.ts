import { db } from '../db.adapter';
import { beverage_types, beverage_subtypes } from '../schemas';

export async function seed() {
  console.log('Seeding beverage_types...');

  try {
    // Check if beverage types already exist
    const existing = await db.select().from(beverage_types).limit(1);
    if (existing.length > 0) {
      console.log('✓ Beverage types already seeded, skipping...');
      return;
    }

    // First insert the main types
    const insertedTypes = await db.insert(beverage_types).values([
      {
        name: 'Cerveza',
        displayName: 'Cerveza',
        hasSubtypes: true,
        defaultConsumptionTemp: 3,
        defaultFreezeTemp: -2,
      },
      {
        name: 'Vino',
        displayName: 'Vino',
        hasSubtypes: false,
        defaultConsumptionTemp: 16,
        defaultFreezeTemp: 12,
      },
      {
        name: 'Cava',
        displayName: 'Cava',
        hasSubtypes: false,
        defaultConsumptionTemp: 8,
        defaultFreezeTemp: 6,
      },
      {
        name: 'Licor',
        displayName: 'Licor',
        hasSubtypes: false,
        defaultConsumptionTemp: 18,
        defaultFreezeTemp: 16,
      },
      {
        name: 'Zumo',
        displayName: 'Zumo',
        hasSubtypes: false,
        defaultConsumptionTemp: 4,
        defaultFreezeTemp: 2,
      },
      {
        name: 'Refresco',
        displayName: 'Refresco',
        hasSubtypes: false,
        defaultConsumptionTemp: 4,
        defaultFreezeTemp: 2,
      },
      {
        name: 'Agua',
        displayName: 'Agua',
        hasSubtypes: false,
        defaultConsumptionTemp: 4,
        defaultFreezeTemp: 2,
      },
    ]);

    // Get the beer type ID for subtypes
    const beerType = await db.query.beverage_types.findFirst({
      where: (types, { eq }) => eq(types.name, 'Cerveza'),
    });

    if (beerType) {
      // Add beer subtypes
      await db.insert(beverage_subtypes).values([
        {
          beverageTypeId: beerType.id,
          name: 'Rubia',
          displayName: 'Rubia',
          consumptionTemp: 3,
          freezeTemp: -2,
        },
        {
          beverageTypeId: beerType.id,
          name: 'Negra',
          displayName: 'Negra',
          consumptionTemp: 3,
          freezeTemp: -6,
        },
      ]);
    }

    console.log('✅ Beverage types and subtypes seed completed successfully!');
    return insertedTypes;
  } catch (error) {
    console.error('❌ Error seeding beverage types:', error);
    throw error;
  }
}
