/** Script generation utilities for deployment builds. */

import { join } from 'path';
import { execSync } from 'child_process';
import { readFile, writeFile } from 'fs/promises';

import type { BuildConfig, BuildOptions } from '../build-deployment.types.js';

/** Create the ports utility script from template. */
export async function createPortsUtility({ config }: { config: BuildConfig }): Promise<void> {
  console.log('🔧 Creating ports utility...');

  const template = await readFile(join(config.templatesDir, 'ports.utils.js.template'), 'utf-8');
  await writeFile(join(config.distDir, 'ports.utils.js'), template);
  console.log('✅ Ports utility created');
}

/** Create the start-server.js script from template. */
export async function createStartupScript({ config }: { config: BuildConfig }): Promise<void> {
  console.log('🚀 Creating startup script...');

  const template = await readFile(join(config.templatesDir, 'start-server.js.template'), 'utf-8');
  const startScript = template.replace(/{{SERVER_PORT}}/g, '4040').replace(/{{CLIENT_PORT}}/g, '3000');

  const outPath = join(config.distDir, 'start-server.js');
  await writeFile(outPath, startScript);
  execSync(`chmod +x ${outPath}`, { stdio: 'inherit' });
  console.log('✅ Startup script created as start-server.js');
}

/** Create the start-client.js script from template. */
export async function createClientServer({ config }: { config: BuildConfig }): Promise<void> {
  console.log('🌐 Creating client server script...');

  const template = await readFile(join(config.templatesDir, 'start-client.js.template'), 'utf-8');
  const clientScript = template.replace(/{{CLIENT_PORT}}/g, '3000');

  const outPath = join(config.distDir, 'start-client.js');
  await writeFile(outPath, clientScript);
  execSync(`chmod +x ${outPath}`, { stdio: 'inherit' });
  console.log('✅ Client server script created');
}

/** Create the universal setup.sh script from template. */
export async function createSetupScripts({
  config,
}: {
  config: BuildConfig;
  options: BuildOptions;
}): Promise<void> {
  console.log('🔧 Creating universal setup script...');

  const template = await readFile(join(config.templatesDir, 'setup.sh.template'), 'utf-8');
  const outPath = join(config.distDir, 'setup.sh');
  await writeFile(outPath, template);
  execSync(`chmod +x ${outPath}`, { stdio: 'inherit' });
  console.log('✅ Universal setup script created (setup.sh)');
}

/** Create the simple `start` launcher script from template. */
export async function createStartScript({ config }: { config: BuildConfig }): Promise<void> {
  console.log('🚀 Creating simple start script...');

  const template = await readFile(join(config.templatesDir, 'start.sh.template'), 'utf-8');
  const outPath = join(config.distDir, 'start');
  await writeFile(outPath, template);
  execSync(`chmod +x ${outPath}`, { stdio: 'inherit' });
  console.log('✅ Simple start script created (start)');
}

/** Create the README from template. */
export async function createReadme({ config }: { config: BuildConfig }): Promise<void> {
  console.log('📖 Creating README...');

  const template = await readFile(join(config.templatesDir, 'README.md.template'), 'utf-8');
  const readme = template.replace(/{{TIMESTAMP}}/g, new Date().toISOString());
  await writeFile(join(config.distDir, 'README.md'), readme);
  console.log('✅ README created');
}

/** Create the test-production.js script from template. */
export async function createTestScript({ config }: { config: BuildConfig }): Promise<void> {
  console.log('🧪 Creating test script...');

  const template = await readFile(join(config.templatesDir, 'test-production.js.template'), 'utf-8');
  const outPath = join(config.distDir, 'test-production.js');
  await writeFile(outPath, template);
  execSync(`chmod +x ${outPath}`, { stdio: 'inherit' });
  console.log('✅ Test script created');
}

/** Platform-specific .bat / .sh startup scripts (inline content, no templates). */
export async function createPlatformSpecificScripts({
  config,
  options,
}: {
  config: BuildConfig;
  options: BuildOptions;
}): Promise<void> {
  console.log('🔧 Creating platform-specific startup scripts...');

  const scripts = {
    windows: {
      server: '@echo off\necho Starting Touch Monorepo Server...\ncd /d "%~dp0"\nnode dist/server/index.js\n',
      client:
        '@echo off\necho Starting Touch Monorepo Client...\ncd /d "%~dp0"\nnode dist/client/server.js\n',
      both: '@echo off\ncd /d "%~dp0"\nstart "server" cmd /c start-server.bat\nstart "client" cmd /c start-client.bat\n',
    },
    linux: {
      server:
        '#!/bin/bash\necho "Starting Touch Monorepo Server..."\ncd "$(dirname "$0")"\nnode dist/server/index.js\n',
      client:
        '#!/bin/bash\necho "Starting Touch Monorepo Client..."\ncd "$(dirname "$0")"\nnode dist/client/server.js\n',
      both: '#!/bin/bash\ncd "$(dirname "$0")"\n(./start-server.sh &) >/dev/null 2>&1\n(./start-client.sh &) >/dev/null 2>&1\n',
    },
    macos: {
      server:
        '#!/bin/bash\necho "Starting Touch Monorepo Server..."\ncd "$(dirname "$0")"\nnode dist/server/index.js\n',
      client:
        '#!/bin/bash\necho "Starting Touch Monorepo Client..."\ncd "$(dirname "$0")"\nnode dist/client/server.js\n',
      both: '#!/bin/bash\ncd "$(dirname "$0")"\n(./start-server-macos.sh &) >/dev/null 2>&1\n(./start-client-macos.sh &) >/dev/null 2>&1\n',
    },
  } as const;

  if (options.platform === 'windows') {
    await writeFile(join(config.distDir, 'start-server.bat'), scripts.windows.server);
    await writeFile(join(config.distDir, 'start-client.bat'), scripts.windows.client);
    await writeFile(join(config.distDir, 'start-both.bat'), scripts.windows.both);
    console.log('✅ Windows startup scripts created');
  }

  if (options.platform === 'linux') {
    const files = ['start-server.sh', 'start-client.sh', 'start-both.sh'];
    await writeFile(join(config.distDir, files[0]), scripts.linux.server);
    await writeFile(join(config.distDir, files[1]), scripts.linux.client);
    await writeFile(join(config.distDir, files[2]), scripts.linux.both);
    execSync(`chmod +x ${files.map((f) => join(config.distDir, f)).join(' ')}`, { stdio: 'inherit' });
    console.log('✅ Linux startup scripts created');
  }

  if (options.platform === 'macos') {
    const files = ['start-server-macos.sh', 'start-client-macos.sh', 'start-both-macos.sh'];
    await writeFile(join(config.distDir, files[0]), scripts.macos.server);
    await writeFile(join(config.distDir, files[1]), scripts.macos.client);
    await writeFile(join(config.distDir, files[2]), scripts.macos.both);
    execSync(`chmod +x ${files.map((f) => join(config.distDir, f)).join(' ')}`, { stdio: 'inherit' });
    console.log('✅ macOS startup scripts created');
  }
}
