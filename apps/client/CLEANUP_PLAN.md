# 🧹 Cleanup Plan - Remove Deprecated Code

📅 Nov 8, 2025

## Status: Ready to Execute

Now that we've switched to OKLCH colors with direct values, we can remove a lot of deprecated code!

---

## 1️⃣ CSS Files to Remove (4 files)

### ❌ `/src/theme.css` (643 lines - OLD!)
**Status:** Commented out in `main.tsx`
**Reason:** Replaced by `theme-minimal.css` (30 lines)
**Safe to delete:** ✅ Yes

### ❌ `/src/styles/radix-ui/overrides-V1.css`
**Status:** Versioned file (V1 = old)
**Reason:** Superseded by `overrides.css`
**Safe to delete:** ✅ Yes

### ❌ `/src/styles/radix-ui/css/unused/radix-ORIG.css`
**Status:** In "unused" folder
**Safe to delete:** ✅ Yes

### ❌ `/src/styles/radix-ui/css/unused/radix-FULL.css`
**Status:** In "unused" folder
**Safe to delete:** ✅ Yes

---

## 2️⃣ Color Utilities to Remove (3 files)

### ❌ `/src/styles/colors/utils/generate-css-variables.utils.ts`
**Reason:** Generates CSS variables (we only need 16 now, hardcoded in theme-minimal.css)
**Used by:** Only `generate-css-themes.utils.ts` (also deprecated)
**Safe to delete:** ✅ Yes

### ❌ `/src/styles/colors/utils/generate-css-themes.utils.ts`
**Reason:** Generates the old `theme.css` file (643 lines)
**Used by:** Nobody (script only)
**Safe to delete:** ✅ Yes

### ❌ `/src/styles/colors/utils/generate-project-palette.utils.ts`
**Reason:** Generates colors with CSS variable references
**Used by:** Only `colors.source.ts` line 26 (but that export is deprecated)
**Safe to delete:** ⚠️ Check first

---

## 3️⃣ Helper Utilities to Remove (1 file)

### ❌ `/src/styles/colors/utils/camelToKebab.ts`
**Reason:** Only needed for CSS variable name conversion
**Used by:** Deprecated CSS variable generators
**Safe to delete:** ✅ Yes

---

## 4️⃣ Old Theme Files to Remove (3 files)

### ⚠️ `/src/styles/themes/light.colors.ts` (Hex values)
**Reason:** We're using OKLCH now (generate-oklch-themes.ts)
**Used by:** `generate-emotion-themes.ts` (also deprecated)
**Safe to delete:** ⚠️ Keep for backwards compatibility (hexLightTheme export)

### ⚠️ `/src/styles/themes/dark.colors.ts` (Hex values)
**Reason:** We're using OKLCH now
**Used by:** `generate-emotion-themes.ts` (also deprecated)
**Safe to delete:** ⚠️ Keep for backwards compatibility (hexDarkTheme export)

### ⚠️ `/src/styles/themes/generate-emotion-themes.ts` (Hex generator)
**Reason:** We're using `generate-oklch-themes.ts` now
**Used by:** `styles/index.ts` exports it as `hexLightTheme` for backwards compatibility
**Safe to delete:** ⚠️ Keep for backwards compatibility

---

## 5️⃣ Documentation Files to Remove (2 files)

### ❌ `/src/styles/colors/docs/MY_PALETTE-ORIG.ts`
**Reason:** Old reference palette (before optimization)
**Safe to delete:** ✅ Yes

### ⚠️ `/src/styles/colors/docs/MY_PALETTE.ts`
**Reason:** Generated reference palette
**Safe to delete:** ⚠️ Keep as reference/documentation

---

## 6️⃣ Constants to Remove (1 file)

### ❌ `/src/styles/colors/constants/css-vars.constants.ts`
**Reason:** CSS variable name constants
**Used by:** Deprecated CSS variable generators
**Safe to delete:** ⚠️ Check first

---

## 7️⃣ Scripts/Generators to Keep

### ✅ `/src/styles/colors/utils/generate-themes.utils.ts`
**Reason:** Generates `light.colors.ts` and `dark.colors.ts` from OKLCH
**Status:** Still useful for regenerating theme files
**Keep:** ✅ Yes

### ✅ `/src/styles/colors/utils/generateMyPalette.utils.ts`
**Reason:** Generates reference palette
**Status:** Documentation/reference tool
**Keep:** ✅ Yes

---

## 8️⃣ Migration Scripts (Can Remove After Cleanup)

### ❌ `/scripts/migrate-colors-imports.sh`
**Reason:** One-time migration script (already executed)
**Safe to delete:** ✅ Yes (after cleanup is done)

### ❌ `/scripts/revert-colors-imports.sh`
**Reason:** Reversal script (already executed)
**Safe to delete:** ✅ Yes (after cleanup is done)

---

## Summary

### Safe to Delete Immediately (11 files):
1. ✅ `src/theme.css` (643 lines → replaced)
2. ✅ `src/styles/radix-ui/overrides-V1.css`
3. ✅ `src/styles/radix-ui/css/unused/radix-ORIG.css`
4. ✅ `src/styles/radix-ui/css/unused/radix-FULL.css`
5. ✅ `src/styles/colors/utils/generate-css-variables.utils.ts`
6. ✅ `src/styles/colors/utils/generate-css-themes.utils.ts`
7. ✅ `src/styles/colors/utils/camelToKebab.ts`
8. ✅ `src/styles/colors/docs/MY_PALETTE-ORIG.ts`
9. ✅ `scripts/migrate-colors-imports.sh`
10. ✅ `scripts/revert-colors-imports.sh`
11. ✅ `src/styles/colors/utils/generate-project-palette.utils.ts` (check first)

### Keep for Backwards Compatibility (3 files):
1. ⚠️ `src/styles/themes/light.colors.ts` (hex values)
2. ⚠️ `src/styles/themes/dark.colors.ts` (hex values)
3. ⚠️ `src/styles/themes/generate-emotion-themes.ts` (hex generator)

### Keep as Reference/Tools (3 files):
1. ✅ `src/styles/colors/docs/MY_PALETTE.ts`
2. ✅ `src/styles/colors/utils/generate-themes.utils.ts`
3. ✅ `src/styles/colors/utils/generateMyPalette.utils.ts`

### Keep (Core Files):
1. ✅ `src/theme-minimal.css` (30 lines - NEW!)
2. ✅ `src/styles/colors/colors.source.ts` (COLOR_MAPPING source)
3. ✅ `src/styles/colors/colors.styles.ts` (colorsCSS export)
4. ✅ `src/styles/colors/colors-direct.ts` (OKLCH colors)
5. ✅ `src/styles/themes/generate-oklch-themes.ts` (OKLCH generator)

---

## Cleanup Commands

```bash
# Navigate to project
cd /Users/justin/repos-finografic/touch-monorepo/apps/client

# Delete old CSS files
rm src/theme.css
rm src/styles/radix-ui/overrides-V1.css
rm src/styles/radix-ui/css/unused/radix-ORIG.css
rm src/styles/radix-ui/css/unused/radix-FULL.css

# Delete deprecated CSS variable generators
rm src/styles/colors/utils/generate-css-variables.utils.ts
rm src/styles/colors/utils/generate-css-themes.utils.ts
rm src/styles/colors/utils/camelToKebab.ts

# Delete old reference files
rm src/styles/colors/docs/MY_PALETTE-ORIG.ts

# Delete migration scripts (one-time use)
rm scripts/migrate-colors-imports.sh
rm scripts/revert-colors-imports.sh

# Check if generate-project-palette is truly unused
grep -r "generate-project-palette" src
# If no results (except the file itself), delete it:
rm src/styles/colors/utils/generate-project-palette.utils.ts

# Check if css-vars.constants is truly unused
grep -r "css-vars.constants" src
# If no results (except the file itself), delete it:
rm src/styles/colors/constants/css-vars.constants.ts
```

---

## After Cleanup

### Lines of Code Removed:
- `theme.css`: ~643 lines
- CSS variable generators: ~300 lines
- Old CSS files: ~200 lines
- Helper utilities: ~50 lines
- **Total: ~1,193 lines removed!** 🎉

### What Remains:
- ✅ OKLCH color system (modern!)
- ✅ Minimal CSS variables (16 essential)
- ✅ Fully typed color palette
- ✅ Backwards compatibility (hex themes if needed)
- ✅ Clean, maintainable codebase

---

## Verification After Cleanup

```bash
# Ensure no imports are broken
npm run build

# Ensure TypeScript is happy
npm run type-check

# Ensure linting passes
npm run lint
```

---

**Ready to execute? Run the cleanup commands!** 🧹✨

