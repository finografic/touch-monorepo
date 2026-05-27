# Design system and UI stack

Focus: Panda CSS, remaining PrimeReact usage, Emotion, and CSS variable noise.

---

## Completed (reference)

| Item | Notes |
| --- | --- |
| FieldWrapper → `FieldBox` (`@workspace/design-system/forms`) | `FieldWrapper/` removed. |
| Admin TabNav migration | Done. |
| Radix Themes removed | Panda + DS patterns in use. |
| Orders table → TanStack Table | PrimeReact `DataTable` replaced; see admin orders UI. |
| Phase 6e / 6f (imports, styles, Radix) | Completed per prior design-system roadmap. |

---

## Phase 6g — Panda CSS custom property audit

**When:** Any time after the Radix / theme cleanup.

**Finding:** Panda emits a global `*, ::before, ::after` block with composable utility variables (`--blur`, `--translate-x`, etc.). The app does not use Panda’s composable transform/filter utilities (transforms are explicit in keyframes/recipes).

**Optional follow-up:** In `panda.config.ts`, disable unused composable utility groups (e.g. filter/backdrop/transform) to reduce noise.

**Manual check:** On a production build, DevTools → pick an element → confirm inherited `--*` variables match expected design tokens, not leftover third-party noise.

---

## PrimeReact — incremental replacement

PrimeReact remains for a few components that do not yet have a full DS replacement:

| Area | Component | Effort |
| --- | --- | --- |
| `SelectAlt.tsx` | Dropdown (editable) | Medium |
| `SelectWithNew.tsx` | Dropdown + “add new” | High |
| `TemperatureInputField.tsx` | InputNumber (locale, °C) | Medium |
| `ListBoxSelect.tsx` | ListBox | Low |

When **all** PrimeReact imports are gone, remove the `primereact` dependency from `apps/client/package.json`.

---

## Emotion

`@emotion/react`, `@emotion/styled`, and `@emotion/css` are still in `apps/client/package.json`. Finish migrating remaining Emotion usage to Panda / DS patterns, then remove Emotion packages and any leftover `.styles.ts` that exist only for Emotion.

---

## Suggested order

1. DevTools / Panda audit (6g) — quick, low risk.
2. PrimeReact — replace by feature (start with simpler surfaces like list box).
3. Emotion removal — after PrimeReact and stray styles are addressed.
