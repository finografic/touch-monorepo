/**
 * Emotion Theme Types
 * Defines the structure for light/dark theme objects used with Emotion's ThemeProvider
 */

import type { ColorPalette } from '../colors/palette.types';

export interface EmotionTheme {
  colors: ColorPalette;
  name: 'light' | 'dark';
}

// Extend Emotion's theme types
declare module '@emotion/react' {
  export interface Theme extends EmotionTheme {}
}

