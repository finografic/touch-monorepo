/**
 * colors — design-system color palette as CSS custom property references.
 *
 * Drop-in replacement for the legacy `colors` import.
 * Migration: change the import only — nothing else in the file needs to change.
 *
 *   // Before:
 *   import { colors } from 'styles';
 *   // or: import { colors } from 'styles/colors/colors-direct';
 *
 *   // After:
 *   import { colors } from '@workspace/design-system/tokens';
 *
 * Key naming matches v1 exactly: camelCase shades (primaryXLight, infoLight, etc.)
 * Transparency variants (primary25, greyXXLight50, etc.) are intentionally omitted —
 * use the expanded shade scale instead (xxxlight / lighter / darker / xxxdark).
 *
 * Shade map (v1 suffix → design-system token suffix):
 *   (base)  → {name}
 *   Light   → {name}-light
 *   XLight  → {name}-xlight
 *   XXLight → {name}-xxlight
 *   Dark    → {name}-dark
 *   XDark   → {name}-xdark
 *   XXDark  → {name}-xxdark
 *
 * New shades with no v1 equivalent (available here, were not in v1):
 *   XXXLight → {name}-xxxlight   (near-white)
 *   Lighter  → {name}-lighter    (between xlight and light)
 *   Darker   → {name}-darker     (between dark and xdark)
 *   XXXDark  → {name}-xxxdark    (near-black)
 *
 * Notes on v1 name differences:
 *   - v1 `default`    → token `neutral`  (same value, renamed in design-system)
 *   - v1 `text`       → semantic `fg`    (no palette; mapped to fg semantic tokens)
 *   - v1 `background` → semantic `bg`    (no palette; mapped to bg semantic tokens)
 *   - v1 `error`      → `danger`         (same token, different alias)
 */

const v = (token: string): string => `var(--colors-${token})`;

export const colors = {

  // ── Fixed ──────────────────────────────────────────────────────────────────

  white:          v('white'),
  black:          v('black'),
  transparent:    'transparent',

  // ── Primary ────────────────────────────────────────────────────────────────

  primaryXXXLight:v('primary-xxxlight'),
  primaryXXLight: v('primary-xxlight'),
  primaryXLight:  v('primary-xlight'),
  primaryLighter: v('primary-lighter'),
  primaryLight:   v('primary-light'),
  primary:        v('primary'),
  primaryDark:    v('primary-dark'),
  primaryDarker:  v('primary-darker'),
  primaryXDark:   v('primary-xdark'),
  primaryXXDark:  v('primary-xxdark'),
  primaryXXXDark: v('primary-xxxdark'),

  // ── Secondary ──────────────────────────────────────────────────────────────

  secondaryXXXLight:v('secondary-xxxlight'),
  secondaryXXLight: v('secondary-xxlight'),
  secondaryXLight:  v('secondary-xlight'),
  secondaryLighter: v('secondary-lighter'),
  secondaryLight:   v('secondary-light'),
  secondary:        v('secondary'),
  secondaryDark:    v('secondary-dark'),
  secondaryDarker:  v('secondary-darker'),
  secondaryXDark:   v('secondary-xdark'),
  secondaryXXDark:  v('secondary-xxdark'),
  secondaryXXXDark: v('secondary-xxxdark'),

  // ── Success ────────────────────────────────────────────────────────────────

  successXXXLight: v('success-xxxlight'),
  successXXLight: v('success-xxlight'),
  successXLight:  v('success-xlight'),
  successLighter: v('success-lighter'),
  successLight:   v('success-light'),
  success:        v('success'),
  successDark:    v('success-dark'),
  successDarker:  v('success-darker'),
  successXDark:   v('success-xdark'),
  successXXDark:  v('success-xxdark'),
  successXXXDark: v('success-xxxdark'),

  // ── Warning ────────────────────────────────────────────────────────────────
  warning:        v('warning'),
  warningXXXLight: v('warning-xxxlight'),
  warningXXLight: v('warning-xxlight'),
  warningXLight:  v('warning-xlight'),
  warningLighter: v('warning-lighter'),
  warningLight:   v('warning-light'),
  warningDark:    v('warning-dark'),
  warningDarker:  v('warning-darker'),
  warningXDark:   v('warning-xdark'),
  warningXXDark:  v('warning-xxdark'),
  warningXXXDark: v('warning-xxxdark'),

  // ── Danger ─────────────────────────────────────────────────────────────────

  dangerXXXLight: v('danger-xxxlight'),
  dangerXXLight: v('danger-xxlight'),
  dangerXLight:  v('danger-xlight'),
  dangerLighter: v('danger-lighter'),
  dangerLight:   v('danger-light'),
  danger:        v('danger'),
  dangerDark:    v('danger-dark'),
  dangerDarker:  v('danger-darker'),
  dangerXDark:   v('danger-xdark'),
  dangerXXDark:  v('danger-xxdark'),
  dangerXXXDark: v('danger-xxxdark'),
  error:         v('danger'),       // v1 alias
  errorLight:    v('danger-light'), // v1 alias

  // ── Info ───────────────────────────────────────────────────────────────────

  infoXXXLight: v('info-xxxlight'),
  infoXXLight: v('info-xxlight'),
  infoXLight:  v('info-xlight'),
  infoLighter: v('info-lighter'),
  infoLight:   v('info-light'),
  info:        v('info'),
  infoDark:    v('info-dark'),
  infoDarker:  v('info-darker'),
  infoXDark:   v('info-xdark'),
  infoXXDark:  v('info-xxdark'),
  infoXXXDark: v('info-xxxdark'),

  // ── Grey ───────────────────────────────────────────────────────────────────

  greyXXXLight: v('grey-xxxlight'),
  greyXXLight: v('grey-xxlight'),
  greyXLight:  v('grey-xlight'),
  greyLighter: v('grey-lighter'),
  greyLight:   v('grey-light'),
  grey:        v('grey'),
  greyDark:    v('grey-dark'),
  greyDarker:  v('grey-darker'),
  greyXDark:   v('grey-xdark'),
  greyXXDark:  v('grey-xxdark'),
  greyXXXDark: v('grey-xxxdark'),

  // ── Default → Neutral (renamed in design-system; same base value) ──────────

  defaultXXXLight: v('neutral-xxxlight'),
  defaultXXLight: v('neutral-xxlight'),
  defaultXLight:  v('neutral-xlight'),
  defaultLighter: v('neutral-lighter'),
  defaultLight:   v('neutral-light'),
  default:        v('neutral'),
  defaultDark:    v('neutral-dark'),
  defaultDarker:  v('neutral-darker'),
  defaultXDark:   v('neutral-xdark'),
  defaultXXDark:  v('neutral-xxdark'),
  defaultXXXDark: v('neutral-xxxdark'),

  // ── Text → fg semantic (approximate; prefer token('colors.fg.*') directly) ─

  textXXLight:    v('fg-subtle'),
  textXLight:     v('fg-subtle'),
  textLight:      v('fg-muted'),
  text:           v('fg'),
  textDark:       v('fg'),
  textXDark:      v('fg'),

  // ── Background → bg semantic ───────────────────────────────────────────────

  background:     v('bg'),
  backgroundDark: v('bg-emphasized'),

} as const;

export type ColorsKey = keyof typeof colors;
