import { writeFile } from 'fs/promises';
import { join } from 'path';
import type { BuildConfig, BuildOptions } from '../build-deployment.types.js';

/**
 * Create standalone package.json for deployment
 */
export async function createStandalonePackage(config: BuildConfig, options: BuildOptions): Promise<void> {
  console.log('📄 Creating standalone package.json...');

  const standalonePackageJson = {
    name: 'touch-monorepo-deployment',
    version: '1.0.0',
    description: 'Touch Monorepo Production Deployment',
    type: 'module',
    scripts: {
      'start': 'run-p start:server start:client',
      'start:server': 'node dist/server/index.js',
      'start:client': 'node dist/client/server.js',
      'setup': './setup.sh',
    },
    dependencies: {
      'better-sqlite3': '11.9.0',
      'dotenv': '^16.0.0',
    },
    devDependencies: {
      'npm-run-all': '^4.1.5',
    },
    engines: {
      node: '>=18.0.0',
    },
    // Don't restrict os/cpu - let npm handle platform compatibility
    // os: options.platform ? [options.platform] : undefined,
    // cpu: options.arch ? [options.arch] : undefined,
  };

  await writeFile(join(config.distDir, 'package.json'), JSON.stringify(standalonePackageJson, null, 2));
  console.log('✅ Standalone package.json created');
}
