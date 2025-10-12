import { describe, expect, it } from 'vitest';
import { getFilterStepIndex, getFiltersToClearAhead, FILTER_STEP_ORDER } from '../filters-flow.utils';
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

  describe('getFilterStepIndex', () => {
    it('should return correct index for each filter step', () => {
      expect(getFilterStepIndex('drinkType')).toBe(0);
      expect(getFilterStepIndex('drinkSubtype')).toBe(1);
      expect(getFilterStepIndex('drinkVolume')).toBe(2);
      expect(getFilterStepIndex('containerType')).toBe(3);
      expect(getFilterStepIndex('temperature')).toBe(4);
    });

    it('should return -1 for invalid filter keys', () => {
      expect(getFilterStepIndex('invalidKey' as FilterKey)).toBe(-1);
      expect(getFilterStepIndex('mode' as FilterKey)).toBe(-1);
    });
  });

  describe('getFiltersToClearAhead', () => {
    it('should clear all subsequent filters when changing drinkType', () => {
      const result = getFiltersToClearAhead('drinkType');
      expect(result).toEqual(['drinkSubtype', 'drinkVolume', 'containerType', 'temperature']);
    });

    it('should clear all subsequent filters when changing drinkSubtype', () => {
      const result = getFiltersToClearAhead('drinkSubtype');
      expect(result).toEqual(['drinkVolume', 'containerType', 'temperature']);
    });

    it('should clear all subsequent filters when changing drinkVolume', () => {
      const result = getFiltersToClearAhead('drinkVolume');
      expect(result).toEqual(['containerType', 'temperature']);
    });

    it('should clear only temperature when changing containerType', () => {
      const result = getFiltersToClearAhead('containerType');
      expect(result).toEqual(['temperature']);
    });

    it('should clear nothing when changing temperature (last step)', () => {
      const result = getFiltersToClearAhead('temperature');
      expect(result).toEqual([]);
    });

    it('should return empty array for invalid filter keys', () => {
      expect(getFiltersToClearAhead('invalidKey' as FilterKey)).toEqual([]);
      expect(getFiltersToClearAhead('mode' as FilterKey)).toEqual([]);
    });

    it('should handle edge cases correctly', () => {
      // Test with empty string
      expect(getFiltersToClearAhead('' as FilterKey)).toEqual([]);
      
      // Test with undefined (if somehow passed)
      expect(getFiltersToClearAhead(undefined as any)).toEqual([]);
    });
  });

  describe('Integration scenarios', () => {
    it('should handle the complete flow clearing scenario', () => {
      // Scenario: User changes from "Vino" to "Agua" (drinkType change)
      const clearedFilters = getFiltersToClearAhead('drinkType');
      expect(clearedFilters).toEqual(['drinkSubtype', 'drinkVolume', 'containerType', 'temperature']);
      
      // After clearing, only mode and drinkType should remain
      const remainingFilters = FILTER_STEP_ORDER.filter(
        (filter) => !clearedFilters.includes(filter)
      );
      expect(remainingFilters).toEqual(['drinkType']);
    });

    it('should handle volume change scenario (75cl to 1.25L)', () => {
      // Scenario: User changes from "75cl" to "1.25L" (drinkVolume change)
      const clearedFilters = getFiltersToClearAhead('drinkVolume');
      expect(clearedFilters).toEqual(['containerType', 'temperature']);
      
      // After clearing, mode, drinkType, drinkSubtype, drinkVolume should remain
      const remainingFilters = FILTER_STEP_ORDER.filter(
        (filter) => !clearedFilters.includes(filter)
      );
      expect(remainingFilters).toEqual(['drinkType', 'drinkSubtype', 'drinkVolume']);
    });

    it('should handle container type change scenario', () => {
      // Scenario: User changes from "Vidrio" to "Plástico" (containerType change)
      const clearedFilters = getFiltersToClearAhead('containerType');
      expect(clearedFilters).toEqual(['temperature']);
      
      // After clearing, all filters except temperature should remain
      const remainingFilters = FILTER_STEP_ORDER.filter(
        (filter) => !clearedFilters.includes(filter)
      );
      expect(remainingFilters).toEqual(['drinkType', 'drinkSubtype', 'drinkVolume', 'containerType']);
    });
  });

  describe('Performance and edge cases', () => {
    it('should handle large filter arrays efficiently', () => {
      // Test that the function works correctly with the current filter order
      const startTime = performance.now();
      
      // Run the function multiple times
      for (let i = 0; i < 1000; i++) {
        getFiltersToClearAhead('drinkVolume');
      }
      
      const endTime = performance.now();
      const executionTime = endTime - startTime;
      
      // Should complete in reasonable time (less than 100ms for 1000 iterations)
      expect(executionTime).toBeLessThan(100);
    });

    it('should maintain consistency across multiple calls', () => {
      // Test that the function returns consistent results
      const result1 = getFiltersToClearAhead('drinkType');
      const result2 = getFiltersToClearAhead('drinkType');
      const result3 = getFiltersToClearAhead('drinkType');
      
      expect(result1).toEqual(result2);
      expect(result2).toEqual(result3);
      expect(result1).toEqual(['drinkSubtype', 'drinkVolume', 'containerType', 'temperature']);
    });
  });
});
