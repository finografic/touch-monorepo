# Grid System

12-column responsive grid. **No React Context, no provider, no JavaScript at runtime** —
pure CSS classes from a pre-generated static stylesheet (`grid.css`).

## Import

```tsx
import { Row, Col, Container } from '@workspace/design-system/grid';
```

The CSS is already imported once in `apps/client/src/main.tsx`:
```ts
import '@workspace/design-system/grid/grid.css';
```

---

## Container

Max-width centered wrapper. Wraps the page content area.

```tsx
<Container>...</Container>
<Container fluid>...</Container>
```

### Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `fluid` | `boolean` | `false` | `false` = max-width constrained; `true` = 100% width |
| `...rest` | `ComponentPropsWithoutRef<'div'>` | — | All standard div props |

### CSS behaviour

| State | `max-width` |
|-------|-------------|
| default | `var(--layout-content-max-width, 1200px)` |
| `fluid` | `100%` |

- Centered via `margin-inline: auto`
- Has `padding-inline: 8px` (half the default gutter) so content doesn't touch viewport edges
- `max-width` token comes from the design-system layout tokens; fallback is `1200px`

---

## Row

Flex row container. Pairs with `Col`. Applies negative margin to offset Col gutters.

```tsx
<Row>...</Row>
<Row justify="between" align="center">...</Row>
<Row nogutter>...</Row>
<Row gutterWidth={32}>...</Row>
```

### Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `align` | `'start' \| 'center' \| 'end' \| 'stretch'` | — | Maps to `align-items` |
| `justify` | `'start' \| 'center' \| 'end' \| 'between' \| 'around'` | — | Maps to `justify-content` |
| `direction` | `'row' \| 'column' \| 'row-reverse' \| 'column-reverse'` | — | Maps to `flex-direction` |
| `wrap` | `'wrap' \| 'nowrap' \| 'reverse'` | `'wrap'` (CSS default) | Maps to `flex-wrap` |
| `nogutter` | `boolean` | `false` | Removes gutter margin/padding from row and direct Col children |
| `gutterWidth` | `number` | `16` | Override gutter in px — sets `--ds-grid-gutter` inline |
| `...rest` | `ComponentPropsWithoutRef<'div'>` | — | All standard div props |

### align values

| Value | CSS |
|-------|-----|
| `"start"` | `align-items: flex-start` |
| `"center"` | `align-items: center` |
| `"end"` | `align-items: flex-end` |
| `"stretch"` | `align-items: stretch` |

### justify values

| Value | CSS |
|-------|-----|
| `"start"` | `justify-content: flex-start` |
| `"center"` | `justify-content: center` |
| `"end"` | `justify-content: flex-end` |
| `"between"` | `justify-content: space-between` |
| `"around"` | `justify-content: space-around` |

> **Note:** Row prop values use shorthands (`"between"`, `"start"`) because they map to
> CSS `data-*` attributes — not passed directly as CSS values. This is the opposite of
> Panda's `<Flex>` which accepts full CSS values (`"space-between"`, `"flex-start"`).

### Gutter

The gutter is controlled by the `--ds-grid-gutter` CSS custom property (default `16px`).
Row uses negative `margin-inline` to compensate; Col uses `padding-inline` to create the actual gap.

- `nogutter` removes both margin and padding entirely
- `gutterWidth={n}` sets `--ds-grid-gutter: npx` via inline style, overriding the default for that row subtree

---

## Col

Responsive column. Mobile-first: defaults to full width (100%) at all breakpoints unless a
narrower width is specified.

```tsx
<Col xs={12} md={6} lg={4}>...</Col>
<Col md="content">...</Col>  {/* shrink-to-content width */}
```

### Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `xs` | `number \| 'content'` | — | Width at all sizes (mobile-first base) |
| `sm` | `number \| 'content'` | — | Width at ≥ 640px |
| `md` | `number \| 'content'` | — | Width at ≥ 768px |
| `lg` | `number \| 'content'` | — | Width at ≥ 1024px |
| `xl` | `number \| 'content'` | — | Width at ≥ 1280px |
| `xxl` | `number \| 'content'` | — | Width at ≥ 1536px |
| `...rest` | `ComponentPropsWithoutRef<'div'>` | — | All standard div props |

### Width values

- **`1–12`** — fraction of 12 columns (`6` = 50%, `4` = 33.3%, `3` = 25%, etc.)
- **`'content'`** — `flex: 0 0 auto; width: auto` — shrinks to fit content
- **omitted** — inherits the previous breakpoint's width (mobile-first cascade)

### Breakpoints

| Prop | Min-width | Notes |
|------|-----------|-------|
| `xs` | none (base) | Applied at all sizes; overridden by larger breakpoints |
| `sm` | 640px | |
| `md` | 768px | |
| `lg` | 1024px | |
| `xl` | 1280px | |
| `xxl` | 1536px | Named `xxl` (not `2xl`) — `2xl` is not a valid JSX identifier |

### TypeScript note

`ColSpan` is typed as `number | 'content'` — the 1–12 constraint is enforced by CSS, not
TypeScript. Passing `0` or `13` emits a class that doesn't exist in `grid.css` and has no effect.

---

## CSS Custom Properties

Defined on `:root` in `grid.css`. Can be overridden globally or scoped.

| Property | Default | Notes |
|----------|---------|-------|
| `--ds-grid-columns` | `12` | Read-only reference; not used in current CSS calculations |
| `--ds-grid-gutter` | `16px` | Total gutter width; each side gets `gutter / 2` |

---

## CSS Classes (emitted)

Understanding what's emitted is useful for debugging in DevTools.

| Element | Classes emitted |
|---------|----------------|
| `Container` | `ds-container` (+ `data-fluid` attribute if fluid) |
| `Row` | `ds-row` (+ `data-align`, `data-justify`, `data-direction`, `data-wrap`, `data-nogutter` attributes as set) |
| `Col` | `ds-col ds-col-xs-6 ds-col-md-3 ...` (one class per breakpoint prop) |

---

## Examples

### Basic responsive layout

```tsx
<Row>
  <Col xs={12} md={6}>Left</Col>
  <Col xs={12} md={6}>Right</Col>
</Row>
```

### Three-column with sidebar

```tsx
<Row>
  <Col xs={12} lg={3}>Sidebar</Col>
  <Col xs={12} lg={9}>Main content</Col>
</Row>
```

### Row with alignment

```tsx
<Row justify="between" align="center">
  <Col xs="content">Logo</Col>
  <Col xs="content">Nav</Col>
</Row>
```

### No gutter

```tsx
<Row nogutter>
  <Col xs={6}>A</Col>
  <Col xs={6}>B</Col>
</Row>
```

### Custom gutter

```tsx
<Row gutterWidth={32}>
  <Col xs={6}>A</Col>
  <Col xs={6}>B</Col>
</Row>
```

### Inside a Container

```tsx
<Container>
  <Row>
    <Col xs={12} md={8}>Content</Col>
    <Col xs={12} md={4}>Aside</Col>
  </Row>
</Container>
```

---

## What this is NOT

- **Not a flex utility** — for simple flex grouping without column structure, use Panda's `<Flex>` from `styled-system/jsx`
- **Not CSS Grid** — this is a flexbox-based column grid (bootstrap-style)
- **Not context-based** — no `ScreenClassProvider`, no `setConfiguration`, no `useScreenClass` hook
- **Not Panda-generated** — `grid.css` is a static pre-generated file; no Panda runtime needed in the design-system package
