**Note**: This script focuses on fixing the `better-sqlite3` library itself. Database schema, migrations, and table creation should be handled separately with your existing database scripts.

## 🚀 Usage

### Basic Usage

```bash
# Run the full rebuild process
pnpm sqlite-rebuild

# Run with verbose output
pnpm sqlite-rebuild --verbose

# Force rebuild even with version mismatches
pnpm sqlite-rebuild --force
```

### Advanced Options

```bash
# Include database migration test
pnpm sqlite-rebuild --include-migration

# Clean only (skip rebuild)
pnpm sqlite-rebuild --clean-only

# Specify target version
pnpm sqlite-rebuild --version 11.9.0

# Combine options
pnpm sqlite-rebuild --force --verbose --include-migration
```
