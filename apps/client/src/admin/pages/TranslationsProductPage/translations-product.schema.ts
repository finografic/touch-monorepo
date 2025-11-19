import { z } from 'zod';

import { getLanguageFieldName } from './utils/translation-helpers';

// Create dynamic schema based on supported languages
export const createTranslationSchema = (
  t: (key: string) => string,
  supportedLanguages: Array<{ isoCode: string }>,
) => {
  // Create dynamic fields object for language translations
  const languageFields: Record<string, z.ZodString> = {};
  supportedLanguages.forEach((lang) => {
    const fieldName = getLanguageFieldName(lang.isoCode);
    languageFields[fieldName] = z.string().min(1, t('ui.forms.validation.required'));
  });

  const baseFields = {
    id: z.string(),
    name: z.string().min(1, t('ui.forms.validation.required')),
    ...languageFields,
  };

  return z.object({
    drinkSubtypes: z.array(
      z.object({
        ...baseFields,
        drinkTypeId: z.string(),
        isActive: z.boolean().optional(),
      }),
    ),
    volumes: z.array(
      z.object({
        ...baseFields,
        isActive: z.boolean().optional(),
      }),
    ),
    drinkTypes: z.array(
      z.object({
        ...baseFields,
        hasSubtypes: z.boolean().optional(),
        isActive: z.boolean().optional(),
      }),
    ),
    containerTypes: z.array(
      z.object({
        ...baseFields,
        thermalConductivity: z.number().optional(),
        isActive: z.boolean().optional(),
      }),
    ),
  });
};
