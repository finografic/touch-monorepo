import createCuid from '@bugsnag/cuid';

import { db } from '../db.adapter';
import { app_configuration } from '../schemas';

/** Default app configuration row: grid layout mode (standard vs minimal 4-slot 2×2) */
const GRID_LAYOUT_KEY = 'grid_layout';

const DEFAULT_APP_CONFIG = [
  {
    name: GRID_LAYOUT_KEY,
    isActive: false, // false = standard grid; true = minimal (4 slots, 2×2, no special slot)
    data: '{}',
  },
];

export async function seed() {
  console.log('Seeding app_configuration...');

  try {
    const existing = await db.select().from(app_configuration).limit(1);
    if (existing.length > 0) {
      console.log('✓ app_configuration already seeded, skipping...');
      return;
    }

    const rowsToInsert = DEFAULT_APP_CONFIG.map((row) => ({
      id: createCuid(),
      name: row.name,
      isActive: row.isActive,
      data: row.data,
    }));

    await db.insert(app_configuration).values(rowsToInsert);

    console.log('✅ app_configuration seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding app_configuration:', error);
    throw error;
  }
}
