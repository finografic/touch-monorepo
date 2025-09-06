/**
 * Color System Tests
 * Tests the enhanced color palette with shade + transparency combinations
 */

import { describe, test, expect } from 'vitest';
import { colors } from '../colors.styles';

describe('Enhanced Color System', () => {
  describe('Base Colors', () => {
    test('should have base color CSS variables', () => {
      expect(colors.primary).toBe('var(--color-primary)');
      expect(colors.secondary).toBe('var(--color-secondary)');
      expect(colors.danger).toBe('var(--color-danger)');
      expect(colors.success).toBe('var(--color-success)');
      expect(colors.warning).toBe('var(--color-warning)');
      expect(colors.info).toBe('var(--color-info)');
    });

    test('should have fixed colors as hex values', () => {
      expect(colors.white).toBe('#ffffff');
      expect(colors.black).toBe('#000000');
      expect(colors.transparent).toBe('transparent');
    });
  });

  describe('Shade Variants', () => {
    test('should have light shade variants', () => {
      expect(colors.primaryLight).toBe('var(--color-primary-light)');
      expect(colors.primaryXLight).toBe('var(--color-primary-xlight)');
      expect(colors.primaryXXLight).toBe('var(--color-primary-xxlight)');
    });

    test('should have dark shade variants', () => {
      expect(colors.primaryDark).toBe('var(--color-primary-dark)');
      expect(colors.primaryXDark).toBe('var(--color-primary-xdark)');
      expect(colors.primaryXXDark).toBe('var(--color-primary-xxdark)');
    });

    test('should work with all base colors', () => {
      expect(colors.dangerLight).toBe('var(--color-danger-light)');
      expect(colors.successDark).toBe('var(--color-success-dark)');
      expect(colors.infoXLight).toBe('var(--color-info-xlight)');
    });
  });

  describe('Transparency Variants', () => {
    test('should have golden ratio thirds (33%, 66%)', () => {
      expect(colors.primary33).toBe('var(--color-primary-33)');
      expect(colors.primary66).toBe('var(--color-primary-66)');
      expect(colors.danger33).toBe('var(--color-danger-33)');
      expect(colors.danger66).toBe('var(--color-danger-66)');
    });

    test('should have extreme values (5%, 95%)', () => {
      expect(colors.primary5).toBe('var(--color-primary-5)');
      expect(colors.primary95).toBe('var(--color-primary-95)');
      expect(colors.success5).toBe('var(--color-success-5)');
      expect(colors.success95).toBe('var(--color-success-95)');
    });

    test('should have quarter values (25%, 50%, 75%)', () => {
      expect(colors.primary25).toBe('var(--color-primary-25)');
      expect(colors.primary50).toBe('var(--color-primary-50)');
      expect(colors.primary75).toBe('var(--color-primary-75)');
    });

    test('should have standard increments (10%, 20%, etc.)', () => {
      expect(colors.primary10).toBe('var(--color-primary-10)');
      expect(colors.primary20).toBe('var(--color-primary-20)');
      expect(colors.primary30).toBe('var(--color-primary-30)');
      expect(colors.primary40).toBe('var(--color-primary-40)');
      expect(colors.primary60).toBe('var(--color-primary-60)');
      expect(colors.primary70).toBe('var(--color-primary-70)');
      expect(colors.primary80).toBe('var(--color-primary-80)');
      expect(colors.primary90).toBe('var(--color-primary-90)');
    });
  });

  describe('Combined Shade + Transparency Variants', () => {
    test('should combine light shades with transparency', () => {
      expect(colors.primaryLight33).toBe('var(--color-primary-light-33)');
      expect(colors.primaryXLight25).toBe('var(--color-primary-xlight-25)');
      expect(colors.primaryXXLight66).toBe('var(--color-primary-xxlight-66)');
    });

    test('should combine dark shades with transparency', () => {
      expect(colors.primaryDark33).toBe('var(--color-primary-dark-33)');
      expect(colors.primaryXDark25).toBe('var(--color-primary-xdark-25)');
      expect(colors.primaryXXDark66).toBe('var(--color-primary-xxdark-66)');
    });

    test('should work with all color combinations', () => {
      expect(colors.dangerLight50).toBe('var(--color-danger-light-50)');
      expect(colors.successDark75).toBe('var(--color-success-dark-75)');
      expect(colors.infoXLight33).toBe('var(--color-info-xlight-33)');
      expect(colors.warningXXDark95).toBe('var(--color-warning-xxdark-95)');
    });

    test('should support golden ratio in combined variants', () => {
      expect(colors.primaryLight33).toBe('var(--color-primary-light-33)');
      expect(colors.dangerDark66).toBe('var(--color-danger-dark-66)');
    });
  });

  describe('Color System Properties', () => {
    test('should maintain camelCase property names', () => {
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

    test('should generate kebab-case CSS variable names', () => {
      // All CSS variables should use kebab-case
      expect(colors.primaryLight).toContain('--color-primary-light');
      expect(colors.primaryXLight).toContain('--color-primary-xlight');
      expect(colors.primaryXXLight).toContain('--color-primary-xxlight');
      expect(colors.primaryLight33).toContain('--color-primary-light-33');
    });
  });

  describe('Real-World Usage', () => {
    test('should support common design patterns', () => {
      // Subtle overlays
      expect(colors.primary5).toBe('var(--color-primary-5)');
      expect(colors.greyLight20).toBe('var(--color-grey-light-20)');

      // Drop shadows
      expect(colors.greyDark40).toBe('var(--color-grey-dark-40)');

      // Bold accents with transparency
      expect(colors.dangerDark80).toBe('var(--color-danger-dark-80)');

      // Golden ratio elegance
      expect(colors.infoLight33).toBe('var(--color-info-light-33)');
      expect(colors.successXLight66).toBe('var(--color-success-xlight-66)');
    });

    test('should replace hex suffix patterns', () => {
      // These new patterns should replace old hex suffixes like:
      // ${colors.info}11 → ${colors.info10} or ${colors.info5}
      // ${colors.primary}33 → ${colors.primary33}
      // ${colors.danger}80 → ${colors.danger80}

      expect(colors.info10).toBe('var(--color-info-10)');
      expect(colors.primary33).toBe('var(--color-primary-33)');
      expect(colors.danger80).toBe('var(--color-danger-80)');
    });
  });
});
