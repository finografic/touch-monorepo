import type { OrderFilters } from 'types/filters.types';
import type { OrderReadableModel } from 'types/models/order-readable.model';

/**
 * Test data generator
 * Creates mock OrderReadableModel data for testing
 */
export const createMockData = (count: number = 10): OrderReadableModel[] => {
  const drinkTypes = ['cerveza', 'vino', 'cava', 'licor', 'zumo', 'refresco', 'agua'];
  const subtypes = ['rubia', 'negra', 'tinto', 'blanco', 'rosado'];
  const volumes = ['25cl', '33cl', '50cl', '75cl', '1L', '1.25L', '1.5L', '2L'];
  const containerTypes = ['plastico', 'vidrio', 'metal'];

  return Array.from({ length: count }, (_, index) => ({
    id: `mock-${index}`,
    mode: '3',
    drinkType: drinkTypes[index % drinkTypes.length],
    drinkSubtype: subtypes[index % subtypes.length],
    volume: volumes[index % volumes.length],
    containerType: containerTypes[index % containerTypes.length],
    modeId: 'mock-mode-id',
    temperatureProfile: 'mock-profile',
    defaultTempConsume: 4,
    defaultTempFreeze: 2,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
};

/**
 * Test filters generator
 * Creates mock filter states for testing
 */
export const createMockFilters = (): OrderFilters => ({
  mode: {
    id: 'mode-1',
    name: '3',
  },
  drinkType: {
    id: 'drink-1',
    name: 'vino',
    hasSubtypes: true,
    defaultTempConsume: 15,
  },
  drinkSubtype: {
    id: 'subtype-1',
    name: 'tinto',
    defaultTempConsume: 15,
  },
  drinkVolume: {
    id: 'volume-1',
    name: '75cl',
  },
  containerType: {
    id: 'container-1',
    name: 'vidrio',
  },
});
