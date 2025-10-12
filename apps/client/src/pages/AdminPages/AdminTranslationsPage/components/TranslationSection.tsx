import React, { memo } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import type { FieldError } from 'react-hook-form';
import { Box, Flex, Grid, Heading, Text, TextField } from '@radix-ui/themes';
import { useTranslation } from 'react-i18next';
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
      <Box className="translation-section">
        <Flex direction="column" gap="4">
          <Box>
            <Heading as="h2">{title}</Heading>
            <Text size="2" color="gray">
              {description}
            </Text>
          </Box>

          <Flex direction="column" gap="4">
            {fields.map((field, index) => (
              <Box key={field.id} className="translation-item">
                <Grid columns={gridColumns} gap="3" align="center">
                  {/* Base name (readonly) */}
                  <Box>
                    <Text size="1" weight="medium" color="gray" mb="1" className="field-label">
                      {t('ui.forms.labels.name')}
                    </Text>
                    <TextField.Root
                      {...register(`${fieldName}.${index}.name`)}
                      className="value-key"
                      readOnly
                      variant="soft"
                      size="3"
                    />
                  </Box>

                  {/* Dynamic language fields */}
                  {supportedLanguages.map((language) => {
                    const filterKey = getLanguageFieldName(language.isoCode);
                    const fieldPath = `${fieldName}.${index}.${filterKey}`;

                    return (
                      <Box key={language.isoCode}>
                        <Text size="1" weight="medium" mb="1">
                          {language.displayName}
                        </Text>
                        <TextField.Root
                          {...register(fieldPath)}
                          placeholder={t('ui.forms.placeholders.enterText')}
                          size="3"
                        />
                        {errors?.[index]?.[filterKey] && (
                          <Text size="1" color="red" mt="1">
                            {errors[index][filterKey].message}
                          </Text>
                        )}
                      </Box>
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
                  {(fieldName === 'drinkTypes' ||
                    fieldName === 'volumes' ||
                    fieldName === 'containerTypes') && (
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
          </Flex>
        </Flex>
      </Box>
    );
  },
);
