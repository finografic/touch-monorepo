/**
 * Converts camelCase to kebab-case for CSS variable names
 * Examples:
 * - 'infoDark' → 'info-dark'
 * - 'primaryXXLight' → 'primary-xxlight'
 * - 'success' → 'success'
 */
export const camelToKebab = (str: string): string => {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
};

/**
 * Generates CSS variable name from color name
 * Examples:
 * - 'infoDark' → '--color-info-dark'
 * - 'primaryXXLight' → '--color-primary-xxlight'
 */
export const colorToCssVar = (colorName: string): string => {
  return `--color-${camelToKebab(colorName)}`;
};

/**
 * Generates CSS variable reference for use in styles
 * Examples:
 * - 'infoDark' → 'var(--color-info-dark)'
 * - 'primaryXXLight' → 'var(--color-primary-xxlight)'
 */
export const colorToCssVarRef = (colorName: string): string => {
  return `var(${colorToCssVar(colorName)})`;
};
