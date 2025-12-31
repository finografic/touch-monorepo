# @finografic/i18n

📅 Jun 14, 2025

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
