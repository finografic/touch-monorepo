import type { ColorPalette } from '../palette.types';

/**
 * Light theme color palette - actual hex values for CSS variable generation
 * These colors are used to generate the CSS variables that the main colors object references
 */
export const lightColors: ColorPalette = {
  // Base colors - darker for high contrast on light backgrounds
  primary: '#1e3a8a', // Blue-900 - much darker blue for high contrast
  secondary: '#047857', // Emerald-700 - deeper green for better contrast
  default: '#111827', // Gray-900 - very dark for maximum contrast
  success: '#065f46', // Emerald-800 - much deeper success green
  warning: '#92400e', // Amber-800 - darker warning for better visibility
  danger: '#991b1b', // Red-800 - deeper danger red
  info: '#1e40af', // Blue-800 - darker info blue
  text: '#000000', // Pure black for maximum readability
  grey: '#1f2937', // Gray-800 - much darker gray
  gray: '#1f2937', // Gray-800 - much darker gray
  transparent: 'transparent',

  // Fixed colors
  white: '#ffffff',
  black: '#000000',
  background: '#fefefe', // Pure white with subtle warmth
} as any; // Cast to avoid complex type checking for now
