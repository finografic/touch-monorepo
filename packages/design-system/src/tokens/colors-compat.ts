/**
 * colorsV2 — v1-compatible color palette with Panda CSS custom properties
 *
 * Drop-in replacement for the legacy `colors` import.
 * Migration: change the import only — nothing else in the file needs to change.
 *
 *   // Before:
 *   import { colors } from 'styles';
 *   // or:
 *   import { colors } from 'styles/colors/colors-direct';
 *
 *   // After:
 *   import { colorsV2 as colors } from '@workspace/design-system/tokens/colors-compat';
 *
 * Key naming matches v1 exactly: camelCase shades (primaryXLight),
 * transparency variants appended as numeric suffix (primaryLight75).
 *
 * Shade map (v1 → design-system token):
 *   (base)  → colors.{name}
 *   Light   → colors.{name}.light
 *   XLight  → colors.{name}.xlight
 *   XXLight → colors.{name}.xxlight
 *   Dark    → colors.{name}.dark
 *   XDark   → colors.{name}.xdark
 *   XXDark  → colors.{name}.xxdark
 *
 * Transparency variants use CSS color-mix() — same visual result as v1's
 * alpha channel approach, but OKLCH-native.
 *
 * Notes on v1 name differences:
 *   - v1 `default`    → token `neutral`  (renamed in design-system)
 *   - v1 `text`       → semantic `fg`    (no palette; maps to fg semantic token)
 *   - v1 `background` → semantic `bg`    (no palette; maps to bg semantic token)
 *   - v1 `error`      → `danger`         (same token, different alias)
 *
 * Dark mode: raw palette tokens (primary, info, etc.) are fixed values.
 * If you want auto dark-mode switching, use the semantic tokens (fg, bg,
 * border, accent) from `styled-system/tokens` instead.
 */

// ── Helpers ────────────────────────────────────────────────────────────────────

/** Returns a CSS custom property reference for a design-system color token. */
const v = (token: string): string => `var(--colors-${token})`;

/** Returns a color-mix() for transparency — replaces v1's rgba/alpha variants. */
const a = (token: string, pct: number): string =>
  `color-mix(in oklch, var(--colors-${token}) ${pct}%, transparent)`;

// ── Palette ────────────────────────────────────────────────────────────────────

export const colorsV2 = {

  // ── Fixed ──────────────────────────────────────────────────────────────────
  white:       v('white'),
  black:       v('black'),
  transparent: 'transparent',
  white25:     a('white', 25),
  white50:     a('white', 50),
  white75:     a('white', 75),

  // ── Primary ────────────────────────────────────────────────────────────────
  primary:           v('primary'),
  primaryLight:      v('primary-light'),
  primaryXLight:     v('primary-xlight'),
  primaryXXLight:    v('primary-xxlight'),
  primaryDark:       v('primary-dark'),
  primaryXDark:      v('primary-xdark'),
  primaryXXDark:     v('primary-xxdark'),
  primary25:         a('primary', 25),
  primary50:         a('primary', 50),
  primary75:         a('primary', 75),
  primaryLight25:    a('primary-light', 25),
  primaryLight50:    a('primary-light', 50),
  primaryLight75:    a('primary-light', 75),
  primaryXLight25:   a('primary-xlight', 25),
  primaryXLight50:   a('primary-xlight', 50),
  primaryXLight75:   a('primary-xlight', 75),
  primaryXXLight25:  a('primary-xxlight', 25),
  primaryXXLight50:  a('primary-xxlight', 50),
  primaryXXLight75:  a('primary-xxlight', 75),
  primaryDark25:     a('primary-dark', 25),
  primaryDark50:     a('primary-dark', 50),
  primaryDark75:     a('primary-dark', 75),

  // ── Secondary ──────────────────────────────────────────────────────────────
  secondary:          v('secondary'),
  secondaryLight:     v('secondary-light'),
  secondaryXLight:    v('secondary-xlight'),
  secondaryXXLight:   v('secondary-xxlight'),
  secondaryDark:      v('secondary-dark'),
  secondaryXDark:     v('secondary-xdark'),
  secondaryXXDark:    v('secondary-xxdark'),
  secondary25:        a('secondary', 25),
  secondary50:        a('secondary', 50),
  secondary75:        a('secondary', 75),
  secondaryLight25:   a('secondary-light', 25),
  secondaryLight50:   a('secondary-light', 50),
  secondaryLight75:   a('secondary-light', 75),
  secondaryXLight25:  a('secondary-xlight', 25),
  secondaryXLight50:  a('secondary-xlight', 50),
  secondaryXLight75:  a('secondary-xlight', 75),
  secondaryXXLight25: a('secondary-xxlight', 25),
  secondaryXXLight50: a('secondary-xxlight', 50),
  secondaryXXLight75: a('secondary-xxlight', 75),
  secondaryDark25:    a('secondary-dark', 25),
  secondaryDark50:    a('secondary-dark', 50),
  secondaryDark75:    a('secondary-dark', 75),

  // ── Success ────────────────────────────────────────────────────────────────
  success:          v('success'),
  successLight:     v('success-light'),
  successXLight:    v('success-xlight'),
  successXXLight:   v('success-xxlight'),
  successDark:      v('success-dark'),
  successXDark:     v('success-xdark'),
  successXXDark:    v('success-xxdark'),
  success25:        a('success', 25),
  success50:        a('success', 50),
  success75:        a('success', 75),
  successLight25:   a('success-light', 25),
  successLight50:   a('success-light', 50),
  successLight75:   a('success-light', 75),
  successXLight25:  a('success-xlight', 25),
  successXLight50:  a('success-xlight', 50),
  successXLight75:  a('success-xlight', 75),
  successXXLight25: a('success-xxlight', 25),
  successXXLight50: a('success-xxlight', 50),
  successXXLight75: a('success-xxlight', 75),
  successDark25:    a('success-dark', 25),
  successDark50:    a('success-dark', 50),
  successDark75:    a('success-dark', 75),

  // ── Warning ────────────────────────────────────────────────────────────────
  warning:          v('warning'),
  warningLight:     v('warning-light'),
  warningXLight:    v('warning-xlight'),
  warningXXLight:   v('warning-xxlight'),
  warningDark:      v('warning-dark'),
  warningXDark:     v('warning-xdark'),
  warningXXDark:    v('warning-xxdark'),
  warning25:        a('warning', 25),
  warning50:        a('warning', 50),
  warning75:        a('warning', 75),
  warningLight25:   a('warning-light', 25),
  warningLight50:   a('warning-light', 50),
  warningLight75:   a('warning-light', 75),
  warningXLight25:  a('warning-xlight', 25),
  warningXLight50:  a('warning-xlight', 50),
  warningXLight75:  a('warning-xlight', 75),
  warningXXLight25: a('warning-xxlight', 25),
  warningXXLight50: a('warning-xxlight', 50),
  warningXXLight75: a('warning-xxlight', 75),
  warningDark25:    a('warning-dark', 25),
  warningDark50:    a('warning-dark', 50),
  warningDark75:    a('warning-dark', 75),

  // ── Danger ─────────────────────────────────────────────────────────────────
  // v1 also used `error` as an alias — danger === error here
  danger:          v('danger'),
  dangerLight:     v('danger-light'),
  dangerXLight:    v('danger-xlight'),
  dangerXXLight:   v('danger-xxlight'),
  dangerDark:      v('danger-dark'),
  dangerXDark:     v('danger-xdark'),
  dangerXXDark:    v('danger-xxdark'),
  danger25:        a('danger', 25),
  danger50:        a('danger', 50),
  danger75:        a('danger', 75),
  dangerLight25:   a('danger-light', 25),
  dangerLight50:   a('danger-light', 50),
  dangerLight75:   a('danger-light', 75),
  dangerXLight25:  a('danger-xlight', 25),
  dangerXLight50:  a('danger-xlight', 50),
  dangerXLight75:  a('danger-xlight', 75),
  dangerXXLight25: a('danger-xxlight', 25),
  dangerXXLight50: a('danger-xxlight', 50),
  dangerXXLight75: a('danger-xxlight', 75),
  dangerDark25:    a('danger-dark', 25),
  dangerDark50:    a('danger-dark', 50),
  dangerDark75:    a('danger-dark', 75),
  error:           v('danger'),        // v1 alias
  errorLight:      v('danger-light'),  // v1 alias

  // ── Info ───────────────────────────────────────────────────────────────────
  info:          v('info'),
  infoLight:     v('info-light'),
  infoXLight:    v('info-xlight'),
  infoXXLight:   v('info-xxlight'),
  infoDark:      v('info-dark'),
  infoXDark:     v('info-xdark'),
  infoXXDark:    v('info-xxdark'),
  info25:        a('info', 25),
  info50:        a('info', 50),
  info75:        a('info', 75),
  infoLight25:   a('info-light', 25),
  infoLight50:   a('info-light', 50),
  infoLight75:   a('info-light', 75),
  infoXLight25:  a('info-xlight', 25),
  infoXLight50:  a('info-xlight', 50),
  infoXLight75:  a('info-xlight', 75),
  infoXXLight25: a('info-xxlight', 25),
  infoXXLight50: a('info-xxlight', 50),
  infoXXLight75: a('info-xxlight', 75),
  infoDark25:    a('info-dark', 25),
  infoDark50:    a('info-dark', 50),
  infoDark75:    a('info-dark', 75),

  // ── Grey ───────────────────────────────────────────────────────────────────
  grey:          v('grey'),
  greyLight:     v('grey-light'),
  greyXLight:    v('grey-xlight'),
  greyXXLight:   v('grey-xxlight'),
  greyDark:      v('grey-dark'),
  greyXDark:     v('grey-xdark'),
  greyXXDark:    v('grey-xxdark'),
  grey25:        a('grey', 25),
  grey50:        a('grey', 50),
  grey75:        a('grey', 75),
  greyLight25:   a('grey-light', 25),
  greyLight50:   a('grey-light', 50),
  greyLight75:   a('grey-light', 75),
  greyXLight25:  a('grey-xlight', 25),
  greyXLight50:  a('grey-xlight', 50),
  greyXLight75:  a('grey-xlight', 75),
  greyXXLight25: a('grey-xxlight', 25),
  greyXXLight50: a('grey-xxlight', 50),
  greyXXLight75: a('grey-xxlight', 75),
  greyDark25:    a('grey-dark', 25),
  greyDark50:    a('grey-dark', 50),
  greyDark75:    a('grey-dark', 75),

  // ── Default → Neutral (renamed in design-system) ───────────────────────────
  // v1 called this `default`; the new token is `neutral` (same base value).
  default:           v('neutral'),
  defaultLight:      v('neutral-light'),
  defaultXLight:     v('neutral-xlight'),
  defaultXXLight:    v('neutral-xxlight'),
  defaultDark:       v('neutral-dark'),
  defaultXDark:      v('neutral-xdark'),
  defaultXXDark:     v('neutral-xxdark'),
  default25:         a('neutral', 25),
  default50:         a('neutral', 50),
  default75:         a('neutral', 75),
  defaultLight25:    a('neutral-light', 25),
  defaultLight50:    a('neutral-light', 50),
  defaultLight75:    a('neutral-light', 75),
  defaultXLight25:   a('neutral-xlight', 25),
  defaultXLight50:   a('neutral-xlight', 50),
  defaultXLight75:   a('neutral-xlight', 75),
  defaultXXLight25:  a('neutral-xxlight', 25),
  defaultXXLight50:  a('neutral-xxlight', 50),
  defaultXXLight75:  a('neutral-xxlight', 75),
  defaultDark25:     a('neutral-dark', 25),
  defaultDark50:     a('neutral-dark', 50),
  defaultDark75:     a('neutral-dark', 75),

  // ── Text → fg semantic (no palette; maps to semantic fg tokens) ────────────
  // These are approximate — the v1 `text` shades are now semantic fg tokens.
  // For exact semantic meaning, prefer `token('colors.fg.*')` directly.
  text:         v('fg'),
  textLight:    v('fg-muted'),
  textXLight:   v('fg-subtle'),
  textXXLight:  v('fg-subtle'),  // no exact match; fg.subtle is closest
  textDark:     v('fg'),         // fg is already the dark/default text
  textXDark:    v('fg'),
  text25:       a('fg', 25),
  text50:       a('fg', 50),
  text75:       a('fg', 75),
  textLight25:  a('fg-muted', 25),
  textLight50:  a('fg-muted', 50),
  textLight75:  a('fg-muted', 75),
  textXLight25: a('fg-subtle', 25),
  textXLight50: a('fg-subtle', 50),
  textXLight75: a('fg-subtle', 75),

  // ── Background → bg semantic ───────────────────────────────────────────────
  background:     v('bg'),
  backgroundDark: v('bg-emphasized'),

} as const;

/** Convenience type — union of all valid colorsV2 keys. */
export type ColorsV2Key = keyof typeof colorsV2;
