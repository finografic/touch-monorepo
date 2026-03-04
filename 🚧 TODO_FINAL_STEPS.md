# Design System Migration — Final Steps

> **Where we are:** Phases 6a–6d complete. The design-system package is fully built.
> All Radix component imports are replaced. 14 unused `@radix-ui` packages removed.
> What remains is wiring the `styles/` folder out of existence and cleaning up
> the final deps (`@radix-ui/themes`, Emotion).

---

## What's Left At a Glance

| Work | Scope | Blocker |
|---|---|---|
| **6e** — Migrate `styles/` imports to DS tokens | ~107 imports across ~60 files | None — start any time |
| **6f** — Remove `styles/` folder, Radix Themes, Emotion | ~10 deletions + 1 file edit | 6e must be zero |
| **6g** — CSS custom property audit | DevTools investigation | 6f |
| **AdminNavigation** — `TabNav` from `@radix-ui/themes` | 1 component rebuild | Optional / 6f forces it |
| **PrimeReact** | DataTable, Dropdown, InputNumber, ListBox | Separate concern, no blocker |

---

## Phase 6e — Migrate `styles/` Imports

### Current state

~44 `from 'styles/...'` imports remain (was 107 — 44 icons + 19 colors/layout/viewport migrated). Most are in `.styles.ts` (Emotion) files.
The barrel `from 'styles'` import was already migrated to `from '@workspace/design-system/tokens'`
in a previous session; compat re-exports live in `_migration.tokens.ts`.

**Breakdown by path:**

| Done | Path | Count | Action |
|---|---|---|---|
| ✅ | `styles/icons` | 44 | Added named exports to DS icons; bulk-replaced import path |
| ✅ | `styles/colors/palette.types` | 8 | Replaced `ColorPalette` with DS `ColorsKey` |
| ✅ | `styles/colors/colors-direct` | 4 | Replaced with `colors` from DS tokens |
| ✅ | `styles/viewport/viewport.types` | 4 | Replaced with DS `ScreenClass` / `BreakpointMap`; `xxl` → `'2xl'` in Header.tsx |
| ✅ | `styles/layout/base.constants` | 3 | Replaced with DS `spacing` via `const padding = spacing` alias |
| ☐ | `styles/project/buttons.styles` | 6 | Replace with DS button recipe or Panda utilities |
| ☐ | `styles/forms/forms.constants` | 6 | Replace with DS form constants or inline values |
| ☐ | `styles/forms/forms.styles` | 5 | Replace with DS `forms.css` classes or Panda `css()` |
| ☐ | `styles/themes/emotion-theme.types` | 3 | Replace with DS token types |
| ☐ | Other (fonts, hooks, utils, radix-ui) | ~24 | Case-by-case |

### Strategy

Work in batches. Typecheck after each batch. Do not attempt a full rewrite in one pass.

**Batch 1 — Colors (highest value, ~12 files)**

Files importing `styles/colors/palette.types` or `styles/colors/colors-direct`:

```ts
// Before
import type { ColorPalette } from 'styles/colors/palette.types';
import { colorsDirect } from 'styles/colors/colors-direct';

// After
import type { ColorPalette } from '@workspace/design-system/tokens';
import { colors } from '@workspace/design-system/tokens';
```

**Batch 2 — Layout + Viewport (~7 files)**

```ts
// Before
import { HEADER_HEIGHT, SIDEBAR_WIDTH } from 'styles/layout/base.constants';
import type { Breakpoint } from 'styles/viewport/viewport.types';

// After
// Use CSS vars directly: var(--layout-header-height)
// Or import from DS tokens if layout constants are exported there
```

**Batch 3 — Forms (~11 files)**

Replace `styles/forms/forms.styles` and `styles/forms/forms.constants` with DS
`forms.css` BEM classes or Panda `css()` utilities. The DS `forms.css` is already
imported in `main.tsx`.

**Batch 4 — Emotion `.styles.ts` files themselves**

Each `.styles.ts` file that previously used `import { colors, layout } from 'styles'`
now imports from DS tokens via `_migration.tokens.ts`. The Emotion `css` template
tags can stay as-is — Emotion is only removed in 6f. The goal here is just to
ensure every value reference comes from DS tokens, not the old `styles/` directory.

**~~Batch 5 — Icons (44 files)~~ ✅ Done**

Added named exports to `packages/design-system/src/icons/index.ts` (destructured from
the `icons` object). Import path bulk-replaced across all 46 files:

```ts
// Before
import { ChevronDownIcon } from 'styles/icons';
// After
import { ChevronDownIcon } from '@workspace/design-system/icons';
```

### Done when

```bash
grep -r "from 'styles/" apps/client/src/ --include="*.ts" --include="*.tsx"
# → 0 results
```

---

## Phase 6f — Remove `styles/` + Final Dep Cleanup

**Requires:** Phase 6e complete.

This is a single focused session. Work top-down through this checklist.

### 1. Confirm zero `styles/` imports

```bash
grep -r "from 'styles/" apps/client/src/
# Must return nothing before proceeding
```

### 2. Delete `apps/client/src/styles/`

```bash
rm -rf apps/client/src/styles/
```

### 3. Remove Radix Themes

In `apps/client/src/App.tsx`:
- Remove `Theme as RadixTheme` import
- Remove `<RadixTheme>` wrapper (keep children)

In `apps/client/src/main.tsx`:
- Remove `import '@radix-ui/themes/styles.css'`
- Remove `import './styles/radix-ui/overrides.css'` (file deleted above)

In `apps/client/package.json`:
- Remove `"@radix-ui/themes"`
- Remove `"radix-themes-tw"` (Tailwind bridge — no longer needed)

### 4. Remove Emotion

In `apps/client/package.json`:
- Remove `"@emotion/react"`, `"@emotion/styled"`, `"@emotion/css"`

Remove `EmotionThemeProvider` from `App.tsx` (or keep if any remaining Emotion
`.styles.ts` files are still in use — but the goal is zero).

### 5. Update dark mode condition

`panda.config.ts` currently uses `conditions.dark = '[data-theme="dark"] &'` to
match `EmotionThemeProvider`. Once the Emotion wrapper is gone, confirm that
`[data-theme="dark"]` is still set on the root element by whatever replaces it
(likely just a direct `document.documentElement.setAttribute` or a Zustand store).

### 6. Audit `theme.css`

Open `apps/client/src/theme.css`. Remove any rules that were compensating for
Radix Themes global styles (overrides in `styles/radix-ui/overrides.css` are
a clue — check what they were correcting and whether the correction is still
needed without Radix present).

### 7. Verify

```bash
pnpm typecheck    # target: 0 errors
pnpm build        # must pass clean
```

---

## Phase 6g — CSS Custom Property Audit

**When:** After 6f.

### Problem

DevTools shows hundreds of `--blur`, `--brightness`, `--translate-x` etc. custom
property declarations stacking per-element. Root causes are:

1. **Panda CSS base layer** — utility reset vars emitted on `*, :before, :after` per component
2. **Radix Themes** — injects its own `--*` token set *(gone after 6f)*
3. **Emotion** — scoped class selectors may re-declare Panda vars *(gone after 6f)*

### Steps

1. Open DevTools after 6f and re-audit — how many overrides remain?
2. If Panda noise is still high, consider setting `utilities: { reset: 'container' }` or
   similar in `panda.config.ts` to scope resets to a container class instead of `*`
3. Audit `_migration.tokens.ts` — remove any compat exports that are no longer imported
4. Check for duplicate token names between Panda tokens and any remaining custom properties

---

## AdminNavigation — `TabNav` Hold

`apps/client/src/admin/components/AdminNavigation/AdminNavbar.tsx` intentionally
retains `TabNav` from `@radix-ui/themes`. This is the one Radix Themes component
held back by design.

**When to address:** Either before 6f (migrate `AdminNavbar` to use plain buttons
with active state styling matching what `TabNav` provided), or let 6f force it
(removing `@radix-ui/themes` will break the build, which surfaces the migration).

**Migration approach:**

`TabNav.Root` renders as a flex row of tab-style buttons. Replace with:

```tsx
// Before (AdminNavbar.tsx)
<TabNav.Root size="2" className="admin-nav" style={{ justifyContent: 'center' }}>
  <TabNav.Link asChild active={isActive}>
    <button ...>{navItem.label}</button>
  </TabNav.Link>
</TabNav.Root>

// After — plain buttons, active state via className
<div className="admin-nav" role="tablist" style={{ justifyContent: 'center' }}>
  <button
    role="tab"
    aria-selected={isActive}
    className={`nav-button ${isActive ? 'active' : ''}`}
    ...
  >
    {navItem.label}
  </button>
</div>
```

The visual styling that `TabNav` provided lives in `styles/radix-ui/overrides.css`
and the component's own `.styles.ts`. Once Radix is gone, style the active tab
button directly in the component's Emotion styles or migrate to Panda.

---

## PrimeReact — Not Part of This Migration

The following files use PrimeReact components that have no DS equivalent.
They are **not blocked** by this migration and can stay long-term or be
replaced as separate work items.

| File | Component | Complexity |
|---|---|---|
| `SelectAlt.tsx` | `Dropdown` (editable mode) | Medium |
| `SelectWithNew.tsx` | `Dropdown` (editable + "add new") | High |
| `TemperatureInputField.tsx` | `InputNumber` (locale, spinners, °C) | Medium |
| `ListBoxSelect.tsx` | `ListBox` (visible list) | Low |
| `OrdersTable.tsx` | `DataTable` (sortable/filterable table) | High |

If `PrimeReactProvider` in `main.tsx` becomes the only reason PrimeReact is
in the bundle, and these components are admin-only / low-traffic, consider
lazy-loading the `PrimeReactProvider` subtree.

---

## Recommended Order of Work

```
1. Phase 6e — Batch 1 (colors)         ~1 hour
2. Phase 6e — Batch 2 (layout/viewport) ~30 min
3. Phase 6e — Batch 3 (forms)           ~1 hour
4. Phase 6e — Batch 4 (styles.ts files) ~1–2 hours
5. Phase 6e — Batch 5 (icons decision)  ~30 min
6. AdminNavigation TabNav migration      ~1 hour
7. Phase 6f — Delete + cleanup          ~1 hour
8. Phase 6g — DevTools audit            ~30 min
```

Total estimated effort: **~7–8 hours** across sessions.
