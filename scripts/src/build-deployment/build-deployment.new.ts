#!/usr/bin/env tsx

import { select, checkbox, confirm } from '@inquirer/prompts';
import chalk from 'chalk';

// Type imports
import type { BuildOptions } from './build-deployment.types.js';

// Config imports
import { config, AUTO_CONFIRM } from './build-deployment.constants.js';
import {
  platformConfigs,
  deploymentOptions,
  getDefaultPlatform,
  type PlatformConfig,
} from './platforms.config.js';

// Utility imports
import { copyBuildArtifacts, copyEnvExample, cleanPlatformArtifacts } from './utils/file.utils.js';
import { buildApplications, installDependencies } from './utils/build.utils.js';
import { createZipArchive } from './utils/archive.utils.js';
import { cleanupTempDirectory } from './utils/cleanup.utils.js';
import {
  createSetupScripts,
  createStartScript,
  createPlatformSpecificScripts,
} from './utils/scripts.utils.js';
import { createStandalonePackage } from './utils/package.utils.js';
import { createUserDocumentation } from './docs/documentation.generator.js';

/**
 * 🏗️ Touch Monorepo Deployment Builder
 *
 * This is the main orchestrator that coordinates the entire deployment process.
 * The heavy lifting is done by the various utility modules.
 */

/**
 * Get interactive build options from user
 */
async function getInteractiveOptions(): Promise<BuildOptions> {
  console.log(chalk.cyan('\n🏗️  Touch Monorepo Deployment Builder'));
  console.log(chalk.gray('═'.repeat(50)));

  if (AUTO_CONFIRM) {
    const defaultPlatform = getDefaultPlatform();
    const defaultConfig = platformConfigs.find((config) => config.value === defaultPlatform);
    console.log(chalk.yellow(`📦 Auto-confirm mode: Using ${defaultConfig?.name || 'macOS'}`));

    return {
      platform: defaultConfig?.platform || 'macos',
      arch: defaultConfig?.arch || 'x64',
      standalone: defaultConfig?.standalone || false,
      zip: true,
    };
  }

  // Platform selection
  const selectedPlatform = await select({
    message: chalk.bold('🎯 Select deployment platform:'),
    choices: platformConfigs.map((config) => ({
      name: `${config.icon} ${config.name}`,
      value: config.value,
      description: config.description,
    })),
    default: getDefaultPlatform(),
  });

  const platformConfig = platformConfigs.find((config) => config.value === selectedPlatform);
  if (!platformConfig) {
    throw new Error(`Invalid platform selection: ${selectedPlatform}`);
  }

  // Deployment options
  const selectedOptions = await checkbox({
    message: chalk.bold('⚙️  Select deployment options:'),
    choices: deploymentOptions.map((option) => ({
      name: `${option.icon} ${option.name}`,
      value: option.value,
      description: option.description,
      checked: option.default,
    })),
  });

  // Build confirmation
  const shouldBuild = await confirm({
    message: chalk.bold('🚀 Start deployment build?'),
    default: true,
  });

  if (!shouldBuild) {
    console.log(chalk.yellow('👋 Deployment cancelled by user'));
    process.exit(0);
  }

  return {
    platform: platformConfig.platform,
    arch: platformConfig.arch,
    standalone: platformConfig.standalone,
    zip: selectedOptions.includes('zip'),
  };
}

/**
 * Main deployment build process
 */
async function main(): Promise<void> {
  try {
    console.log(chalk.cyan('🏗️  Starting Touch Monorepo deployment build...\n'));

    // Get build options
    const options = await getInteractiveOptions();

    console.log(chalk.blue('\n📋 Build Configuration:'));
    console.log(`  Platform: ${options.platform}`);
    console.log(`  Architecture: ${options.arch}`);
    console.log(`  Standalone: ${options.standalone}`);
    console.log(`  Create ZIP: ${options.zip}`);
    console.log('');

    // Step 1: Build applications
    await buildApplications(config);

    // Step 2: Copy build artifacts
    await copyBuildArtifacts(config);

    // Step 3: Handle dependencies
    if (options.standalone) {
      await createStandalonePackage(config, options);
    } else {
      await installDependencies(config);
    }

    // Step 4: Copy environment files
    await copyEnvExample();

    // Step 5: Clean old artifacts
    await cleanPlatformArtifacts(config);

    // Step 6: Create scripts
    await createSetupScripts(config);
    await createStartScript(config);
    await createPlatformSpecificScripts(config, options);

    // Step 7: Create documentation
    await createUserDocumentation(config);

    // Step 8: Create ZIP archive if requested
    let zipName = '';
    if (options.zip) {
      zipName = await createZipArchive(config, options);
    }

    // Step 9: Clean up temporary files
    await cleanupTempDirectory(config);

    // Success!
    console.log('');
    console.log(chalk.green('🎉 Deployment build completed successfully!'));
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

    // Clean up temporary directory even on failure
    try {
      await cleanupTempDirectory(config);
    } catch (cleanupError) {
      console.warn('⚠️  Failed to cleanup temp directory after error:', cleanupError);
    }

    process.exit(1);
  }
}

// Run the deployment builder
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('💥 Unexpected error:', error);
    process.exit(1);
  });
}
