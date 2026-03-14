# @workspace/design-system

Token-driven design system built on **Ark UI** and **Panda CSS**.

> **Key links:** [Ark UI](https://ark-ui.com) · [Panda CSS](https://panda-css.com) · [Zag.js](https://zagjs.com)
>
> **🤖 AI-ready:** A **Panda CSS MCP server** is pre-configured for this package — giving Claude Code,
> Cursor, and other MCP-compatible agents live access to tokens, recipes, and slot schemas.
> Run `pnpm panda:mcp` from `packages/design-system/` to start it.

---

## Quick Start

### 1. Configure Panda CSS in the consuming app

```ts
// apps/client/panda.config.ts
import { defineConfig } from '@pandacss/dev';
import { designSystemPreset } from '@workspace/design-system/panda.preset';

export default defineConfig({
  presets: ['@pandacss/dev/presets', designSystemPreset],
  include: ['./src/**/*.{ts,tsx}'],
  outdir: 'styled-system',
  jsxFramework: 'react',
});
```

### 2. Import global styles once at app entry

```tsx
// apps/client/src/main.tsx
import '@workspace/design-system/styles/global.css';
import '@workspace/design-system/forms/forms.css';
import '@workspace/design-system/grid/grid.css';
```

### 3. Run Panda codegen

```bash
pnpm panda codegen
```

---

## Package Exports

| Import path                                  | Contents                                                                    |
| -------------------------------------------- | --------------------------------------------------------------------------- |
| `@workspace/design-system`                   | Main re-export barrel                                                       |
| `@workspace/design-system/components`        | All components (see below)                                                  |
| `@workspace/design-system/forms`             | All form inputs (Checkbox, Switch, Select, SelectDefault, SelectSearchable, |
|                                              | InputField, InputNumber, RadioGroup, Slider, FieldBox, Label)               |
| `@workspace/design-system/forms/forms.css`   | Import once at app entry                                                    |
| `@workspace/design-system/recipes`           | All recipe functions                                                        |
| `@workspace/design-system/grid`              | `Row`, `Col`, `Container`                                                   |
| `@workspace/design-system/grid/grid.css`     | Import once at app entry                                                    |
| `@workspace/design-system/tokens`            | `colors` palette map (camelCase → CSS vars)                                 |
| `@workspace/design-system/viewport`          | Breakpoint constants                                                        |
| `@workspace/design-system/palette/colors`    | Raw OKLCH color palette                                                     |
| `@workspace/design-system/panda.preset`      | Panda CSS preset — import in `panda.config.ts`                              |
| `@workspace/design-system/styles/global.css` | Aggregates reset + keyframes                                                |

---

## Components

All from `@workspace/design-system/components`.
See [COMPONENTS.md](./src/components/COMPONENTS.md) for the full inventory, patterns, and conventions.

### Simple wrappers (recipe applied internally)

| Component | Element           | Notes                                                                |
| --------- | ----------------- | -------------------------------------------------------------------- |
| `Badge`   | `span`            | Props: `variant`, `colorScheme`, `size`                              |
| `Button`  | `ark.button`      | Props: `variant`, `colorScheme`, `size`, `loading`                   |
| `Callout` | `div[role=alert]` | Prop: `status`                                                       |
| `Card`    | `div`             | Props: `size`, `variant`                                             |
| `Spinner` | SVG               | Prop: `size` (number, default `20`)                                  |
| `Text`    | polymorphic       | Prop: `variant` infers element (h1–h6, p, span). Override with `as`. |

### TanStack Table

| Component   | Notes                                                                         |
| ----------- | ----------------------------------------------------------------------------- |
| `DataTable` | Pagination, sorting, filtering, row selection. Props via `classNames` object. |

### Ark UI compounds (slot recipes via `createStyleContext`)

| Component           | Sub-components                                                                                       |
| ------------------- | ---------------------------------------------------------------------------------------------------- |
| `Dialog`            | Root · Backdrop · Positioner · Content · Header · Title · Description · Body · Footer · CloseTrigger |
| `Menu`              | Root · Trigger · Positioner · Content · Item · ItemGroup · ItemGroupLabel · Separator · Arrow        |
| `Popover`           | Root · Trigger · Positioner · Content · Arrow · Title · Description · CloseTrigger                   |
| `Tabs`              | Root · List · Trigger · Content · Indicator                                                          |
| `Toast` / `Toaster` | Root · Title · Description · CloseTrigger · `createToaster`                                          |
| `Tooltip`           | Root · Trigger · Positioner · Content · Arrow                                                        |

### Form inputs — `@workspace/design-system/forms`

See [FORMS.md](./src/forms/FORMS.md) for the full inventory, RHF patterns, and conventions.

| Component                    | Description                                              |
| ---------------------------- | -------------------------------------------------------- |
| `Checkbox` / `CheckboxField` | Ark Checkbox compound + convenience wrapper              |
| `FieldBox`                   | RHF-aware label/hint/error layout wrapper                |
| `InputField`                 | Ark Field.Input with leading/trailing slot support       |
| `InputNumber`                | Ark NumberInput with prefix/suffix and `Intl` formatting |
| `Label`                      | Plain `<label>` with size variant                        |
| `RadioGroup`                 | Ark RadioGroup — default + card variant                  |
| `Select`                     | Ark Select compound — Root, Trigger, Content, Item, etc. |
| `SelectDefault`              | Convenience wrapper accepting `options: SelectOption[]`  |
| `SelectSearchable`           | Ark Combobox with `match-sorter` filtering + `onAddNew`  |
| `Slider`                     | Ark Slider compound — Root, Track, Range, Thumb, Label   |
| `Switch` / `SwitchField`     | Ark Switch compound + convenience wrapper                |

---

## Recipes

All exported from `@workspace/design-system/recipes`.

### Single-element (`cva`)

| Recipe          | Variants                                                                            |
| --------------- | ----------------------------------------------------------------------------------- |
| `badgeRecipe`   | `variant` (solid, soft, outline) · `colorScheme` · `size` (sm, md, lg)              |
| `buttonRecipe`  | `variant` (solid, subtle, outline, ghost) · `colorScheme` · `size` (sm, md, lg)     |
| `calloutRecipe` | `status` (error, warning, success, info)                                            |
| `cardRecipe`    | `size` (sm, md, lg) · `variant` (elevated, outlined)                                |
| `labelRecipe`   | `size` (sm, md, lg)                                                                 |
| `spinnerRecipe` | — (base only)                                                                       |
| `switchRecipe`  | `size` (sm, md, lg)                                                                 |
| `textRecipe`    | `variant` (h1–h6, body, body-lg, body-sm, caption, overline) · `color` · `truncate` |

### Slot recipes (`sva`)

| Recipe                   | `className`         | Slots                                                                                                                                               |
| ------------------------ | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `checkboxRecipe`         | `checkbox`          | root · control · indicator · label · description · errorText                                                                                        |
| `dialogRecipe`           | `dialog`            | backdrop · positioner · content · header · body · footer · title · description · closeTrigger                                                       |
| `fieldBoxRecipe`         | `field-box`         | root · label · requiredIndicator · helperText · errorText · warningText                                                                             |
| `inputFieldRecipe`       | `input-field`       | root · input · slot                                                                                                                                 |
| `inputNumberRecipe`      | `input-number`      | root · label · control · input · incrementTrigger · decrementTrigger · prefix · suffix                                                              |
| `menuRecipe`             | `menu`              | root · positioner · content · trigger · item · itemGroup · itemGroupLabel · separator · arrow                                                       |
| `popoverRecipe`          | `popover`           | positioner · content · arrow · title · description · trigger · closeTrigger                                                                         |
| `radioGroupRecipe`       | `radio-group`       | root · label · item · itemControl · indicator · itemText · itemDescription                                                                          |
| `selectRecipe`           | `select`            | root · control · trigger · valueText · indicator · positioner · content · item · itemText · itemIndicator · itemGroup · label · clearTrigger · list |
| `selectSearchableRecipe` | `select-searchable` | root · control · input · leadIcon · positioner · content · item · itemText · itemIndicator · itemGroup · emptyState · addNew                        |
| `sliderRecipe`           | `slider`            | root · label · valueText · control · track · range · thumb · markerGroup · marker                                                                   |
| `tableRecipe`            | `table`             | root · table · thead · tbody · tfoot · tr · headerRow · th · td · sortIcon · emptyState · caption                                                   |
| `tabsRecipe`             | `tabs`              | root · list · trigger · content · indicator                                                                                                         |
| `toastRecipe`            | `toast`             | root · group · title · description · actionTrigger · closeTrigger                                                                                   |
| `tooltipRecipe`          | `tooltip`           | positioner · content · arrow · trigger                                                                                                              |

---

## Tokens

### Design tokens (used in Panda recipes and `css()` calls)

```ts
// Semantic colors
bg: 'bg.panel'; // panel background
bg: 'bg.muted'; // subtle background
bg: 'bg.hover'; // hover state
color: 'fg'; // primary text
color: 'fg.muted'; // secondary text
borderColor: 'border'; // default border
borderColor: 'border.subtle';

// Spacing (numeric scale — 1 = 0.25rem)
p: '4'; // 1rem
gap: '2'; // 0.5rem
px: '3'; // 0.75rem

// Typography
textStyle: 'heading.1' | 'heading.2' | 'heading.3' | 'heading.4';
textStyle: 'body.sm' | 'body.md' | 'body.lg';
fontSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
fontWeight: 'normal' | 'medium' | 'semibold' | 'bold';

// Border radius
borderRadius: 'sm' | 'md' | 'lg' | 'xl' | 'full';

// Z-index
zIndex: 'base' | 'overlay' | 'modal' | 'popover' | 'tooltip';
```

### `colors` map — `@workspace/design-system/tokens`

Maps camelCase keys to CSS custom properties. Useful when migrating from a direct color object.

```ts
import { colors } from '@workspace/design-system/tokens';

borderColor: colors.primaryLight,    // var(--colors-primary-light)
color: colors.greyXXXLight,          // var(--colors-grey-xxxlight)
background: colors.danger,           // var(--colors-danger)
```

**Shade scale** (11 stops, no alpha variants):
`xxxlight` · `xxlight` · `xlight` · `lighter` · `light` · base · `dark` · `darker` · `xdark` · `xxdark` · `xxxdark`

**Color groups:** `primary` · `secondary` · `success` · `warning` · `danger` · `info` · `grey` · `neutral`

---

## Color System

All colors use **OKLCH** for perceptually uniform shade generation. Shades are derived at
runtime using CSS `color-mix()` — no build step, no generated color values.

```text
┌─────────────────────────────────────────────────────┐
│  Raw palette    colors.primary = oklch(48.8% ...)   │
├─────────────────────────────────────────────────────┤
│  Semantic       bg.error = colors.danger.xlight     │
│                 fg.error = colors.danger             │
│                 border.error = colors.danger         │
├─────────────────────────────────────────────────────┤
│  Recipe         callout({ status: 'error' })         │
│                   → bg: bg.error, color: fg.error   │
└─────────────────────────────────────────────────────┘
```

Color palette preview: open `docs/color-palette-preview.html` in a browser.

---

## Grid

Bootstrap-style responsive 12-column grid. Import the CSS once, use components anywhere.

```tsx
import { Row, Col, Container } from '@workspace/design-system/grid';

<Container>
  <Row>
    <Col xs={12} md={8}>main content</Col>
    <Col xs={12} md={4}>sidebar</Col>
  </Row>
</Container>;
```

| Prop  | Breakpoint      |
| ----- | --------------- |
| `xs`  | base (no query) |
| `sm`  | 640px           |
| `md`  | 768px           |
| `lg`  | 1024px          |
| `xl`  | 1280px          |
| `xxl` | 1536px          |

`Row` props: `align` · `justify` · `wrap` · `direction` · `nogutter` · `gutterWidth`

`Col` accepts `1–12` or `'content'` (shrinks to content width) per breakpoint.

---

## Development

```bash
# Codegen (regenerates styled-system/)
pnpm panda:codegen

# Build (codegen + tsdown)
pnpm build

# Type check
pnpm typecheck

# Panda Studio (token browser)
pnpm panda:studio

# Panda MCP server (for Claude Code / Cursor)
pnpm panda:mcp
```

---

## Folder Structure

```text
packages/design-system/src/
├── panda.preset.ts          ← THE PRESET — import in consuming app panda.config.ts
├── index.ts                 ← Main barrel
│
├── components/              ← All components (one folder per component)
│   ├── badge/               ← badge.recipe.ts · badge.types.ts · badge.tsx · index.ts
│   ├── button/
│   ├── callout/
│   ├── card/
│   ├── data-table/
│   ├── dialog/
│   ├── menu/
│   ├── popover/
│   ├── spinner/
│   ├── tabs/
│   ├── text/
│   ├── toast/
│   └── tooltip/
│
├── forms/                   ← Pre-composed form inputs (one folder per component)
│   ├── checkbox/            ← checkbox.recipe.ts · checkbox.types.ts · checkbox.tsx · index.ts
│   ├── field-box/
│   ├── input-field/
│   ├── input-number/
│   ├── label/
│   ├── radio-group/
│   ├── select/
│   ├── select-default/
│   ├── select-searchable/
│   ├── slider/
│   └── switch/
│
├── recipes/                 ← index.ts only — re-exports all recipes from components/
│
├── tokens/                  ← Design tokens
│   ├── colors.ts            ← OKLCH base palette + semantic tokens
│   ├── typography.ts        ← Font families, sizes, weights, text styles
│   ├── spacing.ts           ← Spacing, radii, borders, shadows, breakpoints, z-index
│   └── animations.ts        ← Keyframes, durations, easings
│
├── grid/                    ← Row · Col · Container + grid.css
├── styles/                  ← global.css · reset.css · keyframes.css
├── viewport/                ← Breakpoint constants
├── palette/                 ← Raw color palette
└── internals/               ← Internal utilities (not exported)
```
