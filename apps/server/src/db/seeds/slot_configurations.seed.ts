import { db } from '../db.adapter';
import { slot_configurations, volumes } from '../schemas';
import { randomUUID } from 'node:crypto';

// Default configuration matching current ORDER_ITEMS_CONFIG
const DEFAULT_SLOT_CONFIG = [
  // First row (1-3)
  { slotNumber: 1, slotType: 'A' as const },
  { slotNumber: 2, slotType: 'B' as const },
  { slotNumber: 3, slotType: 'B' as const },

  // Second row (4-6)
  { slotNumber: 4, slotType: 'B' as const },
  { slotNumber: 5, slotType: 'B' as const },
  { slotNumber: 6, slotType: 'B' as const },

  // Third row (7-9)
  { slotNumber: 7, slotType: 'B' as const },
  { slotNumber: 8, slotType: 'B' as const },
  { slotNumber: 9, slotType: 'B' as const },

  // Last slot (positioned separately)
  { slotNumber: 10, slotType: 'C' as const },
];

export async function seed() {
  console.log('Seeding slot configurations...');

  try {
    const existing = await db.select().from(slot_configurations).limit(1);
    if (existing.length > 0) {
      console.log('✓ Slot configurations already seeded, skipping...');
      return;
    }

    const configsToInsert = DEFAULT_SLOT_CONFIG.map((config) => ({
      id: randomUUID(),
      slotNumber: config.slotNumber,
      slotType: config.slotType,
    }));

    await db.insert(slot_configurations).values(configsToInsert);

    console.log('✅ Slot configurations seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding slot configurations:', error);
    throw error;
  }
}
