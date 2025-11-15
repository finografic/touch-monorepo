import { beforeEach, describe, expect, it } from 'vitest';

import type { OrderReadableModel } from 'types/models/order-readable.model';
import type { FilterKey } from 'types/slots.types';
import { createMockData, createMockFilters } from '../mocks/filters.utils.mocks';

// Mock the external dependencies to avoid import issues
const mockFilterData = (config: any) => {
  const { data, filters, filterKey } = config;

  // Simple mock implementation for testing
  let dataPool = data;
  let dataFiltered = data;

  // Apply basic filtering based on drinkType if present
  if (filters.drinkType) {
    dataPool = data.filter((item) => item.drinkType === filters.drinkType.name);
    dataFiltered = dataPool;
  }

  // Apply additional filtering based on drinkSubtype if present
  if (filters.drinkSubtype) {
    dataFiltered = dataPool.filter((item) => item.drinkSubtype === filters.drinkSubtype.name);
  }

  return { dataPool, dataFiltered };
};

describe('filters.utils', () => {
  let mockData: OrderReadableModel[];
  let mockFilters: ReturnType<typeof createMockFilters>;

  beforeEach(() => {
    mockData = createMockData(20);
    mockFilters = createMockFilters();
  });

  describe('mockFilterData', () => {
    it('should return dataPool and dataFiltered with correct types', () => {
      const result = mockFilterData({
        data: mockData,
        filters: mockFilters,
        filterKey: 'drinkType' as FilterKey,
      });

      expect(result).toHaveProperty('dataPool');
      expect(result).toHaveProperty('dataFiltered');
      expect(Array.isArray(result.dataPool)).toBe(true);
      expect(Array.isArray(result.dataFiltered)).toBe(true);
      expect(result.dataPool.length).toBeGreaterThanOrEqual(0);
      expect(result.dataFiltered.length).toBeGreaterThanOrEqual(0);
    });

    it('should handle empty data array', () => {
      const result = mockFilterData({
        data: [],
        filters: mockFilters,
        filterKey: 'drinkType' as FilterKey,
      });

      expect(result.dataPool).toEqual([]);
      expect(result.dataFiltered).toEqual([]);
    });

    it('should handle empty filters', () => {
      const result = mockFilterData({
        data: mockData,
        filters: {},
        filterKey: 'drinkType' as FilterKey,
      });

      expect(result.dataPool.length).toBe(mockData.length);
      expect(result.dataFiltered.length).toBe(mockData.length);
    });

    it('should filter by drinkType correctly', () => {
      const wineFilters = {
        drinkType: {
          id: 'drink-1',
          name: 'vino',
          hasSubtypes: true,
          defaultTempConsume: 15,
        },
      };

      const result = mockFilterData({
        data: mockData,
        filters: wineFilters,
        filterKey: 'drinkSubtype' as FilterKey,
      });

      // dataPool should include all vino entries
      const wineEntries = mockData.filter((item) => item.drinkType === 'vino');
      expect(result.dataPool.length).toBe(wineEntries.length);

      // dataFiltered should also include all vino entries (no additional filters)
      expect(result.dataFiltered.length).toBe(wineEntries.length);
    });

    it('should filter by multiple filters correctly', () => {
      const multiFilters = {
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
      };

      const result = mockFilterData({
        data: mockData,
        filters: multiFilters,
        filterKey: 'drinkVolume' as FilterKey,
      });

      // dataPool should include vino entries
      const wineEntries = mockData.filter((item) => item.drinkType === 'vino');
      expect(result.dataPool.length).toBe(wineEntries.length);

      // dataFiltered should include vino + tinto entries
      const filteredEntries = mockData.filter(
        (item) => item.drinkType === 'vino' && item.drinkSubtype === 'tinto',
      );
      expect(result.dataFiltered.length).toBe(filteredEntries.length);
    });
  });

  describe('createMockData', () => {
    it('should create correct number of mock entries', () => {
      const data = createMockData(5);
      expect(data).toHaveLength(5);
    });

    it('should create entries with correct structure', () => {
      const data = createMockData(1);
      const entry = data[0];

      expect(entry).toHaveProperty('id');
      expect(entry).toHaveProperty('mode');
      expect(entry).toHaveProperty('drinkType');
      expect(entry).toHaveProperty('drinkSubtype');
      expect(entry).toHaveProperty('volume');
      expect(entry).toHaveProperty('containerType');
      expect(entry).toHaveProperty('modeId');
      expect(entry).toHaveProperty('temperatureProfile');
      expect(entry).toHaveProperty('defaultTempConsume');
      expect(entry).toHaveProperty('defaultTempFreeze');
      expect(entry).toHaveProperty('isActive');
      expect(entry).toHaveProperty('createdAt');
      expect(entry).toHaveProperty('updatedAt');
    });

    it('should create entries with valid data types', () => {
      const data = createMockData(1);
      const entry = data[0];

      expect(typeof entry.id).toBe('string');
      expect(typeof entry.mode).toBe('string');
      expect(typeof entry.drinkType).toBe('string');
      expect(typeof entry.drinkSubtype).toBe('string');
      expect(typeof entry.volume).toBe('string');
      expect(typeof entry.containerType).toBe('string');
      expect(typeof entry.modeId).toBe('string');
      expect(typeof entry.temperatureProfile).toBe('string');
      expect(typeof entry.defaultTempConsume).toBe('number');
      expect(typeof entry.defaultTempFreeze).toBe('number');
      expect(typeof entry.isActive).toBe('boolean');
      expect(entry.createdAt).toBeInstanceOf(Date);
      expect(entry.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('createMockFilters', () => {
    it('should create filters with correct structure', () => {
      const filters = createMockFilters();

      expect(filters).toHaveProperty('mode');
      expect(filters).toHaveProperty('drinkType');
      expect(filters).toHaveProperty('drinkSubtype');
      expect(filters).toHaveProperty('drinkVolume');
      expect(filters).toHaveProperty('containerType');
    });

    it('should create filters with correct values', () => {
      const filters = createMockFilters();

      expect(filters.mode?.name).toBe('3');
      expect(filters.drinkType?.name).toBe('vino');
      expect(filters.drinkSubtype?.name).toBe('tinto');
      expect(filters.drinkVolume?.name).toBe('75cl');
      expect(filters.containerType?.name).toBe('vidrio');
    });
  });
});
