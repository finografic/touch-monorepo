# Inlang Source JSON Format Guide

## Overview

This document explains how to structure JSON translation files for Inlang/Paraglide to generate type-safe message functions with variant support.

## File Structure

Translation files are located in:
- `apps/client/messages/app/{locale}.json`
- `apps/client/messages/admin/{locale}.json`
- `apps/client/messages/shared/{locale}.json`

Where `{locale}` is one of: `en-GB`, `es-ES`, `ca-ES`

## Basic Message (No Variants)

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

## Variant Messages (With Selectors)

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

## Inlang Settings Configuration

The `project.inlang/settings.json` file configures how Paraglide processes these files:

```json
{
  "$schema": "https://inlang.com/schema/project-settings",
  "baseLocale": "en-GB",
  "locales": ["en-GB", "es-ES"],

  "modules": [
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

## Best Practices

1. **Always include `$schema`** at the top of each JSON file
2. **Use snake_case** for all keys (e.g., `admin_dashboard_title`)
3. **Keep variants consistent** across all locales (same selectors, same match patterns)
4. **Use descriptive selector names** that match your TypeScript input types
5. **Group related messages** logically (e.g., all `admin_dashboard_*` keys together)

## Compilation

After editing JSON files, regenerate Paraglide messages:

```bash
pnpm i18n.paraglide.compile
```

This generates TypeScript functions in `apps/client/src/i18n/messages/`.

