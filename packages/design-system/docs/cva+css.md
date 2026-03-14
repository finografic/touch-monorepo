# Styling with `cva()` & `css()`

**Panda `css()` — replaces simple Emotion `css` templates:**

tsx

```tsx
// ❌ Emotion
import { css } from '@emotion/react';

const wrapper = css`
  padding: var(--spacing-4);
  margin-bottom: var(--spacing-6);
  border-radius: var(--radii-md);
  background: var(--colors-neutral-50);
`;

// ✅ Panda css() — same result, but token keys are type-checked
import { css } from '../styled-system/css';

const wrapper = css({
  p: '4',
  mb: '6',
  borderRadius: 'md',
  bg: 'neutral.50',
});

// Usage is the same either way
<div className={wrapper}>...</div>
```

This is the easiest swap. Static styles, no dynamic values, just token references. Panda gives you autocomplete and type errors on invalid keys — Emotion with CSS vars doesn't.

**Panda `css()` with conditions — replaces Emotion responsive/dark mode:**

tsx

```tsx
// ❌ Emotion
const sidebar = css`
  width: 100%;
  padding: var(--spacing-4);

  @media (min-width: 768px) {
    width: 280px;
    padding: var(--spacing-6);
  }

  [data-theme='dark'] & {
    background: var(--colors-neutral-900);
  }
`;

// ✅ Panda css() — responsive + dark mode via token-aware conditions
const sidebar = css({
  w: 'full',
  p: '4',
  md: { w: '280px', p: '6' },
  _dark: { bg: 'neutral.900' },
});
```

Responsive breakpoints and dark mode are first-class in Panda — no media query strings, and `_dark` maps to your `[data-theme="dark"] &` condition from your config.

**Panda recipe — replaces Emotion + props switching:**

tsx

```tsx
// ❌ Emotion — manual variant logic
import { css } from '@emotion/react';

const getStatusStyles = (status: 'idle' | 'active' | 'error') => css`
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: var(--radii-sm);
  font-size: var(--font-sizes-sm);

  ${status === 'idle' && `
    background: var(--colors-neutral-100);
    color: var(--colors-neutral-700);
  `}
  ${status === 'active' && `
    background: var(--colors-success-100);
    color: var(--colors-success-800);
  `}
  ${status === 'error' && `
    background: var(--colors-danger-100);
    color: var(--colors-danger-800);
  `}
`;

<div css={getStatusStyles(status)}>...</div>

// ✅ Panda cva() — variants are declarative, type-safe, static CSS
import { cva } from '../styled-system/css';

const statusBadge = cva({
  base: {
    py: '2',
    px: '3',
    borderRadius: 'sm',
    fontSize: 'sm',
  },
  variants: {
    status: {
      idle:   { bg: 'neutral.100', color: 'neutral.700' },
      active: { bg: 'success.100', color: 'success.800' },
      error:  { bg: 'danger.100', color: 'danger.800' },
    },
  },
  defaultVariants: { status: 'idle' },
});

<div className={statusBadge({ status })}>...</div>
```

This is where recipes shine. The Emotion version generates CSS at runtime for every variant switch. The `cva()` version generates all three variants statically at build time — at runtime it's just picking a class name.

**Panda `css()` + Emotion together — hybrid for dynamic runtime values:**

tsx

```tsx
// Panda handles the static token-based layout
import { css } from '../styled-system/css';

const panel = css({
  borderRadius: 'md',
  border: '1px solid',
  borderColor: 'neutral.200',
  overflow: 'hidden',
  _dark: { borderColor: 'neutral.700' },
});

// Emotion handles the dynamic runtime part
import { css as emotionCss } from '@emotion/react';

const panelDynamic = (height: number, isCollapsed: boolean) => emotionCss`
  height: ${isCollapsed ? '48px' : `${height}px`};
  transition: height 0.2s ease;
`;

// Both applied together
<div className={panel} css={panelDynamic(calculatedHeight, collapsed)}>
  ...
</div>
```

This is the pattern where keeping Emotion makes sense. The static styles (border, radius, dark mode) are Panda — type-checked, static CSS, zero runtime cost. The dynamic styles (JS-computed height) stay in Emotion because Panda can't do runtime interpolation.

**Where Emotion stays valuable — complex runtime interpolation:**

tsx

```tsx
// This is hard to express in Panda — keep in Emotion
const gridItem = (colSpan: number, rowStart: number, isDragging: boolean) => css`
  grid-column: span ${colSpan};
  grid-row-start: ${rowStart};
  opacity: ${isDragging ? 0.5 : 1};
  transform: ${isDragging ? 'scale(0.98)' : 'none'};
  z-index: ${isDragging ? 10 : 'auto'};
  transition: opacity 0.15s, transform 0.15s;
`;
```

Any time the style values themselves are computed from JS variables (not just choosing between predefined variants), Emotion is the right tool. Panda's `css()` accepts token keys, not arbitrary expressions.

**Decision heuristic:**

Use `css()` when the styles are static and reference tokens. Use `cva()` when you have a finite set of variant combinations. Use Emotion when the actual CSS values are computed from runtime state. And when a component has both — static layout plus dynamic behavior — use both, as in the hybrid example.

Yes, panda’s cva method i will be using for sure for variants…

Most dynamic styling I do tends to be via className assignment.. this is a more classic approach, but has the advantage of being framework-agnostic..

Emotion css I  use for granular and scoped styling, though use traditional css syntax (one reason I like emotion strings), and target child elements will css selectors, as opposed to adding css attributes to each child elements.. That is the mix I use..

4 Mar

That makes sense — and it's a clean separation of concerns:

Panda `cva()` for variant logic, className toggling for dynamic state (`className={isActive ? 'active' : ''}`), and Emotion template strings for scoped styling with nested selectors. The nested selector approach is particularly practical for components where you'd otherwise be threading style props through five layers of children:

tsx

```tsx
const tableStyles = css`
  border-collapse: collapse;

  th {
    padding: var(--spacing-2) var(--spacing-3);
    text-align: left;
    font-weight: var(--font-weights-semibold);
    border-bottom: 2px solid var(--colors-neutral-200);
  }

  td {
    padding: var(--spacing-2) var(--spacing-3);
    border-bottom: 1px solid var(--colors-neutral-100);
  }

  tr:hover td {
    background: var(--colors-neutral-50);
  }
`;
```

One parent `css` prop styles the whole subtree. Trying to do that with Panda `css()` on every `th`, `td`, and `tr` individually would be verbose and scatter the styling logic across elements.

The framework-agnostic point on className is worth noting too. If you ever pull a component out of React into another context (or someone references your portfolio code), there's no library coupling in the conditional logic — just a string.
