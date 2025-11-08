/**
 * Direct color export - uses actual hex values instead of CSS variables
 * This version eliminates CSS variable overhead for better performance
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
 *   color: ${colors.primary};
 * `;
 * ```
 */

import { lightTheme } from '../themes/generate-emotion-themes';

/**
 * Direct colors export - uses light theme by default
 * For theme-aware styling, use theme.colors instead
 */
export const colors = lightTheme.colors;

// Re-export theme objects for direct access
export { lightTheme, darkTheme, themes } from '../themes/generate-emotion-themes';

