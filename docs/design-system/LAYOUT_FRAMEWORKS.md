# Layout & Component Framework Recommendations

## Your Current Pain Points (observed from code)

1. **Deep nesting** — `Flex` inside `Flex` inside `Flex` for simple layouts (e.g., a button with an icon needs `<Flex justify="start" align="center" width="180px" gap="4" ml="4">` just to position an icon next to text)
2. **`<Text>` everywhere** — Radix Themes requires `<Text size="2" weight="medium">` where a plain `<span>` or `<label>` would do
3. **Styling friction** — You're fighting Radix's `.rt-` class specificity with selectors like `.rt-Text.rt-r-size-3 { font-weight: 700 }` in your Emotion styles
4. **Multiple styling systems** — Emotion (`css`), Radix Themes (props), Tailwind, AND styled-components all coexist, making it unclear which system "owns" layout
5. **Radix Themes' opinionated layout** — `<Flex>`, `<Box>`, `<Text>` are convenience wrappers that add DOM nodes and classes you don't need

---

## Understanding the Two Layers of Radix

This is important: **Radix Primitives** and **Radix Themes** are different things.

| | Radix Primitives | Radix Themes |
|---|---|---|
| Package | `@radix-ui/react-*` | `@radix-ui/themes` |
| What it is | Unstyled, accessible behavior | Pre-styled component library |
| Layout components | None | `Flex`, `Box`, `Grid`, `Text`, `Container` |
| Styling opinion | Zero — bring your own | Very opinionated (CSS custom properties, `.rt-` classes) |
| Your usage | Dialog, Toast, Switch, etc. | `Flex`, `Text`, `Badge`, layout props |

**The `<Flex>`, `<Text>`, `<Badge>` components causing you grief come from Radix Themes, not Radix Primitives.** You could drop `@radix-ui/themes` entirely and keep all the accessible primitives (Dialog, Switch, Checkbox, etc.).

---

## Recommendations

### Option 1: Keep Radix Primitives + Drop Radix Themes (Recommended)

**Replace Radix Themes layout with plain HTML + your existing Emotion styles.**

What changes:

- `<Flex direction="column" gap="4">` → `<div className="stack-4">` or just flexbox in CSS
- `<Text size="3" weight="bold">` → `<span className="text-bold">` or a `<label>`
- `<Badge>` → your own thin styled component
- Keep `<Switch>`, `<Dialog>`, `<Checkbox>`, etc. from `@radix-ui/react-*` — they're great

What you gain:

- **Fewer DOM nodes** — no wrapper divs from Flex/Box
- **No `.rt-` specificity wars** — you own all the classes
- **One styling system** — Emotion only (or Tailwind only — pick one)
- **Radix Primitives still handle accessibility** for interactive elements

What it costs:

- You build your own `<Badge>`, `<Callout>` etc. (these are simple)
- You lose Radix Themes' design token system (but you already have your own in `styles/`)

**Example — your legend today:**

```tsx
<Flex align="center" gap="4">
  <div className="legend-circle legend-type-a">A</div>
  <Text size="3">Type A</Text>
</Flex>
```

**After:**

```tsx
<div className="legend-item">
  <div className="legend-circle legend-type-a">A</div>
  <span>Type A</span>
</div>
```

One element removed, no Radix class overhead, styled via your existing `.legend-circle + span` selector (which you already have!).

---

### Option 2: Ark UI (by the Chakra team)

**Website:** <https://ark-ui.com>

Ark UI is the closest spiritual successor to "Radix Primitives done differently."

| Aspect | Radix Primitives | Ark UI |
|---|---|---|
| Accessibility | Excellent | Excellent (same WAI-ARIA patterns) |
| Styling | Zero opinion | Zero opinion |
| State machines | Internal, opaque | Built on Zag.js (inspectable, deterministic) |
| Layout components | None (Themes adds them) | None (intentionally) |
| Framework support | React only | React, Solid, Vue |
| Bundle size | Similar | Similar |
| API surface | Compound components (`Dialog.Root`, `Dialog.Content`) | Same compound pattern |

**Why consider it:**

- Same philosophy as Radix Primitives (unstyled, accessible)
- State machine approach (Zag.js) means fewer edge-case bugs in complex components
- No "Themes" layer that tempts you into `<Flex>` and `<Text>` wrappers
- Growing ecosystem, backed by the Chakra team

**Why maybe not:**

- Smaller community than Radix (less Stack Overflow help)
- You'd still need to migrate your Radix Primitive usage (Dialog, Toast, etc.)
- The API is slightly different — learning curve

---

### Option 3: React Aria (by Adobe)

**Website:** <https://react-spectrum.adobe.com/react-aria/>

| Aspect | Radix Primitives | React Aria |
|---|---|---|
| Accessibility | Excellent | Best-in-class (Adobe's a11y team) |
| Styling | Zero | Zero (hooks or renderless) |
| Layout components | None | None |
| Approach | Components | Hooks-first (`useButton`, `useDialog`) |
| Bundle | Per-component | Per-hook (very treeshakeable) |
| Mobile/touch | Good | Excellent (press events, touch handling) |

**Why consider it:**

- Hook-based API means YOU control the DOM — zero extra wrapper elements
- `useButton()` gives you accessible button behavior on any element
- Best touch/mobile support of any library (relevant for your touch-monorepo?)
- No layout opinions whatsoever

**Why maybe not:**

- Hooks approach is more verbose than Radix's declarative components
- Steeper learning curve
- Smaller React community mindshare than Radix

---

### Option 4: shadcn/ui (demystified)

**Why you found it confusing:** shadcn/ui is not a package — it's a CLI that copies component source files into your project. There's no `import { Button } from 'shadcn'`. Instead, you run `npx shadcn@latest add button` and it generates a file like `components/ui/button.tsx` that you own and edit.

Under the hood it's just: **Radix Primitives + Tailwind + class-variance-authority (cva)**.

| Aspect | Notes |
|---|---|
| Primitives | Uses Radix Primitives for behavior |
| Styling | Tailwind utility classes |
| Layout | None — plain `<div className="flex gap-4">` |
| Customization | You own the files, edit them directly |

**Why consider it:**

- It solves your exact problem: accessible primitives WITHOUT layout/text wrappers
- Components are thin and readable (typically 20-40 lines)
- You already have Tailwind installed

**Why maybe not:**

- Requires full commitment to Tailwind for styling (conflicts with your Emotion setup)
- Generated code uses `cn()` utility (tailwind-merge + clsx) which adds a convention to learn
- You'd need to pick: Tailwind OR Emotion, not both

---

## Reducing Nesting Right Now (No Migration Needed)

Regardless of which framework you choose long-term, these patterns reduce nesting immediately:

### 1. Replace layout `<Flex>` with semantic HTML + CSS

```tsx
// Before — 3 Radix components, 3 DOM nodes with .rt- classes
<Flex direction="column" gap="4" pt="2">
  <Text size="3" weight="bold" mb="2">Layout mode</Text>
  <Flex align="center" gap="2">
    <Switch ... />
    <Text size="2" weight="medium">Minimal</Text>
  </Flex>
</Flex>

// After — plain HTML, styled by your Emotion styles
<fieldset className="layout-mode">
  <legend>Layout mode</legend>
  <label>
    <Switch ... />
    Minimal (4 slots, 2×2)
  </label>
</fieldset>
```

Fewer nodes, better semantics, easier to style.

### 2. Use `<label>` instead of `<Text>` next to form controls

The `<Text>` component adds a `<span>` with multiple Radix classes. A `<label>` is more semantic AND needs no wrapper.

### 3. Buttons don't need inner `<Flex>` for icon + text

```tsx
// Before
<Button variant="outline">
  <Flex justify="start" align="center" width="180px" gap="4" ml="4">
    <PlusIcon />
    Add Column
  </Flex>
</Button>

// After — use CSS on the button itself
<Button variant="outline" className="column-action-btn">
  <PlusIcon />
  Add Column
</Button>

// In styles:
.column-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  min-width: 180px;
}
```

### 4. Consolidate your styling layer

You currently have 4 styling systems. Pick a primary:

| Keep | Drop | Notes |
|---|---|---|
| **Emotion** | styled-components, Tailwind, Radix Themes props | You already have a mature token system in `styles/` |
| **Tailwind** | Emotion, styled-components, Radix Themes props | Would require rewriting existing styles |

Having one system means one place to look, one specificity model, and no conflicts.

---

## Summary

| Option | Migration effort | Nesting reduction | Styling freedom | Accessibility |
|---|---|---|---|---|
| **Drop Radix Themes, keep Primitives** | Low | High | Full | Same |
| **Ark UI** | Medium | High | Full | Excellent |
| **React Aria** | High | Highest | Full | Best |
| **shadcn/ui** | Medium | High | Tailwind-only | Same (uses Radix) |

**My recommendation:** Start with Option 1 — drop `@radix-ui/themes` (the `Flex`, `Text`, `Box`, `Badge` imports) and replace with semantic HTML styled by Emotion. Keep all your `@radix-ui/react-*` primitives. This is the lowest-effort change with the highest nesting reduction, and it doesn't require learning a new library.
