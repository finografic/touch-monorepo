import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';
import type { BuildConfig, BuildOptions } from '../build-deployment.types.js';

/**
 * Create standalone package.json for deployment
 */
export async function createStandalonePackage(config: BuildConfig, options: BuildOptions): Promise<void> {
  console.log('📄 Creating standalone package.json...');

  // Read server's package.json to get ALL production dependencies
  const serverPackageContent = await readFile(join(config.serverDir, 'package.json'), 'utf-8');
  const serverPackage = JSON.parse(serverPackageContent);

  // Extract all server dependencies (excluding workspace references)
  const serverDependencies = { ...serverPackage.dependencies };

  // Remove workspace references and replace with actual dependencies
  Object.keys(serverDependencies).forEach((key) => {
    if (serverDependencies[key].startsWith('workspace:')) {
      delete serverDependencies[key];
    }
  });

  // Add deployment-specific dependencies
  const deploymentDependencies = {
    ...serverDependencies,
    'npm-run-all': '^4.1.5', // For running both server and client
  };

  const standalonePackageJson = {
    name: 'touch-monorepo-deployment',
    version: '1.0.0',
    description: 'Touch Monorepo Production Deployment',
    type: 'module',
    scripts: {
      'start': 'run-p start:server start:client',
      'start:server': 'node dist/server/index.js',
      'start:client': 'node start-client.js',
      'setup': './setup.sh',
    },
    dependencies: deploymentDependencies,
    engines: {
      node: '>=18.0.0',
    },
    // Don't restrict os/cpu - let npm handle platform compatibility
    // os: options.platform ? [options.platform] : undefined,
    // cpu: options.arch ? [options.arch] : undefined,
  };

  await writeFile(join(config.distDir, 'package.json'), JSON.stringify(standalonePackageJson, null, 2));
  console.log('✅ Standalone package.json created with all server dependencies');
}
