/**
 * Border radius tokens for Panda CSS.
 * Keys: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
 * Used in recipes as: borderRadius: 'md', rounded: 'full'
 *
 * @example
 * // In recipe: borderRadius: 'md' → border-radius: 0.5rem (8px)
 * // In recipe: rounded: 'full' → border-radius: 9999px (pill shape)
 */
import { defineTokens } from '@pandacss/dev';

export const radiiTokens = defineTokens.radii({
  'none': { value: '0' },
  'xs':   { value: '0.25rem' },
  'sm':   { value: '0.33rem' },
  'md':   { value: '0.5rem' },
  'lg':   { value: '0.66rem' },
  'xl':   { value: '1rem' },
  '2xl':  { value: '1.25rem' },
  'full': { value: '9999px' },
});

/**
 * Border width tokens for Panda CSS.
 * Keys: 'none' | 'light' | 'default' | 'heavy'
 * Used in recipes as: borderWidth: 'default', borderWidth: 'light'
 *
 * @example
 * // In recipe: borderWidth: 'default' → border-width: 2px
 * // In recipe: borderWidth: 'light' → border-width: 1px
 */
export const borderWidthTokens = defineTokens.borderWidths({
  none:    { value: '0' },
  light:   { value: '1px' },
  default: { value: '2px' },
  heavy:   { value: '4px' },
});

/**
 * Box shadow tokens for Panda CSS.
 * Keys: 'base.sm' | 'base.md' | 'base.lg'
 * Used in recipes as: boxShadow: 'md', shadow: 'sm'
 *
 * Note: Semantic shadow tokens (with light/dark variants) are defined
 * in panda.preset.ts under semanticTokens.shadows.
 *
 * @example
 * // In recipe: boxShadow: 'md' → box-shadow: <elevation shadow>
 */
export const shadowTokens = defineTokens.shadows({
  base: {
    sm: { value: '0 1px 2px 0 rgba(16, 24, 40, 0.05)' },
    md: { value: '0 4px 8px -2px rgba(16, 24, 40, 0.18), 0 1.5px 4px rgba(16, 24, 40, 0.14)' },
    lg: { value: '0 8px 24px rgba(16, 24, 40, 0.18), 0 1.5px 4px rgba(16, 24, 40, 0.08)' },
  },
});
