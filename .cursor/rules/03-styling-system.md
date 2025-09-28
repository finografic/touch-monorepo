# Styling & Design System Rules

## Color System Usage

- ALWAYS use the color system: `colors.primary`, `colors.success`, etc.
- Never use hardcoded hex colors or CSS color names
- Use color variants: `colors.primaryLight`, `colors.primaryDark` for states
- Use transparency variants: `colors.primary25`, `colors.primary50` for overlays
- Colors auto-adapt to light/dark themes via CSS variables

## Available Colors

Base colors: `default`, `primary`, `secondary`, `success`, `warning`, `danger`, `info`, `grey`

Usage examples:

```typescript
// ✅ Correct
background-color: ${colors.primary};
color: ${colors.white};
border: 1px solid ${colors.primaryDark};

// ❌ Avoid
background-color: #1e3a8a;
color: white;
```

## Component Styling

- Use CSS-in-JS with Emotion
- Create style objects in separate `.styles.ts` files for complex components
- Use the `css` function for dynamic styles
- Leverage your button, layout, and spacing constants

## Icon System

- Use your centralized icon system from `styles/icons`
- Icons automatically get `.icon` class and proper styling
- Access original Radix/Lucide names via data attributes
- Use semantic names: `<CloseIcon />`, `<DropdownIcon />`

## Responsive Design

- Use your breakpoint system from `styles/viewport`
- Mobile-first approach with `min-width` media queries
- Test on multiple screen sizes
- Consider touch targets for mobile devices

## CSS Organization

- Layer CSS using `@layer` for proper cascade control
- Theme overrides go in `@layer theme-override`
- Component styles in `@layer components`
- Utility styles in `@layer utilities`
