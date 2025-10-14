/**
 * JavaScript-specific constants for color system
 * These constants are used for JS object generation and manipulation
 */

/**
 * Variance factor for generating shade variants
 * Controls the intensity of color variations
 * - 0.5 = subtle variations
 * - 0.8 = balanced variations (default)
 * - 1.0 = maximum variations
 */
export const SHADE_VARIANCE_FACTOR = 0.75;

/**
 * Saturation factor for color variants
 * Controls the saturation level of color variations
 * Optimized for OKLCH color space to avoid muddy colors
 *
 * - 0.7 = very desaturated (minimal use)
 * - 0.9 = professional look (clean, slightly desaturated)
 * - 1.0 = no saturation change
 * - 1.1 = enhanced saturation (vibrant but professional)
 * - 1.2 = high saturation (for emphasis)
 */
export const SATURATION_FACTOR = 0.8; // Optimized for OKLCH

/**
 * Saturation factor specifically for status colors (success, warning, danger, info)
 * Higher saturation for better visibility on touch screens
 *
 * - 1.0 = no saturation change
 * - 1.2 = vibrant (good for status indicators)
 * - 1.4 = high impact (maximum recommended)
 * - 1.6 = ultra vibrant (use with caution)
 */
export const STATUS_SATURATION_FACTOR = 1.5; // Maximum vibrancy - will be balanced with transparency in components
