import type { ColorPalette } from '../palette.types';

/**
 * Dark theme color palette - actual hex values for CSS variable generation
 * These colors are used to generate the CSS variables that the main colors object references
 */
export const darkColors: ColorPalette = {
  // Base colors - lighter for visibility on dark backgrounds
  primary: '#93c5fd', // Blue-300 - lighter for dark theme
  primaryXXLight: '#dbeafe',
  primaryXLight: '#bfdbfe',
  primaryLight: '#a5b4fc',
  primaryDark: '#6366f1',
  primaryXDark: '#4f46e5',
  primaryXXDark: '#4338ca',

  secondary: '#6ee7b7', // Emerald-300 - lighter for dark theme
  secondaryXXLight: '#d1fae5',
  secondaryXLight: '#a7f3d0',
  secondaryLight: '#6ee7b7',
  secondaryDark: '#10b981',
  secondaryXDark: '#059669',
  secondaryXXDark: '#047857',

  default: '#d1d5db', // Gray-300 - lighter for dark theme
  defaultXXLight: '#f9fafb',
  defaultXLight: '#f3f4f6',
  defaultLight: '#e5e7eb',
  defaultDark: '#9ca3af',
  defaultXDark: '#6b7280',
  defaultXXDark: '#4b5563',

  success: '#6ee7b7', // Emerald-300 - lighter for dark theme
  successXXLight: '#d1fae5',
  successXLight: '#a7f3d0',
  successLight: '#6ee7b7',
  successDark: '#10b981',
  successXDark: '#059669',
  successXXDark: '#047857',

  warning: '#fcd34d', // Amber-300 - lighter for dark theme
  warningXXLight: '#fef3c7',
  warningXLight: '#fde68a',
  warningLight: '#fcd34d',
  warningDark: '#f59e0b',
  warningXDark: '#d97706',
  warningXXDark: '#b45309',

  danger: '#fca5a5', // Red-300 - lighter for dark theme
  dangerXXLight: '#fecaca',
  dangerXLight: '#fca5a5',
  dangerLight: '#f87171',
  dangerDark: '#ef4444',
  dangerXDark: '#dc2626',
  dangerXXDark: '#b91c1c',

  info: '#93c5fd', // Blue-300 - lighter for dark theme
  infoXXLight: '#dbeafe',
  infoXLight: '#bfdbfe',
  infoLight: '#a5b4fc',
  infoDark: '#6366f1',
  infoXDark: '#4f46e5',
  infoXXDark: '#4338ca',

  text: '#ffffff', // White - very light for dark theme
  textXXLight: '#f9fafb',
  textXLight: '#f3f4f6',
  textLight: '#e5e7eb',
  textDark: '#9ca3af',
  textXDark: '#6b7280',
  textXXDark: '#4b5563',

  grey: '#d1d5db', // Gray-300 - lighter for dark theme
  greyXXLight: '#f9fafb',
  greyXLight: '#f3f4f6',
  greyLight: '#e5e7eb',
  greyDark: '#9ca3af',
  greyXDark: '#6b7280',
  greyXXDark: '#4b5563',

  gray: '#d1d5db', // Gray-300 - lighter for dark theme
  grayXXLight: '#f9fafb',
  grayXLight: '#f3f4f6',
  grayLight: '#e5e7eb',
  grayDark: '#9ca3af',
  grayXDark: '#6b7280',
  grayXXDark: '#4b5563',

  transparent: 'transparent',

  // Fixed colors
  white: '#ffffff',
  black: '#000000',
  background: '#0f172a', // Darker slate background for better contrast
} as any; // Cast to avoid complex type checking for now
