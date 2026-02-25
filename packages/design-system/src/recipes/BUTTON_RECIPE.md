# Button Recipe

Defined in `button.ts` via Panda CSS `defineRecipe()`.

All CSS is generated **statically at build time** (`panda codegen`). At runtime,
`buttonRecipe(...)` returns only a string of pre-existing class names — no CSS is
created or injected.

---

## Props

| Prop          | Type                                                          | Default     |
| ------------- | ------------------------------------------------------------- | ----------- |
| `size`        | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'`                      | `'md'`      |
| `variant`     | `'solid' \| 'subtle' \| 'outline' \| 'ghost' \| 'link'`      | `'outline'` |
| `colorScheme` | `'default' \| 'primary' \| 'secondary' \| 'success' \| 'warning' \| 'danger' \| 'info' \| 'grey'` | `'default'` |

---

## Usage

### With `ark.button` (primitive)

```tsx
import { ark } from '@ark-ui/react';
import { buttonRecipe } from '@workspace/design-system/recipes';

<ark.button className={buttonRecipe({ variant: 'solid', colorScheme: 'primary', size: 'md' })}>
  Save
</ark.button>
```

### Standalone className

```tsx
import { buttonRecipe } from '@workspace/design-system/recipes';

const cls = buttonRecipe({ variant: 'outline', colorScheme: 'danger', size: 'sm' });

<button className={cls} onClick={handleDelete}>
  Delete
</button>
```

---

## Variants

### `solid` — filled background, white text

```tsx
buttonRecipe({ variant: 'solid', colorScheme: 'primary' })
```

### `subtle` — tinted background, coloured text

```tsx
buttonRecipe({ variant: 'subtle', colorScheme: 'success' })
```

### `outline` — transparent background, coloured border + text (default)

```tsx
buttonRecipe({ variant: 'outline', colorScheme: 'default' })
```

### `ghost` — no border, coloured text, tinted hover

```tsx
buttonRecipe({ variant: 'ghost', colorScheme: 'info' })
```

### `link` — looks like a hyperlink, no padding/height constraints

```tsx
buttonRecipe({ variant: 'link', colorScheme: 'primary' })
```

---

## Color schemes

All colour references inside the recipe use `colorPalette.*` shade tokens, which
Panda resolves per `colorScheme` at codegen time. This produces **40 static CSS
combinations** (8 colours × 5 variants) with no runtime work.

| `colorScheme` | Palette token |
| ------------- | ------------- |
| `default`     | `neutral`     |
| `primary`     | `primary`     |
| `secondary`   | `secondary`   |
| `success`     | `success`     |
| `warning`     | `warning`     |
| `danger`      | `danger`      |
| `info`        | `info`        |
| `grey`        | `grey`        |

**Note:** `warning + solid` has a compound variant override (`color: fg`) because
amber-500 is too light for white text.

---

## Migration note — V1 `soft` → V2 `subtle`

The V1 client `Button` component (`apps/client/src/components/Button/`) uses
`ButtonVariant = 'solid' | 'soft' | ...`. The recipe uses `'subtle'` (the Ark UI
convention). When migrating to this recipe, rename `soft` → `subtle` at the call
sites.

---

## Sizes

| Size | Height | Min-width | Padding X | Font   |
| ---- | ------ | --------- | --------- | ------ |
| `xs` | 7      | 7         | 2         | `xs`   |
| `sm` | 8      | 8         | 3         | `sm`   |
| `md` | 10     | 10        | 4         | `sm`   |
| `lg` | 11     | 11        | 5         | `md`   |
| `xl` | 12     | 12        | 6         | `md`   |

Values are Panda spacing tokens (1 = 0.25rem).
