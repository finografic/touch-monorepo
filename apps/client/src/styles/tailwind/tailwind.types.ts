import twColors from 'tailwindcss/colors';

export type TWColorName = keyof typeof twColors;

// Color names that have shade variants
// export type TWColorName = keyof Omit<TWColorsAll, 'inherit' | 'current' | 'transparent' | 'black' | 'white'>;

// Shade values (x-axis)
export type TWColorShade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;

/**
 * Type-safe CSS variable name template for Tailwind colors
 * Examples:
 * - ColorVariableName<'blue', 'light'> = '--color-blue-light'
 */
export type ColorVariableName<C extends TWColorShade, S extends TWColorShade | ''> = S extends ''
  ? `--color-${C}`
  : `--color-${C}-${S}`;

// Type for a complete color object with shades
export type TWColorWithShades = {
  [shade in TWColorShade]: string;
};
