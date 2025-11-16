# Color Palette Comparison

📅 Nov 15, 2025

This document explains the different color files in the `themes/` folder.

---

## 📁 File Overview

### **Runtime Colors (Actually Used in App)**

| File | Status | Description |
|------|--------|-------------|
| `generate-oklch-themes.ts` | ✅ **ACTIVE** | OKLCH colors used by app at runtime |

**Imported by:** `EmotionThemeProvider.tsx`

```typescript
import { oklchDarkTheme, oklchLightTheme } from 'styles/themes/generate-oklch-themes';
```

**Benefits:**
- ✅ Perceptually uniform color space
- ✅ Category-based transformations (theme/status/grey/text)
- ✅ Configurable via `oklch-palette.config.ts`
- ✅ Better color science (OKLCH > RGB)

---

### **Visual Reference Colors (IDE Preview Only)**

| File | Purpose | Generation Method | Status |
|------|---------|-------------------|--------|
| `dark.colors.ts` | Visual reference | OKLCH → Hex conversion | ✅ **NEW** (synced) |
| `light.colors.ts` | Visual reference | OKLCH → Hex conversion | ✅ **NEW** (synced) |
| `dark.colors.hex.ts` | Visual reference | Old RGB manipulation | ⚠️ **OLD** (comparison) |
| `light.colors.hex.ts` | Visual reference | Old RGB manipulation | ⚠️ **OLD** (comparison) |

---

## 🎨 Generation Methods

### **Method 1: OKLCH-based (Current) - `.colors.ts`**

```
COLOR_MAPPING (OKLCH source colors)
  ↓
Category-based transformation config
  ↓
OKLCH shade generation (perceptually uniform)
  ↓
OKLCH → Hex conversion
  ↓
dark.colors.ts / light.colors.ts
```

**Script:** `generate-oklch-hex-themes.ts`
**Command:** `pnpm colors:generate:oklch-hex`

**Configuration:**
- Uses `oklch-palette.config.ts` for transformation rules
- Different `contrast` and `chromaShift` per category
- Same logic as runtime OKLCH colors (guaranteed sync!)

**Benefit:** These hex values **exactly mirror** what the app renders (OKLCH → Hex conversion)

---

### **Method 2: RGB-based (Old) - `.colors.hex.ts`**

```
Hardcoded hex colors (e.g., #1e3a8a)
  ↓
RGB manipulation (lighten/darken)
  ↓
Saturation adjustments
  ↓
dark.colors.hex.ts / light.colors.hex.ts
```

**Script:** `generate-themes.utils.ts`
**Command:** `pnpm colors:generate:themes`

**Issues:**
- ❌ Not perceptually uniform (RGB space problems)
- ❌ Doesn't reflect actual OKLCH transformations
- ❌ Out of sync with runtime colors
- ❌ No category-based transformations

**Purpose:** Keep for comparison, then likely delete

---

## 🔄 Workflow

### **To Regenerate All Color Files:**

```bash
pnpm colors:generate:all
```

This runs:
1. `generateMyPalette.utils.ts` - Visual palette documentation
2. `generate-themes.utils.ts` - Old RGB-based hex files (`.hex.ts`)
3. `generate-oklch-hex-themes.ts` - **New OKLCH-based hex files (`.colors.ts`)** ✅

---

## 🎯 IDE Color Preview

Your IDE color plugin renders hex values as color swatches:

```typescript
// ✅ Shows color swatch in IDE
primary: '#93c5fd',
primaryDark: '#405d7c',

// ❌ No color swatch (OKLCH string)
primary: 'oklch(68.8% 0.243 264.376)',
```

**Solution:** Use `.colors.ts` files for visual reference while coding!

---

## 📊 Side-by-Side Comparison

### **Primary Color Example**

#### Dark Theme

| Shade | Old RGB Method | New OKLCH Method | Delta |
|-------|----------------|------------------|-------|
| `primary` | `#93c5fd` | `#93c5fd` | ✅ Same |
| `primaryXXLight` | `#deeaf8` | `#e3eeff` | Slightly different |
| `primaryXLight` | `#cfe1f7` | `#c0d9ff` | Lighter in OKLCH |
| `primaryLight` | `#bed8f5` | `#a3c5f8` | More saturated |
| `primaryDark` | `#547696` | `#6589c7` | Brighter in OKLCH |
| `primaryXDark` | `#405d7c` | `#3f5d9e` | More blue |
| `primaryXXDark` | `#304760` | `#243276` | Darker |

**Observation:** OKLCH method produces more **perceptually uniform** transitions and better preserves **chroma (saturation)** in darker shades.

---

## 🤔 Decision: Keep or Delete `.hex.ts` Files?

### **Reasons to Keep:**

1. ✅ Historical reference
2. ✅ Side-by-side comparison
3. ✅ Fallback if OKLCH conversion has issues

### **Reasons to Delete:**

1. ❌ Out of sync with actual app colors
2. ❌ Confusing to have multiple "sources of truth"
3. ❌ Old RGB method is inferior
4. ❌ Adds maintenance burden

---

## ✅ Recommendation

**Short-term (Now):**
- ✅ Keep both `.colors.ts` and `.colors.hex.ts`
- ✅ Compare visually
- ✅ Verify OKLCH conversions look correct

**Medium-term (After testing):**
- ❌ Delete `.colors.hex.ts` files
- ❌ Remove `generate-themes.utils.ts` script
- ❌ Update `package.json` to only generate OKLCH-based files

**Long-term:**
- ✅ Only maintain OKLCH-based generation
- ✅ Single source of truth: `COLOR_MAPPING` → OKLCH transformations

---

## 🎨 Color Categories

The new OKLCH system uses **category-based transformations**:

| Category | Colors | Transformation Goal |
|----------|--------|---------------------|
| **Theme** | `primary`, `secondary` | Balanced contrast, vibrant |
| **Status** | `success`, `warning`, `danger`, `info`, `default` | High contrast for visibility |
| **Grey** | `grey` | Subtle contrast, neutral |
| **Text** | `text` | Maximum contrast for readability |

Each category has different `contrast` (1-10) and `chromaShift` (0-2) values in `oklch-palette.config.ts`.

---

## 🔧 How to Tweak Colors

### **1. Adjust Category Transformations**

Edit `apps/client/src/styles/colors/oklch-palette.config.ts`:

```typescript
export const OKLCH_PALETTE_CONFIG = {
  light: {
    theme: { contrast: contrast(5), chromaShift: chromaShift(1.0) },
    status: { contrast: contrast(6), chromaShift: chromaShift(1.2) },
    text: { contrast: contrast(8), chromaShift: chromaShift(0.2) },
  },
  // ...
};
```

**Then regenerate:**

```bash
pnpm colors:generate:oklch-hex
```

### **2. Change Source Colors**

Edit `apps/client/src/styles/colors/colors.source.ts`:

```typescript
export const COLOR_MAPPING: ColorMapping = {
  primary: { value: 'oklch(68.8% 0.243 264.376)' }, // Change this!
  // ...
};
```

**Then regenerate all:**

```bash
pnpm colors:generate:all
```

---

## 📝 Summary

| File | Used by App? | Purpose | Keep? |
|------|--------------|---------|-------|
| `generate-oklch-themes.ts` | ✅ Yes | Runtime OKLCH colors | ✅ YES |
| `dark.colors.ts` | ❌ No | OKLCH→Hex visual reference | ✅ YES |
| `light.colors.ts` | ❌ No | OKLCH→Hex visual reference | ✅ YES |
| `dark.colors.hex.ts` | ❌ No | Old RGB visual reference | ⚠️ MAYBE (for now) |
| `light.colors.hex.ts` | ❌ No | Old RGB visual reference | ⚠️ MAYBE (for now) |
| `generate-emotion-themes.ts` | ❌ No | Old hex-based themes | ⚠️ MAYBE (delete later) |

---

**Last Updated:** 2025-11-15
**Status:** Awaiting visual comparison and decision on `.hex.ts` files

