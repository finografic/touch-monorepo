/**
 * 🎨 OKLCH Palette Generator — Panda CSS Compatible
 *
 * Generates 11-stop shade ramps (50–950) from semantic OKLCH base colors,
 * producing perceptually uniform steps optimized for the Panda CSS token system.
 *
 * @example
 * ```ts
 * import { generateAllPalettes, SEMANTIC_BASES } from './palette';
 *
 * // panda.config.ts
 * export default defineConfig({
 *   theme: {
 *     tokens: {
 *       colors: generateAllPalettes(SEMANTIC_BASES),
 *     },
 *   },
 * });
 * ```
 */

// Types
export type { OklchColor, ShadeStop, ShadePalette, PandaToken, SemanticBase } from './palette.types';
export { SHADE_STOPS } from './palette.types';

// OKLCH utilities
export { parseOklch, formatOklch, clamp } from './oklch.utils';

// Shade ramp internals (exported for testing / advanced use)
export { buildLightnessRamp, chromaMultiplier, hueShift } from './shades';

// Generators (primary public API)
export { generatePalette, generateAllPalettes } from './generators';

// Base color definitions
export { SEMANTIC_BASES } from './bases';
