import { db } from '../db.adapter';
import { slot_configurations } from '../schemas';
import createCuid from '@bugsnag/cuid';

// Default configuration matching current SLOT_ITEMS_CONFIG
const DEFAULT_SLOT_CONFIG = [
  // First row (1-3)
  { slotNumber: 1, slotType: 'A' as const, relayNumber: 1 },
  { slotNumber: 2, slotType: 'B' as const, relayNumber: 2 },
  { slotNumber: 3, slotType: 'B' as const, relayNumber: 3 },

  // Second row (4-6)
  { slotNumber: 4, slotType: 'B' as const, relayNumber: 4 },
  { slotNumber: 5, slotType: 'B' as const, relayNumber: 5 },
  { slotNumber: 6, slotType: 'B' as const, relayNumber: 6 },

  // Third row (7-9)
  { slotNumber: 7, slotType: 'B' as const, relayNumber: 7 },
  { slotNumber: 8, slotType: 'B' as const, relayNumber: 8 },
  { slotNumber: 9, slotType: 'B' as const, relayNumber: 9 },

  // Second row (10-12)
  { slotNumber: 10, slotType: 'B' as const, relayNumber: 10 },
  { slotNumber: 11, slotType: 'B' as const, relayNumber: 11 },
  { slotNumber: 12, slotType: 'B' as const, relayNumber: 12 },

  // Second row (13-15)
  { slotNumber: 13, slotType: 'B' as const, relayNumber: 13 },
  { slotNumber: 14, slotType: 'B' as const, relayNumber: 14 },
  { slotNumber: 15, slotType: 'B' as const, relayNumber: 15 },

  // Last slot (positioned separately)
  { slotNumber: 16, slotType: 'C' as const, relayNumber: null },
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
      id: createCuid(),
      slotNumber: config.slotNumber,
      slotType: config.slotType,
      relayNumber: config.relayNumber,
    }));

    await db.insert(slot_configurations).values(configsToInsert);

    console.log('✅ Slot configurations seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding slot configurations:', error);
    throw error;
  }
}
