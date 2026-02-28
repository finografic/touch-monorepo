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
| 6d | Swap Radix component imports → design-system | 🚧 In Progress (10 files remain) |
| 6e | Migrate Emotion `.styles.ts` files → Panda | ⬜ Pending |
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
- Added `grid/index` entry to `tsdown.config.ts`
- Imported `@workspace/design-system/grid/grid.css` in `apps/client/src/main.tsx`
- `ColSpan` typed as `number | 'content'` to support dynamic values
- Fixed `Row.tsx` — removed `node:crypto` debug import; replaced `HTMLDivElement` with `ElementRef<'div'>` in all grid components (ESLint `no-undef` rule doesn't see browser globals)
- `tsdown --no-clean` flag added to `dev` script — prevents watch mode from wiping dist on startup (race condition with client panda codegen)

---

## ✅ Phase 6c-ii — Replace `react-grid-system`

**Completed:** 2026-02-27

- Swapped all 16 `react-grid-system` imports → `@workspace/design-system/grid`
- Removed `ScreenClassProvider` from `App.tsx` (no provider needed)
- Removed `setConfiguration` calls from `Layout.tsx`, `AdminLayout.tsx`, `viewport.queries.ts`
- Replaced `Visible` in `DevScreenSize` with local Emotion-based component
- Replaced `<Row css={...}>` in `ScreenSizeOverlay` with plain `<div css={...}>` (no grid needed)
- Removed `react-grid-system` from `apps/client/package.json`

---

## ✅ Phase 6c-iii — Replace Radix Themes Layout Primitives

**Completed:** 2026-02-27

- Added `styled-system` path alias to `apps/client/tsconfig.json` paths
- Replaced `Flex` → `Flex` from `styled-system/jsx` across 59 files
- Replaced `Box` → `Box` from `styled-system/jsx` across 59 files
- Replaced `Container` from Radix → `Container` from `@workspace/design-system/grid` (1 file)
- Translated all `justify="between"` → `justify="space-between"` on Flex (data-attribute Row usages unchanged)
- Fixed 3 files (`SectionHeader`, `FieldWrapper`, `FieldWrapperBasic`) where Panda Box's complex union type conflicted with Emotion `css` prop — swapped to `div` (no Panda style props were used)
- Net new TypeScript errors: 0

---

## ✅ Phase 6c-iv — Verify

**Completed:** 2026-02-27

- `pnpm typecheck` — 64 errors, all pre-existing (0 new from migration)
- `pnpm dev` — app runs, no visual regressions observed
- Fixed turbo pipeline — added `@workspace/design-system#build` to `dev` task `dependsOn`; design-system now builds before client dev starts
- Fixed `turbo.json` — added explicit `@workspace/design-system#build` entry with correct `dependsOn` + `outputs`
- Added `lint.fix.imports` script to root `package.json` (runs `eslint --fix` for `simple-import-sort/imports`)
- **Known issue noted:** CSS custom property override accumulation visible in DevTools (see Phase 6g)

---

## 🚧 Phase 6d — Replace Radix Component Imports

**Started:** 2026-02-27

### Component mapping

| Radix Themes | Design-system | Notes |
|---|---|---|
| `<Button>` | `<Button>` from `components/Button` | ✅ Done |
| `<Badge>` | `<span className={badge({...})}>` | ✅ Done |
| `<Switch>` | Ark UI `Switch.*` compound + `dsSwitch` recipe | ✅ Done |
| `<Tabs.*>` | Design-system `Tabs.*` | ✅ Done |
| `<DropdownMenu.*>` | Design-system `Menu.*` | ✅ Done |
| `<Callout.*>` | `<div className={callout({...})}>` | ✅ Done |
| `<Card>` | `<div className={card({...})}>` | ✅ Done (added `cardRecipe`) |
| `<Spinner>` | `<LoaderIcon>` + `@keyframes spin` | ✅ Done (spin added to keyframes.css) |
| `<Text>` | `<span>` | ✅ Done |
| `<Heading>` | `<h1>/<h2>/<h3>` | ✅ Done |
| `<DataList.*>` | `<dl>/<div>/<dt>/<dd>` (semantic HTML) | ✅ Done (4 files) |
| `<IconButton>` | `<Button>` from `components/Button` | ✅ Done (LanguagesList, LanguagesListSelected) |
| `<TabNav.*>` | `<div>` + `<button aria-current>` | ✅ Done (AdminNavbar, HiddenMeasureItems) |
| `<Dialog.*>` | `<Dialog.*>` from `@workspace/design-system/forms` | ✅ Done (`GenericDialog` + `LanguageDeleteDialog` migrated) |
| `<AlertDialog.*>` | `<Dialog.Content role="alertdialog">` — Ark has no separate AlertDialog | ✅ Done (rolled into LanguageDeleteDialog) |
| `<TextField>` | `<InputField.Root>` + `<InputField.Slot>` from `forms/InputField` | ✅ DS built — client migration pending |
| `<IconButton>` (forms) | `<Button>` from `components/Button` (same as other IconButton migrations) | ✅ DS ready — client migration pending |
| `<RadioCards.*>` | `<RadioGroup.Root variant="card">` + `<RadioGroup.Item>` from `forms/RadioGroup` | ✅ DS built — client migration pending |
| `<CheckboxGroup.*>` | `<div>` wrapper + `<Checkbox.*>` from `forms/Checkbox` | ✅ DS built — client migration pending |
| PrimeReact `<Slider>` | `<Slider.*>` from `@workspace/design-system/forms` | ✅ DS built — `VolumeSlider.tsx` migration pending |
| `<Theme>` / `ThemeProps` | Deferred | ⏸ Pending 6f |

### What was done (2026-02-28) — Phase 6d-iv Dialog + Slider migration

- Built `forms/Slider` — `Slider.Root/Label/ValueText/Control/Track/Range/Thumb` compound; unwraps Ark's `value: number[]` → single `value: number` / `onValueChange: (value: number) => void`; `Thumb` includes `HiddenInput` internally
- Built `forms/Dialog` — `Dialog.Root/Backdrop/Positioner/Content/Header/Title/Description/Body/Footer/CloseTrigger` compound; `Root` normalises Ark's `onOpenChange({open})` → `(open: boolean) => void`; `Content` accepts `size?: 'xs'|'sm'|'md'|'lg'|'xl'|'cover'|'full'` via `data-size`; `Description` visually hidden by default (`.ds-dialog__description--visible` opt-in)
- Exported `DialogSize` type from `forms/index.ts`
- Added `.sr-only` utility to `forms.css` (replaces Radix `VisuallyHidden`)
- Added `Slider` + `Dialog` to `forms/primitives.ts`
- Migrated `apps/client/src/components/Dialog/GenericDialog.tsx` — removed Radix `Dialog`, `IconButton`, `VisuallyHidden`, `Tabs`; uses DS `Dialog.*` + DS `Tabs.*`; `Dialog.CloseTrigger asChild` wraps `<Button variant="ghost">`; `sr-only` on hidden title
- Migrated `apps/client/src/admin/pages/AdminLanguagesPage/components/LanguageDeleteDialog.tsx` — replaced Radix `AlertDialog.*` with DS `Dialog.*` + `role="alertdialog"` on `Dialog.Content`; uses `.ds-dialog__description--visible` for inline warning text; client `Button` `color` prop (not `colorScheme`)

### What was done (2026-02-28) — Phase 6d-iii DS components built

- Imported `@workspace/design-system/forms/forms.css` in `apps/client/src/main.tsx`
- Built `forms/InputField` — `InputField.Root` + `InputField.Slot` compound; `forwardRef` to `Field.Input`; replaces `TextField.Root` / `TextField.Slot` from Radix Themes (API-compatible drop-in, minus Radix `size` prop)
- Built `forms/Checkbox` — `Checkbox.Root/Control/Indicator/Label/HiddenInput` compound; default indicator uses `CheckIcon`/`MinusIcon` (DS icons registry); CSS handles `checked`/`indeterminate` states
- Built `forms/RadioGroup` — `RadioGroup.Root/Item/ItemControl/Indicator/ItemText/Label` compound; `variant="default"` (traditional radio) or `variant="card"` (full-tile, replaces `RadioCards.*`)
- Created `forms/primitives.ts` — raw Ark re-exports (`Checkbox`, `Field`, `RadioGroup`); only accessible via `@workspace/design-system/forms/primitives` path (deliberate bypass of DS styling); registered as separate package export entry
- Architecture decision: client never imports from `@ark-ui/react` directly — DS is the dependency boundary; `forms/primitives` is the escape hatch

### What was done (2026-02-28) — Phase 6d-ii quick wins

- `DataList.*` → semantic HTML `<dl>/<div>/<dt>/<dd>` (4 files, no new component needed)
- `IconButton` → `<Button>` in `LanguagesList` + `LanguagesListSelected` (color: `red`→`danger`, `orange`→`warning`; size: `2`→`sm`)
- `TabNav.Root` → `<div>`, `TabNav.Link asChild` → `<button aria-current>` in `AdminNavbar` + `HiddenMeasureItems`
- Added `colors` palette export to `@workspace/design-system/tokens` — typed camelCase keys mapping to CSS vars; drop-in v1 replacement (import-only change)
- Removed alpha/transparency token variants — 11-stop shade scale covers in-between needs
- Added ESLint `no-restricted-syntax` rule enforcing numeric spacing props: `gap={4}` not `gap="4"`

### What was done (2026-02-27)

- Added `@keyframes spin` to design-system `src/styles/keyframes.css`; imported in `main.tsx`
- Added `cardRecipe` to design-system (`src/recipes/card.ts`); registered in `panda.preset.ts`
- Renamed Panda recipe key `switch` → `dsSwitch` (avoid reserved keyword in generated `.d.ts`); deleted stale `switch.d.ts` + `switch.mjs` from both `styled-system/` dirs
- Bulk-replaced 42 client files: Text→span, Heading→h1/h2/h3, Spinner→LoaderIcon, Button→local Button, Tabs→DS Tabs, Badge→span+recipe, Callout→div+recipe, Card→div+recipe, Switch→Ark Switch compound, DropdownMenu→DS Menu
- Fixed `AdminDashboardPage.tsx` TS2590 (`<Box css={styles}>` → `<div css={styles}>`)
- Fixed `RelaysConnectionStatus.tsx` — `toggleRelayFunctionality` called with 0 args (not 1)
- Fixed `NoItems.tsx` (missed by bulk pass) — Callout.Root compound → div+callout recipe
- Net new TypeScript errors: 0 (65 total, all pre-existing)

### Remaining client migrations

All DS components are built. Pending client-side wiring:

~~01  apps/client/src/admin/pages/AdminSoundPage/VolumeSlider.tsx                       (PrimeReact Slider → DS Slider)~~
~~02  apps/client/src/components/LanguageSelector/LanguageSelector.tsx                    (RadioCards → RadioGroup variant="card")~~
~~03  apps/client/src/components/Pads/PadGroup/PadGroup.tsx                               (CheckboxGroup.Root → < div >)~~
~~04  apps/client/src/components/SearchBar/SearchBar.tsx                                  (TextField → InputField)~~
~~05  apps/client/src/forms/InputTemperature/InputTemperature.tsx                          (TextField + IconButton → InputField + Button)~~
~~06  apps/client/src/forms/InputTime/InputTime.tsx                                       (TextField + IconButton → InputField + Button)~~
~~07  apps/client/src/forms/SearchableLanguageInput/SearchableLanguageInput.tsx            (TextField → InputField)~~
~~08  apps/client/src/forms/SearchableLanguageInput/SearchableLanguageInputCurated.tsx    (TextField → InputField)~~
~~09  apps/client/src/forms/SelectCustom/SelectCustom.tsx                                 (TextField → InputField)~~
~~10  apps/client/src/forms/SelectSearchable/SelectSearchable.tsx                        (TextField → InputField)~~
11  apps/client/src/App.tsx                                                            (Theme as RadixTheme — keep until 6f)

All files unblocked — DS components for Dialog, Slider, InputField, Checkbox, RadioGroup all built.

---

## ⬜ Phase 6e — Migrate Emotion `.styles.ts` Files

NOTE: I think i will do this gradually / incremental, stated.
TODO: steps below can be done immediately

- ensure ALL imports of COLORS and LAYOUT (some others) variable objects are coming from NEW design-system.
- PERHAPS: for colors, create convenience `colors` export and just change import ??
- OR: the new Panda DS already export colors like that, no ??

**Scope:** Incremental. Not all 117 files need migrating at once.

### Strategy

Do NOT attempt a full rewrite. Work in priority order:

1. **Files that import from `styles/colors/`** — replace with Panda CSS variables (`var(--colors-*)`)
2. **Files that import from `styles/layout/`** — replace with layout token CSS vars
3. **Files that import from `styles/fonts/` or `styles/constants/`** — replace with text recipe or Panda utilities
4. **Files using `useTheme()` / `theme.colors.*`** — replace with Panda CSS variables
5. **Remaining `.styles.ts` files using pure Emotion** — leave until last; Emotion stays in bundle until 6f

### Patterns to replace

| Old pattern | New pattern |
|---|---|
| `import { colors } from 'styles/colors/colors.source'` | Use `var(--colors-*)` or Panda `token()` |
| `useTheme()` → `theme.colors.primary` | `var(--colors-accent-default)` |
| `css\`color: ${theme.colors.text}\`` | `css({ color: 'fg.default' })` or Panda class |
| `import { HEADER_HEIGHT } from 'styles/layout/layout.config'` | `var(--layout-header-height)` from layout tokens |
| `import { FONT_SIZE_* } from 'styles/fonts/'` | Panda `fontSize` token or `text` recipe |

### Steps

1. Audit all `styles/` import paths in `apps/client/src/`
2. Prioritise files with `styles/colors/` imports (highest churn, biggest migration win)
3. Replace in batches — typecheck between batches
4. After each file is migrated: delete the `styles/` import, confirm no TS errors
5. Track progress — when `styles/` import count reaches zero, move to 6f

---

## ⬜ Phase 6f — Remove `styles/` Folder + Cleanup

**Gate:** Zero remaining imports from `apps/client/src/styles/` in all source files.

### Checklist

- [ ] Grep confirms zero `from '.*styles/'` or `from '@/styles/'` imports in `apps/client/src/`
- [ ] Remove `apps/client/src/styles/` directory
- [ ] Remove `@radix-ui/themes` from `apps/client/package.json`
- [ ] Remove `@emotion/react`, `@emotion/styled` from `apps/client/package.json` (if no remaining usage)
- [ ] Remove `EmotionThemeProvider` wrapper (if Emotion fully removed)
- [ ] Update `panda.config.ts` — confirm `conditions.dark` is still correct without Emotion wrapper
- [ ] Remove any lingering `theme.css` overrides that were only needed for Radix Themes
- [ ] Run full `pnpm build` — confirm clean output
- [ ] Run `pnpm typecheck` — zero errors

---

## ⬜ Phase 6g — CSS Custom Property Audit

**When:** After 6f (Radix Themes + Emotion removed). Some overrides will self-resolve then.

**Problem observed (2026-02-27):** DevTools shows hundreds of CSS custom property declarations
being overridden per-element — `--blur`, `--brightness`, `--contrast`, `--translate-x`, etc.
These are Panda CSS's utility reset variables (from the `base` layer) being emitted once per
component/layer, stacking up across inherited elements. With Radix Themes and Emotion also
injecting CSS vars, the cascades multiply.

**Root causes (in priority order):**

1. **Panda CSS base layer resets** — Panda emits utility CSS vars on `*, :before, :after` for every
   component. With many Panda components on one page, these stack visibly in DevTools. They are
   functionally correct (later declarations win) but create visual noise.
2. **Radix Themes CSS vars** — Radix injects its own `--*` token set. Removed in 6f.
3. **Emotion + Radix interaction** — Emotion-scoped class selectors may re-declare Panda vars.
   Resolved when Emotion is removed in 6f.

**Steps:**

1. After 6f, re-audit in DevTools — confirm how many overrides remain
2. If Panda base layer still noisy: review `panda.config.ts` `preflight` setting and utility
   reset scope; consider scoping resets to a container class instead of `*`
3. Audit token definitions in design-system — check for duplicate or conflicting token names
   between Panda tokens, Radix tokens, and legacy `styles/` vars
4. Remove any token aliases that were only bridges for the migration period

---

## Decisions

1. Emotion co-exists with Panda during migration — no hard cutover (2026-02-26)
2. Dark mode via `[data-theme="dark"]` condition — matches `EmotionThemeProvider` (2026-02-26)
3. `panda cssgen` (no PostCSS) — compatible with lightningcss Vite transformer (2026-02-26)
4. `preflight: false` in client `panda.config.ts` — reset already in `theme.css` (2026-02-26)
5. Build `src/grid/` in design-system — replaces both `react-grid-system` and Radix layout primitives (2026-02-27)
6. Grid module uses pre-generated static CSS (`grid.css`), not Panda runtime — no `ScreenClassProvider` or `setConfiguration` needed (2026-02-27)
7. Grid breakpoints align with existing Panda/Tailwind scale (xs/sm/md/lg/xl/xxl); `xxxl` dropped (2026-02-27)
8. `ColSpan` typed as `number | 'content'` — 1-12 constraint enforced by CSS, not TypeScript (2026-02-27)
9. `jsxFramework: 'react'` enabled in client — generates `Box`, `Stack`, `HStack`, `VStack` as React components; `Flex` generated but not used (use `Row` instead) (2026-02-27)
10. Row/Col carry no margin/padding props — spacing is a separate concern handled by `Box` + Panda `css()` (2026-02-27)
11. `justify` props use CSS values (`"space-between"`) not shorthand aliases (`"between"`) — Panda passes values directly to CSS; no hidden mapping layer (2026-02-27)
12. CSS custom property override audit deferred to Phase 6g — majority will self-resolve when Radix Themes + Emotion are removed in 6f (2026-02-27)
13. `colors` palette export added to `@workspace/design-system/tokens` — camelCase keys → CSS vars, drop-in v1 replacement (import-only change, no alpha variants) (2026-02-28)
14. Alpha/transparency token variants removed — 11-stop shade scale (`xxxlight`→`xxxdark`) covers in-between needs without extra tokens (2026-02-28)
15. ESLint enforces numeric spacing props on Panda layout components — `gap={4}` not `gap="4"` (2026-02-28)
16. DS is the Ark UI dependency boundary — client never imports from `@ark-ui/react` directly; `forms/primitives` and `components/primitives` are the explicit escape hatch paths (2026-02-28)
17. `forms/primitives` path convention — raw Ark re-exports only accessible via `/primitives` suffix; `forms/index` has zero primitive re-exports; deliberate import = deliberate bypass (2026-02-28)
18. `TextField` renamed `InputField` in DS — aligns with client's `Input*` naming convention (InputPassword, InputTime, etc.) and alphabetical grouping (2026-02-28)
19. `RadioGroup variant="card"` covers `RadioCards` use case — same compound structure, CSS differentiation via `data-variant`; no separate RadioCards component needed (2026-02-28)
20. Dialog size scale: `xs·sm·md·lg·xl·cover·full` — same scale used across all DS components; `cover` = 95vw/95vh, `full` = 100vw/100vh borderless; aligned with Park UI vocabulary (2026-02-28)
21. `AlertDialog` mapped to `Dialog.Content role="alertdialog"` — Ark UI has no separate AlertDialog primitive; `role` attribute provides equivalent accessibility semantics (2026-02-28)

---

## Open Questions

1. **Spinner** — ✅ Resolved: `LoaderIcon` + `@keyframes spin` in keyframes.css (no new recipe needed).
2. **Card** — ✅ Resolved: `cardRecipe` added to design-system.
3. **Emotion removal** — 🤔 [TBD] Is full Emotion removal the goal after 6f, or keep Emotion for complex one-off styles?
4. **Token override scope** — After 6f, if Panda base layer resets are still noisy, scope to container vs `*`?
