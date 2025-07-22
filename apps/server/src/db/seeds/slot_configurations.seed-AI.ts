import { db } from '../db.adapter';
import { slot_configurations } from '../schemas';
import { randomUUID } from 'node:crypto';

// Default configuration matching current ORDER_ITEMS_CONFIG
const DEFAULT_SLOT_CONFIG = [
  // First row (1-3)
  { slotNumber: 1, itemType: 'A' as const },
  { slotNumber: 2, itemType: 'B' as const },
  { slotNumber: 3, itemType: 'B' as const },

  // Second row (4-6)
  { slotNumber: 4, itemType: 'B' as const },
  { slotNumber: 5, itemType: 'B' as const },
  { slotNumber: 6, itemType: 'B' as const },

  // Third row (7-9)
  { slotNumber: 7, itemType: 'B' as const },
  { slotNumber: 8, itemType: 'B' as const },
  { slotNumber: 9, itemType: 'B' as const },

  // Last slot (positioned separately)
  { slotNumber: 10, itemType: 'C' as const },
];

export const seedSlotConfigurations = async () => {
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

export default seedSlotConfigurations;
