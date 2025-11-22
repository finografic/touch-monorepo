# Complete Inlang/Paraglide i18n Guide

## Overview

This guide covers the complete workflow for managing internationalized messages using Inlang and Paraglide JS, from source JSON files to TypeScript usage.

## Table of Contents

1. [Source JSON Format](#source-json-format)
2. [Inlang Configuration](#inlang-configuration)
3. [TypeScript Parsing](#typescript-parsing)
4. [Best Practices](#best-practices)
5. [Workflow](#workflow)

---

## Source JSON Format

### File Structure

Translation files are located in:
- `apps/client/messages/app/{locale}.json`
- `apps/client/messages/admin/{locale}.json`
- `apps/client/messages/shared/{locale}.json`

Where `{locale}` is one of: `en-GB`, `es-ES`, `ca-ES`

### Basic Message (No Variants)

For simple messages without variants, use flat keys:

```json
{
  "$schema": "https://inlang.com/schema/inlang-message-format",
  "admin_items_title": "Records Management",
  "admin_items_description": "Manage database records"
}
```

**Generated Function:**
```typescript
m.admin_items_title() // "Records Management"
m.admin_items_description() // "Manage database records"
```

### Variant Messages (With Selectors)

For messages that need to vary based on inputs (e.g., role, element type), use the variant syntax:

```json
{
  "$schema": "https://inlang.com/schema/inlang-message-format",
  "admin_dashboard": [
    {
      "selectors": ["element", "role"],
      "match": {
        "element=title, role=admin": "Admin Dashboard",
        "element=title, role=public": "User Dashboard",
        "element=description, role=admin": "Control panel - system management",
        "element=description, role=public": "Control panel - maintenance utilities"
      }
    }
  ]
}
```

**Key Points:**
- The key (`admin_dashboard`) becomes the function name
- `selectors` array defines the input parameter names
- `match` object uses `selector=value` syntax for pattern matching
- All combinations must be defined for each locale

**Generated Function:**
```typescript
m.admin_dashboard({ element: 'title', role: 'admin' }) // "Admin Dashboard"
m.admin_dashboard({ element: 'title', role: 'public' }) // "User Dashboard"
m.admin_dashboard({ element: 'description', role: 'admin' }) // "Control panel - system management"
```

---

## Inlang Configuration

The `project.inlang/settings.json` file configures how Paraglide processes these files:

```json
{
  "$schema": "https://inlang.com/schema/project-settings",
  "baseLocale": "en-GB",
  "locales": ["en-GB", "es-ES"],

  "modules": [
    "https://cdn.jsdelivr.net/npm/@inlang/message-lint-rule-empty-pattern@latest/dist/index.js",
    "https://cdn.jsdelivr.net/npm/@inlang/message-lint-rule-identical-pattern@latest/dist/index.js",
    "https://cdn.jsdelivr.net/npm/@inlang/message-lint-rule-missing-translation@latest/dist/index.js",
    "https://cdn.jsdelivr.net/npm/@inlang/message-lint-rule-without-source@latest/dist/index.js",
    "https://cdn.jsdelivr.net/npm/@inlang/message-lint-rule-valid-js-identifier@latest/dist/index.js",
    "https://cdn.jsdelivr.net/npm/@inlang/plugin-message-format@latest/dist/index.js",
    "https://cdn.jsdelivr.net/npm/@inlang/plugin-m-function-matcher@2/dist/index.js"
  ],

  "plugin.inlang.messageFormat": {
    "pathPattern": [
      "./messages/app/{locale}.json",
      "./messages/admin/{locale}.json",
      "./messages/shared/{locale}.json"
    ]
  },

  "plugin.inlang.m-function-matcher": {
    "defaultSelectorOrder": ["element", "role"]
  },

  "plugin.paraglide-js": {
    "outdir": "./src/i18n",
    "project": "./project.inlang",
    "cleanOutdir": true
  }
}
```

**Important Settings:**
- `defaultSelectorOrder`: Defines the order of selectors when using variants
- `pathPattern`: Tells Inlang where to find translation files
- `cleanOutdir`: Cleans output directory before compilation

---

## TypeScript Parsing

### Importing Messages

All generated messages are available through the `m` namespace:

```typescript
import { m } from 'i18n/messages';
```

### Basic Messages (No Variants)

For simple messages without variants, call the function directly:

```typescript
const title = m.admin_items_title(); // "Records Management"
const description = m.admin_items_description(); // "Manage database records"
```

### Variant Messages (With Selectors)

For messages with variants, pass an object matching the selector pattern:

```typescript
// From source JSON:
// "admin_dashboard": [
//   {
//     "selectors": ["element", "role"],
//     "match": { ... }
//   }
// ]

const title = m.admin_dashboard({ element: 'title', role: 'admin' });
// Returns: "Admin Dashboard"

const description = m.admin_dashboard({ element: 'description', role: 'public' });
// Returns: "Control panel - maintenance utilities"
```

### Creating Helper Functions

For cleaner code, create helper functions that wrap Paraglide messages:

```typescript
import { m } from 'i18n/messages';

// Admin Dashboard variants
export const getAdminDashboard = (inputs: { role: 'public' | 'admin' }) => ({
  title: m.admin_dashboard({ element: 'title', role: inputs.role }),
  description: m.admin_dashboard({ element: 'description', role: inputs.role }),
});
```

**Usage:**
```typescript
const { title, description } = getAdminDashboard({ role: 'admin' });
// title: "Admin Dashboard"
// description: "Control panel - system management"
```

### Locale Management

Set the locale using the runtime:

```typescript
import { setLocale } from 'i18n/runtime';

setLocale('en-GB'); // or 'es-ES', 'ca-ES'
```

The locale is typically synced with your app's language state:

```typescript
import { useEffect } from 'react';
import { setLocale } from 'i18n/runtime';
import { useAppConfig } from 'providers/AppConfigProvider';

const MyComponent = () => {
  const { currentLanguage } = useAppConfig();

  useEffect(() => {
    setLocale(currentLanguage as 'en-GB' | 'es-ES');
  }, [currentLanguage]);

  return <div>{m.admin_dashboard({ element: 'title', role: 'admin' })}</div>;
};
```

---

## Best Practices

### Source JSON

1. **Always include `$schema`** at the top of each JSON file
2. **Use snake_case** for all keys (e.g., `admin_dashboard_title`)
3. **Keep variants consistent** across all locales (same selectors, same match patterns)
4. **Use descriptive selector names** that match your TypeScript input types
5. **Group related messages** logically (e.g., all `admin_dashboard_*` keys together)

### TypeScript Parsing

1. **Create helper functions** for complex variant structures
2. **Group related messages** in the same helper (e.g., `getAdminDashboard`)
3. **Use consistent input types** across helpers (e.g., `{ role: 'public' | 'admin' }`)
4. **Document selector meanings** in comments when not obvious
5. **Keep helpers in** `apps/client/src/utils/i18n/i18n-inlang.messages.ts`

---

## Workflow

### Adding New Messages

1. **Edit JSON files** in `apps/client/messages/{folder}/{locale}.json`
2. **Add variant structure** if needed (with selectors and match patterns)
3. **Compile messages:**
   ```bash
   pnpm i18n.paraglide.compile
   ```
4. **Create helper function** in `apps/client/src/utils/i18n/i18n-inlang.messages.ts` if needed
5. **Use in components** via `m` namespace or helper functions

### Example: Complete Helper Pattern

```typescript
import { m } from 'i18n/messages';

// Admin Dashboard variants
export const getAdminDashboard = (inputs: { role: 'public' | 'admin' }) => ({
  title: m.admin_dashboard({ element: 'title', role: inputs.role }),
  description: m.admin_dashboard({ element: 'description', role: inputs.role }),
});

// Usage in component
const AdminDashboardPage = () => {
  const { user } = useAuth();
  const role = user?.role === 'admin' ? 'admin' : 'public';
  const dashboard = getAdminDashboard({ role });

  return (
    <AdminPageLayout title={dashboard.title} subtitle={dashboard.description}>
      {/* ... */}
    </AdminPageLayout>
  );
};
```

---

## Type Safety

Paraglide generates fully type-safe functions:
- Selector values are typed (e.g., `role: 'public' | 'admin'`)
- Missing variants cause TypeScript errors
- Autocomplete works for all message keys

## Compilation

After editing JSON files, regenerate Paraglide messages:

```bash
pnpm i18n.paraglide.compile
```

This generates TypeScript functions in `apps/client/src/i18n/messages/`.

