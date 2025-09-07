import type { ColorPalette } from '../palette.types';

/**
 * Light theme color palette - actual hex values for CSS variable generation
 * These colors are used to generate the CSS variables that the main colors object references
 */
export const lightColors: ColorPalette = {
  // Base colors - darker for high contrast on light backgrounds
  primary: '#1e3a8a', // Blue-900 - much darker blue for high contrast
  primaryXXLight: '#c5dce3',
  primaryXLight: '#abccd6',
  primaryLight: '#92bcc9',
  primaryDark: '#406b78',
  primaryXDark: '#31525c',
  primaryXXDark: '#22393f',
  
  secondary: '#047857', // Emerald-700 - deeper green for better contrast
  secondaryXXLight: '#cdece8',
  secondaryXLight: '#b7e3de',
  secondaryLight: '#a0dbd3',
  secondaryDark: '#4f8982',
  secondaryXDark: '#3c6963',
  secondaryXXDark: '#2a4945',
  
  default: '#111827', // Gray-900 - very dark for maximum contrast
  defaultXXLight: '#c3c5c5',
  defaultXLight: '#a9acac',
  defaultLight: '#8e9292',
  defaultDark: '#3d4141',
  defaultXDark: '#2e3131',
  defaultXXDark: '#202222',
  
  success: '#065f46', // Emerald-800 - much deeper success green
  successXXLight: '#a3ffa3',
  successXLight: '#7aff7a',
  successLight: '#52ff52',
  successDark: '#00ad00',
  successXDark: '#008500',
  successXXDark: '#005c00',
  
  warning: '#92400e', // Amber-800 - darker warning for better visibility
  warningXXLight: '#ffe0a3',
  warningXLight: '#ffd37a',
  warningLight: '#ffc552',
  warningDark: '#ad7400',
  warningXDark: '#855800',
  warningXXDark: '#5c3d00',
  
  danger: '#991b1b', // Red-800 - deeper danger red
  dangerXXLight: '#ffbcbc',
  dangerXLight: '#ff9e9e',
  dangerLight: '#ff8080',
  dangerDark: '#ad2e2e',
  dangerXDark: '#852323',
  dangerXXDark: '#5c1818',
  
  info: '#1e40af', // Blue-800 - darker info blue
  infoXXLight: '#a3e8ff',
  infoXLight: '#7adeff',
  infoLight: '#52d3ff',
  infoDark: '#0082ad',
  infoXDark: '#006385',
  infoXXDark: '#00455c',
  
  text: '#000000', // Pure black for maximum readability
  textXXLight: '#c8c8c8',
  textXLight: '#afafaf',
  textLight: '#979797',
  textDark: '#454545',
  textXDark: '#353535',
  textXXDark: '#252525',
  
  grey: '#1f2937', // Gray-800 - much darker gray
  greyXXLight: '#dadada',
  greyXLight: '#cacaca',
  greyLight: '#bababa',
  greyDark: '#686868',
  greyXDark: '#505050',
  greyXXDark: '#373737',
  
  gray: '#1f2937', // Gray-800 - much darker gray
  grayXXLight: '#dadada',
  grayXLight: '#cacaca',
  grayLight: '#bababa',
  grayDark: '#686868',
  grayXDark: '#505050',
  grayXXDark: '#373737',
  
  transparent: 'transparent',

  // Fixed colors
  white: '#ffffff',
  black: '#000000',
  background: '#fefefe', // Pure white with subtle warmth
} as any; // Cast to avoid complex type checking for now
