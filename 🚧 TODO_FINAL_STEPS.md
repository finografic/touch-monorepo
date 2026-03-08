# Design System Migration — Final Steps

> **Where we are:** Phases 6a–6f (partial) complete. Design-system package fully built.
> All Radix component imports replaced. Icons extracted to `@workspace/icons` (own package).
> AdminNavigation TabNav migration complete. `styles/` fully cleaned — subdirs deleted, forms/fonts inlined.
> Radix Themes removed. EmotionThemeProvider removed. FieldWrapper replaced with DS FieldBox.
> global.styles.ts pruned (Radix blocks gone, scrollbars moved to DS global.css).
> Phase 6f remaining: remove @emotion packages + migrate all `.styles.ts` files off Emotion.

---

## What's Left At a Glance

| Work | Scope | Blocker |
|---|---|---|
| ~~**6e** — Clear remaining `styles/` imports~~ | ✅ Complete — 0 alias imports remain | — |
| **6f** — Remove Emotion (packages + .styles.ts files) | ~113 files still use `@emotion/react` | — |
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

### What survives in `styles/` (flat — confirmed)

| File | Why it stays |
|---|---|
| `styles/project.styles.ts` | Admin + front-end layout rules; app-specific |
| `styles/project.app.800x480.styles.ts` | Pi 800×480 hardware overrides; deeply project-specific |
| `styles/project.app.1024x600.styles.ts` | Pi 1024×600 hardware overrides; deeply project-specific |
| `styles/project.app.styles.ts` | App content layout |
| `styles/global.styles.ts` | App-level typography, button-box, media queries |

`styles/fonts.styles.ts` — **inlined into `global.styles.ts`** and deleted.
Everything else in `styles/` is deleted (subdirs, forms*.styles.ts, etc.).

### Checklist

~~**1. Migrate `EmotionTheme` type**~~ ✅ Done — option (b): deleted `EmotionThemeProvider`
entirely; `Layout.tsx` drives dark mode via `document.documentElement.setAttribute('data-theme', ...)`;
`Layout.styles.ts` uses DS `colors` token CSS vars directly.

~~**2. Flatten `styles/project/` → root of `styles/`**~~ ✅ Done

~~**3. Flatten `styles/fonts/` → root of `styles/`**~~ ✅ Done (then inlined into global.styles.ts + deleted)

~~**4. Flatten `styles/forms/` → root of `styles/`**~~ ✅ Done — all `forms*.styles.ts` deleted

~~**5. Remove Radix Themes**~~ ✅ Done

- `App.tsx`: `<RadixTheme>` wrapper removed ✅
- `main.tsx`: `@radix-ui/themes/styles.css` import removed ✅
- `styles/radix-ui/` directory deleted ✅
- `package.json`: `@radix-ui/themes`, `radix-themes-tw` removed ✅
- `global.styles.ts`: all `rt-*` override blocks removed ✅
- Scrollbar styles moved to DS `global.css` ✅

**6. Remove Emotion** ← _next big step_

- ~~`App.tsx` / `providers/`: remove `EmotionThemeProvider`~~ ✅ Done
- ~~Delete `styles/themes/` directory (OKLCH generation, hex themes)~~ ✅ Done
- ~~Delete `styles/colors/`, `styles/hooks/`, `styles/layout/`, `styles/constants/`~~ ✅ Done
- `apps/client/package.json`: remove `@emotion/react`, `@emotion/styled`, `@emotion/css`
- Migrate all remaining `.styles.ts` files off Emotion (113 files — see strategy below)
- Remove `_migration.tokens.ts` compat shim from the DS package

~~**7. Confirm dark mode**~~ ✅ Done — `Layout.tsx` calls `document.documentElement.setAttribute('data-theme', theme)` which drives Panda CSS vars. No ThemeProvider needed.

**8. Verify**

```bash
pnpm typecheck    # target: 0 errors
pnpm build        # must pass clean
```

**End state:** `styles/` contains exactly the 5 files listed above, flat, no subdirectories.

### Emotion Removal Strategy (step 6)

113 files still use `@emotion/react`. Options (not mutually exclusive):

| Approach | Scope | Effort |
|---|---|---|
| **a) Keep Emotion, just drop the ThemeProvider** | Already done | ✅ |
| **b) Migrate `.styles.ts` → plain CSS modules** | Per component, systematic | High |
| **c) Migrate `.styles.ts` → Panda `css()` utility** | Requires Panda codegen fix first | Medium |
| **d) Leave Emotion, remove only if needed** | No effort, but dep stays | Low |

> Current recommendation: do Panda codegen fix first (see below), then decide between (b) and (c).
> Emotion without a ThemeProvider is a much smaller surface — acceptable to leave for now.

---

## Phase 6g — CSS Custom Property Audit

**When:** After 6f (or can do now — Radix is already gone).

**Code-side audit complete.** Findings:

- ~~`_migration.tokens.ts` deleted~~ ✅ Already gone
- Radix Themes removed — main source of per-element noise is gone ✅
- Panda utility classes are all class-scoped (`.w_20`, etc.) — no noise there ✅
- **Remaining noise:** Panda's `@layer base` still emits a `*, ::before, ::after, ::backdrop`
  block initializing ~20 composable utility vars (`--blur`, `--translate-x`, `--rotate`, etc.)
  — **but none of these Panda composable transform/filter utilities are actually used**
  (all transforms in the app are hardcoded `transform: scale(...)` in keyframes/recipes)

**Options for the `*` utility reset noise:**

| Option | What it does | Effort |
|---|---|---|
| **Accept it** | Leave as-is — it's one declaration block, not per-rule | None |
| **Disable unused utility groups** | Remove filter/backdrop/transform from Panda config | Low |
| **`utilities: { reset: 'container' }` *(not valid option)*| Scope to container class | — |

Simplest fix: disable the filter/transform composable utilities in `panda.config.ts` since they aren't used.

**DevTools check still needed:**
1. Open DevTools on a production build, select any element
2. Confirm the only `--` vars inherited are Panda tokens (colors, spacing) not Radix noise
3. If the `--blur` / `--translate-x` init block is still visible as noise, apply the fix above

---

## FieldWrapper → FieldBox ✅ Done

All consumers of `apps/client/src/forms/FieldWrapper/` migrated to `FieldBox` from
`@workspace/design-system/forms`. `FieldWrapper/` directory deleted.

Files updated: `SoundConfigurationSection.tsx`, `OrdersForm.tsx`, `PublicModePage.tsx`.

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

1. ~~Phase 6e — clear ~14 remaining imports~~          ✅ Done
2. ~~AdminNavigation TabNav migration~~                ✅ Done
3. ~~Phase 6f (partial) — prune styles/, remove Radix Themes, EmotionThemeProvider~~ ✅ Done
4. ~~Phase 6f (remaining) — remove @emotion packages + .styles.ts files~~
5. Phase 6g — DevTools audit (can do now — Radix is already gone)
6. PrimeReact replacement (incremental, separate concern)

---
