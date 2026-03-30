# Design System `Button` migration (client)

Reference for replacing the local `components/Button` with `@finografic/design-system/components`.

## `ButtonProps` (DS — canonical contract)

```ts
export type ButtonProps =
  & ComponentPropsWithoutRef<'button'>
  & Omit<ButtonVariants, 'iconOnly'>
  & {
    /** Shows a spinner and disables interaction. Also sets `aria-busy`. */
    loading?: boolean;
    /** Icon element rendered before or after children. Hidden while `loading`. */
    icon?: ReactNode;
    /** Side the icon appears on. Default: `left` */
    iconPosition?: 'left' | 'right';
    /** Stretches the button to fill its container width. */
    fullWidth?: boolean;
  };
```

`ButtonVariants` (from `buttonRecipe`): **`size`** · **`variant`** · **`palette`** · `iconOnly` (not a public prop — derived when `(icon || loading) && !children`).

## Variant & palette values (DS)

| Prop      | Values                                                                                          |
| --------- | ----------------------------------------------------------------------------------------------- |
| `size`    | `xs` \| `sm` \| `md` \| `lg` \| `xl`                                                            |
| `variant` | `solid` \| `subtle` \| `outline` \| `ghost` \| `link`                                           |
| `palette` | `default` \| `primary` \| `secondary` \| `success` \| `warning` \| `danger` \| `info` \| `grey` |

**Defaults (DS):** `size="md"`, `variant="outline"`, `palette="default"`.

## Mapping from local `components/Button`

| Local               | DS                                                                                            |
| ------------------- | --------------------------------------------------------------------------------------------- |
| `color`             | **`palette`** (same token names as above)                                                     |
| `variant="soft"`    | **`variant="subtle"`** (local `soft` is not in DS)                                            |
| (no `variant` prop) | Local default was **`solid`** → set **`variant="solid"`** where you relied on the old default |

## Import

```ts
import { Button } from '@finografic/design-system/components';
```

## Open points / doubts

1. **Emotion `css` prop** — Some call sites (`LoginForm`, `FullscreenToggleButton`, `ThemeToggleButton`, `UnauthorizedPage`) pass `css={...}` from `@emotion/react`. The DS `Button` spreads props onto `ark.button`. If styles stop applying, switch to `className` + Panda/`css()` from your design pipeline or wrap in a styled wrapper.

2. **`LanguageDeleteDialog` close control** — `<Button variant="ghost" size="sm" … />` is self-closing (no children). Consider adding a visible icon (e.g. `CloseIcon`) for consistency with DS patterns.

3. **NotFoundCard** — Commented-out buttons used non-DS colors (`warningLight`, `primaryLight`). If re-enabled, map to the closest **`palette`** or override with `className` / CSS.

4. **Left in repo on purpose** — `components/Button/` (implementation, `Button.examples.tsx`, `button-base.styles`, `getVariantStyles` for non-Button styling) remains for shared styles and docs until fully retired.

5. **`RelaysTable.styles.ts`** — Imports `getVariantStyles` from `components/Button/utils` for table row styling, not the React `Button` component. No change required for DS `Button`.

## Applied in client (app `Button` → DS)

Imports were switched to `@finografic/design-system/components` and **`color` → `palette`** (and **`soft` → `subtle`**) everywhere that used the local `Button` component. **`variant="solid"`** was added where the old default “filled” look was implicit (icon-only toolbar / toggles).

Remaining references to `components/Button` are intentional: the **local implementation** (`Button.tsx`), **`Button.examples.tsx`**, shared **style utilities** (`button-base.styles`, `getVariantStyles`), and commented-out imports in a few files.
