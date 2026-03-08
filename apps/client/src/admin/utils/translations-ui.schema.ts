import * as v from 'valibot';

import { getLanguageFieldName } from 'admin/utils/translation-helpers';

export const createTranslationSchema = (
  t: (key: string) => string,
  supportedLanguages: Array<{ isoCode: string }>,
) => {
  const languageFields: Record<string, v.BaseSchema<unknown, string, v.BaseIssue<unknown>>> = {};
  supportedLanguages.forEach((lang) => {
    const fieldName = getLanguageFieldName(lang.isoCode);
    languageFields[fieldName] = v.pipe(v.string(), v.minLength(1, t('ui.forms.validation.required')));
  });

  const baseFields = {
    id: v.string(),
    name: v.pipe(v.string(), v.minLength(1, t('ui.forms.validation.required'))),
    ...languageFields,
  };

  return v.object({
    drinkSubtypes: v.array(
      v.object({
        ...baseFields,
        drinkTypeId: v.string(),
        isActive: v.optional(v.boolean()),
      }),
    ),
    volumes: v.array(
      v.object({
        ...baseFields,
        isActive: v.optional(v.boolean()),
      }),
    ),
    drinkTypes: v.array(
      v.object({
        ...baseFields,
        hasSubtypes: v.optional(v.boolean()),
        isActive: v.optional(v.boolean()),
      }),
    ),
    containerTypes: v.array(
      v.object({
        ...baseFields,
        thermalConductivity: v.optional(v.number()),
        isActive: v.optional(v.boolean()),
      }),
    ),
  });
};

export const createUiLabelsSchema = () => {
  return v.object({
    sections: v.array(
      v.object({
        key: v.string(),
        items: v.array(
          v.object({
            key: v.string(),
            values: v.record(v.string(), v.string()),
          }),
        ),
      }),
    ),
  });
};
