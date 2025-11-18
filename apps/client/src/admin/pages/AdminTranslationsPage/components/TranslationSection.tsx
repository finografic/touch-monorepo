import React, { memo } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Box, Grid, TextField } from '@radix-ui/themes';
import { AdminSection } from 'admin/components';
import { FieldWrapper } from 'forms/FieldWrapper/FieldWrapper';

import { getLanguageFieldName } from '../utils/translation-helpers';

interface SupportedLanguage {
  isoCode: string;
  displayName: string;
  nativeName: string;
}

interface TranslationSectionProps {
  title: string;
  description: string;
  fieldName: string;
  errors?: any;
  supportedLanguages: SupportedLanguage[];
}

export const TranslationSection: React.FC<TranslationSectionProps> = memo(
  ({ title, description, fieldName, errors, supportedLanguages }) => {
    const { t } = useTranslation();
    const { register, control } = useFormContext();
    const { fields } = useFieldArray({
      control,
      name: fieldName,
    });

    // Calculate grid columns based on number of languages (name + languages)
    const gridColumns = String(1 + supportedLanguages.length);

    return (
      <AdminSection title={title} description={description} variant="border-solid">
        {fields.map((field, index) => (
          <Box key={field.id} className="translation-item">
            <Grid columns={gridColumns} gap="3" align="center">
              {/* Base name (readonly) */}
              <Box>
                <FieldWrapper label=" ">
                  <TextField.Root
                    {...register(`${fieldName}.${index}.name`)}
                    className="value-key"
                    readOnly
                    variant="soft"
                    size="3"
                    style={{ pointerEvents: 'none', userSelect: 'none' }}
                  />
                </FieldWrapper>
              </Box>

              {/* Dynamic language fields */}
              {supportedLanguages.map((language) => {
                const filterKey = getLanguageFieldName(language.isoCode);
                const fieldPath = `${fieldName}.${index}.${filterKey}`;

                return (
                  <FieldWrapper
                    key={language.isoCode}
                    name={fieldPath}
                    label={language.displayName}
                    error={errors?.[index]?.[filterKey] && errors[index][filterKey].message}
                  >
                    <TextField.Root
                      {...register(fieldPath)}
                      placeholder={t('ui.forms.placeholders.enterText')}
                      size="3"
                    />
                  </FieldWrapper>
                );
              })}

              {/* Hidden fields */}
              <input type="hidden" {...register(`${fieldName}.${index}.id`)} />
              {/* Additional hidden fields for specific entity types */}
              {fieldName === 'drinkSubtypes' && (
                <>
                  <input type="hidden" {...register(`${fieldName}.${index}.drinkTypeId`)} />
                  <input type="hidden" {...register(`${fieldName}.${index}.isActive`)} />
                </>
              )}
              {(fieldName === 'drinkTypes' || fieldName === 'volumes' || fieldName === 'containerTypes') && (
                <input type="hidden" {...register(`${fieldName}.${index}.isActive`)} />
              )}
              {fieldName === 'drinkTypes' && (
                <input type="hidden" {...register(`${fieldName}.${index}.hasSubtypes`)} />
              )}
              {fieldName === 'containerTypes' && (
                <input type="hidden" {...register(`${fieldName}.${index}.thermalConductivity`)} />
              )}
            </Grid>
          </Box>
        ))}
      </AdminSection>
    );
  },
);
