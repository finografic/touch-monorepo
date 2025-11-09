import { db } from '../db.adapter';
import { slot_configurations } from '../schemas';
import createCuid from '@bugsnag/cuid';

// Default configuration: All 16 slots, first 10 active (3 columns x 3 rows + 1 separate)
const DEFAULT_SLOT_CONFIG = [
  // First column (active)
  { slotNumber: 1, slotType: 'A' as const, isActive: true, relayNumber: 1 },
  { slotNumber: 2, slotType: 'B' as const, isActive: true, relayNumber: 2 },
  { slotNumber: 3, slotType: 'B' as const, isActive: true, relayNumber: 3 },

  // Second column (active)
  { slotNumber: 4, slotType: 'B' as const, isActive: true, relayNumber: 4 },
  { slotNumber: 5, slotType: 'B' as const, isActive: true, relayNumber: 5 },
  { slotNumber: 6, slotType: 'B' as const, isActive: true, relayNumber: 6 },

  // Third column (active)
  { slotNumber: 7, slotType: 'B' as const, isActive: true, relayNumber: 7 },
  { slotNumber: 8, slotType: 'B' as const, isActive: true, relayNumber: 8 },
  { slotNumber: 9, slotType: 'B' as const, isActive: true, relayNumber: 9 },

  // Fourth column (inactive)
  { slotNumber: 10, slotType: 'C' as const, isActive: false, relayNumber: 10 },
  { slotNumber: 11, slotType: 'B' as const, isActive: false, relayNumber: 11 },
  { slotNumber: 12, slotType: 'B' as const, isActive: false, relayNumber: 12 },

  // Fifth column (inactive)
  { slotNumber: 13, slotType: 'B' as const, isActive: false, relayNumber: 13 },
  { slotNumber: 14, slotType: 'B' as const, isActive: false, relayNumber: 14 },
  { slotNumber: 15, slotType: 'B' as const, isActive: false, relayNumber: 15 },

  // Last slot (active, positioned separately)
  { slotNumber: 16, slotType: 'C' as const, isActive: true, relayNumber: 16 },
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
      isActive: config.isActive,
      relayNumber: config.relayNumber,
    }));

    await db.insert(slot_configurations).values(configsToInsert);

    console.log('✅ Slot configurations seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding slot configurations:', error);
    throw error;
  }
}
