# 🎨 OKLCH Category-Based Color System

📅 Nov 15, 2025

## Overview

The OKLCH palette generation system has been **extended** to support **category-specific transformations**. This allows different types of colors (theme, status, grey, text) to have distinct shade generation rules, solving the problem of insufficient contrast in certain color categories (e.g., text colors) while maintaining optimal appearance for others.

---

## What Changed

### ✅ New Files Created

1. **`styles/colors/oklch-palette.config.ts`** ⭐ NEW CONFIG FILE
   - Defines color categories (theme, status, grey, text)
   - Simple 2-value config per category: `contrast` (1-10) and `chromaShift` (0-2)
   - Converts human-readable values to OKLCH transformation values
   - Separate configs for light and dark themes

2. **`styles/themes/generate-oklch-themes.BACKUP.ts`** 🔒 BACKUP
   - Original version saved before refactoring

### ✅ Modified Files

1. **`styles/themes/generate-oklch-themes.ts`** 🔄 REFACTORED
   - Now uses category-specific transformation rules
   - `generateOKLCHShades()` accepts `colorName` parameter
   - Determines category and applies appropriate config
   - All hardcoded transformation values removed

---

## How It Works

### 1. Color Categories

Colors are organized into 4 categories:

```typescript
{
  theme: ['primary', 'secondary'],        // Brand colors
  status: ['success', 'warning', 'danger', 'info', 'default'],  // UI feedback
  grey: ['grey'],                         // Neutral colors
  text: ['text']                          // Text colors
}
```

### 2. Simple Configuration

Each category has 2 intuitive config values:

```typescript
{
  contrast: 8,      // 1-10 scale: Controls difference between shades
  chromaShift: 0.2  // 0-2 scale: Controls saturation changes
}
```

**Example: Text Colors**
```typescript
text: {
  contrast: 8,      // HIGH contrast for readability
  chromaShift: 0.2  // LOW saturation (stay neutral)
}
```

**Example: Status Colors**
```typescript
status: {
  contrast: 6,      // MEDIUM-HIGH contrast
  chromaShift: 1.2  // HIGH saturation (vibrant feedback)
}
```

### 3. Automatic Transformation

The config values are automatically converted to OKLCH transformations:

```typescript
contrast: 8  →  Lightness steps: XXLight: +0.19, Light: +0.12, Dark: -0.12, etc.
chromaShift: 0.2  →  Chroma multipliers: XXLight: 0.94, Dark: 1.03, etc.
```

---

## Configuration Guide

### Adjusting Contrast

**Problem**: Text shade variants look too similar?

**Solution**: Increase `contrast` value in `oklch-palette.config.ts`

```typescript
// BEFORE: Low contrast
text: {
  contrast: 5,  // Subtle differences
  chromaShift: 0.2
}

// AFTER: High contrast
text: {
  contrast: 8,  // Strong differences ✅
  chromaShift: 0.2
}
```

### Adjusting Saturation

**Problem**: Status colors losing vibrancy in dark/light shades?

**Solution**: Increase `chromaShift` value

```typescript
// BEFORE: Conservative saturation
status: {
  contrast: 6,
  chromaShift: 0.8  // Minimal color shift
}

// AFTER: Vibrant shades
status: {
  contrast: 6,
  chromaShift: 1.5  // Strong color shift ✅
}
```

---

## Default Configuration

### Light Theme

| Category | Contrast | ChromaShift | Purpose |
|----------|----------|-------------|---------|
| **theme** | 5 | 1.0 | Balanced, vibrant brand colors |
| **status** | 6 | 1.2 | High visibility UI feedback |
| **grey** | 4 | 0.3 | Subtle, even neutral transitions |
| **text** | 8 | 0.2 | High contrast, neutral readability |

### Dark Theme

| Category | Contrast | ChromaShift | Purpose |
|----------|----------|-------------|---------|
| **theme** | 5.5 | 1.1 | Slightly higher contrast for dark BG |
| **status** | 6.5 | 1.3 | Enhanced visibility on dark |
| **grey** | 4.5 | 0.4 | Slightly more visible |
| **text** | 8.5 | 0.2 | Very high contrast for dark mode |

---

## Technical Details

### Color Transformation Flow

```
COLOR_MAPPING (colors.source.ts)
  ↓
getColorCategory() → Determine category
  ↓
OKLCH_PALETTE_CONFIG → Get category config
  ↓
calculateTransformValues() → Convert to OKLCH values
  ↓
generateOKLCHShades() → Apply transformations
  ↓
ColorPalette (complete theme)
```

### Transformation Formula

**Lightness Steps:**
```typescript
baseStep = 0.12 * (contrast / 5)
XXLight = baseStep * 2.0
Light = baseStep * 1.0
Dark = baseStep * 1.0
XXDark = baseStep * 2.0
```

**Chroma Multipliers:**
```typescript
chromaBase = 0.15 * chromaShift
XXLight multiplier = 1 - (chromaBase * 2)  // Most desaturated
Dark multiplier = 1 + (chromaBase * 0.8)   // Slightly saturated
XXDark multiplier = 1 + (chromaBase * 1.5) // Most saturated
```

---

## Examples

### Example 1: Increase Text Contrast

**Scenario**: `textLight` and `textXLight` are too similar

```typescript
// In oklch-palette.config.ts
light: {
  text: {
    contrast: 8,  // Increase from 5 → 8
    chromaShift: 0.2
  }
}
```

**Result**:
- `textLight` is now visibly lighter
- `textDark` is now visibly darker
- Better differentiation between shade variants

### Example 2: More Vibrant Status Colors

**Scenario**: Success/danger colors lose saturation in light shades

```typescript
// In oklch-palette.config.ts
light: {
  status: {
    contrast: 6,
    chromaShift: 1.5  // Increase from 1.2 → 1.5
  }
}
```

**Result**:
- `successLight` maintains more green saturation
- `dangerDark` has richer red saturation
- Better visual hierarchy

### Example 3: Subtle Grey Transitions

**Scenario**: Grey shades are too distinct

```typescript
// In oklch-palette.config.ts
light: {
  grey: {
    contrast: 3,  // Decrease from 4 → 3
    chromaShift: 0.2  // Decrease from 0.3 → 0.2
  }
}
```

**Result**:
- Softer transitions between grey variants
- More subtle, professional appearance

---

## Benefits

### ✅ **Flexibility**
- Tune each color category independently
- No need to modify transformation code

### ✅ **Simplicity**
- Just 2 values: `contrast` and `chromaShift`
- Human-readable (1-10 scale, not 0.157 values)

### ✅ **Maintainability**
- All config in one place
- Easy to experiment and compare

### ✅ **Perceptually Uniform**
- Still uses OKLCH color space
- Transformations remain perceptually accurate

---

## Migration Notes

### No Breaking Changes

- ✅ All existing color references work unchanged
- ✅ `colors.primary`, `colors.textLight`, etc. still valid
- ✅ Themes automatically regenerated with new system

### Only Config Changes Needed

To customize color transformations:

1. Open `styles/colors/oklch-palette.config.ts`
2. Adjust `contrast` or `chromaShift` for desired category
3. Save (color system regenerates automatically)
4. Test in browser

---

## Future Enhancements

### Potential Additions

1. **Per-Color Overrides**
   - Allow specific colors to override category defaults
   - Example: Make `danger` extra vibrant

2. **Accessibility Mode**
   - High-contrast config preset for WCAG AAA
   - One toggle to boost all contrast values

3. **Color Harmony Tools**
   - Automatic complementary color generation
   - Triadic/analogous color schemes

4. **Visual Config Tool**
   - UI to preview changes in real-time
   - Export config as JSON

---

## Troubleshooting

### Issue: Colors look washed out

**Solution**: Increase `chromaShift` for that category

```typescript
theme: {
  contrast: 5,
  chromaShift: 1.5  // Was 1.0
}
```

### Issue: Not enough difference between shades

**Solution**: Increase `contrast` for that category

```typescript
text: {
  contrast: 9,  // Was 8
  chromaShift: 0.2
}
```

### Issue: Too much saturation in light shades

**Solution**: Decrease `chromaShift`

```typescript
status: {
  contrast: 6,
  chromaShift: 0.8  // Was 1.2
}
```

---

## Files Reference

| File | Purpose |
|------|---------|
| `colors/oklch-palette.config.ts` | Configuration for transformations |
| `themes/generate-oklch-themes.ts` | Applies config to generate themes |
| `colors/colors.source.ts` | Source OKLCH values (unchanged) |
| `themes/generate-oklch-themes.BACKUP.ts` | Original implementation (backup) |

---

## Summary

The new category-based system provides:

🎯 **Granular Control** - Tune text contrast without affecting status colors
🎨 **Better Defaults** - Each category optimized for its use case
🔧 **Easy Tweaking** - Simple 1-10 scale, no OKLCH knowledge needed
📈 **Scalable** - Add more categories or transformations easily

**Ready to customize your colors? Edit `oklch-palette.config.ts` and see the results!** 🚀

