import { db } from '../db.adapter';
import { modes } from '../schemas';
import createCuid from '@bugsnag/cuid';

export async function seed() {
  console.log('Seeding modes...');

  try {
    const existing = await db.select().from(modes).limit(1);
    if (existing.length > 0) {
      console.log('✓ Modes already seeded, skipping...');
      return;
    }

    // Insert the five basic modes
    const insertedModes = await db
      .insert(modes)
      .values([
        {
          id: createCuid(),
          name: '1',
          isDefault: false,
          isActive: true,
        },
        {
          id: createCuid(),
          name: '2',
          isDefault: false,
          isActive: true,
        },
        {
          id: createCuid(),
          name: '3',
          isDefault: true,
          isActive: true,
        },
        {
          id: createCuid(),
          name: '4',
          isDefault: false,
          isActive: false,
        },
        {
          id: createCuid(),
          name: '5',
          isDefault: false,
          isActive: false,
        },
      ])
      .returning();

    console.log('✅ Modes seed completed successfully!');
    return insertedModes;
  } catch (error) {
    console.error('❌ Error seeding modes:', error);
    throw error;
  }
}
