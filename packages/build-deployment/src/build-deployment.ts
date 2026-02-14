#!/usr/bin/env tsx

/**
 * Touch Monorepo Deployment Builder — Main Orchestrator
 *
 * Coordinates the entire deployment pipeline. All heavy lifting
 * is delegated to focused utility modules in ./utils/.
 *
 *
 */

import chalk from 'chalk';

import { config } from './build-deployment.constants.js';
import { parseArguments, hasCliArgs, getInteractiveOptions, applyPlatformDefaults } from './cli.js';

// Utils
import { buildClient, buildServer, installDependencies } from './utils/build.utils.js';
import {
  cleanDistDirectory,
  createDistStructure,
  copyDataFiles,
  copyEnvExample,
  cleanPlatformArtifacts,
} from './utils/file.utils.js';
import { consolidateEnvironmentFiles } from './utils/env.utils.js';
import {
  createPortsUtility,
  createStartupScript,
  createClientServer,
  createSetupScripts,
  createStartScript,
  createPlatformSpecificScripts,
  createReadme,
  createTestScript,
} from './utils/scripts.utils.js';
import {
  createPackageJson,
  addWindowsScriptsToPackageJson,
  createStandalonePackage,
} from './utils/package.utils.js';
import { createZipArchive } from './utils/archive.utils.js';
import { cleanupTempDirectory, killPortsIfOccupied } from './utils/cleanup.utils.js';
import { createUserDocumentation } from './utils/docs.utils.js';

import type { BuildOptions } from './build-deployment.types.js';

async function main(): Promise<void> {
  // Resolve options from CLI args or interactive prompts
  let options: BuildOptions;

  if (hasCliArgs()) {
    options = applyPlatformDefaults(parseArguments());
  } else {
    options = await getInteractiveOptions();
  }

  // Print build configuration
  console.log(chalk.cyan('\n🏗️  Building Touch Monorepo Deployment'));
  console.log(chalk.gray('═'.repeat(60)));
  console.log(`${chalk.bold('Platform:')} ${options.platform || 'universal'}`);
  console.log(`${chalk.bold('Architecture:')} ${options.arch || 'universal'}`);
  console.log(`${chalk.bold('Standalone:')} ${options.standalone ? 'Yes' : 'No'}`);
  console.log(`${chalk.bold('Include Node:')} ${options.includeNode ? 'Yes' : 'No'}`);
  console.log(`${chalk.bold('Create Zip:')} ${options.zip ? 'Yes' : 'No'}`);
  console.log(chalk.gray('═'.repeat(60)));

  try {
    // 1. Prepare
    await killPortsIfOccupied();
    await cleanDistDirectory({ config });
    await createDistStructure({ config });

    // 2. Build
    await buildClient({ config });
    await buildServer({ config });

    // 3. Data & environment
    await copyDataFiles({ config });
    await consolidateEnvironmentFiles({ config });

    // 4. Scripts & utilities
    await createPortsUtility({ config });
    await createStartupScript({ config });
    await createClientServer({ config });
    await createReadme({ config });
    await createTestScript({ config });

    // 5. Package & dependencies
    await createPackageJson({ config, options });

    if (options.standalone) {
      await createStandalonePackage({ config, options });
    } else {
      await installDependencies({ config });
    }

    await addWindowsScriptsToPackageJson({ config, options });

    // 6. Platform-specific assets
    await copyEnvExample({ config });
    await cleanPlatformArtifacts({ config });
    await createSetupScripts({ config, options });
    await createStartScript({ config });
    await createPlatformSpecificScripts({ config, options });
    await createUserDocumentation({ config });

    // 7. Archive
    let zipName = '';
    if (options.zip) {
      zipName = await createZipArchive({ config, options });
    }

    // 8. Cleanup
    await cleanupTempDirectory({ config });

    // Done!
    console.log('');
    console.log('🎉 Deployment build completed successfully!');
    console.log('📦 Deployment built in: .temp/deployment (cleaned up)');
    console.log('');

    if (options.zip && zipName) {
      console.log('📦 Zip archive created:', zipName);
      console.log('📁 Saved to: deployments/ folder');
    }

    console.log('');
    console.log('🚀 Next steps:');
    console.log('  1. Extract the deployment folder');
    console.log('  2. Run setup: ./setup.sh');
    console.log('  3. Start app: ./start');
    console.log('');
    console.log('📖 For detailed instructions, see:');
    console.log('   - USER_GUIDE_EN.md (English)');
    console.log('   - GUIA_USUARIO_ES.md (Spanish)');
    console.log('');
  } catch (error) {
    console.error('❌ Deployment build failed:', error);

    try {
      await cleanupTempDirectory({ config });
    } catch (cleanupError) {
      console.warn('⚠️  Failed to cleanup temp directory after error:', cleanupError);
    }

    process.exit(1);
  }
}

// Run the build if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main as buildProduction };
