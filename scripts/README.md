# Scripts

📅 Aug 8, 2025

This directory contains various utility scripts for the Touch Monorepo project.

## Available Scripts

- `generate-types/`: Scripts for generating TypeScript types
- `script-runner/`: Interactive script runner utility

## Utility Functions

Common utility functions (file system, project root detection, config loading) are available from the `@finografic/project-scripts` package:

```typescript
// Example usage:
import { findProjectRoot, isFile, findScriptConfigFile } from '@finografic/project-scripts/utils';

// Find project root directory
const rootDir = findProjectRoot();

// Check if file exists
const exists = isFile('path/to/file');

// Find config file in directory tree
const configFile = findScriptConfigFile(['config.ts', 'config.js']);
```

These utilities are maintained in the external package to avoid duplication and ensure consistency across the project.
