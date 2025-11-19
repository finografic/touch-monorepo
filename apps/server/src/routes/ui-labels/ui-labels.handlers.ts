import type { AppRouteHandler } from 'types/app.types';
import type { ListRoute, SaveRoute } from './ui-labels.routes';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from 'lib/zod.errors';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import * as HttpStatusPhrases from 'stoker/http-status-phrases';
import { findProjectRoot } from '@finografic/project-scripts/utils';

const rootDir = findProjectRoot();
const TRANSLATIONS_BASE_PATH = join(rootDir, 'packages/i18n/src/translations/common');

// Supported languages
const SUPPORTED_LANGUAGES = [
  { isoCode: 'es-ES', displayName: 'Spanish', nativeName: 'Español' },
  { isoCode: 'en-GB', displayName: 'English', nativeName: 'English' },
  { isoCode: 'ca-ES', displayName: 'Catalan', nativeName: 'Català' },
] as const;

// Language file mapping
const LANGUAGE_FILES = {
  'en-GB': 'en-GB.json',
  'es-ES': 'es-ES.json',
  'ca-ES': 'ca-ES.json',
} as const;

type LanguageCode = keyof typeof LANGUAGE_FILES;

// Helper function to flatten nested objects with dot notation
function flattenObject(obj: any, prefix = ''): Record<string, any> {
  const flattened: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(flattened, flattenObject(value, newKey));
    } else {
      flattened[newKey] = value;
    }
  }

  return flattened;
}

// Helper function to group flattened keys by their section (second level)
// Keys are now in format: topLevel.section.item (e.g., "ui.buttons.add", "time.units.seconds")
function groupBySection(flattenedData: Record<string, any>): Record<string, Record<string, any>> {
  const sections: Record<string, Record<string, any>> = {};

  for (const [key, value] of Object.entries(flattenedData)) {
    const pathParts = key.split('.');
    // Need at least 3 parts: topLevel.section.item
    // Or 2 parts for backward compatibility: section.item
    if (pathParts.length >= 3) {
      // New format: topLevel.section.item
      const sectionKey = pathParts[1]; // buttons, units, relative, etc.
      const itemKey = pathParts.slice(2).join('.'); // The rest of the path (item)

      if (!sections[sectionKey]) {
        sections[sectionKey] = {};
      }
      sections[sectionKey][itemKey] = value;
    } else if (pathParts.length === 2) {
      // Backward compatibility: section.item (for old ui-only structure)
      const sectionKey = pathParts[0];
      const itemKey = pathParts[1];

      if (!sections[sectionKey]) {
        sections[sectionKey] = {};
      }
      sections[sectionKey][itemKey] = value;
    }
  }

  return sections;
}

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

export const list: AppRouteHandler<ListRoute> = async (context) => {
  try {
    // Read all translation files
    const translationData: Record<string, any> = {};

    for (const [langCode, fileName] of Object.entries(LANGUAGE_FILES)) {
      const filePath = join(TRANSLATIONS_BASE_PATH, fileName);

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
          HttpStatusCodes.INTERNAL_SERVER_ERROR,
        );
      }

      const fileContent = await readFile(filePath, 'utf-8');
      translationData[langCode] = JSON.parse(fileContent);
    }

    // Check if translation data exists
    if (!translationData['en-GB'] || !translationData['es-ES'] || !translationData['ca-ES']) {
      console.error('[ui-labels] Missing translation data in common files', translationData);
      return context.json(
        {
          success: false,
          error: {
            issues: [
              {
                code: 'MISSING_TRANSLATIONS',
                message: 'Translation data not found in one or more language files',
              },
            ],
            name: 'MissingTranslationsError',
          },
        },
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      );
    }

    // Flatten each language's translations (all top-level keys: ui, time, etc.)
    const flattenedTranslations: Record<string, Record<string, any>> = {};

    for (const [langCode, translation] of Object.entries(translationData)) {
      if (!translation) {
        flattenedTranslations[langCode] = {};
        continue;
      }

      // Flatten all top-level keys (ui, time, etc.) into a single flat structure
      const allFlattened: Record<string, any> = {};
      for (const [topLevelKey, topLevelValue] of Object.entries(translation)) {
        if (typeof topLevelValue === 'object' && topLevelValue !== null) {
          const flattened = flattenObject(topLevelValue);
          // Prefix keys with the top-level key to avoid collisions
          for (const [key, value] of Object.entries(flattened)) {
            allFlattened[`${topLevelKey}.${key}`] = value;
          }
        }
      }
      flattenedTranslations[langCode] = allFlattened;
    }

    // Group by sections using English as the base
    const sections = groupBySection(flattenedTranslations['en-GB']);

    // Map section keys to their top-level parent (ui, time, etc.)
    // This is used to reconstruct the full flattened key when looking up values
    const sectionToTopLevel: Record<string, string> = {
      buttons: 'ui',
      forms: 'ui',
      navigation: 'ui',
      states: 'ui',
      actions: 'ui',
      units: 'time',
      relative: 'time',
    };

    // Section titles and descriptions
    const sectionTitles: Record<string, { title: string; description: string }> = {
      buttons: {
        title: 'UI Buttons',
        description: 'Labels for buttons throughout the application',
      },
      forms: {
        title: 'Form Elements',
        description: 'Labels, placeholders, and validation messages for forms',
      },
      navigation: {
        title: 'Navigation',
        description: 'Navigation menu items and links',
      },
      states: {
        title: 'Application States',
        description: 'Loading, error, success, and other state messages',
      },
      actions: {
        title: 'User Actions',
        description: 'Confirmation dialogs and action-related messages',
      },
      units: {
        title: 'Time Units',
        description: 'Time unit labels (seconds, minutes, hours, days)',
      },
      relative: {
        title: 'Relative Time',
        description: 'Relative time expressions (now, just now, minutes ago, etc.)',
      },
    };

    // Build sections array
    const processedSections = Object.entries(sections).map(([sectionKey, sectionItems]) => {
      const topLevelKey = sectionToTopLevel[sectionKey] || 'ui'; // Default to 'ui' if not mapped
      const items = Object.keys(sectionItems).map((itemKey) => {
        const values: Record<string, string> = {};

        for (const language of SUPPORTED_LANGUAGES) {
          // Reconstruct the full flattened key: topLevel.section.item (e.g., "ui.buttons.add")
          const fullKey = `${topLevelKey}.${sectionKey}.${itemKey}`;
          values[language.isoCode] = flattenedTranslations[language.isoCode]?.[fullKey] || '';
        }

        return {
          key: itemKey,
          values,
        };
      });

      const sectionInfo =
        sectionTitles[sectionKey] || {
          title: sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1),
          description: `${sectionKey} related translations`,
        };

      return {
        key: sectionKey,
        title: sectionInfo.title,
        description: sectionInfo.description,
        items: items.sort((a, b) => a.key.localeCompare(b.key)),
      };
    });

    return context.json(
      {
        sections: processedSections.sort((a, b) => a.key.localeCompare(b.key)),
      },
      HttpStatusCodes.OK,
    );
  } catch (error) {
    console.error('[ui-labels] Error loading UI labels:', error);
    return context.json(
      {
        success: false,
        error: {
          issues: [
            {
              code: 'LOAD_ERROR',
              message: `Failed to load UI labels: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          name: 'LoadError',
        },
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

export const save: AppRouteHandler<SaveRoute> = async (context) => {
  const data = context.req.valid('json');
  const { sections } = data;

  // Group all UI label data by language
  const languageData: Record<LanguageCode, Record<string, string>> = {
    'en-GB': {},
    'es-ES': {},
    'ca-ES': {},
  };

  // Map section keys to their top-level parent (ui, time, etc.)
  // This determines where each section should be saved in the JSON structure
  const sectionToTopLevel: Record<string, string> = {
    buttons: 'ui',
    forms: 'ui',
    navigation: 'ui',
    states: 'ui',
    actions: 'ui',
    units: 'time',
    relative: 'time',
  };

  // Process sections and items to build flattened language data
  // Group by top-level key first, then by section
  const topLevelData: Record<LanguageCode, Record<string, Record<string, string>>> = {
    'en-GB': {},
    'es-ES': {},
    'ca-ES': {},
  };

  for (const section of sections) {
    const topLevelKey = sectionToTopLevel[section.key] || 'ui'; // Default to 'ui' if not mapped

    for (const item of section.items) {
      for (const [langCode, value] of Object.entries(item.values)) {
        if (langCode in topLevelData && typeof value === 'string') {
          if (!topLevelData[langCode as LanguageCode][topLevelKey]) {
            topLevelData[langCode as LanguageCode][topLevelKey] = {};
          }
          // Build the flattened key: sectionKey.itemKey (e.g., "buttons.add", "units.seconds")
          const flattenedKey = `${section.key}.${item.key}`;
          topLevelData[langCode as LanguageCode][topLevelKey][flattenedKey] = value;
        }
      }
    }
  }

  // Convert to the format expected by unflattenObject
  for (const langCode of Object.keys(languageData) as LanguageCode[]) {
    for (const [topLevelKey, sectionData] of Object.entries(topLevelData[langCode])) {
      for (const [key, value] of Object.entries(sectionData)) {
        // Prefix with top-level key: "ui.buttons.add" or "time.units.seconds"
        languageData[langCode][`${topLevelKey}.${key}`] = value;
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

      // Unflatten the data back to nested structure
      const unflattenedData = unflattenObject(languageData[langCode as LanguageCode]);

      // Update each top-level key (ui, time, etc.) while preserving others
      const updatedData = {
        ...existingData,
        ...unflattenedData,
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
