# Design System Migration Plan — `apps/client`

> **Goal:** Replace `apps/client/src/styles/` as the style source of truth with
> `@workspace/design-system`. Emotion stays in place during migration (incremental).
> Radix Themes layout primitives are removed first, then Radix components, then Emotion.
> The `styles/` folder is deleted only at the end.

---

## Status Overview

| Phase | Description | Status |
|---|---|---|
| 6a | Panda CSS infrastructure wired into client | ✅ Done |
| 6b | Dark mode + global styles via preset | ✅ Done |
| 6c-i | Build `src/grid/` module in design-system | ✅ Done |
| 6c-ii | Replace `react-grid-system` (16 files) | ✅ Done |
| 6c-iii | Replace Radix Themes layout primitives (~86 call sites) | ✅ Done |
| 6c-iv | Verify — typecheck + dev + visual regression check | ✅ Done |
| 6d | Swap Radix component imports → design-system | ✅ Done |
| 6e | Migrate Emotion `.styles.ts` files → DS tokens | 🚧 In Progress (107 imports remain) |
| 6f | Remove `styles/` folder + Radix Themes + Emotion | ⬜ Pending |
| 6g | CSS custom property audit — resolve token overrides | ⬜ Pending |

---

## ✅ Phase 6a — Panda CSS Infrastructure

**Completed:** 2026-02-26

- Added `@workspace/design-system` + `@pandacss/dev` to client deps
- Added `panda.config.ts` using `designSystemPreset` (`preflight: false` — reset already in theme.css)
- `panda codegen && panda cssgen` (no PostCSS — compatible with lightningcss Vite transformer)
- Added `panda:codegen` script; prepended codegen to `dev` and `build` scripts
- Gitignored `styled-system/` and `dist/` in client
- Imported `styled-system/styles.css` in `main.tsx`

---

## ✅ Phase 6b — Dark Mode + Global Styles

**Completed:** 2026-02-26

- Configured `conditions.dark = '[data-theme="dark"] &'` to match existing `EmotionThemeProvider`
- Verified semantic tokens generate under `[data-theme="dark"]` selector (not `.dark`)
- Design-system `globalCss` (bg, fg, border, scrollbar, focus ring) included via preset

---

## ✅ Phase 6c-i — Build Grid Module

**Completed:** 2026-02-27

- Created `packages/design-system/src/grid/` — `Col.tsx`, `Row.tsx`, `Container.tsx`, `index.ts`, `grid.css`
- Pre-generated `grid.css` — 12 columns × 6 breakpoints, no Panda runtime required
- Added `./grid` and `./grid/grid.css` to design-system exports map
- `ColSpan` typed as `number | 'content'` to support dynamic values
- `tsdown --no-clean` flag added to `dev` script — prevents watch mode from wiping dist on startup

---

## ✅ Phase 6c-ii — Replace `react-grid-system`

**Completed:** 2026-02-27

- Swapped all 16 `react-grid-system` imports → `@workspace/design-system/grid`
- Removed `ScreenClassProvider` from `App.tsx`, `setConfiguration` from `Layout.tsx` / `AdminLayout.tsx`
- Removed `react-grid-system` from `apps/client/package.json`

---

## ✅ Phase 6c-iii — Replace Radix Themes Layout Primitives

**Completed:** 2026-02-27

- Replaced `Flex` → `styled-system/jsx` across 59 files; `Box` → `styled-system/jsx` across 59 files
- Replaced Radix `Container` → DS `Container` (1 file)
- Translated all `justify="between"` → `justify="space-between"` on Flex
- Fixed 3 files (`SectionHeader`, `FieldWrapper`, `FieldWrapperBasic`) — Panda Box union type conflicted with Emotion `css` prop, swapped to `div`
- Net new TypeScript errors: 0

---

## ✅ Phase 6c-iv — Verify

**Completed:** 2026-02-27

- `pnpm typecheck` — 64 errors, all pre-existing (0 new from migration)
- `pnpm dev` — app runs, no visual regressions observed
- Fixed turbo pipeline — `@workspace/design-system#build` added to `dev` task `dependsOn`
- **Known issue noted:** CSS custom property override accumulation in DevTools (see Phase 6g)

---

## ✅ Phase 6d — Replace Radix Component Imports

**Completed:** 2026-03-02

### Component mapping

| Source | Design-system replacement | Notes |
|---|---|---|
| Radix `<Button>` | `<Button>` from `components/Button` | ✅ Done |
| Radix `<Badge>` | `<span className={badge({...})}>` | ✅ Done |
| Radix `<Switch>` | Ark UI `Switch.*` + `dsSwitch` recipe | ✅ Done |
| Radix `<Tabs.*>` | DS `Tabs.*` | ✅ Done |
| Radix `<DropdownMenu.*>` | DS `Menu.*` | ✅ Done |
| Radix `<Callout.*>` | `<div className={callout({...})}>` | ✅ Done |
| Radix `<Card>` | `<div className={card({...})}>` | ✅ Done |
| Radix `<Spinner>` | `<LoaderIcon>` + `@keyframes spin` | ✅ Done |
| Radix `<Text>` | `<span>` | ✅ Done |
| Radix `<Heading>` | `<h1>/<h2>/<h3>` | ✅ Done |
| Radix `<DataList.*>` | `<dl>/<div>/<dt>/<dd>` | ✅ Done (4 files) |
| Radix `<IconButton>` | `<Button>` from `components/Button` | ✅ Done |
| Radix `<TabNav.*>` | `<div>` + `<button aria-current>` | ✅ Done (AdminNavbar, HiddenMeasureItems) |
| Radix `<Dialog.*>` | DS `Dialog.*` from `forms/` | ✅ Done (GenericDialog, LanguageDeleteDialog) |
| Radix `<AlertDialog.*>` | `<Dialog.Content role="alertdialog">` | ✅ Done |
| Radix `<TextField>` | DS `InputField.Root` + `InputField.Slot` | ✅ Done (6 files) |
| Radix `<RadioCards.*>` | DS `RadioGroup.Root variant="card"` | ✅ Done (LanguageSelector) |
| Radix `<CheckboxGroup.*>` | `<div>` + DS `Checkbox.*` | ✅ Done (PadGroup) |
| PrimeReact `<Slider>` | DS `Slider.*` from `forms/` | ✅ Done (VolumeSlider) |
| PrimeReact `<Panel>` | Custom collapsible via CSS `grid-template-rows` | ✅ Done (ProfilesPanel) |
| `@radix-ui/react-navigation-menu` | Semantic `div/ul/li` | ✅ Done (FrontEndNavigation) |
| `@radix-ui/react-toast` | `ol/li` with `role="status"` | ✅ Done (Toast, Toaster) |
| Radix `<Theme>` / `ThemeProps` | Deferred to 6f | ⏸ App.tsx |

### DS components built (design-system side)

- `forms/InputField` — `InputField.Root` + `InputField.Slot`; replaces `TextField.Root/Slot`
- `forms/Checkbox` — `Checkbox.Root/Control/Indicator/Label/HiddenInput`
- `forms/RadioGroup` — `variant="default"` + `variant="card"` (covers `RadioCards`)
- `forms/Slider` — unwraps Ark's `value: number[]` → single `value: number`
- `forms/Dialog` — normalises Ark's `onOpenChange({open})` → `(open: boolean) => void`; size prop `xs·sm·md·lg·xl·cover·full`
- `forms/primitives.ts` — raw Ark re-exports as explicit escape hatch
- `components/toast.tsx` — re-exports Ark UI `Toast`, `Toaster`, `createToaster`

### Package cleanup (2026-03-02)

Removed 14 unused `@radix-ui/*` packages from `apps/client/package.json`:
`colors`, `react-checkbox`, `react-collapsible`, `react-dialog`, `react-form`,
`react-navigation-menu`, `react-popover`, `react-portal`, `react-primitive`,
`react-radio-group`, `react-slot`, `react-toast`, `react-toggle`, `react-toolbar`

### Remaining `@radix-ui` imports (intentional holds)

- `App.tsx` — `Theme as RadixTheme` (deferred to 6f)
- `AdminNavbar.tsx` — `TabNav` from `@radix-ui/themes` (AdminNavigation intentionally preserved)
- `styles/radix-ui/theme.config.ts` — `ThemeProps` type (deferred to 6f)
- `main.tsx` — `@radix-ui/themes/styles.css` import (deferred to 6f)

### Remaining PrimeReact imports (no DS equivalent yet)

- `SelectAlt.tsx`, `SelectWithNew.tsx` — PrimeReact `Dropdown` (editable + "add new" mode)
- `TemperatureInputField.tsx` — PrimeReact `InputNumber` (locale formatting, stacked spinners)
- `ListBoxSelect.tsx` — PrimeReact `ListBox` (visible option list, no DS equivalent)
- `OrdersTable.tsx` — PrimeReact `DataTable` (complex sortable/filterable table)

---

## 🚧 Phase 6e — Migrate `styles/` Imports → DS Tokens

**Scope:** Incremental. 107 `from 'styles/...'` imports remain across ~60 files.

**What's already done:** 101 `.styles.ts` files had their `from 'styles'` barrel imports replaced with `from '@workspace/design-system/tokens'` in a previous session. Compat re-exports were added to `_migration.tokens.ts`.

**Remaining import breakdown (as of 2026-03-02):**

| Import path | Count | Migration target |
|---|---|---|
| `styles/icons` | 44 | Keep or move icons to DS icons registry |
| `styles/project/buttons.styles` | 6 | Migrate to DS button recipe / Panda utilities |
| `styles/forms/forms.constants` | 6 | Replace with DS form constants or inline |
| `styles/forms/forms.styles` | 5 | Replace with DS `forms.css` / Panda utilities |
| `styles/colors/palette.types` | 8 | Replace with DS `ColorPalette` type |
| `styles/colors/colors-direct` | 4 | Replace with `colors` from DS tokens |
| `styles/viewport/viewport.types` | 4 | Replace with DS breakpoint types |
| `styles/layout/base.constants` | 3 | Replace with DS layout tokens |
| `styles/themes/emotion-theme.types` | 3 | Replace with DS token types |
| Other (fonts, hooks, utils, radix-ui) | ~24 | Case-by-case |

**Priority order:**

1. `styles/colors/*` — replace with `colors` from `@workspace/design-system/tokens`
2. `styles/layout/*` — replace with layout token CSS vars
3. `styles/forms/*` — replace with DS `forms.css` classes or Panda utilities
4. `styles/viewport/*` — replace with DS breakpoint constants
5. `styles/icons` — assess: move to DS registry or keep as local asset
6. `styles/themes/*`, `styles/fonts/*`, `styles/hooks/*` — last pass

**Gate:** Zero `from 'styles/'` imports before moving to 6f.

---

## ⬜ Phase 6f — Remove `styles/` Folder + Final Cleanup

**Gate:** Phase 6e complete (zero `from 'styles/'` imports).

### Checklist

- [ ] `grep -r "from 'styles/"` returns zero matches
- [ ] Remove `apps/client/src/styles/` directory
- [ ] Remove `@radix-ui/themes` from `apps/client/package.json`
- [ ] Remove `@emotion/react`, `@emotion/styled`, `@emotion/css` from `apps/client/package.json`
- [ ] Remove `EmotionThemeProvider` wrapper from `App.tsx`
- [ ] Remove `RadixTheme` wrapper from `App.tsx`
- [ ] Update `panda.config.ts` — confirm `conditions.dark` is correct without Emotion wrapper (may need to point at a different data attribute or class)
- [ ] Remove `@radix-ui/themes/styles.css` import from `main.tsx`
- [ ] Remove `styles/radix-ui/overrides.css` import from `main.tsx`
- [ ] Audit `theme.css` — remove any overrides that only existed for Radix Themes compatibility
- [ ] Run `pnpm typecheck` — resolve all remaining errors (currently ~64 pre-existing)
- [ ] Run full `pnpm build` — confirm clean output

---

## ⬜ Phase 6g — CSS Custom Property Audit

**When:** After 6f (Radix Themes + Emotion removed).

**Problem observed (2026-02-27):** DevTools shows hundreds of CSS custom property declarations
being overridden per-element — `--blur`, `--brightness`, `--contrast`, `--translate-x`, etc.
These are Panda CSS's utility reset variables emitted on `*, :before, :after` stacking across
inherited elements. Radix Themes and Emotion multiplying the cascade.

**Root causes:**
1. Panda CSS base layer resets — emitted once per component, functionally correct but noisy
2. Radix Themes CSS vars — removed in 6f
3. Emotion-scoped selectors re-declaring Panda vars — resolved in 6f

**Steps:**
1. After 6f, re-audit in DevTools — confirm how many overrides remain
2. If Panda base layer still noisy: consider scoping resets to a container class instead of `*`
3. Audit DS token definitions — check for duplicate names between Panda tokens and legacy `styles/` vars
4. Remove any `_migration.tokens.ts` compat exports that are no longer needed

---

## Decisions

1. Emotion co-exists with Panda during migration — no hard cutover (2026-02-26)
2. Dark mode via `[data-theme="dark"]` condition — matches `EmotionThemeProvider` (2026-02-26)
3. `panda cssgen` (no PostCSS) — compatible with lightningcss Vite transformer (2026-02-26)
4. `preflight: false` in client `panda.config.ts` — reset already in `theme.css` (2026-02-26)
5. Build `src/grid/` in design-system — replaces both `react-grid-system` and Radix layout primitives (2026-02-27)
6. Grid module uses pre-generated static CSS (`grid.css`), not Panda runtime — no provider or configuration needed (2026-02-27)
7. Grid breakpoints align with existing Panda/Tailwind scale (xs/sm/md/lg/xl/xxl); `xxxl` dropped (2026-02-27)
8. `ColSpan` typed as `number | 'content'` — 1-12 constraint enforced by CSS, not TypeScript (2026-02-27)
9. `jsxFramework: 'react'` enabled in client — generates `Box`, `Stack`, `HStack`, `VStack`; `Flex` generated but not used (use `Row` instead) (2026-02-27)
10. Row/Col carry no margin/padding props — spacing handled by `Box` + Panda `css()` (2026-02-27)
11. `justify` props use CSS values (`"space-between"`) not shorthand aliases (`"between"`) (2026-02-27)
12. CSS custom property override audit deferred to Phase 6g — majority self-resolve after 6f (2026-02-27)
13. `colors` palette export added to `@workspace/design-system/tokens` — camelCase keys → CSS vars, no alpha variants (2026-02-28)
14. Alpha/transparency token variants removed — 11-stop shade scale (`xxxlight`→`xxxdark`) covers in-between needs (2026-02-28)
15. ESLint enforces numeric spacing props on Panda layout components — `gap={4}` not `gap="4"` (2026-02-28)
16. DS is the Ark UI dependency boundary — client never imports from `@ark-ui/react` directly; `forms/primitives` and `components/primitives` are the explicit escape hatch paths (2026-02-28)
17. `forms/primitives` path convention — raw Ark re-exports only accessible via `/primitives` suffix; deliberate import = deliberate bypass of DS styling (2026-02-28)
18. `TextField` renamed `InputField` in DS — aligns with client's `Input*` naming convention (2026-02-28)
19. `RadioGroup variant="card"` covers `RadioCards` use case — CSS differentiation via `data-variant` (2026-02-28)
20. Dialog size scale: `xs·sm·md·lg·xl·cover·full` — aligned with Park UI vocabulary (2026-02-28)
21. `AlertDialog` mapped to `Dialog.Content role="alertdialog"` — Ark UI has no separate AlertDialog (2026-02-28)
22. AdminNavigation (`AdminNavbar.tsx`) intentionally retains `@radix-ui/themes` TabNav — not migrated until the component is rebuilt or `@radix-ui/themes` is removed in 6f (2026-03-02)
23. Toast system keeps custom `ToastContext` state management — only the Radix DOM layer replaced with `ol/li`; `data-state` attribute preserved for CSS `slideIn`/`hide` animations (2026-03-02)
24. ProfilesPanel collapse animation uses CSS `grid-template-rows: 0fr/1fr` transition — no JS animation library needed (2026-03-02)

---

## Open Questions

1. **Emotion removal** — Is full Emotion removal the goal after 6f, or keep Emotion for complex one-off styles? Recommendation: remove. Panda `css()` function covers all Emotion use cases.
2. **`styles/icons`** — 44 imports. Move to DS icons registry, or keep as a local `styles/icons/` re-export barrel that survives 6f? Recommendation: assess which icons are used and migrate to DS `icons.ts` registry.
3. **PrimeReact** — No DS equivalents for `DataTable`, `Dropdown`, `InputNumber`, `ListBox`. Keep PrimeReact for these, or build DS equivalents? No action required for this migration — `primereact` stays as a runtime dep.
4. **Token override scope** — After 6f, if Panda base layer resets are still noisy, scope to a container class instead of `*`?
