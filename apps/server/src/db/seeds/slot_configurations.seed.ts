import { db } from '../db.adapter';
import { slot_configurations } from '../schemas';
import { randomUUID } from 'node:crypto';

// Default configuration matching current ORDER_ITEMS_CONFIG
const DEFAULT_SLOT_CONFIG = [
  // First row (0-2)
  { slotNumber: 0, itemType: 'A' as const },
  { slotNumber: 1, itemType: 'B' as const },
  { slotNumber: 2, itemType: 'B' as const },

  // Second row (3-5)
  { slotNumber: 3, itemType: 'B' as const },
  { slotNumber: 4, itemType: 'B' as const },
  { slotNumber: 5, itemType: 'B' as const },

  // Third row (6-8)
  { slotNumber: 6, itemType: 'B' as const },
  { slotNumber: 7, itemType: 'B' as const },
  { slotNumber: 8, itemType: 'B' as const },

  // Last slot (positioned separately)
  { slotNumber: 9, itemType: 'C' as const },
];

export const seedSlotConfigurations = async () => {
  console.log('🌱 Seeding slot configurations...');

  try {
    // Clear existing data
    await db.delete(slot_configurations);

    // Insert default configurations
    const configsToInsert = DEFAULT_SLOT_CONFIG.map((config) => ({
      id: randomUUID(),
      slotNumber: config.slotNumber,
      itemType: config.itemType,
    }));

    await db.insert(slot_configurations).values(configsToInsert);

    console.log('✅ Slot configurations seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding slot configurations:', error);
    throw error;
  }
};
