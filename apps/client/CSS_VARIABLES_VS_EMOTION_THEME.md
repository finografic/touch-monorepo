# CSS Variables vs Emotion Theme: Why Your Inline Style Was Needed

📅 Nov 8, 2025

## What You Discovered

You found that `background-color: var(--color-background)` in Emotion CSS **didn't work**, but using:

```tsx
const { background } = useColors();
<div css={styles} style={{ background }}>
```

**DID work**. This uncovered an important pattern!

## Why CSS Variables Can Fail in Emotion

### The Issue: Emotion's `css` is Static

When you write:

```ts
export const styles = css`
  background-color: var(--color-background);
`;
```

**What happens:**
1. Emotion generates this CSS **once** when the module loads
2. The CSS variable reference is baked into a generated class (e.g., `.css-abc123`)
3. The class is applied to the DOM
4. **But:** The CSS variable might not be defined yet, or might be overridden

### Why Inline Styles Work

```tsx
const { background } = useColors();
<div style={{ background }}>
```

**Why this works:**
1. `useColors()` returns **direct hex values** (`#fefefe`, `#0f172a`)
2. Inline styles have **highest specificity** (override everything)
3. The component **re-renders** when theme changes
4. React applies the new inline style immediately

## The Better Solution: Emotion Theme Functions

Instead of CSS variables OR inline styles, use **Emotion's theme properly**:

### ❌ Bad: Static CSS with CSS Variables

```ts
// Layout.styles.ts
export const styles = css`
  background-color: var(--color-background); // ❌ Can fail
`;
```

**Problems:**
- CSS variable might not be defined
- Can be overridden by `!important` in global styles
- CSS layer ordering issues
- Timing/hydration issues

### ❌ Okay But Messy: Inline Styles

```tsx
// Layout.tsx
const { background } = useColors();
<div css={styles} style={{ background }}> // ⚠️ Works but messy
```

**Problems:**
- Mixes CSS-in-JS with inline styles
- Verbose (need to import `useColors()` everywhere)
- Less maintainable
- Defeats the purpose of styled components

### ✅ Best: Emotion Theme Function

```ts
// Layout.styles.ts
import type { EmotionTheme } from 'styles/themes/emotion-theme.types';

export const styles = (theme: EmotionTheme) => css`
  background-color: ${theme.colors.background}; // ✅ Perfect!
  color: ${theme.colors.text};
`;
```

```tsx
// Layout.tsx
import { useTheme } from '@emotion/react';
import type { EmotionTheme } from 'styles/themes/emotion-theme.types';

const emotionTheme = useTheme() as EmotionTheme;

<div css={styles(emotionTheme)}> // ✅ Clean!
```

**Why this is better:**
1. ✅ **Direct color values** (no CSS variable lookup)
2. ✅ **Type-safe** (TypeScript knows what colors exist)
3. ✅ **Reactive** (re-renders when theme changes)
4. ✅ **Clean API** (one hook, one function call)
5. ✅ **Performant** (direct values, no CSS variable overhead)

## Is Emotion Theme Switching Reactive?

**YES!** Here's how it works:

```tsx
// EmotionThemeProvider.tsx
export const EmotionThemeProvider = ({ children }: Props) => {
  const [currentTheme, setCurrentTheme] = useState<EmotionTheme>(lightTheme);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const theme = document.documentElement.getAttribute('data-theme');
      setCurrentTheme(theme === 'dark' ? darkTheme : lightTheme);
      // ☝️ This setState triggers re-render of all consumers!
    });
    // ... observer watches data-theme attribute
  }, []);

  return (
    <ThemeProvider theme={currentTheme}>
      {children}
    </ThemeProvider>
  );
};
```

**When theme changes:**
1. User clicks theme toggle button
2. `AppConfigProvider.toggleTheme()` updates `data-theme` attribute
3. `MutationObserver` in `EmotionThemeProvider` detects the change
4. Calls `setCurrentTheme()` which triggers React re-render
5. All components using `useTheme()` re-render with new theme
6. Background changes instantly! ✨

## When to Use Each Approach

### Use Emotion Theme Functions (✅ Recommended)

**For:** Any Emotion-styled component that needs theme switching

```ts
export const styles = (theme: EmotionTheme) => css`
  background: ${theme.colors.background};
  color: ${theme.colors.text};
  border: 1px solid ${theme.colors.primaryLight};
`;
```

```tsx
const theme = useTheme() as EmotionTheme;
<Component css={styles(theme)} />
```

### Use CSS Variables (⚠️ Special Cases Only)

**For:** Global styles that need to work outside React's render cycle

```css
/* global.styles.ts */
body {
  background-color: var(--color-background);
}
```

**When it's safe:**
- Global `body`, `html`, `#root` styles
- Radix UI components that expect CSS variables
- Overrides that need maximum specificity (`!important`)

**When it can fail:**
- Emotion-generated CSS classes (timing issues)
- CSS layer conflicts
- Specificity wars with `!important`

### Use `colorsDirect` Import (✅ For Static Styles)

**For:** Components that DON'T need theme switching

```ts
import { colorsDirect as colors } from 'styles';

export const styles = css`
  background: ${colors.background}; // Always light theme
  // Good for: branded elements, fixed decorations
`;
```

**When to use:**
- Logos, branded elements (always same color)
- Decorative elements that shouldn't change
- When you explicitly want the light theme color

### Use Inline Styles (❌ Avoid)

**Don't use unless absolutely necessary** (e.g., dynamic calculations)

```tsx
// ❌ Bad: defeats the purpose of Emotion
const { background } = useColors();
<div style={{ background }}>
```

## Pattern Summary

### For React Components with Theme Switching

**The Emotion Theme Pattern:**

```tsx
// Component.styles.ts
import type { EmotionTheme } from 'styles/themes/emotion-theme.types';

export const styles = (theme: EmotionTheme) => css`
  background: ${theme.colors.background};
  color: ${theme.colors.text};
`;
```

```tsx
// Component.tsx
import { useTheme } from '@emotion/react';
import type { EmotionTheme } from 'styles/themes/emotion-theme.types';
import { styles } from './Component.styles';

export const Component = () => {
  const theme = useTheme() as EmotionTheme;

  return (
    <div css={styles(theme)}>
      Content
    </div>
  );
};
```

### For Nested Styles

If your styles are complex, you can pass theme to nested functions:

```ts
const headerStyles = (theme: EmotionTheme) => css`
  background: ${theme.colors.primaryDark};
  color: ${theme.colors.white};
`;

const footerStyles = (theme: EmotionTheme) => css`
  background: ${theme.colors.greyLight};
`;

export const styles = (theme: EmotionTheme) => css`
  > header {
    ${headerStyles(theme)}
  }

  > footer {
    ${footerStyles(theme)}
  }
`;
```

## Why Your Bug Wasn't Really a Bug

Your inline style workaround **was covering up a design issue**, not a bug:

1. ❌ **CSS variables in Emotion** = wrong tool for the job
2. ✅ **Emotion theme functions** = proper solution
3. ✅ **Emotion IS reactive** = it re-renders on theme change
4. ✅ **Your intuition was correct** = the CSS variable approach should have worked

**The real issue:** CSS variables are for **global CSS**, not **component-scoped Emotion styles**.

## Migration Path

If you have other components using CSS variables in Emotion:

### Search for this pattern:

```bash
# Find files using var(--color-*)
grep -r "var(--color-" apps/client/src --include="*.styles.ts"
```

### Replace with theme functions:

```diff
- export const styles = css`
-   background: var(--color-background);
- `;

+ export const styles = (theme: EmotionTheme) => css`
+   background: ${theme.colors.background};
+ `;
```

```diff
- <Component css={styles} />

+ const theme = useTheme() as EmotionTheme;
+ <Component css={styles(theme)} />
```

## Summary

✅ **Emotion theme functions** = Best approach
✅ **Emotion IS reactive** = Re-renders on theme change
✅ **CSS variables** = For global styles only
✅ **Your intuition was right** = It should "just work"
✅ **The fix** = Use proper Emotion patterns, not workarounds

**Your app now uses the correct pattern!** 🎉

The background will change reactively when you toggle themes, using Emotion's built-in theme system rather than inline styles or CSS variables.

