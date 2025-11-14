/**
 * useColors Hook - Zero-migration theme switching
 *
 * This hook provides the same `colors` object you're used to,
 * but it automatically switches between light and dark themes!
 *
 * Usage (EXACTLY like before):
 * ```tsx
 * import { useColors } from 'styles/hooks/useColors';
 *
 * const Component = () => {
 *   const colors = useColors();
 *
 *   return (
 *     <div css={css`
 *       color: ${colors.primary};           // Same as before!
 *       background: ${colors.primaryLight}; // Same as before!
 *     `}>
 *       Content
 *     </div>
 *   );
 * };
 * ```
 */

import { useTheme } from '@emotion/react';

import type { ColorPalette } from '../colors/palette.types';

/**
 * Hook that returns the current theme's colors
 * Automatically switches between light and dark based on theme context
 */
export function useColors(): ColorPalette {
  const theme = useTheme();
  return theme.colors;
}

/**
 * Hook that returns the current theme name
 */
export function useThemeName(): 'light' | 'dark' {
  const theme = useTheme();
  return theme.name;
}
