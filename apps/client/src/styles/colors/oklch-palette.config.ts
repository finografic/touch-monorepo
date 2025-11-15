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
import { chromaShift, contrast } from './oklch-palette.types';

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
      // contrast: contrast(5), // Medium contrast
      contrast: contrast(6.9), // increase: wider gradient spread
      chromaShift: chromaShift(1.0), // Moderate saturation changes
      // chromaShift: chromaShift(0.8), // Moderate saturation changes
    },

    // Status colors: High visibility for UI feedback
    status: {
      // contrast: contrast(6), // Higher contrast for clarity
      contrast: contrast(6.5), // ~10% increase: wider gradient spread
      chromaShift: chromaShift(1), // More vibrant in shades
      // chromaShift: chromaShift(1.0), // More vibrant in shades
    },

    // Grey colors: Subtle transitions
    grey: {
      // contrast: contrast(4), // Subtle differences
      contrast: contrast(6.9), // Subtle differences
      chromaShift: chromaShift(0.3), // Minimal saturation changes
      // chromaShift: chromaShift(0.2), // Minimal saturation changes
    },

    // Text colors: High contrast for readability
    text: {
      // contrast: contrast(8), // Strong contrast between variants
      chromaShift: chromaShift(4), // Keep neutral (low saturation)
      contrast: contrast(5), // Moderate contrast (prevent collapsing to black)
      // chromaShift: chromaShift(0.1), // Keep neutral (low saturation)
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // DARK THEME
  // ─────────────────────────────────────────────────────────────────────────
  dark: {
    // Theme colors: Slightly higher contrast in dark mode
    theme: {
      contrast: contrast(5.5), // Slightly higher than light
      chromaShift: chromaShift(1.1), // Slightly more vibrant
      // chromaShift: chromaShift(0.9), // Slightly more vibrant
    },

    // Status colors: High visibility maintained
    status: {
      contrast: contrast(6.5), // Higher contrast for dark backgrounds
      // contrast: contrast(7.2), // ~10% increase: wider gradient spread
      chromaShift: chromaShift(1.3), // More saturation shift
      // chromaShift: chromaShift(1.1), // More saturation shift
    },

    // Grey colors: Subtle but visible
    grey: {
      contrast: contrast(4.5), // Slightly more contrast than light
      chromaShift: chromaShift(0.4), // Minimal saturation
      // chromaShift: chromaShift(0.3), // Minimal saturation
    },

    // Text colors: High contrast for dark mode readability
    text: {
      // contrast: contrast(8.5), // Very high contrast
      contrast: contrast(5), // Moderate contrast (prevent collapsing to black)
      // chromaShift: chromaShift(0.2), // Stay neutral
      chromaShift: chromaShift(0.1), // Stay neutral
    },
  },
};
