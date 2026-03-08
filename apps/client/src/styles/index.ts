// Active barrel exports — only what is actually consumed via `import { x } from 'styles'`
//
// NOTE: colors here are OKLCH direct values (not CSS vars) — used by remaining Emotion consumers.
// Migrate consumers to `@workspace/design-system/tokens` then remove this.
export { colors } from './colors/colors-direct';

// Type used by Button.types.ts — migrate to DS types when available.
export type { ColorBaseName } from './colors/colors.types';
