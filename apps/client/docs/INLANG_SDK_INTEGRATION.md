# Inlang SDK Integration Guide

## Overview

This guide shows how to integrate Inlang SDK with your existing translation editors, replacing REST API calls with direct Inlang message file manipulation.

## Installation

```bash
cd apps/client
pnpm add @inlang/sdk
```

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Your Existing UI Components                            │
│  (TranslationsUiPage, etc.)                            │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│  REST API (apps/server)                                 │
│  - GET /ui-labels                                        │
│  - POST /ui-labels/save                                  │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│  Inlang File Manager (apps/server/src/lib)              │
│  - getInlangMessagesFromFiles()                         │
│  - saveInlangMessagesToFiles()                         │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│  Inlang Message Files                                   │
│  apps/client/messages/{folder}/{locale}.json            │
└─────────────────────────────────────────────────────────┘
```

## Implementation

### Option 1: File Manager (Recommended - Already Implemented)

The file manager (`apps/server/src/lib/inlang-file-manager.ts`) directly manipulates Inlang JSON files:

**Features:**
- ✅ Understands Inlang message format (flat and variant)
- ✅ Preserves existing messages
- ✅ Handles multiple namespaces (app, admin, shared)
- ✅ Works with variant messages (selectors/match)

**Usage in Server Handlers:**

```typescript
// apps/server/src/routes/ui-labels/ui-labels.handlers.inlang.ts
import {
  getInlangMessagesFromFiles,
  saveInlangMessagesToFiles,
} from '../../lib/inlang-file-manager';

export const list = async (context) => {
  const data = await getInlangMessagesFromFiles();
  return context.json({ sections: data.sections });
};

export const save = async (context) => {
  const data = context.req.valid('json');
  const result = await saveInlangMessagesToFiles(data);
  return context.json(result);
};
```

**To Use:**
1. Replace imports in `apps/server/src/routes/ui-labels/index.ts`:
   ```typescript
   // Change from:
   import * as handlers from './ui-labels.handlers';
   // To:
   import * as handlers from './ui-labels.handlers.inlang';
   ```

### Option 2: Inlang SDK (For Advanced Use Cases)

If you need SDK features (validation, linting, etc.), use the SDK bridge:

```typescript
import { createInlangProject } from '@inlang/sdk';

const project = await createInlangProject({
  projectPath: './apps/client/project.inlang',
});

// Read messages
const messages = await project.query.messages.getAll();

// Update message
await project.mutate.messages.update({
  id: 'admin_dashboard_title',
  languageTag: 'en-GB',
  pattern: [{ type: 'Text', value: 'New Title' }],
});
```

**Note:** SDK is better for validation and advanced features, but file manager is simpler for basic read/write operations.

## Migration Steps

### Step 1: Test File Manager

1. Update server handlers to use Inlang file manager:
   ```typescript
   // In apps/server/src/routes/ui-labels/index.ts
   import * as handlers from './ui-labels.handlers.inlang';
   ```

2. Test your translation editor - it should work the same!

### Step 2: Update Message Structure (If Needed)

The file manager handles both:
- **Flat messages:** `"admin_items_title": "Records Management"`
- **Variant messages:** `"admin_dashboard": [{ selectors: [...], match: {...} }]`

If your current structure differs, the file manager will adapt, but you may want to standardize.

### Step 3: Remove Old REST API (Optional)

Once file manager is working:
1. Remove old file I/O code from `ui-labels.handlers.ts`
2. Keep only the Inlang handlers
3. Update any direct file access to use the file manager

## Dynamic Language Support

The file manager reads locales from `SUPPORTED_LOCALES` constant. To support dynamic languages:

```typescript
// In inlang-file-manager.ts
// Read from project.inlang/settings.json instead of hardcoded
import { readFile } from 'fs/promises';
import { join } from 'path';

const settingsPath = join(rootDir, 'apps/client/project.inlang/settings.json');
const settings = JSON.parse(await readFile(settingsPath, 'utf-8'));
const SUPPORTED_LOCALES = settings.locales; // Dynamic!
```

## Key Benefits

1. **Direct File Access:** No REST API overhead for file operations
2. **Inlang Format Aware:** Understands variant messages and selectors
3. **Backward Compatible:** Same API interface as your REST endpoints
4. **Type Safe:** Can add TypeScript types for message structure
5. **Preserves Data:** Merges updates instead of overwriting

## Troubleshooting

### Messages not appearing
- Check file paths match `MESSAGES_BASE_PATH`
- Verify locale codes match `project.inlang/settings.json`
- Check namespace detection logic matches your message IDs

### Variant messages not saving correctly
- Ensure section keys include role suffix (e.g., `dashboard_admin`)
- Verify match key format: `element=title, role=admin`
- Check selector order matches settings.json

### File permissions
- Ensure server has write access to `apps/client/messages/`
- Check file ownership and permissions

## Next Steps

1. ✅ File manager is ready to use
2. Switch server handlers to use Inlang file manager
3. Test with your existing UI
4. Gradually migrate other translation editors
5. Consider SDK for advanced features (validation, linting)
