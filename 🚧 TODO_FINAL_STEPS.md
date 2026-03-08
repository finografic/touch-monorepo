# Design System Migration — Final Steps

> **Where we are:** Phases 6a–6f (partial) complete. Design-system package fully built.
> All Radix component imports replaced. Icons extracted to `@workspace/icons` (own package).
> AdminNavigation TabNav migration complete. `styles/` subdirectories flattened.
> Phase 6f in progress — Radix Themes + Emotion removal is next.

---

## What's Left At a Glance

| Work | Scope | Blocker |
|---|---|---|
| ~~**6e** — Clear remaining `styles/` imports~~ | ✅ Complete — 0 alias imports remain | — |
| **6f** — Prune `styles/`; remove Radix Themes + Emotion | See checklist below | 6e must be zero |
| **6g** — CSS custom property audit | DevTools investigation | 6f |
| ~~**AdminNavigation** — `TabNav` from `@radix-ui/themes`~~ | ✅ Complete — AdminNavigationV2 | — |
| ~~**Icons** — `@workspace/design-system/icons`~~ | ✅ Moved to `@workspace/icons` package | — |
| **PrimeReact** | DataTable, Dropdown, InputNumber, ListBox | Separate concern, no blocker |

---

## Phase 6e — Migrate `styles/` Imports

### Current state

✅ **Phase 6e complete.** Zero `from 'styles/...'` alias imports remain outside `styles/` (was 107).

**Breakdown by path:**

| Done | Path | Count | Action |
|---|---|---|---|
| ✅ | `styles/icons` | 44 | Icons moved to `@workspace/icons`; all imports updated |
| ✅ | `styles/colors/palette.types` | 8 | Replaced `ColorPalette` with DS `ColorsKey` |
| ✅ | `styles/colors/colors-direct` | 4 | Replaced with `colors` from DS tokens |
| ✅ | `styles/viewport/viewport.types` | 4 | Replaced with DS `ScreenClass` / `BreakpointMap`; `xxl` → `'2xl'` in Header.tsx |
| ✅ | `styles/layout/base.constants` | 3 | Replaced with DS `spacing` via `const padding = spacing` alias |
| ✅ | `styles/project/buttons.styles` | 6 | Moved `stylesButtonBase`/`stylesSmallButton` → `components/Button/button-base.styles.ts` |
| ✅ | `styles/forms/forms.constants` | 6 | Moved → `forms/forms.config.ts`; fixed `colors-direct` → DS tokens |
| ✅ | `styles/forms/forms.styles` | 5 | External consumers redirected; `cssForms` stays via relative import until 6f |
| ✅ | `styles/themes/emotion-theme.types` | 3 | Layout.tsx + Layout.styles.ts → relative import |
| ✅ | `styles/project/*.styles` (appContent, 800x480, 1024x600) | 6 | AdminLayout + Layout consumers → relative imports |
| ✅ | `styles/fonts/fonts.styles` | 1 | TimesRepeaterTable → relative import |
| ✅ | `styles/global.styles` + `styles/radix-ui/theme.config` + `generate-oklch-themes` | 4 | App.tsx + EmotionThemeProvider → relative imports |

---

## Phase 6f — Flatten + Prune `styles/` · Remove Radix Themes + Emotion

**Requires:** Phase 6e complete + AdminNavigation migrated. ✅ Both done.

> **Decision:** `styles/` is NOT deleted entirely. Things that are project-specific and
> will never belong in the DS survive as a small, flat folder.

### What survives in `styles/` (flat, ~5 files)

| File | Why it stays |
|---|---|
| `styles/project.styles.ts` | Admin + front-end layout rules; app-specific |
| `styles/project.800x480.styles.ts` | Pi 800×480 hardware overrides; deeply project-specific |
| `styles/project.1024x600.styles.ts` | Pi 1024×600 hardware overrides; deeply project-specific |
| `styles/global.styles.ts` | App-level resets, scrollbar rules, Radix cleanup |
| `styles/fonts.styles.ts` | Font face declarations; project font choices |

Everything else in `styles/` is deleted.

### Checklist

**1. Migrate `EmotionTheme` type (3 files)**

`styles/themes/emotion-theme.types` is only used as the Emotion theme shape.
Two options — choose one before proceeding:

- **a) Inline it** — move the type definition into each consumer directly
- **b) Delete it** — remove `EmotionThemeProvider` and the typed theme pattern entirely,
  replacing with CSS vars (already the direction Panda + DS is heading)

Option (b) is cleaner but requires updating `Layout.tsx`, `Layout.styles.ts`, and
`EmotionThemeProvider.tsx` to drop the typed theme — do this as part of Emotion removal below.

~~**2. Flatten `styles/project/` → root of `styles/`**~~ ✅ Done

~~**3. Flatten `styles/fonts/` → root of `styles/`**~~ ✅ Done

~~**4. Flatten `styles/forms/` → root of `styles/`**~~ ✅ Done (kept as separate files; will delete with Radix removal)

**5. Remove Radix Themes**

- `App.tsx`: remove `Theme as RadixTheme` import + `<RadixTheme>` wrapper
- `main.tsx`: remove `import '@radix-ui/themes/styles.css'`
- Remove `styles/radix-ui/` directory entirely (overrides no longer needed)
- `apps/client/package.json`: remove `"@radix-ui/themes"`, `"radix-themes-tw"`
- Audit `theme.css` — remove rules that compensated for Radix globals

**6. Remove Emotion**

- `App.tsx` / `providers/`: remove `EmotionThemeProvider`
- `apps/client/package.json`: remove `@emotion/react`, `@emotion/styled`, `@emotion/css`
- Delete remaining `.styles.ts` Emotion files OR convert to `css()` from `@pandacss/dev`
- Delete `styles/themes/` directory (OKLCH generation, hex themes — replaced by CSS vars)
- Remove `_migration.tokens.ts` compat shim from the DS package

**7. Confirm dark mode**

`panda.config.ts` uses `conditions.dark = '[data-theme="dark"] &'`. Confirm
`[data-theme="dark"]` is still set on `<html>` by whatever replaces
`EmotionThemeProvider` (direct `document.documentElement.setAttribute` or Zustand).

**8. Verify**

```bash
pnpm typecheck    # target: 0 errors
pnpm build        # must pass clean
```

**End state:** `styles/` contains exactly the ~5 files listed above, flat, no subdirectories.

---

## Phase 6g — CSS Custom Property Audit

**When:** After 6f.

DevTools currently shows hundreds of `--blur`, `--brightness`, `--translate-x` etc.
custom property declarations stacking per-element. After 6f, Radix Themes and Emotion
are gone — re-audit to see how much noise remains.

1. Open DevTools and count overrides per element
2. If Panda noise is still high, consider `utilities: { reset: 'container' }` in
   `panda.config.ts` to scope resets to a container class instead of `*`
3. Audit `_migration.tokens.ts` — confirm it is deleted (step 6f.6 above)
4. Check for duplicate token names between Panda tokens and any remaining CSS vars

---

## Panda Codegen Fix

**When:** Can be done independently — not blocked by 6f.

Currently the design-system package only emits `styles.css` from its Panda codegen.
The full `styled-system/` output (utilities, patterns, recipes as JS/TS) is missing.

1. Diff `panda.config.ts` and related configs between commit `53751843` and current `master`
2. Identify what changed that caused `styled-system/` to stop being emitted
3. Restore full `styled-system/` output so consumers can use Panda utilities directly

---

## PrimeReact — Incremental Replacement

The following use PrimeReact components with no DS equivalent yet. Not blocked.

| File | Component | Complexity |
|---|---|---|
| `SelectAlt.tsx` | `Dropdown` (editable mode) | Medium |
| `SelectWithNew.tsx` | `Dropdown` (editable + "add new") | High |
| `TemperatureInputField.tsx` | `InputNumber` (locale, spinners, °C) | Medium |
| `ListBoxSelect.tsx` | `ListBox` (visible list) | Low |
| `OrdersTable.tsx` | `DataTable` (sortable/filterable table) | High |

### OrdersTable → TanStack Table

The DataTable replacement requires **building the component first**, then swapping it in:

1. Build a reusable `DataTable` component using `@tanstack/react-table`
   - Sorting, column filtering, row selection (checkbox)
   - Style with DS token CSS vars (see docs: `table-tanstack-01.md`, `table-tanstack-02.md`)
2. Replace `OrdersTable.tsx` (PrimeReact `DataTable`) with the new component
3. Remove PrimeReact theme CSS imports and the PrimeReact wrapper
4. Once all PrimeReact usages are gone: remove `primeReact` dependency from `package.json`

---

## Recommended Order of Work

```
1. ~~Phase 6e — clear ~14 remaining imports~~          ✅ Done
2. ~~AdminNavigation TabNav migration~~                ✅ Done
3. Phase 6f — prune styles/ + remove Radix/Emotion     ~2–3 hours
4. Phase 6g — DevTools audit                           ~30 min
```

Total remaining effort: **~3 hours** across sessions.

---
