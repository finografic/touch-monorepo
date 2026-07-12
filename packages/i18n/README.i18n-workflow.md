# I18n Update Workflow

📅 Jun 18, 2025

This document explains how to efficiently update translations in the monorepo.

## Quick Start

### **Most Common Use Case:**

```bash
# Terminal 1: Keep running
pnpm dev

# Terminal 2: When you change translations
pnpm i18n:force

# Back to Terminal 1: Restart dev server
# Ctrl+C then: pnpm dev
```

## Script Organization

### **🏠 Root Package Scripts (Minimal orchestration):**

- `i18n:update` - Standard update → `pnpm --filter @workspace/i18n update`
- `i18n:force` - Aggressive update → `pnpm --filter @workspace/i18n update:force`
- `i18n:reset` - Clean + rebuild → `pnpm --filter @workspace/i18n clean && pnpm i18n:update`

### **📦 I18n Package Scripts (All the actual work):**

- `update` - Build + refresh client (standard)
- `update:force` - Force build + aggressive client refresh
- `refresh` - Only refresh client dependencies
- `refresh:force` - Aggressive client refresh (clears Vite cache)
- `build` / `build.force` - Package building
- `clean` - Clean dist folder
- `clean:client` / `clean:client:force` - Clean client cache
- `install:client` / `install:client:force` - Install client deps

## Available Commands

```bash
# Quick update (recommended)
pnpm i18n:force

# Alternative methods
pnpm i18n:update      # Standard update
pnpm i18n:force       # Aggressive update (recommended)
pnpm i18n:reset       # Clean + rebuild everything

# Client-only dev workflow
pnpm i18n.update.dev  # Update + start fresh client
```

## What Each Script Does

- **`i18n:force`**: Force builds i18n → Clears client cache + Vite cache → Force reinstalls
- **`i18n:update`**: Standard build → Standard client refresh
- **`i18n.refresh`**: Only updates client dependencies (no rebuild)

## Why Manual Restart is Needed

- **Hot reload doesn't work** for workspace dependency changes
- **Vite dev server** needs full restart to pick up new workspace packages
- **Turbo doesn't support** selective service restarts

## Troubleshooting

If translations still don't update:
1. **Make sure you restarted the dev server**
2. Check browser cache (hard refresh)
3. Try `pnpm i18n:force` for stubborn cases
4. **Nuclear option**: `pnpm reset` (rebuilds entire monorepo)
