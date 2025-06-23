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
          nameEn: 'Beer',
          nameEs: 'Cerveza',
          nameCa: 'Cervesa',
          hasSubtypes: true,
          defaultTempConsume: 3,
          defaultTempFreeze: -2,
        },
        {
          name: 'vino',
          nameEn: 'Wine',
          nameEs: 'Vino',
          nameCa: 'Vi',
          hasSubtypes: true,
          defaultTempConsume: 15,
          defaultTempFreeze: 12,
        },
        {
          name: 'cava',
          nameEn: 'Cava',
          nameEs: 'Cava',
          nameCa: 'Cava',
          hasSubtypes: false,
          defaultTempConsume: 8,
          defaultTempFreeze: 6,
        },
        {
          name: 'licor',
          nameEn: 'Liquor',
          nameEs: 'Licor',
          nameCa: 'Licor',
          hasSubtypes: false,
          defaultTempConsume: 18,
          defaultTempFreeze: 16,
        },
        {
          name: 'zumo',
          nameEn: 'Juice',
          nameEs: 'Zumo',
          nameCa: 'Suc',
          hasSubtypes: false,
          defaultTempConsume: 4,
          defaultTempFreeze: 2,
        },
        {
          name: 'refresco',
          nameEn: 'Soda',
          nameEs: 'Refresco',
          nameCa: 'Refresc',
          hasSubtypes: false,
          defaultTempConsume: 4,
          defaultTempFreeze: 2,
        },
        {
          name: 'agua',
          nameEn: 'Water',
          nameEs: 'Agua',
          nameCa: 'Aigua',
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
        nameEn: 'Blonde',
        nameEs: 'Rubia',
        nameCa: 'Rossa',
        drinkTypeId: beerTypeId,
        defaultTempConsume: 3,
        defaultTempFreeze: -2,
      },
      {
        name: 'negra',
        nameEn: 'Dark',
        nameEs: 'Negra',
        nameCa: 'Negra',
        drinkTypeId: beerTypeId,
        defaultTempConsume: 3,
        defaultTempFreeze: -6,
      },
      {
        name: 'tinto',
        nameEn: 'Red',
        nameEs: 'Tinto',
        nameCa: 'Negre',
        drinkTypeId: wineTypeId,
        defaultTempConsume: 15,
        defaultTempFreeze: 12,
      },
      {
        name: 'blanco',
        nameEn: 'White',
        nameEs: 'Blanco',
        nameCa: 'Blanc',
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
