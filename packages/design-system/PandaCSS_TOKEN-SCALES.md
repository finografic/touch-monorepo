# Design Token Scales Reference — Panda CSS & Park UI (Ark UI)

> **Purpose:** Quick-reference for migrating an existing `styles/` system to a Panda CSS + Ark UI design-system package.
> All values sourced from Panda CSS defaults and Park UI component recipes (the styled layer for Ark UI).
> **Framework attribution** is noted per table. Row-level defaults marked with ✦. **"My Map"** column is blank for your own mapping notes.

---

## Table of Contents

- [Design Token Scales Reference — Panda CSS \& Park UI (Ark UI)](#design-token-scales-reference--panda-css--park-ui-ark-ui)
  - [Table of Contents](#table-of-contents)
  - [1. Spacing Scale (Panda CSS)](#1-spacing-scale-panda-css)
  - [2. Sizing Scale (Panda CSS)](#2-sizing-scale-panda-css)
  - [3. Font Sizes (Panda CSS)](#3-font-sizes-panda-css)
  - [4. Font Weights (Panda CSS)](#4-font-weights-panda-css)
  - [5. Border Radius (Panda CSS)](#5-border-radius-panda-css)
  - [6. Shadows (Panda CSS)](#6-shadows-panda-css)
  - [7. Z-Index (Panda CSS)](#7-z-index-panda-css)
  - [8. Durations \& Easings (Panda CSS)](#8-durations--easings-panda-css)
    - [Durations](#durations)
    - [Easings](#easings)
  - [9. Color Palette — Shade Scale (Panda CSS)](#9-color-palette--shade-scale-panda-css)
  - [10. Color Palette — Semantic Tokens (Park UI)](#10-color-palette--semantic-tokens-park-ui)
  - [11. Breakpoints (Panda CSS)](#11-breakpoints-panda-css)
  - [12. Responsive/Layout Props Using Breakpoint Keys (Panda CSS)](#12-responsivelayout-props-using-breakpoint-keys-panda-css)
  - [13. Component Props — Size Subsets (Park UI / Ark UI)](#13-component-props--size-subsets-park-ui--ark-ui)
    - [Size subset summary](#size-subset-summary)
  - [14. Component Props — Variant Subsets (Park UI / Ark UI)](#14-component-props--variant-subsets-park-ui--ark-ui)
    - [Common variant patterns](#common-variant-patterns)
  - [Key Takeaways for Migration](#key-takeaways-for-migration)

---

## 1. Spacing Scale (Panda CSS)

Token key → `rem` value → pixel equivalent. Used for `padding`, `margin`, `gap`, `inset`, etc.
No single "default" — context-dependent. ✦ marks commonly used base values.

| Key   | rem      | px    | My Map |
| ----- | -------- | ----- | ------ |
| `0`   | 0rem     | 0px   |        |
| `0.5` | 0.125rem | 2px   |        |
| `1`   | 0.25rem  | 4px   |        |
| `1.5` | 0.375rem | 6px   |        |
| `2`   | 0.5rem   | 8px   |        |
| `2.5` | 0.625rem | 10px  |        |
| `3`   | 0.75rem  | 12px  |        |
| `3.5` | 0.875rem | 14px  |        |
| `4`   | 1rem     | 16px  |   ✦    |
| `4.5` | 1.125rem | 18px  |        |
| `5`   | 1.25rem  | 20px  |        |
| `5.5` | 1.375rem | 22px  |        |
| `6`   | 1.5rem   | 24px  |        |
| `7`   | 1.75rem  | 28px  |        |
| `8`   | 2rem     | 32px  |        |
| `9`   | 2.25rem  | 36px  |        |
| `10`  | 2.5rem   | 40px  |        |
| `11`  | 2.75rem  | 44px  |        |
| `12`  | 3rem     | 48px  |        |
| `14`  | 3.5rem   | 56px  |        |
| `16`  | 4rem     | 64px  |        |
| `20`  | 5rem     | 80px  |        |
| `24`  | 6rem     | 96px  |        |
| `28`  | 7rem     | 112px |        |
| `32`  | 8rem     | 128px |        |
| `36`  | 9rem     | 144px |        |
| `40`  | 10rem    | 160px |        |
| `44`  | 11rem    | 176px |        |
| `48`  | 12rem    | 192px |        |
| `52`  | 13rem    | 208px |        |
| `56`  | 14rem    | 224px |        |
| `60`  | 15rem    | 240px |        |
| `64`  | 16rem    | 256px |        |
| `72`  | 18rem    | 288px |        |
| `80`  | 20rem    | 320px |        |
| `96`  | 24rem    | 384px |        |

> **Note:** Base unit is `key × 0.25rem` (i.e. `key × 4px`) — Tailwind-inherited convention.

---

## 2. Sizing Scale (Panda CSS)

Named size tokens used for `width`, `maxWidth`, `height`, etc. These are **in addition to** all spacing tokens above (which are also valid size values). No framework-level default.

| Key     | rem / value | px     | My Map |
| ------- | ----------- | ------ | ------ |
| `md`    | 28rem       | 448px  |        |
| `lg`    | 32rem       | 512px  |        |
| `xl`    | 36rem       | 576px  |        |
| `2xl`   | 42rem       | 672px  |        |
| `3xl`   | 48rem       | 768px  |        |
| `4xl`   | 56rem       | 896px  |        |
| `5xl`   | 64rem       | 1024px |        |
| `6xl`   | 72rem       | 1152px |        |
| `7xl`   | 80rem       | 1280px |        |
| `8xl`   | 90rem       | 1440px |        |
| `prose` | 65ch        | ~65ch  |        |
| `full`  | 100%        | 100%   |        |
| `min`   | min-content | —      |        |
| `max`   | max-content | —      |        |
| `fit`   | fit-content | —      |        |

---

## 3. Font Sizes (Panda CSS)

| Key   | rem      | px    | ✦ | My Map |
| ----- | -------- | ----- | - | ------ |
| `2xs` | 0.5rem   | 8px   |   |        |
| `xs`  | 0.75rem  | 12px  |   |        |
| `sm`  | 0.875rem | 14px  |   |        |
| `md`  | 1rem     | 16px  | ✦ |        |
| `lg`  | 1.125rem | 18px  |   |        |
| `xl`  | 1.25rem  | 20px  |   |        |
| `2xl` | 1.5rem   | 24px  |   |        |
| `3xl` | 1.875rem | 30px  |   |        |
| `4xl` | 2.25rem  | 36px  |   |        |
| `5xl` | 3rem     | 48px  |   |        |
| `6xl` | 3.75rem  | 60px  |   |        |
| `7xl` | 4.5rem   | 72px  |   |        |
| `8xl` | 6rem     | 96px  |   |        |
| `9xl` | 8rem     | 128px |   |        |

> **Scale range:** `2xs` through `9xl` (14 steps). ✦ `md` = 1rem (browser default body font size).

---

## 4. Font Weights (Panda CSS)

| Key          | Value | ✦ | My Map |
| ------------ | ----- | - | ------ |
| `thin`       | 100   |   |        |
| `extralight` | 200   |   |        |
| `light`      | 300   |   |        |
| `normal`     | 400   | ✦ |        |
| `medium`     | 500   |   |        |
| `semibold`   | 600   |   |        |
| `bold`       | 700   |   |        |
| `extrabold`  | 800   |   |        |
| `black`      | 900   |   |        |

> ✦ `normal` (400) is the CSS default font weight.

---

## 5. Border Radius (Panda CSS)

| Key    | rem      | px     | ✦ | My Map |
| ------ | -------- | ------ | - | ------ |
| `xs`   | 0.125rem | 2px    |   |        |
| `sm`   | 0.25rem  | 4px    |   |        |
| `md`   | 0.375rem | 6px    | ✦ |        |
| `lg`   | 0.5rem   | 8px    |   |        |
| `xl`   | 0.75rem  | 12px   |   |        |
| `2xl`  | 1rem     | 16px   |   |        |
| `3xl`  | 1.5rem   | 24px   |   |        |
| `4xl`  | 2rem     | 32px   |   |        |
| `full` | 9999px   | 9999px |   |        |

> ✦ `md` is most commonly referenced via Park UI's `l2` layer token.
>
> **Park UI layer tokens:** `l1`, `l2`, `l3` — layer radius tokens for nested component radius calculations (outer – gap = inner). These reference the scale above.

---

## 6. Shadows (Panda CSS)

| Key   | Description                     | ✦ | My Map |
| ----- | ------------------------------- | - | ------ |
| `2xs` | `0 1px rgb(0 0 0 / 0.05)`       |   |        |
| `xs`  | `0 1px 2px 0 rgb(0 0 0 / 0.05)` |   |        |
| `sm`  | 2-layer, subtle offset          |   |        |
| `md`  | 2-layer, medium offset          | ✦ |        |
| `lg`  | 2-layer, large spread           |   |        |
| `xl`  | 2-layer, extra large spread     |   |        |
| `2xl` | Deep shadow, 25% opacity        |   |        |

Also includes `inset-2xs`, `inset-xs`, `inset-sm` for inner shadows.

> ✦ `md` is most commonly used for elevated surfaces (cards, dropdowns).

---

## 7. Z-Index (Panda CSS)

| Key        | Typical Use         | ✦ | My Map |
| ---------- | ------------------- | - | ------ |
| `hide`     | Hidden / -1         |   |        |
| `base`     | Default             | ✦ |        |
| `docked`   | Docked panels       |   |        |
| `dropdown` | Dropdowns, menus    |   |        |
| `sticky`   | Sticky headers      |   |        |
| `banner`   | Banners, notices    |   |        |
| `overlay`  | Backdrop overlays   |   |        |
| `modal`    | Modal dialogs       |   |        |
| `popover`  | Popovers, tooltips  |   |        |
| `toast`    | Toast notifications |   |        |

---

## 8. Durations & Easings (Panda CSS)

### Durations

| Key       | Typical Value | ✦ | My Map |
| --------- | ------------- | - | ------ |
| `fastest` | ~50ms         |   |        |
| `faster`  | ~100ms        |   |        |
| `fast`    | ~150ms        |   |        |
| `normal`  | ~200ms        | ✦ |        |
| `slow`    | ~300ms        |   |        |
| `slower`  | ~400ms        |   |        |
| `slowest` | ~500ms        |   |        |

### Easings

| Key       | Description   | ✦ | My Map |
| --------- | ------------- | - | ------ |
| `default` | Standard ease | ✦ |        |
| `in`      | Ease-in       |   |        |
| `out`     | Ease-out      |   |        |
| `in-out`  | Ease-in-out   |   |        |

---

## 9. Color Palette — Shade Scale (Panda CSS)

Panda CSS includes the Tailwind color palette. All colors use a **numeric shade scale** with 11 stops.

Example colors shown below — the same shade structure applies to all 22 palette colors (rose, pink, fuchsia, purple, violet, indigo, blue, sky, cyan, teal, emerald, green, lime, yellow, amber, orange, red, neutral, stone, zinc, gray, slate).

| Shade | red       | blue      | green     | amber     | slate     | ✦ | My Map |
| ----- | --------- | --------- | --------- | --------- | --------- | - | ------ |
| `50`  | `#fef2f2` | `#eff6ff` | `#f0fdf4` | `#fffbeb` | `#f8fafc` |   |        |
| `100` | `#fee2e2` | `#dbeafe` | `#dcfce7` | `#fef3c7` | `#f1f5f9` |   |        |
| `200` | `#fecaca` | `#bfdbfe` | `#bbf7d0` | `#fde68a` | `#e2e8f0` |   |        |
| `300` | `#fca5a5` | `#93c5fd` | `#86efac` | `#fcd34d` | `#cbd5e1` |   |        |
| `400` | `#f87171` | `#60a5fa` | `#4ade80` | `#fbbf24` | `#94a3b8` |   |        |
| `500` | `#ef4444` | `#3b82f6` | `#22c55e` | `#f59e0b` | `#64748b` | ✦ |        |
| `600` | `#dc2626` | `#2563eb` | `#16a34a` | `#d97706` | `#475569` |   |        |
| `700` | `#b91c1c` | `#1d4ed8` | `#15803d` | `#b45309` | `#334155` |   |        |
| `800` | `#991b1b` | `#1e40af` | `#166534` | `#92400e` | `#1e293b` |   |        |
| `900` | `#7f1d1d` | `#1e3a8a` | `#14532d` | `#78350f` | `#0f172a` |   |        |
| `950` | `#450a0a` | `#172554` | `#052e16` | `#451a03` | `#020617` |   |        |

> **Token syntax:** `red.500`, `blue.200`, `slate.950`, etc.
> ✦ `500` is the conventional "base" shade — used as the default `solid` background in most component color schemes.
>
> **No built-in alpha scale.** Your `solid | a25 | a50 | a75` alpha variants would be a custom extension to this palette.

---

## 10. Color Palette — Semantic Tokens (Park UI)

Park UI's semantic color system uses a **virtual `colorPalette`** concept. Components reference these semantic paths rather than raw palette colors, enabling the `colorPalette` prop to switch the entire color scheme.

| Semantic Path                  | Purpose                           | My Map |
| ------------------------------ | --------------------------------- | ------ |
| `colorPalette.solid.bg`        | Solid variant background          |        |
| `colorPalette.solid.bg.hover`  | Solid hover state                 |        |
| `colorPalette.solid.fg`        | Solid foreground/text             |        |
| `colorPalette.surface.bg`      | Surface variant background        |        |
| `colorPalette.surface.border`  | Surface border color              |        |
| `colorPalette.surface.fg`      | Surface foreground                |        |
| `colorPalette.subtle.bg`       | Subtle variant background         |        |
| `colorPalette.subtle.bg.hover` | Subtle hover state                |        |
| `colorPalette.subtle.fg`       | Subtle foreground                 |        |
| `colorPalette.outline.border`  | Outline variant border            |        |
| `colorPalette.outline.fg`      | Outline foreground                |        |
| `colorPalette.plain.fg`        | Plain (ghost-like) foreground     |        |
| `colorPalette.plain.bg.hover`  | Plain hover state                 |        |
| `colorPalette.default`         | Default accent (e.g. focus rings) |        |
| `colorPalette.fg`              | Contrast foreground               |        |

**Additional global semantic tokens:**

| Token            | Purpose                      | My Map |
| ---------------- | ---------------------------- | ------ |
| `bg.default`     | Page/canvas background       |        |
| `bg.subtle`      | Subtle background            |        |
| `bg.emphasized`  | Emphasized (e.g. switch off) |        |
| `fg.default`     | Primary text                 |        |
| `fg.muted`       | Secondary/muted text         |        |
| `fg.subtle`      | Tertiary/hint text           |        |
| `fg.error`       | Error state text             |        |
| `border.default` | Default border               |        |
| `border.subtle`  | Subtle border                |        |
| `border.error`   | Error state border           |        |

---

## 11. Breakpoints (Panda CSS)

| Key   | min-width | Typical Use                  | My Map |
| ----- | --------- | ---------------------------- | ------ |
| `sm`  | 640px     | Large phones / small tablets |        |
| `md`  | 768px     | Tablets                      |        |
| `lg`  | 1024px    | Small laptops                |        |
| `xl`  | 1280px    | Desktops                     |        |
| `2xl` | 1536px    | Large displays               |        |

> **Usage in responsive styles:**
>
> ```ts
> css({ fontSize: { base: 'sm', md: 'md', lg: 'lg' } });
> ```
>
> `base` = mobile-first default (no breakpoint). Each key applies at `min-width` upward.

---

## 12. Responsive/Layout Props Using Breakpoint Keys (Panda CSS)

These Panda CSS features use the **same `sm | md | lg | xl | 2xl` breakpoint keys** to drive responsive behavior. They relate to responsiveness and layout but are **not component `size` props** — they are CSS utility constructs.

| Feature / Prop              | How Breakpoint Keys Are Used                                                                                  |
| --------------------------- | ------------------------------------------------------------------------------------------------------------- |
| **Responsive style values** | Any CSS property can accept a responsive map: `{ base, sm, md, lg, xl, 2xl }`                                 |
| **Responsive variants**     | Config recipe variants can be applied per-breakpoint: `button({ size: { base: 'sm', md: 'lg' } })`            |
| **Responsive conditions**   | `_sm`, `_md`, `_lg`, `_xl`, `_2xl` condition prefixes in style objects                                        |
| **Container queries**       | Panda supports `@container` with custom breakpoints but these are user-defined, not the above keys by default |
| **Hide/Show patterns**      | `hideBelow('md')`, `hideFrom('lg')` — uses breakpoint keys                                                    |

> **Key point:** The breakpoint keys (`sm`, `md`, `lg`, `xl`, `2xl`) are used **exclusively for responsive layout logic**, not for component sizing. Component `size` props (next section) have overlapping key names but are an entirely separate concept.

---

## 13. Component Props — Size Subsets (Park UI / Ark UI)

These are the **`size` prop values** accepted by Park UI component recipes.
These are **unrelated to breakpoints** — they control the physical dimensions and typography of each component instance.

| Component        | Size Values                                                                      | ✦ Default | My Map |
| ---------------- | -------------------------------------------------------------------------------- | --------- | ------ |
| **Button**       | `2xs` · `xs` · `sm` · `md` · `lg` · `xl` · `2xl`                                 | ✦ `md`    |        |
| **Icon Button**  | `2xs` · `xs` · `sm` · `md` · `lg` · `xl` · `2xl`                                 | ✦ `md`    |        |
| **Input**        | `xs` · `sm` · `md` · `lg` · `xl` · `2xl`                                         | ✦ `md`    |        |
| **Textarea**     | `sm` · `md` · `lg` · `xl`                                                        | ✦ `md`    |        |
| **Select**       | `xs` · `sm` · `md` · `lg` · `xl` · `2xl`                                         | ✦ `md`    |        |
| **Pin Input**    | `xs` · `sm` · `md` · `lg` · `xl` · `2xl`                                         | ✦ `md`    |        |
| **Combobox**     | `xs` · `sm` · `md` · `lg` · `xl` · `2xl`                                         | ✦ `md`    |        |
| **Tags Input**   | `xs` · `sm` · `md` · `lg` · `xl` · `2xl`                                         | ✦ `md`    |        |
| **Avatar**       | `full` · `2xs` · `xs` · `sm` · `md` · `lg` · `xl` · `2xl`                        | ✦ `md`    |        |
| **Badge**        | `sm` · `md` · `lg`                                                               | ✦ `md`    |        |
| **Code**         | `sm` · `md` · `lg`                                                               | ✦ `md`    |        |
| **Icon**         | `xs` · `sm` · `md` · `lg` · `xl` · `2xl`                                         | ✦ `md`    |        |
| **Spinner**      | `xs` · `sm` · `md` · `lg` · `xl`                                                 | ✦ `md`    |        |
| **Switch**       | `sm` · `md` · `lg`                                                               | ✦ `md`    |        |
| **Checkbox**     | `sm` · `md` · `lg`                                                               | ✦ `md`    |        |
| **Radio Group**  | `sm` · `md` · `lg`                                                               | ✦ `md`    |        |
| **Tabs**         | `xs` · `sm` · `md` · `lg`                                                        | ✦ `md`    |        |
| **Menu**         | `xs` · `sm` · `md`                                                               | ✦ `md`    |        |
| **Toggle Group** | `xs` · `sm` · `md` · `lg`                                                        | ✦ `md`    |        |
| **Dialog**       | `xs` · `sm` · `md` · `lg` · `xl` · `cover` · `full`                              | ✦ `md`    |        |
| **Drawer**       | `xs` · `sm` · `md` · `lg` · `xl` · `full`                                        | ✦ `md`    |        |
| **Heading**      | `xs` · `sm` · `md` · `lg` · `xl` · `2xl` · `3xl` · `4xl` · `5xl` · `6xl` · `7xl` | ✦ `xl`    |        |
| **Text**         | `xs` · `sm` · `md` · `lg` · `xl` · `2xl`                                         | ✦ `md`    |        |

### Size subset summary

| Subset Pattern                   | Components Using It                                        |
| -------------------------------- | ---------------------------------------------------------- |
| `sm` · `md` · `lg`               | Badge, Code, Switch, Checkbox, Radio                       |
| `xs` · `sm` · `md` · `lg`        | Tabs, Toggle Group                                         |
| `xs` · `sm` · `md` · `lg` · `xl` | Spinner                                                    |
| `xs` – `2xl`                     | Input, Select, Pin Input, Combobox, Tags Input, Icon, Text |
| `2xs` – `2xl`                    | Button, Icon Button, Avatar                                |
| `xs` – `full`                    | Dialog, Drawer (with `cover`/`full` extras)                |
| `sm` · `md` · `lg` · `xl`        | Textarea                                                   |

---

## 14. Component Props — Variant Subsets (Park UI / Ark UI)

These are the **`variant` prop values** accepted by Park UI component recipes.

| Component        | Variant Values                                       | ✦ Default   | My Map |
| ---------------- | ---------------------------------------------------- | ----------- | ------ |
| **Button**       | `solid` · `surface` · `subtle` · `outline` · `plain` | ✦ `solid`   |        |
| **Icon Button**  | `solid` · `surface` · `subtle` · `outline` · `plain` | ✦ `solid`   |        |
| **Input**        | `outline` · `surface` · `subtle` · `flushed`         | ✦ `outline` |        |
| **Textarea**     | _(no variant prop — single style)_                   | —           |        |
| **Select**       | `outline` · `ghost`                                  | ✦ `outline` |        |
| **Badge**        | `solid` · `subtle` · `outline`                       | ✦ `subtle`  |        |
| **Code**         | `solid` · `surface` · `subtle` · `outline` · `plain` | ✦ `subtle`  |        |
| **Avatar**       | `solid` · `subtle` · `outline`                       | ✦ `subtle`  |        |
| **Tabs**         | `line` · `enclosed` · `plain`                        | ✦ `line`    |        |
| **Toggle Group** | `outline` · `ghost`                                  | ✦ `outline` |        |
| **Menu**         | _(no variant prop — single style)_                   | —           |        |
| **Switch**       | _(no variant prop — single style)_                   | —           |        |
| **Checkbox**     | _(no variant prop — single style)_                   | —           |        |
| **Dialog**       | _(no variant prop — single style)_                   | —           |        |
| **Drawer**       | _(no variant prop — single style)_                   | —           |        |

### Common variant patterns

| Pattern                                              | Components                             |
| ---------------------------------------------------- | -------------------------------------- |
| `solid` · `subtle` · `outline`                       | Badge, Avatar                          |
| `solid` · `surface` · `subtle` · `outline` · `plain` | Button, Icon Button, Code              |
| `outline` · `surface` · `subtle` · `flushed`         | Input, Pin Input, Combobox, Tags Input |
| `outline` · `ghost`                                  | Select, Toggle Group                   |
| `line` · `enclosed` · `plain`                        | Tabs                                   |

---

## Key Takeaways for Migration

1. **`md` is the universal default** — every Park UI component with a size prop defaults to `md` (except Heading which defaults to `xl`).

2. **The `xs`–`2xl` scale is the dominant pattern**, but smaller components (Switch, Checkbox, Badge) only need `sm`–`lg`, while form inputs and buttons extend to `2xs`–`2xl`.

3. **Breakpoint keys and component size keys share names** (`sm`, `md`, `lg`, `xl`, `2xl`) but serve completely different purposes. The TypeScript types should keep them in separate namespaces.

4. **Panda CSS has no built-in alpha token scale.** Your `solid | a25 | a50 | a75` system is a custom extension — this is an area where your design system adds differentiation.

5. **Park UI's `colorPalette` virtual color system** is the bridge between raw palette shades and component variants. Mapping your OKLCH semantic palette to these paths is the key integration point.

6. **Spacing keys are numeric** (`1`, `2`, `3`…) based on `key × 4px`. Unlike the named `xs`–`2xl` keys, these remain plain numbers and won't conflict with your naming conventions.
