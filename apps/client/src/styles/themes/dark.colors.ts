import type { ColorPalette } from '../palette.types';

/**
 * Dark theme color palette - actual hex values for CSS variable generation
 * These colors are used to generate the CSS variables that the main colors object references
 */
export const darkColors: ColorPalette = {
  // Base colors - lighter for visibility on dark backgrounds
  primary: '#93c5fd',      // Blue-300 - lighter for dark theme
  secondary: '#6ee7b7',    // Emerald-300 - lighter for dark theme
  default: '#d1d5db',      // Gray-300 - lighter for dark theme
  success: '#6ee7b7',      // Emerald-300 - lighter for dark theme
  warning: '#fcd34d',      // Amber-300 - lighter for dark theme
  danger: '#fca5a5',       // Red-300 - lighter for dark theme
  info: '#93c5fd',         // Blue-300 - lighter for dark theme
  text: '#ffffff',         // White - very light for dark theme
  grey: '#d1d5db',         // Gray-300 - lighter for dark theme
  gray: '#d1d5db',         // Gray-300 - lighter for dark theme
  transparent: 'transparent',
  
  // Fixed colors
  white: '#ffffff',
  black: '#000000',
  background: '#0f172a',   // Darker slate background for better contrast
} as any; // Cast to avoid complex type checking for now
