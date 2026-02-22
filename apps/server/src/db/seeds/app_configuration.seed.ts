import createCuid from '@bugsnag/cuid';
import { inArray } from 'drizzle-orm';

import { db } from '../db.adapter';
import { app_configuration } from '../schemas';

/** Keys and default rows for app_configuration. New keys added here will be inserted if missing. */
const DEFAULT_APP_CONFIG = [
  {
    name: 'grid_layout',
    isActive: false,
    data: '{}',
  },
  {
    name: 'slot_special_grid',
    isActive: false,
    data: JSON.stringify({ is_visible: true, slot_number: 10, relay_number: 10 }),
  },
  {
    name: 'slot_special_power',
    isActive: false,
    data: JSON.stringify({ is_visible: true, slot_number: 14, relay_number: 14 }),
  },
  {
    name: 'slot_special_alt',
    isActive: false,
    data: JSON.stringify({ is_visible: false, slot_number: 15, relay_number: 15 }),
  },
];

export async function seed() {
  console.log('Seeding app_configuration...');

  try {
    const existingNames = await db
      .select({ name: app_configuration.name })
      .from(app_configuration)
      .where(inArray(app_configuration.name, DEFAULT_APP_CONFIG.map((r) => r.name)));
    const existingSet = new Set(existingNames.map((r) => r.name));

    const toInsert = DEFAULT_APP_CONFIG.filter((row) => !existingSet.has(row.name));
    if (toInsert.length === 0) {
      console.log('✓ app_configuration already up to date, skipping...');
      return;
    }

    const rowsToInsert = toInsert.map((row) => ({
      id: createCuid(),
      name: row.name,
      isActive: row.isActive,
      data: row.data,
    }));

    await db.insert(app_configuration).values(rowsToInsert);
    console.log(`✅ app_configuration: inserted ${rowsToInsert.length} missing entry/entries`);
  } catch (error) {
    console.error('❌ Error seeding app_configuration:', error);
    throw error;
  }
}
