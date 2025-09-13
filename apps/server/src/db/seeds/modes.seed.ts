import { db } from '../db.adapter';
import { modes } from '../schemas';
import { randomUUID } from 'node:crypto';

export async function seed() {
  console.log('Seeding modes...');

  try {
    // Check if already seeded
    const existing = await db.select().from(modes).limit(1);
    if (existing.length > 0) {
      console.log('✓ Modes already seeded, skipping...');
      return;
    }

    // Insert the three basic modes
    const insertedModes = await db
      .insert(modes)
      .values([
        {
          id: randomUUID(),
          name: '1',
          description: 'fast - Fast mode - rapid temperature reduction',
          isDefault: false,
        },
        {
          id: randomUUID(),
          name: '2',
          description: 'fast - Fast mode - rapid temperature reduction',
          isDefault: false,
        },
        {
          id: randomUUID(),
          name: '3',
          description: 'slow - Slow mode - gentler temperature reduction',
          isDefault: true,
        },
        {
          id: randomUUID(),
          name: '4',
          description: 'medium - Medium mode - balanced temperature reduction',
          isDefault: false,
        },
        {
          id: randomUUID(),
          name: '5',
          description: 'fast - Fast mode - rapid temperature reduction',
          isDefault: false,
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
