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
| 6c | Build Grid module in design-system + replace all layout primitives | 🚧 Next |
| 6d | Swap Radix component imports → design-system | ⬜ Pending |
| 6e | Migrate Emotion `.styles.ts` files → Panda | ⬜ Pending |
| 6f | Remove `styles/` folder + Radix Themes + Emotion | ⬜ Pending |

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

## 🚧 Phase 6c — Replace All Layout Primitives (Grid Module)

**Scope:** Replace BOTH `react-grid-system` AND Radix Themes layout primitives in a single
pass by building a proper `Grid` module inside `@workspace/design-system`.

---

### Inventory — `react-grid-system` (archived Nov 2025)

> The package was archived ~3 months ago. It still works but is a dead end.
> All usages carry a `// DEPRECATED` comment in the client already.

| Component / Export | Files | Notes |
|---|---|---|
| `Row` | 11 | Most common — flex row wrapper |
| `Col` | 10 | Responsive column (xs/sm/md/lg/xl props) |
| `Container` | 1 | Header.tsx only |
| `ScreenClassProvider` | 1 | App.tsx — wraps entire app |
| `setConfiguration` | 3 | AdminLayout.tsx, Layout.tsx, viewport.queries.ts |
| `Visible` | 1 | DevScreenSize dev tool only |
| **Total files** | **16** | |

### Inventory — Radix Themes layout primitives

| Component | Approx. uses | Notes |
|---|---|---|
| `<Flex>` | 28 | Flex container with align/justify/gap props |
| `<Box>` | 22 | Generic block wrapper |
| `<Grid>` | ~5 | CSS grid wrapper |
| `<Container>` | ~3 | Max-width centered wrapper |
| `<Text>` (layout) | ~10 | Inline/block text with variant props |
| `<Heading>` | ~5 | Heading element with size variants |
| `<Section>` | ~2 | Semantic section wrapper |

**Combined total: ~86 layout call sites across two separate systems.**

---

### Recommendation: Build `src/grid/` in the design-system

Rather than migrating to plain divs or splitting into two separate passes,
build `Row`, `Col`, and `Container` as first-class design-system components
backed by **Panda CSS** (static CSS classes, not JS inline styles).

**Why not just fork react-grid-system:**

| react-grid-system (original) | Design-system Grid module |
|---|---|
| Inline styles computed at runtime | Static CSS classes via Panda codegen |
| `window.resize` → React context → re-render | Pure CSS media queries — zero JS |
| `ScreenClassProvider` required at app root | No provider needed |
| `setConfiguration()` to set breakpoints | Breakpoints live in `panda.config.ts` |
| 7 breakpoints (xxl, xxxl) | 6 breakpoints — matches existing tokens |
| Archived, no future updates | Owned by us, evolves with the design-system |

**The prop API stays identical** — `<Col xs={12} md={6}>` works exactly the same.
The difference is in the implementation: instead of JS measuring the window, Panda
generates a CSS class for each responsive width at build time.

**Breakpoint alignment — design-system vs react-grid-system:**

| Name | react-grid-system | Design-system (Panda/Tailwind) |
|---|---|---|
| xs | 0px | 0px |
| sm | 576px | 640px |
| md | 768px | 768px ✓ |
| lg | 992px | 1024px |
| xl | 1200px | 1280px |
| 2xl / xxl | 1600px | 1536px |
| xxxl | 1920px | — (drop or map to 2xl) |

Small shifts at sm/lg/xl — not meaningful for the layouts we have.
Drop `xxxl`; map any existing `xxl` usages to `2xl`.

---

### Design — `src/grid/` module

**Components to build:**

```
src/grid/
  Col.tsx          Responsive column — xs/sm/md/lg/xl/2xl props (1-12 or "content")
  Row.tsx          Flex row container — align, justify, gap, wrap props
  Container.tsx    Max-width centered wrapper — fluid prop, uses layout tokens
  index.ts         Barrel export
```

**Col props:**
```ts
xs?: 1-12 | 'content'   // width at base (mobile-first)
sm?: 1-12 | 'content'
md?: 1-12 | 'content'
lg?: 1-12 | 'content'
xl?: 1-12 | 'content'
'2xl'?: 1-12 | 'content'
offset?: { xs?, sm?, md?, lg?, xl?, '2xl'? }
order?: { xs?, sm?, md?, lg?, xl?, '2xl'? }
```

**Row props:**
```ts
align?: 'start' | 'center' | 'end' | 'stretch'
justify?: 'start' | 'center' | 'end' | 'between' | 'around'
gap?: SpacingToken       // maps to Panda spacing tokens
wrap?: 'wrap' | 'nowrap'
direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse'
```

**Container props:**
```ts
fluid?: boolean          // true = 100% width, false = maxWidth per breakpoint
maxW?: string            // override (defaults to layout token contentMaxWidth)
```

**Panda implementation sketch (Col):**
```ts
// Maps xs={6} → { base: '50%', sm: ..., md: ... }
// col(n) = `${(n / 12) * 100}%`
// Uses css({ width: { base: col(xs), md: col(md) }, ... })
```

**Export path:** `@workspace/design-system/grid`
Added to `package.json` exports map alongside `./icons`, `./panda.preset`.

---

### Also replaces: Radix Flex/Box/Grid/Container

Once `Row`, `Col`, `Container` exist, Radix layout primitives become unnecessary:

| Radix Themes | Replacement |
|---|---|
| `<Flex>` | `<Row>` (if horizontal) or `<div className={css({...})}>` |
| `<Box>` | `<div>` with Panda utilities inline |
| `<Grid>` | `<div className={css({ display: 'grid', ... })}>` |
| `<Container>` | `<Container>` from design-system/grid |
| `<Text>` | `<span>` / `<p>` + `text` recipe |
| `<Heading>` | `<h1>`–`<h6>` + `text` recipe |
| `<Section>` | `<section>` + Panda utilities |

---

### Steps

**6c-i — Build the Grid module in design-system**
1. Create `src/grid/Col.tsx`, `Row.tsx`, `Container.tsx`, `index.ts`
2. Add `./grid` to `package.json` exports map
3. Run `panda codegen` + `pnpm typecheck` + `pnpm build` — confirm clean

**6c-ii — Replace react-grid-system (16 files)**
1. Remove `ScreenClassProvider` from `App.tsx` + remove `setConfiguration` calls (3 files)
2. Replace `Row`/`Col`/`Container` imports → `@workspace/design-system/grid` (11/10/1 files)
3. Replace `Visible` in DevScreenSize with Panda responsive `display` utility
4. Remove `react-grid-system` from `apps/client/package.json`

**6c-iii — Replace Radix Themes layout primitives (~86 call sites)**
1. Grep `@radix-ui/themes` for layout-only imports: `Flex`, `Box`, `Grid`, `Container`, `Text`, `Heading`, `Section`
2. Replace file-by-file — use `<Row>`/`<Col>` where bootstrap grid makes sense; `<div css={...}>` otherwise
3. Verify no remaining layout-only `@radix-ui/themes` imports

**6c-iv — Verify**
- `pnpm typecheck` clean
- `pnpm dev` — no visual regressions
- `@radix-ui/themes` imports remaining only in component usage files (for 6d)

---

## ⬜ Phase 6d — Replace Radix Component Imports

**Scope:** Swap every Radix Themes component import for the design-system equivalent.

### Component mapping

| Radix Themes | Design-system | Notes |
|---|---|---|
| `<Button>` | `<Button>` from `@workspace/design-system` | Recipe: `buttonRecipe` |
| `<Badge>` | `<Badge>` | Recipe: `badgeRecipe` |
| `<Dialog.*>` | `<Dialog.*>` | Slot recipe: `dialogRecipe` |
| `<Checkbox>` | `<Checkbox>` / `<CheckboxField>` | Slot recipe: `checkboxRecipe` |
| `<Switch>` | `<Switch>` / `<SwitchField>` | Recipe: `switchRecipe` |
| `<Select.*>` | `<Select.*>` | Slot recipe: `selectRecipe` |
| `<Tabs.*>` | `<Tabs.*>` | Slot recipe: `tabsRecipe` |
| `<Tooltip.*>` | `<Tooltip.*>` | Slot recipe: `tooltipRecipe` |
| `<Popover.*>` | `<Popover.*>` | Slot recipe: `popoverRecipe` |
| `<DropdownMenu.*>` | `<Menu.*>` | Slot recipe: `menuRecipe` |
| `<TextField>` | `<input>` + `inputRecipe` | Recipe: `inputRecipe` |
| `<Callout.*>` | inline `calloutRecipe` | Recipe exists |
| `<Spinner>` | TBD — **blocker** | No design-system recipe yet |
| `<Card>` | TBD | 5 uses; add recipe or use inline Panda |

### Blockers

- **Spinner** — no recipe in design-system. Decision needed before 6d can complete:
  - A) Add `spinnerRecipe` to design-system (Ark UI has a spinner primitive)
  - B) Keep Radix `<Spinner>` for now; remove after 6e
  - C) Inline CSS animation (simplest, no dep)
- **Card** — add `cardRecipe` to design-system, or use inline Panda `css()` for 5 call sites

### Steps

1. Resolve Spinner + Card blockers
2. Grep all `from '@radix-ui/themes'` imports in `apps/client/src/`
3. Categorise: layout (done in 6c) vs component
4. Replace component imports file-by-file; start with leaf components (Button, Badge)
5. Work inward to compound components (Dialog, Select, Tabs)
6. Run `pnpm typecheck` + `pnpm dev` after each significant file batch
7. Confirm `@radix-ui/themes` has zero remaining imports in `apps/client/src/`

---

## ⬜ Phase 6e — Migrate Emotion `.styles.ts` Files

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

## Decisions

1. Emotion co-exists with Panda during migration — no hard cutover (2026-02-26)
2. Dark mode via `[data-theme="dark"]` condition — matches `EmotionThemeProvider` (2026-02-26)
3. `panda cssgen` (no PostCSS) — compatible with lightningcss Vite transformer (2026-02-26)
4. `preflight: false` in client `panda.config.ts` — reset already in `theme.css` (2026-02-26)
5. Build `src/grid/` in design-system — replaces both `react-grid-system` and Radix layout primitives (2026-02-27)
6. Grid module uses Panda CSS (static classes); no `ScreenClassProvider` or `setConfiguration` needed (2026-02-27)
7. Grid breakpoints align with existing Panda/Tailwind scale (xs/sm/md/lg/xl/2xl); `xxxl` dropped (2026-02-27)

---

## Open Questions

1. **Spinner** — Add `spinnerRecipe` to design-system, keep Radix `<Spinner>`, or inline CSS? Blocking 6d.
2. **Card** — Add `cardRecipe` or use inline Panda `css()` for 5 call sites?
3. **Emotion removal** — Is full Emotion removal the goal after 6f, or keep Emotion for complex one-off styles?
