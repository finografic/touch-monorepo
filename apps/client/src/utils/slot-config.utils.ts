import type { SlotConfiguration } from 'types/slot-config.types';
import { SlotType } from 'types/slots.types';

export interface SlotItemConfig {
  slotType: SlotType;
  slotNumber: number;
}

// Utility to generate column-major order slot configs, starting at 1
export function generateColumnMajorConfig({
  columns = 3,
  rows = 3,
  lastType = SlotType.C,
}: {
  columns?: number;
  rows?: number;
  lastType?: SlotType;
}): SlotItemConfig[] {
  const total = columns * rows;
  const config: SlotItemConfig[] = [];
  let n = 1;
  for (let col = 0; col < columns; col++) {
    for (let row = 0; row < rows; row++) {
      // Always use B for all except first (A) and last (special)
      let type: SlotType = SlotType.B;
      if (n === 1) type = SlotType.A;
      config.push({ slotType: type, slotNumber: n });
      n++;
    }
  }
  // Add the special/large slot as the last one (number = total + 1)
  config.push({ slotType: lastType, slotNumber: total + 1 });
  return config;
}

// Fallback configuration if API fails (3x3 grid, column-major, starting at 1, special slot is 10)
const FALLBACK_CONFIG: SlotItemConfig[] = generateColumnMajorConfig({
  columns: 3,
  rows: 3,
  lastType: SlotType.C,
});

/**
 * Convert slot configurations from API to SlotItemConfig format
 */
export const convertSlotConfigsToOrderConfig = (slotConfigs: SlotConfiguration[]): SlotItemConfig[] => {
  // If slotNumbers are 1-based, sort by slotNumber
  return slotConfigs
    .sort((a, b) => a.slotNumber - b.slotNumber)
    .filter((config) => config.isActive)
    .map((config) => ({
      slotType: config.slotType,
      slotNumber: config.slotNumber,
    }));
};

/**
 * Load slot configurations from API and convert to SlotItemConfig format
 * Falls back to hardcoded config if API fails
 */
export const loadSlotItemsConfig = async (): Promise<SlotItemConfig[]> => {
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
 * For dynamic loading, use loadSlotItemsConfig()
 */
export const getSlotsConfig = (): SlotItemConfig[] => {
  return FALLBACK_CONFIG;
};
