# Design System — Draft Plan

> **Goal:** Get `@workspace/design-system` to a draft state that can be plugged into `apps/client`,
> replacing `apps/client/src/styles/` as the style source of truth.
>
> **Expect breakage.** Client will need significant edits — that's fine and expected.
> The old `styles/` folder stays as a reference during the transition.

---

## Current State

### Done
- [x] Color tokens — 11-stop word-name shade scale (`xxxlight`…`xxxdark`), semantic tokens (`bg.*`, `fg.*`, `border.*`, `accent.*`)
- [x] Typography tokens — font families, sizes, weights, line heights, text styles
- [x] Spacing tokens — scale, radii, border widths, shadows, z-index
- [x] Animation tokens — keyframes, durations, easings
- [x] Viewport module — `BREAKPOINTS`, media query helpers, conversion utils
- [x] Panda CSS preset — single import for consuming apps
- [x] Recipes — `button`, `badge`, `callout`, `input`, `switch`
- [x] Components — `Button`, `Switch`, `Dialog`, `Checkbox`, `Toast`
- [x] Palette generator — OKLCH ramp utilities in `src/palette/`
- [x] Global CSS — reset, keyframes, base styles

### Not Yet Started
Everything below.

---

## Phase 1 — Token Completeness

The token layer needs to cover everything `styles/` currently provides before any client migration.

### 1a. Layout tokens
Reference: `styles/layout/layout.config.ts`, `styles/layout/base.constants.ts`

App-level structural values. These live in the design system as tokens but are
**consumed and overridden** per-app — they are not baked into the preset.

```
headerHeight    70px
footerHeight    70px
sidebarWidth    300px
navbarHeight    41px
contentMaxWidth 1200px
```

Add to `src/tokens/layout.tokens.ts` and export from `src/tokens/index.ts`.
Document clearly that apps are expected to override these.

### 1b. Color token audit
Reference: `styles/colors/colors.source.ts`

- Verify base OKLCH values match V1 source (primary, secondary, success, warning, danger, info, grey, default, text)
- V1 had opacity variants (`primary25`, `primary50`, `primary75`) — evaluate whether
  these belong in base tokens or as CSS utilities (lean toward utilities)
- V1 had a `useColors` hook (`styles/hooks/useColors.ts`) — not needed once Panda
  utilities are in place, but note for migration

### 1c. Typography completeness
Reference: `styles/fonts/typography.contants.ts`, `styles/constants/typography.constants.ts`

- Confirm font stacks match V1
- Add `letterSpacing` tokens if missing
- Add `textTransform` / `fontStyle` if used in client

---

## Phase 2 — Recipe Completeness

Recipes are the bridge between tokens and components. Anything that has repeated
visual variants in the client needs a recipe.

### Missing recipes (priority order)

| Recipe | Reference in styles/ | Notes |
|---|---|---|
| `text` | `styles/fonts/typography.contants.ts` | Heading + body variants |
| `label` | `styles/forms/forms-placeholders.styles.ts` | Form labels |
| `form-field` | `styles/forms/forms.styles.ts` | Field wrapper (label + input + error) |
| `select` | `styles/forms/forms-select.styles.ts` | Native select styling |
| `avatar` | — | Circular image/initials |
| `spinner` | — | Loading indicator |
| `progress` | — | Progress bar |
| `tabs` | — | Tab strip + panel |
| `menu` | — | Dropdown menu items |
| `tooltip` | — | Tooltip bubble |

Each recipe follows the same CVA pattern already established in `src/recipes/`.

### Existing recipes to revisit
- `button.ts` — compound variants cover primary/danger/etc.; check against `styles/constants/button.constants.ts` for any missing states (loading, icon-only)
- `input.ts` — add error state, optional icon slot

---

## Phase 3 — Component Completeness (Ark UI wrappers)

Components wrap Ark UI primitives with design system recipes. The bar is: anything
the client renders that has interactive state (focus, disabled, open/closed) needs
an Ark wrapper to get accessibility for free.

### Missing components (priority order)

| Component | Ark primitive | Recipe needed |
|---|---|---|
| `Select` | `@ark-ui/react/select` | new |
| `Combobox` | `@ark-ui/react/combobox` | reuse input + new dropdown |
| `Menu` | `@ark-ui/react/menu` | menu recipe |
| `Tabs` | `@ark-ui/react/tabs` | tabs recipe |
| `Accordion` | `@ark-ui/react/accordion` | new |
| `Tooltip` | `@ark-ui/react/tooltip` | tooltip recipe |
| `Popover` | `@ark-ui/react/popover` | reuse panel/card |
| `Radio` | `@ark-ui/react/radio-group` | reuse checkbox pattern |
| `NumberInput` | `@ark-ui/react/number-input` | reuse input |
| `Slider` | `@ark-ui/react/slider` | new |

Existing component stubs in `src/components/` (`Dialog`, `Checkbox`, `Toast`) need
to be fleshed out with proper recipe wiring — they're currently re-exports.

---

## Phase 4 — Global Styles

Reference: `styles/global.styles.ts`, `styles/icons/icons.css`

Things currently in `styles/global.styles.ts` that need to land in the preset:

- **Scrollbar styling** — custom thin scrollbar, OS-aware (`::-webkit-scrollbar`)
- **Focus-visible ring** — consistent focus outline using `accent.focusRing`
- **Selection color** — `::selection` background using accent token
- **Icon normalization** — `svg` sizing, `currentColor` stroke
- **Font loading** — decide: self-hosted vs system stack (currently system stack in tokens, fine)

These go into `src/styles/global.css` and are applied via `globalCss` in the preset.

---

## Phase 5 — Build & Distribution Validation

Before plugging into client, the package must build cleanly.

- [ ] Run `tsup` — verify `dist/` output includes all new modules (viewport, layout tokens)
- [ ] Run `panda codegen` in a test context — verify all token references resolve (no broken `{colors.*.xlight}` etc.)
- [ ] Verify `panda.preset.ts` compiles and is importable from outside the package
- [ ] Confirm `package.json` exports map covers `./panda.preset` and `./styles/global.css`
- [ ] Check for TypeScript errors across all `src/` files

---

## Phase 6 — Client Migration (expect breakage)

This is not a lift-and-shift. It's a deliberate replacement pass.

### Approach
1. **Add the preset to `apps/client/panda.config.ts`** — this is the first test; Panda codegen will fail on anything that doesn't resolve
2. **Replace Emotion theme usage** — `useTheme()` / `theme.colors.*` calls in components need to become Panda utility classes or CSS variables
3. **Replace `styles/` imports** — work file-by-file through the client; `styles/colors/*`, `styles/fonts/*`, `styles/layout/*`, `styles/viewport/*` all have design-system equivalents
4. **Replace Radix UI component usage** — `@radix-ui/react-*` → Ark UI wrappers from design system (this is the largest change)
5. **Remove `styles/` folder** — only once all references are gone

### Expected breakage areas
- Every file that imports from `styles/colors/` — color names will differ (OKLCH shades vs hex theme)
- Every file using `@emotion/react` css template tag — needs Panda `css()` or utility classes
- Radix UI `<Flex>`, `<Box>`, `<Text>` layout primitives — no direct equivalent in Ark; use HTML + Panda utilities
- `useColors()` hook — remove; access colors via Panda tokens or CSS variables
- App layout dimensions (header/footer height etc.) — will move to layout tokens

### Keep `styles/` as reference while migrating
- Do NOT delete `styles/` until migration is done
- Use it to verify token values match what client currently renders
- The `styles/colors/colors.source.ts` OKLCH values are the ground truth for `baseColors` in the design system

---

## Rough Priority Order

```
Phase 1a  Layout tokens
Phase 2   Missing recipes (text, form-field, label first)
Phase 3   Flesh out Dialog, Checkbox, Toast stubs
Phase 4   Global styles (scrollbar, focus ring)
Phase 5   Build validation
Phase 1b  Color token audit (alongside Phase 5 — panda codegen will surface gaps)
Phase 3   Remaining components (Select, Menu, Tabs)
Phase 6   Client migration
```

---

## Open Questions

- **Emotion co-existence:** Will Panda and Emotion run side-by-side during migration, or do we do a hard cutover? Side-by-side is safer but messy.
- **Radix layout primitives:** Client uses `<Flex>`, `<Box>`, `<Grid>` from Radix Themes heavily. Need a plan for replacing these (Panda patterns + semantic HTML, or a layout utility layer).
- **Dark mode trigger:** Panda uses a `.dark` class or `prefers-color-scheme`. Client needs to decide the mechanism and wire it up before semantic tokens are testable.
- **Font loading:** Currently system stack in tokens. If client moves to a custom font, update `fontTokens` in typography and add `@font-face` to global CSS.
- **Icon system:** V1 has `styles/icons/`. Client likely uses a specific icon library. Decide whether icons belong in the design system or stay app-side.
