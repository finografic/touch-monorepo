# 🚀 Color System Migration - Cheat Sheet

📅 Nov 8, 2025

## Quick Reference: All Your Options

### Option 1: `useColors()` Hook (⭐ RECOMMENDED)

```tsx
import { useColors } from 'styles';

const Component = () => {
  const { colors } = useColors();

  return (
    <div css={css`color: ${colors.primary}`}>
      Content
    </div>
  );
};
```

**Pros:**
- ✅ Only 2 lines change
- ✅ All color names stay the same
- ✅ Automatic theme switching
- ✅ Fast (no CSS variables)

**Cons:**
- ⚠️ Only works in React components (not utils)

**Best for:** Most components

---

### Option 2: Theme Prop

```tsx
<div css={css`
  color: ${({ theme }) => theme.colors.primary};
`}>
  Content
</div>
```

**Pros:**
- ✅ No hook needed
- ✅ Automatic theme switching
- ✅ Fast

**Cons:**
- ⚠️ More verbose
- ⚠️ Different syntax from before

**Best for:** One-off styles, inline CSS

---

### Option 3: `colorsDirect` Import

```tsx
import { colorsDirect as colors } from 'styles';

<div css={css`color: ${colors.primary}`}>
  Content
</div>
```

**Pros:**
- ✅ Exactly like old syntax
- ✅ Works in utils/helpers
- ✅ Fast

**Cons:**
- ❌ No theme switching (light only)
- ⚠️ Need to change import

**Best for:** Utility files, static styles

---

### Option 4: Keep Old System

```tsx
import { colors } from 'styles';

<div css={css`color: ${colors.primary}`}>
  Content
</div>
```

**Pros:**
- ✅ Zero changes
- ✅ Theme switching still works

**Cons:**
- ❌ Slower (CSS variables)
- ❌ Keep 500+ CSS variables

**Best for:** Legacy code you don't want to touch

---

## Side-by-Side Comparison

| Feature | `useColors()` | `theme.colors` | `colorsDirect` | Old `colors` |
|---------|---------------|----------------|----------------|--------------|
| Migration effort | 2 lines | Moderate | 1 line | 0 lines |
| Theme switching | ✅ Yes | ✅ Yes | ❌ No | ✅ Yes |
| Performance | ⚡ Fast | ⚡ Fast | ⚡ Fast | 🐢 Slow |
| Works in utils | ❌ No | ❌ No | ✅ Yes | ✅ Yes |
| Same color names | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| Type safe | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |

## Migration Patterns

### Pattern 1: Component with Inline Styles

**Before:**

```tsx
import { colors } from 'styles';

export const Alert = ({ type, children }) => (
  <div css={css`
    background: ${colors[`${type}Light`]};
    color: ${colors[type]};
    border-left: 4px solid ${colors[`${type}Dark`]};
  `}>
    {children}
  </div>
);
```

**After (useColors):**

```tsx
import { useColors } from 'styles';

export const Alert = ({ type, children }) => {
  const { colors } = useColors();

  return (
    <div css={css`
      background: ${colors[`${type}Light`]};
      color: ${colors[type]};
      border-left: 4px solid ${colors[`${type}Dark`]};
    `}>
      {children}
    </div>
  );
};
```

---

### Pattern 2: Component with Separate Styles Function

**Before:**

```tsx
import { colors } from 'styles';

const getButtonStyles = (variant) => css`
  background: ${colors[variant]};
  &:hover { background: ${colors[`${variant}Dark`]}; }
`;

export const Button = ({ variant, children }) => (
  <button css={getButtonStyles(variant)}>
    {children}
  </button>
);
```

**After (Option A - Pass colors):**

```tsx
import { useColors } from 'styles';

const getButtonStyles = (variant, colors) => css`
  background: ${colors[variant]};
  &:hover { background: ${colors[`${variant}Dark`]}; }
`;

export const Button = ({ variant, children }) => {
  const { colors } = useColors();

  return (
    <button css={getButtonStyles(variant, colors)}>
      {children}
    </button>
  );
};
```

**After (Option B - Move inline):**

```tsx
import { useColors } from 'styles';

export const Button = ({ variant, children }) => {
  const { colors } = useColors();

  const styles = css`
    background: ${colors[variant]};
    &:hover { background: ${colors[`${variant}Dark`]}; }
  `;

  return <button css={styles}>{children}</button>;
};
```

---

### Pattern 3: Utility File (Can't Use Hook)

**Before:**

```tsx
// utils/colors.ts
import { colors } from 'styles';

export function getStatusColor(status) {
  return {
    success: colors.success,
    warning: colors.warning,
    error: colors.danger,
  }[status];
}
```

**After (Option A - Use static colors):**

```tsx
// utils/colors.ts
import { colorsDirect as colors } from 'styles';

export function getStatusColor(status) {
  return {
    success: colors.success,
    warning: colors.warning,
    error: colors.danger,
  }[status];
}
```

**After (Option B - Accept colors parameter):**

```tsx
// utils/colors.ts
import type { ColorPalette } from 'styles';

export function getStatusColor(status, colors: ColorPalette) {
  return {
    success: colors.success,
    warning: colors.warning,
    error: colors.danger,
  }[status];
}

// In component:
import { useColors } from 'styles';
const { colors } = useColors();
const color = getStatusColor('success', colors);
```

---

### Pattern 4: Global Styles

**Before:**

```tsx
import { colors } from 'styles';

export const cssGlobal = css`
  body {
    color: ${colors.text};
    background: ${colors.background};
  }
`;
```

**After (Keep CSS variables or use theme):**

```tsx
// Option A: Keep CSS variables (works fine)
import { colors } from 'styles';

export const cssGlobal = css`
  body {
    color: ${colors.text};
    background: ${colors.background};
  }
`;

// Option B: Use CSS custom properties
export const cssGlobal = css`
  body {
    color: var(--color-text);
    background: var(--color-background);
  }
`;
```

---

## Quick Decision Tree

```
Do you need theme switching?
├─ YES → Is it a React component?
│        ├─ YES → Use useColors() hook ⭐
│        └─ NO (util/helper) → Pass colors as parameter
│                               or use colorsDirect (no switching)
└─ NO → Use colorsDirect import
```

---

## Color Names Quick Reference

All these work in **every approach**:

```ts
// Base colors
primary, secondary, success, warning, danger, info, text, grey, default

// Shade variants (append to base)
XXLight, XLight, Light, Dark, XDark, XXDark

// Transparency variants (append number)
25, 50, 75

// Examples
colors.primary          // #1e3a8a (light) or #93c5fd (dark)
colors.primaryLight     // Lighter shade
colors.primaryDark      // Darker shade
colors.primary25        // 25% opacity
colors.primaryLight50   // Light shade + 50% opacity
colors.dangerXXDark75   // Very dark danger + 75% opacity
```

---

## Implementation Checklist

After making changes to `main.tsx`:

- [ ] Import `useColors` in a component
- [ ] Add `const colors = useColors()`
- [ ] Use `colors.primary`, etc. as before
- [ ] Test light theme
- [ ] Test dark theme
- [ ] Check DevTools (should be faster!)
- [ ] Gradually migrate more components

---

## Need Help?

- 📖 **Detailed guide:** `ZERO_MIGRATION_APPROACH.md`
- 🚀 **Quick start:** `QUICK_START.md`
- 📊 **Full comparison:** `BEFORE_AFTER_COMPARISON.md`
- 🎓 **Code examples:** `src/styles/colors/EXAMPLE_USAGE.tsx`

---

## Summary

**Best approach for most cases:**

```tsx
import { useColors } from 'styles';

const MyComponent = () => {
  const { colors } = useColors();
  // Use colors.primary, colors.primaryLight, etc.
};
```

**Why?**
- ✅ Minimal code changes (2 lines)
- ✅ All color names stay the same
- ✅ Automatic theme switching
- ✅ Performance optimization
- ✅ Type safe

**Start here, adjust if needed!** 🎉

