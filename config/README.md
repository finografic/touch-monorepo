# Touch Monorepo Configuration

📅 Aug 14, 2025

This directory contains project-specific configurations and generated files that are specific to this monorepo implementation.

## Directory Structure

- `db/` - Database-related configurations
  - `db-setup.config.ts` - Database setup and seeding configuration

- `i18n/` - Internationalization configurations
  - Language mappings
  - Supported locales

- `generated/` - Auto-generated files specific to this project
  - `i18n/` - Generated i18n types and mappings

## Usage

These configurations are used by various packages and scripts in the monorepo:

- Database setup uses `db/db-setup.config.ts`
- I18n system uses configurations from `i18n/`
- Generated files are created in `generated/` by build scripts

## Important Notes

1. **Package Independence**: While these configs are used by packages, the packages themselves remain generic and reusable.
2. **Generated Files**: Files in `generated/` are auto-generated and should not be edited manually.
3. **Version Control**: All config files should be version controlled except for files in `generated/`.
