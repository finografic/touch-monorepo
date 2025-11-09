# Spacing & Padding Reference

## Aligned Scale

Both `baseLayout.padding` and `baseLayout.spacing` use **identical values** for consistent sizing throughout the application.

| Key | rem | px | Usage |
|-----|-----|----|----|
| `none` | `0` | 0px | No spacing/padding |
| `px` | - | 1px | Hairline spacing |
| `xs` | `0.25rem` | 4px | Extra small |
| `sm` | `0.5rem` | 8px | Small |
| `md` | `0.75rem` | 12px | Medium |
| `default` | `1rem` | 16px | **Default** (most common) |
| `lg` | `1.25rem` | 20px | Large |
| `xl` | `1.5rem` | 24px | Extra large |
| `xxl` | `1.75rem` | 28px | 2× Extra large |
| `xxxl` | `2rem` | 32px | 3× Extra large |
| `xxxxl` | `2.25rem` | 36px | 4× Extra large |

---

## Usage Examples

```ts
import { baseLayout } from 'styles/constants/base.constants';

// Using padding
css`
  padding: ${baseLayout.padding.default}; // 1rem (16px)
  padding-left: ${baseLayout.padding.lg}; // 1.25rem (20px)
`;

// Using spacing (for margins, gaps, etc.)
css`
  margin-bottom: ${baseLayout.spacing.xl}; // 1.5rem (24px)
  gap: ${baseLayout.spacing.sm}; // 0.5rem (8px)
`;
```

---

## Re-exports

Both are re-exported from `'styles'` for convenience:

```ts
import { spacing } from 'styles'; // Re-exported from global.constants
// spacing === baseLayout.spacing

// padding is accessed via baseLayout
import { baseLayout } from 'styles/constants/base.constants';
```

---

## Design Notes

- **Aligned Values**: `padding` and `spacing` share identical values to reduce confusion
- **Semantic Names**: Use meaningful names (`xs`, `sm`, `md`, etc.) instead of numeric indexes
- **Default Value**: `default` (1rem/16px) is the most commonly used spacing value
- **Root Font Size**: Based on 16px root font size (browser default)

