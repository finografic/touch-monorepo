# Icon System

Lucide icons wrapped with a consistent `.icon` class and `data-icon-name` (Lucide kebab-case) for styling and targeting.

**Ref:** [lucide.dev/icons](https://lucide.dev/icons/)

## Structure

```
styles/icons/
├── index.ts          # Re-exports from icons.ts
├── icons.ts          # Icon definitions (ICONS map → named exports)
├── icons.utils.ts    # createIconWrapper helper
├── icons.css         # Icon styling
└── README.md
```

## Usage

```tsx
import { ChevronDownIcon, HomeIcon, EditIcon } from 'styles/icons';

<ChevronDownIcon />
<HomeIcon className="text-blue-500" />
<EditIcon size={24} />
```

### DOM output

Each icon renders with:

- `class="icon icon-name--chevron-down"` (or the icon’s kebab name)
- `data-icon-name="chevron-down"` (Lucide-style kebab-case)

Use these for CSS targeting, e.g. `.icon[data-icon-name="chevron-down"]`.

## Adding new icons

1. Add the Lucide icon to the `ICONS` map in `icons.ts`:

```ts
// icons.ts
const ICONS = {
  // ...
  NewIcon: Lucide.SomeLucideIcon,
} as const;
```

2. Add the corresponding destructured export in the same file (under the `wrappedIcons` destructuring block).

That’s it. The wrapper handles class names and `data-icon-name` automatically.

## Styling

All icons get the `.icon` class. See `icons.css` for:

- Default size (2rem)
- Color inheritance (`currentColor`)
- Size variants (`.icon-sm`, `.icon-md`, `.icon-lg`, `.icon-xl`)
- Interactive states for buttons

## Benefits

- Consistent styling and targeting via `.icon` and `data-icon-name`
- Tree-shaking: only import what you use
- Single source of truth for icon names in `icons.ts`
- Lucide kebab-case metadata for easy cross-reference with lucide.dev
