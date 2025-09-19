/**
 * Color Utility Tests
 * Tests the helper functions for color system generation
 */

import { describe, test, expect } from 'vitest';
import { camelToKebab, colorToCssVar, colorToCssVarRef } from '../colors/utils/camelToKebab';

describe('Color Utilities', () => {
  describe('camelToKebab', () => {
    test('should convert camelCase to kebab-case', () => {
      expect(camelToKebab('primary')).toBe('primary');
      expect(camelToKebab('primaryLight')).toBe('primary-light');
      expect(camelToKebab('primaryXLight')).toBe('primary-xlight');
      expect(camelToKebab('primaryXXLight')).toBe('primary-xxlight');
    });

    test('should handle complex camelCase', () => {
      expect(camelToKebab('infoDark')).toBe('info-dark');
      expect(camelToKebab('dangerXDark')).toBe('danger-xdark');
      expect(camelToKebab('successXXDark')).toBe('success-xxdark');
    });

    test('should handle numeric suffixes', () => {
      expect(camelToKebab('primary33')).toBe('primary33');
      expect(camelToKebab('primaryLight33')).toBe('primary-light33');
      expect(camelToKebab('dangerXDark25')).toBe('danger-xdark25');
    });
  });

  describe('colorToCssVar', () => {
    test('should generate CSS variable names', () => {
      expect(colorToCssVar('primary')).toBe('--color-primary');
      expect(colorToCssVar('primaryLight')).toBe('--color-primary-light');
      expect(colorToCssVar('infoDark')).toBe('--color-info-dark');
    });

    test('should handle transparency variants', () => {
      expect(colorToCssVar('primary33')).toBe('--color-primary33');
      expect(colorToCssVar('dangerLight25')).toBe('--color-danger-light25');
    });
  });

  describe('colorToCssVarRef', () => {
    test('should generate CSS variable references', () => {
      expect(colorToCssVarRef('primary')).toBe('var(--color-primary)');
      expect(colorToCssVarRef('primaryLight')).toBe('var(--color-primary-light)');
      expect(colorToCssVarRef('infoDark')).toBe('var(--color-info-dark)');
    });

    test('should handle combined variants', () => {
      expect(colorToCssVarRef('primaryLight33')).toBe('var(--color-primary-light33)');
      expect(colorToCssVarRef('dangerXDark25')).toBe('var(--color-danger-xdark25)');
    });
  });

  describe('CSS Variable Format Consistency', () => {
    test('should maintain consistent naming patterns', () => {
      // Base colors
      expect(colorToCssVarRef('primary')).toBe('var(--color-primary)');

      // Shade variants
      expect(colorToCssVarRef('primaryLight')).toBe('var(--color-primary-light)');
      expect(colorToCssVarRef('primaryXLight')).toBe('var(--color-primary-xlight)');

      // Transparency variants
      expect(colorToCssVarRef('primary33')).toBe('var(--color-primary33)');

      // Combined variants
      expect(colorToCssVarRef('primaryLight33')).toBe('var(--color-primary-light33)');
    });

    test('should handle edge cases', () => {
      expect(colorToCssVarRef('')).toBe('var(--color-)');
      expect(colorToCssVarRef('a')).toBe('var(--color-a)');
      expect(colorToCssVarRef('ABC')).toBe('var(--color-abc)');
    });
  });
});
