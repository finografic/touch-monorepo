import { describe, expect, it } from 'vitest';
import {
  FILTER_STEP_ORDER,
  getFiltersToClearAhead,
  getNextStepFilterKey,
  getPrevStepFilterKey,
  getStepIndexByFilterKey,
} from '../filters-flow.utils';
import type { FilterKey } from 'types/orders.types';

describe('filters-flow.utils', () => {
  describe('FILTER_STEP_ORDER', () => {
    it('should have the correct filter step order', () => {
      expect(FILTER_STEP_ORDER).toEqual([
        'drinkType',
        'drinkSubtype',
        'drinkVolume',
        'containerType',
        'temperature',
      ]);
    });

    it('should have 5 filter steps', () => {
      expect(FILTER_STEP_ORDER).toHaveLength(5);
    });
  });

  describe('getStepIndexByFilterKey', () => {
    it('should return correct index for each filter step', () => {
      expect(getStepIndexByFilterKey('drinkType')).toBe(0);
      expect(getStepIndexByFilterKey('drinkSubtype')).toBe(1);
      expect(getStepIndexByFilterKey('drinkVolume')).toBe(2);
      expect(getStepIndexByFilterKey('containerType')).toBe(3);
      expect(getStepIndexByFilterKey('temperature')).toBe(4);
    });

    it('should return -1 for invalid filter keys', () => {
      expect(getStepIndexByFilterKey('invalidKey' as FilterKey)).toBe(-1);
      expect(getStepIndexByFilterKey('mode' as FilterKey)).toBe(-1);
    });
  });

  describe('getFiltersToClearAhead', () => {
    it('should clear all subsequent filters when changing drinkType', () => {
      const result = getFiltersToClearAhead({ filterKey: 'drinkType' });
      expect(result).toEqual(['drinkSubtype', 'drinkVolume', 'containerType', 'temperature']);
    });

    it('should clear all subsequent filters when changing drinkSubtype', () => {
      const result = getFiltersToClearAhead({ filterKey: 'drinkSubtype' });
      expect(result).toEqual(['drinkVolume', 'containerType', 'temperature']);
    });

    it('should clear all subsequent filters when changing drinkVolume', () => {
      const result = getFiltersToClearAhead({ filterKey: 'drinkVolume' });
      expect(result).toEqual(['containerType', 'temperature']);
    });

    it('should clear only temperature when changing containerType', () => {
      const result = getFiltersToClearAhead({ filterKey: 'containerType' });
      expect(result).toEqual(['temperature']);
    });

    it('should clear nothing when changing temperature (last step)', () => {
      const result = getFiltersToClearAhead({ filterKey: 'temperature' });
      expect(result).toEqual([]);
    });

    it('should return empty array for invalid filter keys', () => {
      expect(getFiltersToClearAhead({ filterKey: 'invalidKey' as FilterKey })).toEqual([]);
      expect(getFiltersToClearAhead({ filterKey: 'mode' as FilterKey })).toEqual([]);
    });

    it('should handle edge cases correctly', () => {
      // Test with empty string
      expect(getFiltersToClearAhead({ filterKey: '' as FilterKey })).toEqual([]);

      // Test with undefined (if somehow passed)
      expect(getFiltersToClearAhead({ filterKey: undefined as any })).toEqual([]);
    });
  });

  describe('Integration scenarios', () => {
    it('should handle the complete flow clearing scenario', () => {
      // Scenario: User changes from "Vino" to "Agua" (drinkType change)
      const clearedFilters = getFiltersToClearAhead({ filterKey: 'drinkType' });
      expect(clearedFilters).toEqual(['drinkSubtype', 'drinkVolume', 'containerType', 'temperature']);

      // After clearing, only mode and drinkType should remain
      const remainingFilters = FILTER_STEP_ORDER.filter((filter) => !clearedFilters.includes(filter));
      expect(remainingFilters).toEqual(['drinkType']);
    });

    it('should handle volume change scenario (75cl to 1.25L)', () => {
      // Scenario: User changes from "75cl" to "1.25L" (drinkVolume change)
      const clearedFilters = getFiltersToClearAhead({ filterKey: 'drinkVolume' });
      expect(clearedFilters).toEqual(['containerType', 'temperature']);

      // After clearing, mode, drinkType, drinkSubtype, drinkVolume should remain
      const remainingFilters = FILTER_STEP_ORDER.filter((filter) => !clearedFilters.includes(filter));
      expect(remainingFilters).toEqual(['drinkType', 'drinkSubtype', 'drinkVolume']);
    });

    it('should handle container type change scenario', () => {
      // Scenario: User changes from "Vidrio" to "Plástico" (containerType change)
      const clearedFilters = getFiltersToClearAhead({ filterKey: 'containerType' });
      expect(clearedFilters).toEqual(['temperature']);

      // After clearing, all filters except temperature should remain
      const remainingFilters = FILTER_STEP_ORDER.filter((filter) => !clearedFilters.includes(filter));
      expect(remainingFilters).toEqual(['drinkType', 'drinkSubtype', 'drinkVolume', 'containerType']);
    });
  });

  describe('getNextStepFilterKey', () => {
    it('should return next filter key for valid steps', () => {
      expect(getNextStepFilterKey({ filterKey: 'drinkType' })).toBe('drinkSubtype');
      expect(getNextStepFilterKey({ filterKey: 'drinkSubtype' })).toBe('drinkVolume');
      expect(getNextStepFilterKey({ filterKey: 'drinkVolume' })).toBe('containerType');
      expect(getNextStepFilterKey({ filterKey: 'containerType' })).toBe('temperature');
    });

    it('should return undefined for last step', () => {
      expect(getNextStepFilterKey({ filterKey: 'temperature' })).toBeUndefined();
    });

    it('should return undefined for invalid filter keys', () => {
      expect(getNextStepFilterKey({ filterKey: 'invalidKey' as FilterKey })).toBeUndefined();
      expect(getNextStepFilterKey({ filterKey: 'mode' as FilterKey })).toBeUndefined();
    });
  });

  describe('getPrevStepFilterKey', () => {
    it('should return previous filter key for valid steps', () => {
      expect(getPrevStepFilterKey({ filterKey: 'drinkSubtype' })).toBe('drinkType');
      expect(getPrevStepFilterKey({ filterKey: 'drinkVolume' })).toBe('drinkSubtype');
      expect(getPrevStepFilterKey({ filterKey: 'containerType' })).toBe('drinkVolume');
      expect(getPrevStepFilterKey({ filterKey: 'temperature' })).toBe('containerType');
    });

    it('should return undefined for first step', () => {
      expect(getPrevStepFilterKey({ filterKey: 'drinkType' })).toBeUndefined();
    });

    it('should return undefined for invalid filter keys', () => {
      expect(getPrevStepFilterKey({ filterKey: 'invalidKey' as FilterKey })).toBeUndefined();
      expect(getPrevStepFilterKey({ filterKey: 'mode' as FilterKey })).toBeUndefined();
    });
  });

  describe('Performance and edge cases', () => {
    it('should handle large filter arrays efficiently', () => {
      // Test that the function works correctly with the current filter order
      const startTime = performance.now();

      // Run the function multiple times
      for (let i = 0; i < 1000; i++) {
        getFiltersToClearAhead({ filterKey: 'drinkVolume' });
      }

      const endTime = performance.now();
      const executionTime = endTime - startTime;

      // Should complete in reasonable time (less than 100ms for 1000 iterations)
      expect(executionTime).toBeLessThan(100);
    });

    it('should maintain consistency across multiple calls', () => {
      // Test that the function returns consistent results
      const result1 = getFiltersToClearAhead({ filterKey: 'drinkType' });
      const result2 = getFiltersToClearAhead({ filterKey: 'drinkType' });
      const result3 = getFiltersToClearAhead({ filterKey: 'drinkType' });

      expect(result1).toEqual(result2);
      expect(result2).toEqual(result3);
      expect(result1).toEqual(['drinkSubtype', 'drinkVolume', 'containerType', 'temperature']);
    });
  });
});
