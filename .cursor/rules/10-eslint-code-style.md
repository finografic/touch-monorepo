# ESLint & Code Style Rules

## Import Sorting & Organization

### Simple Import Sort Configuration

The project uses `simple-import-sort` for consistent import ordering. Imports must follow these grouping rules (in order):

1. **React & External Packages** - React, third-party libraries

   ```typescript
   import React from 'react';
   import { ComponentA } from 'react-library';
   import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
   ```

2. **Internal Absolute Imports** - Components, forms, hooks

   ```typescript
   import { useToast } from 'components/Toast';
   import { FieldWrapper } from 'forms/FieldWrapper';
   ```

3. **Providers & App Context**

   ```typescript
   import { useAppConfig } from 'providers/AppConfigProvider';
   ```

4. **Config & Utilities**

   ```typescript
   import { MIN_TEMP_DIFFERENCE } from 'config/app';
   ```

5. **Admin/Pages (Absolute Imports)**

   ```typescript
   import { ORDER_FORM_SCHEMA, type OrdersFormValues } from 'admin/pages/AdminOrdersPage/OrdersForm/OrdersForm.schema';
   ```

6. **Relative Imports** - Local files, utilities

   ```typescript
   import { createFormSubmissionHandler } from './orders-form.submission';
   import { ProfilesPanel } from './ProfilesPanel';
   ```

7. **Side Effect Imports** - CSS, global styles

   ```typescript
   import 'primereact/resources/themes/lara-light-cyan/theme.css';
   ```

### Import Sorting - How to Handle

- **Automatic Fix**: Run `pnpm lint.fix -- path/to/file.tsx` to auto-sort imports
- **On Save**: Prettier runs on save; you may need to manually trigger ESLint fix for import sorting
- **Manual Fix**: Group imports according to the categories above, separated by blank lines

### Common Import Sorting Issues

**Problem**: Imports not in the correct order

```typescript
// ❌ Incorrect - mixed groupings
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useToast } from 'components/Toast';
import { ORDER_FORM_SCHEMA } from 'admin/pages/...';
import { useAppConfig } from 'providers/AppConfigProvider';
import { MIN_TEMP_DIFFERENCE } from 'config/app';
```

**Solution**: Group by category with blank lines between groups

```typescript
// ✅ Correct
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';

import { useToast } from 'components/Toast';

import { useAppConfig } from 'providers/AppConfigProvider';

import { MIN_TEMP_DIFFERENCE } from 'config/app';
import { ORDER_FORM_SCHEMA } from 'admin/pages/...';

import { createFormSubmissionHandler } from './orders-form.submission';
import 'primereact/resources/themes/lara-light-cyan/theme.css';
```

## JSX Parentheses & Formatting

### Disable Conflicting ESLint Rules

The following ESLint rules are disabled in `eslint.config.mjs` to prevent conflicts with Prettier:

- `style/jsx-wrap-multilines` - Prettier handles JSX parentheses
- `react/jsx-wrap-multilines` - Let Prettier format JSX

This prevents the "add parentheses / remove parentheses" cycle where Prettier removes what ESLint adds.

### When to Use Parentheses in JSX

Let **Prettier handle this automatically**. Do not manually adjust JSX parentheses.

```typescript
// ✅ Let Prettier format this automatically
return (
  <section css={styles} className="admin-page-content form-container">
    <FormProvider {...methods}>
      <form id="order-form" onSubmit={handleSubmit(formSubmissionHandler)} noValidate>
        {/* content */}
      </form>
    </FormProvider>
  </section>
);
```

## Running ESLint Fixes

### Auto-fix specific file

```bash
pnpm lint.fix -- path/to/file.tsx
```

### Auto-fix all TypeScript files in a directory

```bash
pnpm lint.fix -- "src/**/*.tsx"
```

### Check without fixing

```bash
pnpm lint -- path/to/file.tsx
```

## Useful ESLint Rules Disabled

These rules are intentionally disabled to improve developer experience:

- `ts/no-unused-vars` - Unused imports are auto-removed by prettier
- `unused-imports/no-unused-imports` - Manual import management preferred
- `style/jsx-one-expression-per-line` - Let Prettier format expressions

## Import Sorting - HYBRID APPROACH (ESLint + Prettier)

### ✅ Current Solution: Both ESLint and Prettier

**Import sorting uses BOTH ESLint and Prettier** for maximum reliability and enforcement:

1. **ESLint (`simple-import-sort`)** - Provides granular control and detailed error reporting
2. **Prettier (`@ianvs/prettier-plugin-sort-imports`)** - Better at detecting errors and enforcing rules on save

This hybrid approach gives you:

- **Granular control** from ESLint's detailed grouping rules
- **Better error detection** from Prettier's plugin
- **Automatic enforcement** on save via Prettier
- **Redundancy** - if one fails, the other still works

### Configuration

**ESLint Configuration** (`apps/client/eslint.config.mjs`):

```typescript
import simpleImportSort from 'eslint-plugin-simple-import-sort';

export default fino({
  plugins: {
    'simple-import-sort': simpleImportSort,
  },
  rules: {
    'simple-import-sort/imports': [
      ERROR,
      {
        groups: [
          // React imports + React-related packages
          ['^react', '^@react', '^@finografic', '^@workspace'],
          // Internal absolute imports: components, providers, pages
          ['^@?\\w', '^(pages|components|lib)(/.*|$)'],
          // Hooks, routes, providers, queries
          ['^(hooks|routes|providers|queries)(/.*|$)'],
          // Side effect imports
          ['^\\u0000'],
          // Relative imports + styles
          [
            '^(utils)',
            '^(types|constants)',
            '^(config|dev-tools)',
            '^\\.\\.(?!/?$)',
            '^\\.\\./?$',
            '^\\./(?=.*/)(?!/?$)',
            '^\\.(?!/?$)',
            '^\\./?$',
            '^(styles)',
            '^.+\\.s?css$',
            '^.+\\.styles$',
          ],
        ],
      },
    ],
    'simple-import-sort/exports': ERROR,
  },
});
```

**Prettier Configuration** (`prettier.config.mjs`):

```javascript
module.exports = {
  // ... other prettier config
  plugins: ['@ianvs/prettier-plugin-sort-imports'],
  importOrder: [
    // React & External Packages
    '^react',
    '^@react',
    '^@finografic',
    '^@workspace',
    '^@',
    '<THIRD_PARTY_MODULES>',
    // Internal imports (matches ESLint groups)
    '^(pages|components|lib)(/.*|$)',
    '^(hooks|routes|providers|queries)(/.*|$)',
    '^(utils)(/.*|$)',
    '^(types|constants)(/.*|$)',
    '^(config|dev-tools)(/.*|$)',
    // Relative imports
    '^\\.\\.(?!/?$)',
    '^\\.\\./?$',
    '^\\./(?=.*/)(?!/?$)',
    '^\\.(?!/?$)',
    '^\\./?$',
    // Styles
    '^(styles)',
    '^.+\\.s?css$',
    '^.+\\.styles$',
  ],
};
```

### How It Works

- **On Save**: Prettier automatically sorts imports when you save (via `formatOnSave`)
- **ESLint Check**: ESLint validates import order and reports detailed errors
- **Both Together**: ESLint provides the rules, Prettier enforces them on save
- **Redundancy**: If one system fails, the other still works

### If Import Sorting Stops Working

1. **Check ESLint config**: Verify `simple-import-sort` plugin is registered in `fino()` call
2. **Check Prettier config**: Verify `@ianvs/prettier-plugin-sort-imports` is in `plugins` array
3. **Rebuild project**: `pnpm install` or full rebuild often fixes transient issues
4. **Restart VS Code**: Sometimes plugins need a restart to reload
5. **Check both systems**: Run `pnpm lint.fix` (ESLint) and `npx prettier --write` (Prettier)

---

## ESLint Config Structure - CRITICAL RULES

### ⚠️ DO NOT Modify ESLint Config Structure

**NEVER attempt to manually merge or combine ESLint configs after the `fino()` call.**

This is a **CRITICAL RULE** that has caused import sorting to break multiple times. The pattern below **MUST NEVER BE USED**:

```typescript
// ❌ OLD APPROACH - This caused constant breakage
// ESLint plugin registration issues made this unreliable
const finoConfig = fino({ ... });
const baseConfig = Array.isArray(finoConfig) ? finoConfig : [finoConfig];
const configWithPlugin = baseConfig.map((config) => ({
  ...config,
  plugins: { ...config.plugins, 'simple-import-sort': plugin },
}));
export default configWithPlugin;
```

**ALWAYS use the direct structure - this is the ONLY correct pattern:**

```typescript
// ✅ CORRECT - Plugin directly in fino() call
// This is the ONLY pattern that works reliably
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import { ERROR, fino, OFF } from '@finografic/eslint-config';
import globals from 'globals';

export default fino({
  ignores: ['**/*.md', '**/*.mdx', '**/*.json', '**/*.jsonc'],
  plugins: {
    'simple-import-sort': simpleImportSort,
  },
  languageOptions: {
    ecmaVersion: 'latest',
    globals: {
      ...globals.browser,
      getDotEnv: 'readonly',
      log: 'readonly',
    },
  },
  formatters: true,
  typescript: true,
  rules: {
    // ... other rules

    // Import sorting rules
    'simple-import-sort/imports': [
      ERROR,
      {
        groups: [
          // React imports + React-related packages
          ['^react', '^@react', '^@finografic', '^@workspace'],
          // Internal absolute imports: components, providers, pages
          ['^@?\\w', '^(pages|components|lib)(/.*|$)'],
          // Hooks, routes, providers, queries
          ['^(hooks|routes|providers|queries)(/.*|$)'],
          // Side effect imports
          ['^\\u0000'],
          // Relative imports + styles
          [
            '^(utils)',
            '^(types|constants)',
            '^(config|dev-tools)',
            '^\\.\\.(?!/?$)',
            '^\\.\\./?$',
            '^\\./(?=.*/)(?!/?$)',
            '^\\.(?!/?$)',
            '^\\./?$',
            '^(styles)',
            '^.+\\.s?css$',
            '^.+\\.styles$',
          ],
        ],
      },
    ],
    'simple-import-sort/exports': ERROR,
  },
});
```

### ⚠️ CRITICAL: Rules That MUST Be Removed

**DO NOT add these rules** - they break import sorting:

```typescript
// ❌ NEVER ADD THESE - They break simple-import-sort
'import/no-duplicates': [ERROR, { 'prefer-inline': false, 'considerQueryString': false }],
'fino/import-dedupe': ERROR,
```

These rules conflict with `simple-import-sort` and cause it to stop working completely.

### Why This Matters

- The `fino()` wrapper from `@finografic/eslint-config` handles plugin registration internally
- Manually merging configs after `fino()` breaks plugin registration completely
- This causes `simple-import-sort` and other plugins to stop working
- The issue is subtle - ESLint may still run but plugins won't be recognized
- **This has broken multiple times** - always use the direct structure

### Why This Matters

- The `fino()` wrapper from `@finografic/eslint-config` handles plugin registration internally
- Manually merging configs after `fino()` breaks plugin registration completely
- This causes `simple-import-sort` and other plugins to stop working
- The issue is subtle - ESLint may still run but plugins won't be recognized
- **This has broken multiple times** - always use the direct structure

### Troubleshooting Checklist

- [ ] Config uses `export default fino({ ... })` directly (not wrapped in another function)
- [ ] Plugins are defined directly in the `plugins` object inside `fino()` call
- [ ] No manual config merging or array mapping after `fino()` call
- [ ] No spreading or combining of config objects after `fino()` returns
- [ ] `import/no-duplicates` rule is NOT present (conflicts with simple-import-sort)
- [ ] `fino/import-dedupe` rule is NOT present (conflicts with simple-import-sort)
- [ ] ESLint config structure matches the exact working version shown above
- [ ] Prettier plugin is installed and configured in `prettier.config.mjs`
- [ ] Both ESLint and Prettier import order configs are aligned
- [ ] Project has been rebuilt after any config changes (`pnpm install` or full rebuild)

## Best Practices

1. **Don't manually fix import order** - Use `pnpm lint.fix` or let Prettier format on save
2. **Don't add/remove JSX parentheses** - Let Prettier handle it
3. **Group imports logically** - Follow the grouping rules above
4. **Blank lines between import groups** - Improves readability (handled automatically)
5. **Run lint fix before committing** - Ensures consistent code style
6. **Never modify ESLint config structure** - Keep plugins directly in `fino()` call
7. **Keep ESLint and Prettier configs aligned** - Both should use the same import order groups
8. **Use both systems together** - ESLint for rules, Prettier for enforcement on save
