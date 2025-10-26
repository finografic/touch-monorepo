# Button Component - Dynamic Shade Variant System

This file implements a flexible color system for the Button component that uses dynamic shade shifting to generate all color variants from base color mappings.

## Overview

Instead of hardcoding specific shade names, we map each ButtonColor to a base shade variant, then dynamically compute other shades by shifting relative to the base.

## Architecture

### 1. Base Color Mapping

Each ButtonColor is mapped to a specific shade variant key:

```typescript
export const BUTTON_BASE_COLORS: Record<ButtonColor, `${ButtonColor}${ShadeVariant}`> = {
  primary: 'primaryLight',      // Base uses 'Light' shade
  secondary: 'secondaryLight',
  success: 'successLight',
  warning: 'warningLight',
  danger: 'dangerLight',
  info: 'infoLight',
  default: 'greyLight',
  grey: 'greyLight',
};
```

### 2. Shade Variant Ordering

Shades are ordered from lightest to darkest:

```typescript
const shadeOrder = ['XXLight', 'XLight', 'Light', 'Dark', 'XDark', 'XXDark'];
// Index:         [    0    ,    1    ,    2   ,    3   ,    4   ,    5   ]
```

### 3. Dynamic Shade Shifting

Given a base shade (e.g., 'Light' at index 2), we compute other shades by shifting:

```typescript
// Base has suffix 'Light' (index 2)
const lightColor = shiftShadeVariant('Light', -2);  // → 'XXLight' (index 0)
const defaultColor = 'Light';                         // → 'Light' (index 2, base)
const darkColor = shiftShadeVariant('Light', +1);   // → 'Dark' (index 3)
```

### 4. Helper Functions

#### extractBaseColorName(colorKey)

- Extracts the base color name from a color key
- Example: `'primaryLight'` → `'primary'`
- Handles all shade variants correctly (checks longer variants first)

#### shiftShadeVariant(currentVariant, shift)

- Shifts shades relative to the current variant
- Negative shift = lighter, positive shift = darker
- Bounded by shade array limits

#### getVariantStyles(variant, color)

- Main function that generates styles for each button variant
- Accepts: `variant` ('solid' | 'outline' | 'ghost' | 'link')
- Accepts: `color` (ButtonColor from Button.types)
- Returns: Emotion CSS template

## Usage Example

```typescript
// Button uses 'success' color
const variantStyles = getVariantStyles('solid', 'success');

// Internally:
// 1. Look up base color: 'success' → 'successLight'
// 2. Extract base name: 'success'
// 3. Extract current variant: 'Light'
// 4. Derive shades:
//    - lightColor: 'successXXLight' (shift -2 from 'Light')
//    - defaultColor: 'successLight' (base)
//    - darkColor: 'successDark' (shift +1 from 'Light')
//    - transparentColor: 'success25' (25% opacity)
// 5. Generate CSS with these shades
```

## Benefits

✅ **Centralized**: All base colors defined in one place
✅ **Flexible**: Easy to change base shade for any color
✅ **Consistent**: All variants use same shade progression
✅ **Maintainable**: Update one mapping affects all variants
✅ **Type-Safe**: TypeScript ensures valid color combinations

## Color Variant Generation

For each button variant, different shades are used:

### Solid Variant

- Background: `defaultColor` (base shade)
- Hover: `darkColor`
- Border: matches background

### Outline Variant

- Text/Border: `defaultColor` (base shade)
- Hover Background: `transparentColor`
- Hover Border/Text: `darkColor`

### Ghost Variant

- Text: `defaultColor` (base shade)
- Hover Background: `transparentColor`
- Hover Text: `darkColor`

### Link Variant

- Text: `defaultColor` (base shade)
- Hover Text: `darkColor`
- Underline decoration

## Extending the System

To add a new color:
1. Add color name to `ColorName` type
2. Add color values to `colors` object in design system
3. Add entry to `BUTTON_BASE_COLORS` mapping
4. All variants auto-generate!

To change shade progression:
1. Update shade offsets in `getVariantStyles`
2. Adjust shift values for desired shade jumps
3. Update comments to reflect new logic

## Architecture Notes

**Why this approach?**
- Previously, each shade was hardcoded per color
- Changing base shade required updating multiple places
- No relative shade relationships
- Difficult to maintain consistency

**Solution:**
- One base shade per color
- Other shades derived by relative shifting
- All shades mathematically related
- Change base = change all shades automatically

## Related Files

- `Button.tsx` - Component that uses this system
- `Button.types.ts` - Type definitions
- `styles/colors/colors.types.ts` - Shade variant types
- `Button.styles.ts` - Actual implementation
