# Inlang File Merging Issue - Root Cause & Solution

📅 Nov 22, 2025

## Problem

When using Inlang SDK's `importFiles`/`exportFiles` with multiple `pathPattern` entries, files with the same locale can get merged into a single file. For example:

- `./messages/app/{locale}.json`
- `./messages/shared/{locale}.json`
- `./messages/admin/{locale}.json`

All three files for `en-GB` might get merged into one file because the plugin can't determine which `pathPattern` to use when importing.

## Root Cause

The Inlang SDK's `ExportFile` type only includes:
- `locale`: The locale (e.g., "en-GB")
- `name`: The filename (e.g., "en-GB.json")
- `content`: The file content

**It does NOT include the full path or folder structure.** When you call `importFiles`, the plugin doesn't know which `pathPattern` to match, so it may merge files with the same locale.

## Solution

✅ **Use the Direct File Manager** (`apps/server/src/lib/inlang-file-manager.ts`)

The file manager directly manipulates files using Node.js `fs` operations, which:
- Preserves folder structure explicitly
- Doesn't rely on plugin path matching
- Avoids ambiguity about which file to update

This is already implemented in `apps/server/src/routes/ui-labels/ui-labels.handlers.inlang.ts`.

## What WON'T Help

❌ **`nestedObjects` setting**: This only affects JSON structure (nested vs flat), not file paths. It won't prevent file merging.

❌ **Index files**: Inlang doesn't support index files in the `messages/` folder. The plugin reads files based on `pathPattern` only.

## Current Implementation

Your handlers are already using the file manager approach:

```typescript
// apps/server/src/routes/ui-labels/ui-labels.handlers.inlang.ts
import { getInlangMessagesFromFiles, saveInlangMessagesToFiles } from 'lib/inlang-file-manager';
```

This is the correct approach and should prevent file merging.

## When File Merging Might Still Occur

If you see file merging, it might be caused by:

1. **Paraglide compilation**: Check if `pnpm i18n.paraglide.compile` is merging files (unlikely, but possible)
2. **Other tools**: Any script or tool that processes these files
3. **Manual editing**: Accidentally copying content between files
4. **SDK bridge usage**: If you're using `inlang-sdk-bridge.server.ts` with `importFiles`/`exportFiles` instead of the file manager

## Recommendation

1. ✅ **Keep using the file manager** for all file operations
2. ❌ **Don't use SDK's `importFiles`/`exportFiles`** for file operations with multiple pathPatterns
3. ✅ **Use SDK for other features** like validation, linting, or querying (not file I/O)
4. ✅ **Keep `nestedObjects: false`** if you're using flat JSON structure (current setup)

## Testing

To verify files aren't merging:

1. Check file sizes - they should remain consistent
2. Check message counts - each file should have expected number of keys
3. Look for duplicate keys across files
4. Monitor file modification times - only edited files should change

