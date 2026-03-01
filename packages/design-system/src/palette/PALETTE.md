# palette/

This folder is the **color system foundation** — the inputs, algorithm, and reference
map that the design system's color tokens are built from. Nothing here is a token
definition; everything here feeds into `tokens/colors.tokens.ts`.

---

## Files

### `colors.base.ts`

The **single source of truth** for the design system's brand colors.

Contains `BASE_COLORS` — a flat object of named OKLCH color strings (plus fixed
`white`, `black`, `transparent`). This is the only file a developer needs to touch
when changing the palette. Swap a value here and every shade, token, and semantic
alias updates automatically.

All values use the OKLCH color space (`oklch(L% C H)`), which provides perceptually
uniform lightness and avoids the hue shifts and muddying that occur in RGB/HSL.

```
primary   → oklch(48.8% 0.243 264.376)   (blue)
secondary → oklch(49.6% 0.265 301.924)   (purple)
success   → oklch(65.4% 0.194 149.214)   (green)
warning   → oklch(76.9% 0.188 70.08)     (amber)
danger    → oklch(57.7% 0.245 27.325)    (red)
info      → oklch(58.8% 0.158 241.966)   (cyan)
default   → oklch(55.3% 0.013 58.071)    (stone/neutral)
grey      → oklch(55.2% 0.016 285.938)   (zinc)
text      → oklch(28% 0 0)               (near-black)
```

---

### `shades.utils.ts`

Exports `buildShadeScale(base: string)` — given a single OKLCH color string,
returns a Panda CSS token object with 11 named shade stops plus a `DEFAULT` alias.

Shades are generated via CSS `color-mix(in oklch, …)`, which keeps interpolation
in OKLCH space — no conversion to RGB, no muddying at midpoints.

**Light side** (mixed toward white):

| Stop       | % of base | ~ TW numeric |
| ---------- | --------- | ------------ |
| `xxxlight` | 5%        | 50           |
| `xxlight`  | 10%       | 100          |
| `xlight`   | 20%       | 200          |
| `lighter`  | 38%       | 300          |
| `light`    | 58%       | 400          |

**Anchor:**

| Stop   | value      | ~ TW numeric |
| ------ | ---------- | ------------ |
| `base` | base as-is | 500          |

**Dark side** (mixed toward black):

| Stop      | % of base | ~ TW numeric |
| --------- | --------- | ------------ |
| `dark`    | 82%       | 600          |
| `darker`  | 65%       | 700          |
| `xdark`   | 47%       | 800          |
| `xxdark`  | 30%       | 900          |
| `xxxdark` | 15%       | 950          |

---

### `colors.palette.ts`

A flat TypeScript object (`colors`) that maps every shade stop to its CSS custom
property reference (`var(--colors-*)`).

This is the **consumer-facing color map** — imported by client and component code
when a raw CSS variable reference is needed outside of Panda's utility system.

```ts
import { colors } from '@workspace/design-system/tokens';

colors.primaryLight       // → var(--colors-primary-light)
colors.dangerXXXLight     // → var(--colors-danger-xxxlight)
colors.grey               // → var(--colors-grey)
```

Also includes legacy `v1` aliases (`error`, `errorLight`, `text*`, `background*`)
for backwards compatibility during migration.

---

## How these connect to `tokens/colors.tokens.ts`

```text
colors.base.ts          →  BASE_COLORS (9 OKLCH inputs)
shades.utils.ts         →  buildShadeScale() (shade generator)
                               ↓
tokens/colors.tokens.ts →  colorTokens        (Panda CSS token definitions)
                           semanticColorTokens (role-based aliases)
                               ↓
colors.palette.ts       →  colors             (CSS var reference map, for JS consumers)
```

`colors.tokens.ts` is purely declarative — it imports `BASE_COLORS` and
`buildShadeScale`, then assembles the Panda token structures. No logic lives there.

---

## Dark mode & theming

### How `var()` references work at runtime

Every entry in `colors` is a CSS custom property reference — a string like
`"var(--colors-primary-light)"`. When Emotion (or any CSS-in-JS library) uses
one of these values, it writes the reference into a class:

```css
.css-xyz { color: var(--colors-primary-light); }
```

The class itself never changes. The browser resolves the `var()` reference
**live**, against whichever CSS custom properties are in scope at render time.
This means theme switches take effect instantly at the CSS level — no JS
re-execution, no re-render required.

### Two-tier system: static vs. adaptive

Not all tokens adapt to dark mode. There are two tiers:

**Tier 1 — Raw palette** (`colorTokens` in `colors.tokens.ts`):
These are fixed color values. `--colors-primary-light` is the same blue
tint in both light and dark mode. Brand colors don't change with the theme.

**Tier 2 — Semantic tokens** (`semanticColorTokens` in `colors.tokens.ts`):
These are role-based aliases defined with `_dark` variants. Panda generates
a separate custom property value for each mode:

```css
:root              { --colors-bg: white;  --colors-fg: oklch(28% 0 0); }
[data-theme="dark"] { --colors-bg: black; --colors-fg: oklch(93% 0 0); }
```

### Which `colors` entries adapt

The `colors` POJO maps to both tiers. Whether a given key adapts to dark
mode depends on which tier it resolves to:

```ts
// Static — same in both modes (raw palette)
colors.primaryLight   // → var(--colors-primary-light)
colors.successXLight  // → var(--colors-success-xlight)

// Adaptive — changes with theme (semantic)
colors.text           // → var(--colors-fg)
colors.background     // → var(--colors-bg)
```

### Practical guidance for Emotion `.styles.ts` files

- Use **semantic entries** (`text`, `background`, `backgroundDark`) for
  surfaces, text, and borders that must adapt to theme.
- Use **raw palette entries** (`primaryLight`, `dangerDark`, etc.) for
  brand accents and decorative colors that stay constant across themes.
- Both approaches work correctly — the `var()` reference is what makes
  theme switching transparent to the CSS-in-JS layer.
