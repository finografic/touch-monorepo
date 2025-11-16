# ✅ Fixed: project.inlang Configuration

📅 Oct 19, 2025

## Problem

The `paraglide-js compile` command was failing with error:

```
Error: ENOTDIR: not a directory, open '/Users/justin/repos-finografic/touch-monorepo/packages/i18n/project.inlang/settings.json'
```

## Root Cause

- `project.inlang` was created as a **file** (JSON)
- ParaglideJS expects `project.inlang` to be a **directory** containing a `settings.json` file

## Solution

Changed from:

```
packages/i18n/project.inlang (file)
```

To:

```
packages/i18n/project.inlang/ (directory)
  └── settings.json (configuration file)
```

## What Was Changed

### 1. Directory Structure

- Deleted `project.inlang` file
- Created `project.inlang/` directory
- Created `project.inlang/settings.json` with proper configuration

### 2. Configuration Content

The `settings.json` file contains:
- `sourceLanguageTag`: "en-GB"
- `languageTags`: ["en-GB", "es-ES"]
- ParaglideJS plugin configuration
- Missing translation lint rule

### 3. Updated References

- `inlang.config.mjs` now properly references `./project.inlang` directory
- Build process works correctly with `pnpm generate.paraglide`

## Verification

✅ `pnpm generate.paraglide` - Success
✅ `pnpm build` - Success
✅ TypeScript compilation - Success

## Result

The Inlang/ParaglideJS tooling can now properly read the project configuration and generate message functions as intended.

