/**
 * 🎨 Palette Generators — Public API
 *
 * Generates 11-stop OKLCH shade ramps (50–950) compatible with Panda CSS token system.
 *
 * @example
 * ```ts
 * import { generatePalette, generateAllPalettes } from './palette/generators';
 * import { SEMANTIC_BASES } from './palette/bases';
 *
 * // Single palette
 * const primary = generatePalette(SEMANTIC_BASES.primary.value);
 *
 * // All palettes, shaped for Panda CSS config
 * const colors = generateAllPalettes(SEMANTIC_BASES);
 * ```
 */

import { clamp, formatOklch, parseOklch } from './oklch.utils';
import type { PandaToken, SemanticBase, ShadePalette, ShadeStop } from './palette.types';
import { SHADE_STOPS } from './palette.types';
import { buildLightnessRamp, chromaMultiplier, hueShift } from './shades';

/**
 * Generate a full 11-stop Panda CSS compatible shade palette
 * from a single OKLCH base color string.
 *
 * @param base - OKLCH color string, e.g. `'oklch(48.8% 0.243 264.376)'`
 * @returns Record mapping shade stops (50–950) to OKLCH color strings
 */
export function generatePalette(base: string): ShadePalette {
  const { l: baseL, c: baseC, h: baseH } = parseOklch(base);
  const lightnessRamp = buildLightnessRamp(baseL);

  const palette = {} as ShadePalette;

  for (const shade of SHADE_STOPS) {
    const l = lightnessRamp[shade];
    const c = baseC * chromaMultiplier(shade);
    const h = hueShift(shade, baseH);

    palette[shade] = formatOklch({ l: clamp(l, 0, 1), c: Math.max(0, c), h });
  }

  return palette;
}

/**
 * Generate multiple palettes from a semantic color config.
 * Output is shaped for direct use in a Panda CSS theme config:
 *
 * ```ts
 * // panda.config.ts
 * import { generateAllPalettes } from './palette/generators';
 * import { SEMANTIC_BASES } from './palette/bases';
 *
 * export default defineConfig({
 *   theme: {
 *     tokens: {
 *       colors: {
 *         ...generateAllPalettes(SEMANTIC_BASES),
 *         white: { value: 'oklch(100% 0 0)' },
 *         black: { value: 'oklch(0% 0 0)' },
 *       },
 *     },
 *   },
 * });
 *
 * // In styles:
 * css({ bg: 'primary.base' })     // base primary
 * css({ bg: 'primary.xxlight' })  // light tint
 * css({ bg: 'danger.darker' })    // dark danger
 * ```
 */
export function generateAllPalettes(
  bases: Record<string, SemanticBase>,
): Record<string, Record<ShadeStop, PandaToken>> {
  const result: Record<string, Record<ShadeStop, PandaToken>> = {};

  for (const [name, { value }] of Object.entries(bases)) {
    const palette = generatePalette(value);
    const tokenized = {} as Record<ShadeStop, PandaToken>;
    for (const shade of SHADE_STOPS) {
      tokenized[shade] = { value: palette[shade] };
    }
    result[name] = tokenized;
  }

  return result;
}
