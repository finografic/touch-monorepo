import type { OrderFilters } from 'types/filters.types';
import type { OrderReadableModel } from 'types/models/order-readable.model';

/**
 * Generate mock entries based on current filter context
 * This ensures mock buttons are contextually relevant
 */
export const generateMockEntries = (filters: OrderFilters): OrderReadableModel[] => {
  const mockEntries: OrderReadableModel[] = [];

  // Get current filter values
  const currentMode = filters.mode?.name || '3';
  const currentDrinkType = filters.drinkType?.name || 'cerveza';
  const currentDrinkSubtype = filters.drinkSubtype?.name || null;
  const currentVolume = filters.drinkVolume?.name || '50cl';
  const currentContainerType = filters.containerType?.name || 'botella';

  // Generate mock entries for common options that might be missing
  const commonVolumes = ['25cl', '33cl', '50cl', '75cl', '1L', '1.25L', '1.5L', '2L'];
  const commonContainerTypes = ['plastico', 'vidrio', 'metal'];
  const commonDrinkTypes = ['cerveza', 'vino', 'cava', 'licor', 'zumo', 'refresco', 'agua'];

  // Add mock volume entries if we have drink type but no volumes
  if (filters.drinkType && !filters.drinkVolume) {
    commonVolumes.forEach((volume, index) => {
      mockEntries.push({
        id: `mock-volume-${index}`,
        mode: currentMode,
        drinkType: currentDrinkType,
        drinkSubtype: currentDrinkSubtype,
        volume,
        containerType: currentContainerType,
        // Add other required fields
        modeId: filters.mode?.id || 'mock-mode-id',
        temperatureProfile: 'mock-profile',
        defaultTempConsume: 4,
        defaultTempFreeze: 2,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });
  }

  // Add mock container type entries if we have volume but no container type
  if (filters.drinkVolume && !filters.containerType) {
    commonContainerTypes.forEach((containerType, index) => {
      mockEntries.push({
        id: `mock-container-${index}`,
        mode: currentMode,
        drinkType: currentDrinkType,
        drinkSubtype: currentDrinkSubtype,
        volume: currentVolume,
        containerType,
        // Add other required fields
        modeId: filters.mode?.id || 'mock-mode-id',
        temperatureProfile: 'mock-profile',
        defaultTempConsume: 4,
        defaultTempFreeze: 2,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });
  }

  // Add mock drink type entries if we have mode but no drink type
  if (filters.mode && !filters.drinkType) {
    commonDrinkTypes.forEach((drinkType, index) => {
      mockEntries.push({
        id: `mock-drink-${index}`,
        mode: currentMode,
        drinkType,
        drinkSubtype: null,
        volume: currentVolume,
        containerType: currentContainerType,
        // Add other required fields
        modeId: filters.mode?.id || 'mock-mode-id',
        temperatureProfile: 'mock-profile',
        defaultTempConsume: 4,
        defaultTempFreeze: 2,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });
  }

  return mockEntries;
};
