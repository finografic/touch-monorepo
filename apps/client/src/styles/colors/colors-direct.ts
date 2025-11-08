/**
 * Direct color export - uses OKLCH color space for better perceptual uniformity
 * This version eliminates CSS variable overhead for better performance
 *
 * 🎨 OKLCH Benefits:
 * - Perceptually uniform colors (equal distance = equal perceived difference)
 * - Smoother gradients and transitions
 * - Better color mixing and transparency
 * - Wider color gamut support (P3 displays)
 *
 * For use in Emotion-styled components with theme support:
 *
 * ```tsx
 * import { css } from '@emotion/react';
 *
 * const styles = css`
 *   color: ${({ theme }) => theme.colors.primary};
 *   background: ${({ theme }) => theme.colors.primaryLight};
 * `;
 * ```
 *
 * Or use the exported colors directly (light theme by default):
 *
 * ```tsx
 * import { colors } from 'styles/colors/colors-direct';
 *
 * const styles = css`
 *   color: ${colors.primary}; // OKLCH color!
 * `;
 * ```
 */

import { oklchLightTheme } from '../themes/generate-oklch-themes';

/**
 * Direct colors export - uses OKLCH light theme by default
 * For theme-aware styling, use theme.colors instead
 */
export const colors = oklchLightTheme.colors;

// Re-export OKLCH theme objects for direct access
export { oklchLightTheme as lightTheme, oklchDarkTheme as darkTheme, oklchThemes as themes } from '../themes/generate-oklch-themes';

