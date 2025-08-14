# @finografic/i18n

Internationalization package providing:
- Configuration and type generation
- Language mappings and validation
- Translation management and utilities

## Features

### Type Generation

The package provides a powerful type generation system that ensures type safety across your i18n implementation:

```bash
# Generate types from config
pnpm gen.types
```

This will:
1. Generate language types (ISO codes, mappings, etc.)
2. Generate constants for supported locales
3. Validate all language and country codes

### Configuration

Create an `i18n.config.ts` in your project's `config/i18n` directory:

```typescript
import type { I18nConfig } from '@workspace/i18n/config';

export const config: I18nConfig = {
  languages: [
    {
      iso3: 'eng',
      iso2: 'en',
      name: 'English',
      nativeName: 'English',
      sortOrder: 1,
      isDefault: true,
    },
    // Add more languages...
  ],
  typeGeneration: {
    outputPath: './config/generated/i18n/language.types.ts',
    languageMapping: {
      eng: 'en',
      spa: 'es',
      cat: 'ca',
    },
    supportedCountries: ['ES', 'GB', 'US'],
    defaultCountries: {
      en: 'GB',
      es: 'ES',
      ca: 'ES',
    },
  },
  validation: {
    strict: true,
  },
};
```

## Translation Management

### Lokalize - VSCode Extension

```sh
💼 Workspace root changed to "/Users/justin/repos-finografic/touch-monorepo"
🌞 Enabled
🧩 Enabled frameworks: React, i18next, React I18next
🧬 Enabled parsers: json, yaml, json5

🚀 Initializing loader "/Users/justin/repos-finografic/touch-monorepo"
📂 Directory structure: file
🗃 Custom Path Matcher: translations/{locale}.json
🗃 Path Matcher Regex: /^translations\/(?<locale>[\w-_]+)\.json$/

📂 Loading locales under touch-monorepo/packages/i18n/src/translations
👀 Watching change on touch-monorepo/packages/i18n/src/translations
✅ Loading finished
```

### Tolgee - i18n Management

#### Remote Project: `SERVI_FRESC`

<https://app.tolgee.io/projects/18817>

#### Local Setup

```sh
pnpm add -D @tolgee/cli --filter @workspace/i18n
```

#### Login

```sh
tolgee login "tgpak_ge4dqmjxl5wgqodhofwday3nmftdomlem44toy3pmzqxaz3movvq"
```

### Tolgee Scripts

#### For Dynamic Content (client-managed database translations)

```bash
pnpm run tolgee:push:dynamic    # Upload drink_types, container_types, etc.
pnpm run tolgee:pull:dynamic    # Download client's edits
```

#### For App Content (mixed management)

```bash
pnpm run tolgee:push:app        # Upload pages, components, etc.
pnpm run tolgee:pull:app        # Download any app translation edits
```

#### For Everything

```bash
pnpm run tolgee:push:all        # Upload all translations
pnpm run tolgee:pull:all        # Download all translations
pnpm run translations:sync      # Pull all + rebuild package
```

### Recommended Usage

- **`tolgee:pull:dynamic`** - Most common (after client edits database content)
- **`translations:sync`** - For CI/CD or major updates
- **`tolgee:push:dynamic`** - When you add new database tables/fields

This gives you **granular control** over which translations to sync, which is perfect for your **two-tier translation system**:
- **Common** (developer-managed locally)
- **Dynamic** (client-managed via Tolgee)
- **App** (mixed management)

Try testing one now:

```bash
pnpm run tolgee:pull:dynamic
```
