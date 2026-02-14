/** User documentation generation. */

import { join } from 'path';
import { readFile, writeFile } from 'fs/promises';

import type { BuildConfig } from '../build-deployment.types.js';

/** Generate English and Spanish user guides from templates. */
export async function createUserDocumentation({ config }: { config: BuildConfig }): Promise<void> {
  console.log('📝 Creating user documentation...');

  const [englishTemplate, spanishTemplate] = await Promise.all([
    readFile(join(config.templatesDir, 'USER_GUIDE_EN.md.template'), 'utf-8'),
    readFile(join(config.templatesDir, 'GUIA_USUARIO_ES.md.template'), 'utf-8'),
  ]);

  const englishTimestamp = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const spanishTimestamp = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  await Promise.all([
    writeFile(
      join(config.distDir, 'USER_GUIDE_EN.md'),
      englishTemplate.replace(/{{TIMESTAMP}}/g, englishTimestamp),
    ),
    writeFile(
      join(config.distDir, 'GUIA_USUARIO_ES.md'),
      spanishTemplate.replace(/{{TIMESTAMP}}/g, spanishTimestamp),
    ),
  ]);

  console.log('✅ User documentation created (USER_GUIDE_EN.md, GUIA_USUARIO_ES.md)');
}
