import { db } from '../db.adapter';
import { modes } from '../schemas';
import createCuid from '@bugsnag/cuid';

// Default modes configuration
const DEFAULT_MODES_CONFIG = [
  {
    name: '1',
    isDefault: false,
    isActive: true,
  },
  {
    name: '2',
    isDefault: false,
    isActive: true,
  },
  {
    name: '3',
    isDefault: true,
    isActive: true,
  },
  {
    name: '4',
    isDefault: false,
    isActive: false,
  },
  {
    name: '5',
    isDefault: false,
    isActive: false,
  },
];

export async function seed() {
  console.log('Seeding modes...');

  try {
    const existing = await db.select().from(modes).limit(1);
    if (existing.length > 0) {
      console.log('✓ Modes already seeded, skipping...');
      return;
    }

    // Insert the five basic modes
    const modesToInsert = DEFAULT_MODES_CONFIG.map((mode) => ({
      id: createCuid(),
      name: mode.name,
      isDefault: mode.isDefault,
      isActive: mode.isActive,
    }));

    const insertedModes = await db.insert(modes).values(modesToInsert).returning();

    console.log('✅ Modes seed completed successfully!');
    return insertedModes;
  } catch (error) {
    console.error('❌ Error seeding modes:', error);
    throw error;
  }
}
