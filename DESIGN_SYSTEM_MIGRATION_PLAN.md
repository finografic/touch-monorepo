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
| 6c | Replace Radix Themes layout primitives | 🚧 Next |
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

## 🚧 Phase 6c — Replace Radix Themes Layout Primitives

**Scope:** Remove all layout-only Radix Themes usage. Components (Button, Dialog, etc.) are handled in 6d.

### Inventory

| Component | Approx. uses | Replacement |
|---|---|---|
| `<Flex>` | 28 | `<div>` + Panda flex utilities |
| `<Box>` | 22 | `<div>` or semantic element + Panda utilities |
| `<Grid>` | ~5 | `<div>` + Panda grid utilities |
| `<Container>` | ~3 | `<div>` + Panda `maxW` / `mx: auto` |
| `<Text>` (layout) | ~10 | `<span>` / `<p>` + `text` recipe |
| `<Heading>` | ~5 | `<h1>`–`<h6>` + `text` recipe |
| `<Section>` | ~2 | `<section>` + Panda utilities |

### Approach

**Option A — Inline replacement (no wrapper):**
Each `<Flex direction="column" gap="2">` becomes `<div className={css({ display: 'flex', flexDirection: 'column', gap: '2' })}>`.

**Option B — Thin local wrappers (recommended for high-frequency patterns):**
Add `apps/client/src/components/layout/` with `Stack`, `Row`, `Col` wrappers that accept
a minimal prop API and emit Panda utility classes. Reduces noise on the 50+ call sites.

```tsx
// Example — Stack.tsx
const Stack = ({ gap = '4', children, ...props }) => (
  <div className={css({ display: 'flex', flexDirection: 'column', gap })} {...props}>
    {children}
  </div>
);
```

### Steps

1. Audit all `@radix-ui/themes` imports in `apps/client/src/` — list files
2. Decide: Option A or B (or hybrid — wrappers for `Flex`/`Box`, inline for `Grid`/`Container`)
3. Create local layout wrappers if Option B
4. Replace layout primitive usages file-by-file
5. Verify no remaining `Flex`, `Box`, `Grid`, `Container`, `Section` imports from `@radix-ui/themes`
6. Run `pnpm typecheck` + `pnpm dev` — confirm no visual regressions

### Key constraint

After Phase 6c, `@radix-ui/themes` imports in client should only remain for **component** usage
(Button, Dialog, Badge, etc.) — those are handled in 6d.

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
5. Layout primitives: thin local wrappers preferred over 50+ inline `css()` call sites (TBD — confirm in 6c)

---

## Open Questions

1. **Spinner** — Add `spinnerRecipe` to design-system, keep Radix `<Spinner>`, or inline CSS? Blocking 6d.
2. **Card** — Add `cardRecipe` or use inline Panda `css()` for 5 call sites?
3. **Local layout wrappers** — Confirm Option A (inline) vs Option B (Stack/Row/Col) before starting 6c.
4. **Emotion removal** — Is full Emotion removal the goal after 6f, or keep Emotion for complex one-off styles?
