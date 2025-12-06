# ESLint & Code Style Rules

## Import Sorting & Organization

### Simple Import Sort Configuration

The project uses `simple-import-sort` for consistent import ordering. Imports must follow these grouping rules (in order):

1. **React & External Packages** - React, third-party libraries

   ```typescript
   import React from 'react';
   import { ComponentA } from 'react-library';
   import { zodResolver } from '@hookform/resolvers/zod';
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
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from 'components/Toast';
import { ORDER_FORM_SCHEMA } from 'admin/pages/...';
import { useAppConfig } from 'providers/AppConfigProvider';
import { MIN_TEMP_DIFFERENCE } from 'config/app';
```

**Solution**: Group by category with blank lines between groups

```typescript
// ✅ Correct
import { zodResolver } from '@hookform/resolvers/zod';

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

## ESLint Config Structure - CRITICAL RULES

### ⚠️ DO NOT Modify ESLint Config Structure

**NEVER attempt to manually merge or combine ESLint configs after the `fino()` call.**

This is a **CRITICAL RULE** that has caused import sorting to break multiple times. The pattern below **MUST NEVER BE USED**:

```typescript
// ❌ NEVER DO THIS - This breaks ESLint completely
// This pattern breaks plugin registration and causes simple-import-sort to stop working
const finoConfig = fino({ ... });
const baseConfig = Array.isArray(finoConfig) ? finoConfig : [finoConfig];
const configWithPlugin = baseConfig.map((config) => ({
  ...config,
  plugins: { ...config.plugins, 'plugin-name': plugin },
}));
export default configWithPlugin;
```

**ALWAYS use the direct structure - this is the ONLY correct pattern:**

```typescript
// ✅ CORRECT - Plugin directly in fino() call
// This is the ONLY pattern that works reliably
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import { ERROR, fino, OFF } from '@finografic/eslint-config';

export default fino({
  ignores: ['**/*.md', '**/*.mdx', '**/*.json', '**/*.jsonc'],
  plugins: {
    'simple-import-sort': simpleImportSort,
  },
  languageOptions: {
    // ... options
  },
  rules: {
    'simple-import-sort/imports': [ERROR, { ... }],
    'simple-import-sort/exports': ERROR,
    // ... other rules
  },
});
```

### Why This Matters

- The `fino()` wrapper from `@finografic/eslint-config` handles plugin registration internally
- Manually merging configs after `fino()` breaks plugin registration completely
- This causes `simple-import-sort` and other plugins to stop working
- The issue is subtle - ESLint may still run but plugins won't be recognized
- **This has broken multiple times** - always use the direct structure

### If Import Sorting Stops Working

1. **First**: Check the config structure matches the correct pattern above
2. **Second**: Try rebuilding the project (`pnpm install` or full rebuild)
3. **Third**: Check `@finografic/eslint-config` version - compare with known working version
4. **Fourth**: Compare with git history or backup to verify structure
5. **Never**: Manually merge configs - always use the direct structure shown above

### Troubleshooting Checklist

- [ ] Config uses `export default fino({ ... })` directly (not wrapped in another function)
- [ ] Plugins are defined directly in the `plugins` object inside `fino()` call
- [ ] No manual config merging or array mapping after `fino()` call
- [ ] No spreading or combining of config objects after `fino()` returns
- [ ] Project has been rebuilt after any config changes

## Best Practices

1. **Don't manually fix import order** - Use `pnpm lint.fix`
2. **Don't add/remove JSX parentheses** - Let Prettier handle it
3. **Group imports logically** - Follow the grouping rules above
4. **Blank lines between import groups** - Improves readability
5. **Run lint fix before committing** - Ensures consistent code style
6. **Never modify ESLint config structure** - Keep plugins directly in `fino()` call

