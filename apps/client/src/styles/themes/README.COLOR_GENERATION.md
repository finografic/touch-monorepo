# Color Generation System

📅 Nov 15, 2025

## 🎯 Quick Reference

### **What's Actually Used in the App?**

**✅ Runtime Colors:** `generate-oklch-themes.ts` exports `oklchLightTheme` / `oklchDarkTheme`
**📁 Visual Reference:** `dark.colors.ts` / `light.colors.ts` (hex values for IDE color preview)

---

## 🚀 Commands

```bash
# Generate all color files
pnpm colors:generate:all

# Individual generators
pnpm colors:generate:palette      # MY_PALETTE.ts (visual docs)
pnpm colors:generate:themes       # Old RGB-based .hex.ts files
pnpm colors:generate:oklch-hex    # New OKLCH-based .colors.ts files
```

---

## 📁 File Structure

```
apps/client/src/styles/
├── colors/
│   ├── colors.source.ts              # 🎨 SOURCE: OKLCH base colors
│   ├── oklch-palette.config.ts       # ⚙️  CONFIG: Transformation rules
│   ├── oklch-palette.types.ts        # 📘 TYPES: Categories, config
│   ├── oklch-palette.utils.ts        # 🔧 UTILS: Transformation math
│   └── utils/
│       ├── generate-oklch-hex-themes.ts  # 🆕 NEW: OKLCH → Hex
│       ├── generate-themes.utils.ts      # ⚠️  OLD: RGB manipulation
│       └── generateMyPalette.utils.ts    # 📄 DOCS: Visual palette
└── themes/
    ├── generate-oklch-themes.ts      # ✅ RUNTIME: App uses this!
    ├── dark.colors.ts                # 🎨 NEW: OKLCH→Hex visual reference
    ├── light.colors.ts               # 🎨 NEW: OKLCH→Hex visual reference
    ├── dark.colors.hex.ts            # ⚠️  OLD: RGB-based (comparison)
    ├── light.colors.hex.ts           # ⚠️  OLD: RGB-based (comparison)
    └── generate-emotion-themes.ts    # ⚠️  OLD: Not used (uses .hex.ts)
```

---

## 🔄 Generation Flow

### **Current System (OKLCH)**

```
colors.source.ts (OKLCH source)
  ↓
oklch-palette.config.ts (category rules)
  ↓
generate-oklch-themes.ts → EmotionThemeProvider ✅ USED IN APP
  ↓
generate-oklch-hex-themes.ts → dark.colors.ts / light.colors.ts 📄 VISUAL REFERENCE
```

### **Old System (RGB - for comparison)**

```
generate-themes.utils.ts
  ↓
dark.colors.hex.ts / light.colors.hex.ts ⚠️ OLD RGB METHOD
  ↓
generate-emotion-themes.ts ⚠️ NOT USED
```

---

## 🎨 Color Categories

The OKLCH system uses **category-based transformations** for different color groups:

| Category | Colors | Purpose |
|----------|--------|---------|
| **theme** | `primary`, `secondary` | Brand colors, balanced vibrancy |
| **status** | `success`, `warning`, `danger`, `info`, `default` | UI feedback, high contrast |
| **grey** | `grey` | Neutral tones, subtle contrast |
| **text** | `text` | Foreground text, maximum readability |

Each category has distinct transformation rules in `oklch-palette.config.ts`:

```typescript
light: {
  theme:  { contrast: contrast(5),   chromaShift: chromaShift(1.0) },
  status: { contrast: contrast(6),   chromaShift: chromaShift(1.2) },
  grey:   { contrast: contrast(4),   chromaShift: chromaShift(0.3) },
  text:   { contrast: contrast(8),   chromaShift: chromaShift(0.2) },
}
```

**Contrast** (1-10): Controls lightness difference between shades
**ChromaShift** (0-2): Controls saturation changes in darker/lighter shades

---

## 🛠️ How to Modify Colors

### **1. Change Base Colors**

Edit `apps/client/src/styles/colors/colors.source.ts`:

```typescript
export const COLOR_MAPPING: ColorMapping = {
  primary: { value: 'oklch(68.8% 0.243 264.376)' }, // Change this!
  secondary: { value: 'oklch(73.3% 0.216 320.879)' },
  // ...
};
```

Then regenerate:

```bash
pnpm colors:generate:all
```

### **2. Adjust Transformation Rules**

Edit `apps/client/src/styles/colors/oklch-palette.config.ts`:

```typescript
export const OKLCH_PALETTE_CONFIG: OKLCHPaletteConfig = {
  light: {
    text: {
      contrast: contrast(10),      // Increase contrast for text
      chromaShift: chromaShift(0.1) // Reduce saturation shift
    },
  },
};
```

Then regenerate:

```bash
pnpm colors:generate:oklch-hex  # Updates visual reference files
# App will use new values automatically (runtime generation)
```

### **3. Add New Color**

1. Add to `colors.source.ts`:

```typescript
export const COLOR_MAPPING: ColorMapping = {
  // ... existing colors
  accent: { value: 'oklch(75.0% 0.15 45.0)' }, // New color!
};
```

2. Update types in `colors.types.ts`:

```typescript
export type ColorBaseName =
  | 'primary'
  | 'secondary'
  // ...
  | 'accent'; // Add here!
```

3. Regenerate:

```bash
pnpm colors:generate:all
```

---

## 📊 OKLCH vs RGB

### **Why OKLCH?**

| Feature | RGB | OKLCH |
|---------|-----|-------|
| **Perceptual Uniformity** | ❌ No | ✅ Yes |
| **Predictable Lightness** | ❌ No | ✅ Yes |
| **Smooth Gradients** | ❌ Banding | ✅ Smooth |
| **Chroma Preservation** | ❌ Loses saturation | ✅ Maintains saturation |
| **Wide Gamut** | ❌ sRGB only | ✅ Display P3+ |

### **Example: Darkening Blue**

**RGB Method:**
```
#3b82f6 (bright blue)
  → darken 20%
#2f68c4 (darker, but also less saturated) ❌
```

**OKLCH Method:**
```
oklch(60% 0.2 264) (bright blue)
  → reduce L by 20%
oklch(40% 0.22 264) (darker, MORE saturated!) ✅
```

---

## 🎯 Visual Reference Files

### **Purpose**

IDE color plugins can't render OKLCH colors as swatches:

```typescript
// ❌ No color preview in IDE
primary: 'oklch(68.8% 0.243 264.376)',

// ✅ Shows color swatch!
primary: '#93c5fd',
```

### **Solution**

We generate **hex equivalents** of the OKLCH colors for visual reference:

| File | Contains | Used By |
|------|----------|---------|
| `generate-oklch-themes.ts` | OKLCH strings | App (runtime) |
| `dark.colors.ts` | Hex strings (OKLCH→Hex) | IDE preview |
| `light.colors.ts` | Hex strings (OKLCH→Hex) | IDE preview |

**Both are generated from the same source!**

---

## 🔧 Troubleshooting

### **Colors look different between dev and production**

Check if color generation ran during build:

```bash
# Build scripts should include color generation
pnpm build.production
# → runs colors:generate:all first
```

### **IDE not showing color swatches**

1. Make sure your IDE has a color preview plugin installed
2. Open `dark.colors.ts` or `light.colors.ts` (not `generate-oklch-themes.ts`)
3. Hex values like `#93c5fd` should show color swatches

### **Colors don't match between hex files and runtime**

Regenerate all:

```bash
pnpm colors:generate:all
```

This ensures `.colors.ts` files are synced with `generate-oklch-themes.ts`.

---

## 📝 TODO: Cleanup Tasks

After verifying the new OKLCH-based system works correctly:

- [ ] Compare `.colors.ts` vs `.colors.hex.ts` visually
- [ ] Verify OKLCH→Hex conversion accuracy
- [ ] Test color rendering in app (light/dark themes)
- [ ] **Decision:** Delete `.colors.hex.ts` files?
- [ ] **Decision:** Delete `generate-themes.utils.ts` script?
- [ ] **Decision:** Delete `generate-emotion-themes.ts`?
- [ ] Update `package.json` scripts (remove old generation)
- [ ] Update documentation

---

## 📚 Related Documentation

- `COLORS_COMPARISON.md` - Detailed comparison of old vs new methods
- `OKLCH_GUIDE.md` - Deep dive into OKLCH color space
- `oklch-palette.config.ts` - Configuration reference
- `colors.source.ts` - Source color definitions

---

**Last Updated:** 2025-11-15
**Maintainer:** @justin

