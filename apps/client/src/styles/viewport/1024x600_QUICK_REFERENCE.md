# Front-End 1024x600 Responsive Design - Quick Reference

> **Note**: This applies to the **front-end/public app** only. The admin panel is designed for normal desktop screens.

## Media Query Pattern

```css
@media (max-width: 1024px) and (max-height: 600px) {
  /* Your compact layout styles */
}
```

## Space Savings Summary

| Component | Current | Compact | Saved |
|-----------|---------|---------|-------|
| Header | 70px | 50px | 20px |
| Footer | 70px | 40px | 30px |
| Nav Bar | 41px | 35px | 6px |
| **Total Fixed** | **181px** | **125px** | **56px** |
| **Available Content** | **419px** | **475px** | **+56px** |

## Typography Scale

| Element | Current | Compact | Reduction |
|---------|---------|---------|-----------|
| Root Font | 16px | 14px | 12.5% |
| H1 | 1.8rem | 1.5rem | 17% |
| H2 | 1.4rem | 1.2rem | 14% |
| Body | 1rem | 0.875rem | 12.5% |

## Spacing Scale

| Spacing | Current | Compact | Reduction |
|---------|---------|---------|-----------|
| Main Content Padding | 2rem | 0.5rem | 75% |
| Page Content Padding | 2rem | 0.75rem | 62.5% |
| Section Padding | 1rem | 0.5rem | 50% |
| Grid Gap | 1rem | 0.5rem | 50% |

## CSS Variables Approach

```css
:root {
  --compact-scale: 1;
}

@media (max-width: 1024px) and (max-height: 600px) {
  :root {
    --compact-scale: 0.85; /* 15% reduction */
  }
}

.component {
  padding: calc(1rem * var(--compact-scale));
  font-size: calc(1rem * var(--compact-scale));
}
```

## Key Files to Update (Front-End Only)

1. ✅ `apps/client/src/layout/Layout.styles.ts` - Main layout adjustments
2. ✅ `apps/client/src/components/Header/Header.styles.ts` - Header optimization
3. `apps/client/src/components/Footer/Footer.styles.ts` - Footer optimization
4. `apps/client/src/components/FrontEndNavigation/FrontEndNavigation.styles.ts` - Nav optimization
5. Component-specific styles (grids, forms, cards, etc.)

> **Note**: Admin panel files (`AdminLayout.styles.ts`, `AdminNavigation.styles.ts`) do NOT need these optimizations.

## Testing

1. Open browser DevTools
2. Toggle device toolbar (Cmd+Shift+M / Ctrl+Shift+M)
3. Set custom dimensions: 1024x600
4. Verify layout fits and remains functional

## Common Adjustments

### Forms

```css
@media (max-width: 1024px) and (max-height: 600px) {
  .form-field {
    margin-bottom: 0.5rem; /* Instead of 1rem */
  }

  input, select, textarea {
    padding: 0.5rem; /* Instead of 0.75rem */
    font-size: 0.875rem; /* Instead of 1rem */
  }
}
```

### Tables

```css
@media (max-width: 1024px) and (max-height: 600px) {
  table {
    font-size: 0.875rem;

    th, td {
      padding: 0.5rem; /* Instead of 0.75rem */
    }
  }
}
```

### Cards

```css
@media (max-width: 1024px) and (max-height: 600px) {
  .card {
    padding: 0.75rem; /* Instead of 1.5rem */
    margin-bottom: 0.5rem; /* Instead of 1rem */
  }
}
```
