/** CLI argument parsing and interactive prompts. */

import { select, checkbox, confirm } from '@inquirer/prompts';
import chalk from 'chalk';

import { AUTO_CONFIRM } from './build-deployment.constants.js';
import type { BuildOptions } from './build-deployment.types.js';
import { platformConfigs, deploymentOptions, getDefaultPlatform } from './platforms.config.js';

/** Parse legacy CLI arguments into BuildOptions. */
export function parseArguments(): BuildOptions {
  const args = process.argv.slice(2);
  const options: BuildOptions = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    switch (arg) {
      case '--platform':
      case '-p':
        options.platform = args[++i] as BuildOptions['platform'];
        break;
      case '--arch':
      case '-a':
        options.arch = args[++i] as BuildOptions['arch'];
        break;
      case '--include-node':
      case '-n':
        options.includeNode = true;
        break;
      case '--standalone':
      case '-s':
        options.standalone = true;
        break;
      case '--zip':
      case '-z':
        options.zip = true;
        break;
      case '--output-dir':
      case '-o':
        options.outputDir = args[++i];
        break;
      case '--help':
      case '-h':
        printHelp();
        process.exit(0);
    }
  }

  return options;
}

/** Check whether any build-related CLI flags were provided. */
export function hasCliArgs(): boolean {
  const buildFlags = [
    '--platform',
    '-p',
    '--arch',
    '-a',
    '--standalone',
    '-s',
    '--zip',
    '-z',
    '--include-node',
    '-n',
  ];
  return process.argv.slice(2).some((arg) => buildFlags.some((flag) => arg.startsWith(flag)));
}

/** Interactive platform/options selection via inquirer prompts. */
export async function getInteractiveOptions(): Promise<BuildOptions> {
  console.log(chalk.cyan('\n🏗️  Touch Monorepo Deployment Builder'));
  console.log(chalk.gray('═'.repeat(50)));

  if (AUTO_CONFIRM) {
    const defaultPlatform = getDefaultPlatform();
    const defaultConfig = platformConfigs.find((c) => c.value === defaultPlatform);
    console.log(chalk.yellow(`📦 Auto-confirm mode: Using ${defaultConfig?.name || 'macOS'}`));

    return {
      platform: defaultConfig?.platform || 'macos',
      arch: defaultConfig?.arch || 'x64',
      standalone: defaultConfig?.standalone || false,
      zip: true,
    };
  }

  const selectedPlatform = await select({
    message: chalk.bold('🎯 Select deployment platform:'),
    choices: platformConfigs.map((c) => ({
      name: c.name,
      value: c.value,
      description: c.description,
    })),
    default: getDefaultPlatform(),
  });

  const platformConfig = platformConfigs.find((c) => c.value === selectedPlatform);
  if (!platformConfig) throw new Error(`Invalid platform selection: ${selectedPlatform}`);

  const additionalOptions = await checkbox({
    message: chalk.bold('⚙️  Select additional options:'),
    choices: deploymentOptions,
  });

  const shouldProceed = await confirm({
    message: chalk.bold(`🚀 Build ${platformConfig.name}?`),
    default: true,
  });

  if (!shouldProceed) {
    console.log(chalk.yellow('📦 Build cancelled by user'));
    process.exit(0);
  }

  return {
    platform: platformConfig.platform,
    arch: platformConfig.arch,
    standalone: platformConfig.standalone || false,
    zip: platformConfig.zip || additionalOptions.includes('zip'),
    includeNode: additionalOptions.includes('includeNode'),
  };
}

/** Apply platform-config defaults when using CLI mode. */
export function applyPlatformDefaults(options: BuildOptions): BuildOptions {
  if (!options.platform || options.arch) return options;

  const platformConfig = platformConfigs.find((c) => c.platform === options.platform);
  if (!platformConfig) return options;

  return {
    ...options,
    arch: platformConfig.arch,
    standalone: platformConfig.standalone || false,
    zip: options.zip || platformConfig.zip || false,
  };
}

function printHelp(): void {
  console.log(
    chalk.cyan(`
🏗️  Touch Monorepo Deployment Builder

Usage: pnpm build.deployment [options]

Interactive Mode (Recommended):
  pnpm build.deployment           Interactive platform selection
  pnpm build.deployment -y        Auto-confirm with host platform

Legacy CLI Mode:
  --platform, -p <platform>      Target platform (windows|linux|macos|universal)
  --arch, -a <arch>              Target architecture (x64|arm64|universal)
  --include-node, -n             Include Node.js runtime
  --standalone, -s               Create standalone package
  --zip, -z                      Create zip archive
  --output-dir, -o <dir>         Output directory for zip
  --yes, -y                      Auto-confirm with defaults
  --help, -h                     Show this help

Examples:
  pnpm build.deployment                    # Interactive mode
  pnpm build.deployment -y                 # Quick build with host platform
  pnpm build.deployment -p macos -z        # Legacy: macOS with zip
    `),
  );
}
