/**
 * Raw color palette for Panda CSS `tokens.colors`.
 *
 * Each color exposes 11 word-named shades plus a `DEFAULT` alias (= base)
 * so `{colors.primary}` resolves without a suffix.
 *
 * All shade values are computed at runtime via CSS color-mix(in oklch, …) —
 * zero build-time cost, perceptually uniform interpolation.
 *
 * Light-side percentages (% of base, remainder white):
 *   xxxlight → 5% | xxlight → 10% | xlight → 20% | lighter → 38% | light → 58%
 *
 * Dark-side percentages (% of base, remainder black):
 *   dark → 82% | darker → 65% | xdark → 47% | xxdark → 30% | xxxdark → 15%
 */
export function buildShadeScale(base: string) {
  return {
    DEFAULT: { value: base },
    xxxlight: { value: `color-mix(in oklch, ${base} 5%, white)` },
    xxlight: { value: `color-mix(in oklch, ${base} 10%, white)` },
    xlight: { value: `color-mix(in oklch, ${base} 20%, white)` },
    lighter: { value: `color-mix(in oklch, ${base} 38%, white)` },
    light: { value: `color-mix(in oklch, ${base} 58%, white)` },
    base: { value: base },
    dark: { value: `color-mix(in oklch, ${base} 82%, black)` },
    darker: { value: `color-mix(in oklch, ${base} 65%, black)` },
    xdark: { value: `color-mix(in oklch, ${base} 47%, black)` },
    xxdark: { value: `color-mix(in oklch, ${base} 30%, black)` },
    xxxdark: { value: `color-mix(in oklch, ${base} 15%, black)` },
  };
}
