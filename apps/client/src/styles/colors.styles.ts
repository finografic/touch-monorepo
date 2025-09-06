/**
 * Main color export - uses our enhanced CSS variable system
 *
 * The colors object provides:
 * - Base colors: colors.primary, colors.danger, etc.
 * - Shade variants: colors.primaryLight, colors.dangerDark, etc.
 * - Transparency variants: colors.primary33, colors.danger75, etc.
 * - Combined variants: colors.primaryLight25, colors.dangerDark66, etc.
 *
 * All values are CSS variable references (var(--color-name)) for automatic theming
 */
export { colors } from './custom/custom.colors';
