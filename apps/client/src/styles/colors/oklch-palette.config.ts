/**
 * 🎨 OKLCH Palette Configuration
 *
 * ⭐ THIS IS THE FILE YOU EDIT TO CUSTOMIZE COLOR TRANSFORMATIONS ⭐
 *
 * This config controls how shade variants are generated for different color categories.
 *
 * The key insight: Different color types need different contrast levels.
 * - Theme colors (primary/secondary): Moderate contrast
 * - Status colors (success/warning/danger): High visibility
 * - Grey colors: Subtle transitions
 * - Text colors: High contrast for readability
 *
 * Simple Config System:
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * `contrast`: Controls the difference between shades (1-10 scale)
 *   • Low (1-3): Subtle differences between shades
 *   • Medium (4-6): Balanced differences
 *   • High (7-10): Strong differences between shades
 *
 * `chromaShift`: Controls color saturation changes in shades (0-2 scale)
 *   • Low (0-0.5): Keep saturation consistent
 *   • Medium (0.5-1.5): Moderate saturation changes
 *   • High (1.5-2): Strong saturation changes
 *
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import type { OKLCHPaletteConfig } from './oklch-palette.types';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎨 OKLCH PALETTE CONFIGURATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//
// Tuned for:
// • Theme colors: Balanced, vibrant
// • Status colors: High visibility
// • Greys: Subtle, even transitions
// • Text colors: High contrast for readability
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const OKLCH_PALETTE_CONFIG: OKLCHPaletteConfig = {
  // ─────────────────────────────────────────────────────────────────────────
  // LIGHT THEME
  // ─────────────────────────────────────────────────────────────────────────
  light: {
    // Theme colors (primary, secondary): Balanced contrast
    theme: {
      contrast: 5, // Medium contrast
      chromaShift: 1.0, // Moderate saturation changes
    },

    // Status colors: High visibility for UI feedback
    status: {
      contrast: 6, // Higher contrast for clarity
      chromaShift: 1.2, // More vibrant in shades
    },

    // Grey colors: Subtle transitions
    grey: {
      contrast: 4, // Subtle differences
      chromaShift: 0.3, // Minimal saturation changes
    },

    // Text colors: High contrast for readability
    text: {
      contrast: 8, // Strong contrast between variants
      chromaShift: 0.2, // Keep neutral (low saturation)
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // DARK THEME
  // ─────────────────────────────────────────────────────────────────────────
  dark: {
    // Theme colors: Slightly higher contrast in dark mode
    theme: {
      contrast: 5.5, // Slightly higher than light
      chromaShift: 1.1, // Slightly more vibrant
    },

    // Status colors: High visibility maintained
    status: {
      contrast: 6.5, // Higher contrast for dark backgrounds
      chromaShift: 1.3, // More saturation shift
    },

    // Grey colors: Subtle but visible
    grey: {
      contrast: 4.5, // Slightly more contrast than light
      chromaShift: 0.4, // Minimal saturation
    },

    // Text colors: High contrast for dark mode readability
    text: {
      contrast: 8.5, // Very high contrast
      chromaShift: 0.2, // Stay neutral
    },
  },
};
