/**
 * Emotion Theme Types
 * Defines the structure for light/dark theme objects used with Emotion's ThemeProvider
 */

import type { ColorPalette } from '../colors/palette.types';

export type ThemeMode = 'light' | 'dark';

export interface EmotionTheme {
  colors: ColorPalette;
  name: ThemeMode;
}

// Extend Emotion's theme types
declare module '@emotion/react' {
  export interface Theme extends EmotionTheme {}
}
