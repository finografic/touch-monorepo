/// <reference types="vitest" />
/**
 * Color System Tests
 * Tests the enhanced color palette with shade + transparency combinations
 */

import { describe, expect, it } from 'vitest';

import { colors } from 'styles';

describe('enhanced Color System', () => {
  describe('base Colors', () => {
    it('should have fixed colors as hex values', () => {
      expect(colors.white).toBe('#ffffff');
      expect(colors.black).toBe('#000000');
      expect(colors.transparent).toBe('transparent');
    });
  });

  describe('color System Properties', () => {
    it('should maintain camelCase property names', () => {
      // Base colors should be camelCase
      expect(colors).toHaveProperty('primary');
      expect(colors).toHaveProperty('primaryLight');
      expect(colors).toHaveProperty('primaryXLight');

      // Transparency should be numeric suffix
      expect(colors).toHaveProperty('primary33');
      expect(colors).toHaveProperty('primary66');

      // Combined should be camelCase + numeric
      expect(colors).toHaveProperty('primaryLight33');
      expect(colors).toHaveProperty('dangerDark66');
    });
  });
});
