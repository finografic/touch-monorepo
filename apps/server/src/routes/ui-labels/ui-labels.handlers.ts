import type { AppRouteHandler } from 'types/app.types';
import type { SaveRoute } from './ui-labels.routes';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from 'lib/zod.errors';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import * as HttpStatusPhrases from 'stoker/http-status-phrases';
import { findProjectRoot } from '@finografic/project-scripts/utils';

const rootDir = findProjectRoot();
const TRANSLATIONS_BASE_PATH = join(rootDir, 'packages/i18n/src/translations/common');

// Language file mapping
const LANGUAGE_FILES = {
  'en-GB': 'en-GB.json',
  'es-ES': 'es-ES.json',
  'ca-ES': 'ca-ES.json',
} as const;

type LanguageCode = keyof typeof LANGUAGE_FILES;

// Helper function to unflatten object structure
function unflattenObject(flattened: Record<string, string>): any {
  const result: any = {};

  for (const [key, value] of Object.entries(flattened)) {
    const keys = key.split('.');
    let current = result;

    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (!(k in current)) {
        current[k] = {};
      }
      current = current[k];
    }

    current[keys[keys.length - 1]] = value;
  }

  return result;
}

export const save: AppRouteHandler<SaveRoute> = async (context) => {
  const data = context.req.valid('json');
  const { sections } = data;

  // Group all UI label data by language
  const languageData: Record<LanguageCode, Record<string, string>> = {
    'en-GB': {},
    'es-ES': {},
    'ca-ES': {},
  };

  // Process sections and items to build flattened language data
  for (const section of sections) {
    for (const item of section.items) {
      for (const [langCode, value] of Object.entries(item.values)) {
        if (langCode in languageData && typeof value === 'string') {
          // Build the flattened key: sectionKey.itemKey (e.g., "buttons.add")
          const flattenedKey = `${section.key}.${item.key}`;
          languageData[langCode as LanguageCode][flattenedKey] = value;
        }
      }
    }
  }

  const filesUpdated: string[] = [];

  // Process each language file
  for (const [langCode, fileName] of Object.entries(LANGUAGE_FILES)) {
    const filePath = join(TRANSLATIONS_BASE_PATH, fileName);

    // Check if file exists
    if (!existsSync(filePath)) {
      console.error(`[ui-labels] Translation file missing: ${filePath}`);
      return context.json(
        {
          success: false,
          error: {
            issues: [
              {
                code: 'FILE_NOT_FOUND',
                path: [filePath],
                message: `Translation file not found at path: ${filePath}`,
              },
            ],
            name: 'FileNotFoundError',
          },
        },
        HttpStatusCodes.UNPROCESSABLE_ENTITY,
      );
    }

    try {
      // Read existing file
      const fileContent = await readFile(filePath, 'utf-8');
      const existingData = JSON.parse(fileContent);

      // Unflatten the UI data back to nested structure
      const uiData = unflattenObject(languageData[langCode as LanguageCode]);

      // Update the UI section while preserving other sections
      const updatedData = {
        ...existingData,
        ui: uiData,
      };

      // Write back to file with proper formatting
      await writeFile(filePath, `${JSON.stringify(updatedData, null, 2)}\n`, 'utf-8');
      filesUpdated.push(fileName);
    } catch (fileError) {
      console.error(`[ui-labels] Error processing file ${filePath}:`, fileError);
      return context.json(
        {
          success: false,
          error: {
            issues: [
              {
                code: 'FILE_PROCESSING_ERROR',
                path: [filePath],
                message: `Failed to process translation file: ${filePath}`,
              },
            ],
            name: 'FileProcessingError',
          },
        },
        HttpStatusCodes.UNPROCESSABLE_ENTITY,
      );
    }
  }

  return context.json(
    {
      message: `Successfully updated ${filesUpdated.length} translation files`,
      filesUpdated,
    },
    HttpStatusCodes.OK,
  );
};
