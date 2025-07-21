import { ItemType } from 'types/orders.types';
import type { SlotConfiguration } from 'types/slot-config.types';

export interface OrderItemConfig {
  itemType: ItemType;
  number: number;
}

// Fallback configuration if API fails
const FALLBACK_CONFIG: OrderItemConfig[] = [
  // First row
  { itemType: ItemType.A, number: 0 },
  { itemType: ItemType.B, number: 1 },
  { itemType: ItemType.B, number: 2 },

  // Second row
  { itemType: ItemType.B, number: 3 },
  { itemType: ItemType.B, number: 4 },
  { itemType: ItemType.B, number: 5 },

  // Third row
  { itemType: ItemType.B, number: 6 },
  { itemType: ItemType.B, number: 7 },
  { itemType: ItemType.B, number: 8 },

  // Last slot (positioned separately)
  { itemType: ItemType.C, number: 9 },
];

/**
 * Convert slot configurations from API to OrderItemConfig format
 */
export const convertSlotConfigsToOrderConfig = (slotConfigs: SlotConfiguration[]): OrderItemConfig[] => {
  return slotConfigs
    .sort((a, b) => a.slotNumber - b.slotNumber)
    .map((config) => ({
      itemType: config.itemType,
      number: config.slotNumber,
    }));
};

/**
 * Load slot configurations from API and convert to OrderItemConfig format
 * Falls back to hardcoded config if API fails
 */
export const loadOrderItemsConfig = async (): Promise<OrderItemConfig[]> => {
  try {
    const response = await fetch('/api/slot-configurations');
    if (!response.ok) {
      console.warn('Failed to load slot configurations from API, using fallback');
      return FALLBACK_CONFIG;
    }

    const result = await response.json();
    if (result.success && result.data) {
      return convertSlotConfigsToOrderConfig(result.data);
    } else {
      console.warn('Invalid response from slot configurations API, using fallback');
      return FALLBACK_CONFIG;
    }
  } catch (error) {
    console.error('Error loading slot configurations:', error);
    return FALLBACK_CONFIG;
  }
};

/**
 * Get the current order items configuration
 * This is a synchronous version that returns the fallback config
 * For dynamic loading, use loadOrderItemsConfig()
 */
export const getOrderItemsConfig = (): OrderItemConfig[] => {
  return FALLBACK_CONFIG;
};
