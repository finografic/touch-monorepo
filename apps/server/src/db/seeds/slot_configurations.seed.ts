import { db } from '../db.adapter';
import { slot_configurations } from '../schemas';
import { randomUUID } from 'node:crypto';

// Default configuration matching current ORDER_ITEMS_CONFIG
const DEFAULT_SLOT_CONFIG = [
  // First row (0-2)
  { slotNumber: 0, itemType: 'A' as const, isSpecialPad: false },
  { slotNumber: 1, itemType: 'B' as const, isSpecialPad: false },
  { slotNumber: 2, itemType: 'B' as const, isSpecialPad: false },

  // Second row (3-5)
  { slotNumber: 3, itemType: 'B' as const, isSpecialPad: false },
  { slotNumber: 4, itemType: 'B' as const, isSpecialPad: false },
  { slotNumber: 5, itemType: 'B' as const, isSpecialPad: false },

  // Third row (6-8)
  { slotNumber: 6, itemType: 'B' as const, isSpecialPad: false },
  { slotNumber: 7, itemType: 'B' as const, isSpecialPad: false },
  { slotNumber: 8, itemType: 'B' as const, isSpecialPad: false },

  // Special pad
  { slotNumber: 9, itemType: 'C' as const, isSpecialPad: true },
];

export async function seed() {
  console.log('Seeding slot_configurations...');

  try {
    // Check if configurations already exist
    const existing = await db.select().from(slot_configurations).limit(1);
    if (existing.length > 0) {
      console.log('✓ Slot configurations already seeded, skipping...');
      return;
    }

    // Insert default configurations
    const configurations = DEFAULT_SLOT_CONFIG.map((config) => ({
      id: randomUUID(),
      ...config,
    }));

    await db.insert(slot_configurations).values(configurations);
    console.log(`✅ Inserted ${configurations.length} slot configurations!`);

    // Log summary
    console.log('📊 Default slot configuration:');
    configurations.forEach((config) => {
      const typeLabel = config.isSpecialPad ? 'Special' : `Type ${config.itemType}`;
      console.log(`   Slot ${config.slotNumber}: ${typeLabel}`);
    });

    return configurations;
  } catch (error) {
    console.error('❌ Error seeding slot configurations:', error);
    throw error;
  }
}
