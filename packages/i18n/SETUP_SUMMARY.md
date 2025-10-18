# i18n Package Setup - Gradual Migration Strategy

## ✅ Current Structure

```
packages/i18n/src/
├── messages/app/                    # NEW: TypeScript messages (your custom system)
│   ├── messages.en-GB.ts           # English TypeScript messages
│   ├── messages.es-ES.ts           # Spanish TypeScript messages
│   └── index.ts                     # Message exports & getAppMessages()
│
├── translations/app/                # EXISTING: i18next JSON files
│   ├── en-GB.json                  # English i18next translations
│   ├── es-ES.json                  # Spanish i18next translations
│   └── (other locales)
│
├── utils/
│   └── messages.utils.ts           # getMessages() utility
│
├── config/                          # Configuration & type generation
├── generators/                      # Type generation scripts
└── index.ts                        # Main package exports
```

## 🎯 Migration Strategy

### Phase 1: Co-existence (Current)

- **i18next**: Existing JSON translations (`src/translations/app/*.json`)
- **Custom TS**: New TypeScript messages (`src/messages/app/*.ts`)
- **ParaglideJS**: Optional generated functions (future enhancement)

### Phase 2: Gradual Migration

- Start using `getMessages(currentLanguage)` for new components
- Keep i18next `t()` for existing components
- Both systems run side by side

### Phase 3: Complete Migration (Future)

- All components use TypeScript messages
- Remove i18next dependency
- Clean up JSON translation files

## 📦 Configuration Files

### 1. `project.inlang/settings.json`

```json
{
  "$schema": "https://inlang.com/schema/project-settings",
  "sourceLanguageTag": "en-GB",
  "languageTags": ["en-GB", "es-ES"],
  "modules": [
    "https://cdn.jsdelivr.net/npm/@inlang/plugin-json@4/dist/index.js",
    "https://cdn.jsdelivr.net/npm/@inlang/plugin-paraglide-js@2/dist/index.js"
  ],
  "plugin.inlang.json": {
    "pathPattern": "./src/translations/app/{language}.json"
  },
  "plugin.paraglide-js": {
    "outdir": "../../config/generated/i18n/messages"
  }
}
```

### 2. `inlang.config.mjs`

- Points to existing i18next JSON files for ParaglideJS generation (optional)
- Generates typed functions to `config/generated/i18n/messages` (when needed)

## 🚀 Package Scripts

### Current Scripts (package.json)

```json
{
  "generate.paraglide": "paraglide-js compile --project ./project.inlang",
  "build": "pnpm generate.paraglide && tsup",
  "postbuild": "tsx src/generators/cli.ts"
}
```

### What Each Does

1. **`generate.paraglide`** - (Optional) Generates ParaglideJS functions from JSON
2. **`build`** - Compiles TypeScript messages + generates types
3. **`postbuild`** - Generates i18n types (language codes, etc.)

## 💡 How to Use

### Option A: Custom TypeScript Messages (Recommended for new code)

```typescript
import { useAppConfig } from '@workspace/core';
import { getMessages } from '@workspace/i18n';

const { currentLanguage } = useAppConfig();
const messages = getMessages(currentLanguage);

const title = messages.admin.pages.dashboard.title;
```

**Benefits:**
- ✅ Type-safe
- ✅ Autocomplete
- ✅ Zero runtime overhead
- ✅ Direct object access

### Option B: Existing i18next (Keep for now)

```typescript
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();
const title = t('admin.pages.dashboard.title');
```

**Use when:**
- Existing components
- Complex translations (pluralization, interpolation)
- Not yet migrated

## 📁 Generated Files Location

All generated files go to the **project root config folder**:

```
config/generated/i18n/
├── constants.generated.ts    # Language constants
├── language.types.ts         # TypeScript types for locales
└── messages/                 # (Future) ParaglideJS generated functions
```

## ✅ Current Status

### Working

- ✅ TypeScript messages (`messages.en-GB.ts`, `messages.es-ES.ts`)
- ✅ `getMessages()` utility function
- ✅ Type safety via TypeScript const objects
- ✅ Admin dashboard using new system
- ✅ Co-existence with i18next
- ✅ Build process (`pnpm build`)

### Optional (Can enable later)

- ⏸️ ParaglideJS function generation (from JSON)
- ⏸️ Full ParaglideJS integration

## 🎯 Next Steps

1. **Test the admin page** - Verify new messages work correctly
2. **Migrate more components** - Gradually replace `t()` with `getMessages()`
3. **Add more messages** - Expand TypeScript message files as needed
4. **Monitor** - Ensure both systems work together smoothly

## 📝 Notes

- The `generate.paraglide` script is **optional** for now
- Your custom TypeScript messages work independently
- ParaglideJS can be fully integrated later if desired
- The dual system allows for gradual, safe migration

