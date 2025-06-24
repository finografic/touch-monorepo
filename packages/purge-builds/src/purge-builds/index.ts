#!/usr/bin/env node

// CLI entry point
import { purge } from './purge-builds';

// Library exports (for programmatic use)
export { purge } from './purge-builds';
export { purge as default } from './purge-builds';
export { GLOB_DELETE_EXCLUDE, GLOB_DELETE_INCLUDE } from './purge-builds.config';
export type { PurgeOptions } from './purge-builds.types';

// Display help information
function showHelp() {
  console.log(`
purge-builds - Clean build artifacts and dependencies from monorepo

USAGE:
  purge-builds [OPTIONS]

OPTIONS:
  -d, --dry-run     Show what would be deleted without actually deleting
  -v, --verbose     Show detailed progress and file lists
  -r, --recursive   Deep recursive cleaning (when run from workspace root)
  -h, --help        Show this help message

EXAMPLES:
  purge-builds                    # Clean current scope
  purge-builds --dry-run          # Preview what would be deleted
  purge-builds -dv                # Dry run with verbose output
  purge-builds --recursive        # Deep clean from workspace root

WHAT IT DELETES:
  • Build artifacts (.turbo, .tsup, dist/, *.tsbuildinfo)
  • Node modules (node_modules/, .pnpm/)
  • Lock files (pnpm-lock.yaml)

WHAT IT PRESERVES:
  • Source code (src/, apps/, packages/)
  • Configuration files (package.json, .env)
  • Git repository (.git/)
  • This CLI tool itself
`);
}

// CLI execution - only runs when file is executed directly
async function main() {
  try {
    // Parse command line arguments
    const args = process.argv.slice(2);

    // Check for help flag
    if (args.includes('--help') || args.includes('-h')) {
      showHelp();
      process.exit(0);
    }

    await purge({
      dryRun: args.includes('--dry-run') || args.includes('-d'),
      verbose: args.includes('--verbose') || args.includes('-v'),
      recursive: args.includes('--recursive') || args.includes('-r'),
    });
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Check if this file is being run directly (not imported)
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
