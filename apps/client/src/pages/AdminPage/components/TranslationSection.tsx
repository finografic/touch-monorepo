import React, { memo } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import type { FieldError } from 'react-hook-form';
import { Box, Flex, Grid, Heading, Text } from '@radix-ui/themes';
import { useTranslation } from 'react-i18next';

interface TranslationSectionProps {
  title: string;
  description: string;
  fieldName: string;
  errors?: any;
}

export const TranslationSection: React.FC<TranslationSectionProps> = memo(
  ({ title, description, fieldName, errors }) => {
    const { t } = useTranslation();
    const { register, control } = useFormContext();
    const { fields } = useFieldArray({
      control,
      name: fieldName,
    });

    return (
      <Box className="translation-section">
        <Flex direction="column" gap="4">
          <Box>
            <Heading size="6" mb="2">
              {title}
            </Heading>
            <Text size="2" color="gray">
              {description}
            </Text>
          </Box>

          <Flex direction="column" gap="4">
            {fields.map((field, index) => (
              <Box key={field.id} className="translation-item">
                <Grid columns="5" gap="3" align="center">
                  {/* Base name (readonly) */}
                  <Box>
                    <Text size="1" weight="medium" color="gray">
                      {t('ui.forms.labels.name')}
                    </Text>
                    <input {...register(`${fieldName}.${index}.name`)} readOnly className="form-input" />
                  </Box>

                  {/* English translation */}
                  <Box>
                    <Text size="1" weight="medium">
                      English
                    </Text>
                    <input
                      {...register(`${fieldName}.${index}.nameEn`)}
                      placeholder={t('ui.forms.placeholders.enterText')}
                      className="form-input"
                    />
                    {errors?.[index]?.nameEn && (
                      <Text size="1" color="red" className="error-message">
                        {errors[index].nameEn.message}
                      </Text>
                    )}
                  </Box>

                  {/* Spanish translation */}
                  <Box>
                    <Text size="1" weight="medium">
                      Español
                    </Text>
                    <input
                      {...register(`${fieldName}.${index}.nameEs`)}
                      placeholder={t('ui.forms.placeholders.enterText')}
                      className="form-input"
                    />
                    {errors?.[index]?.nameEs && (
                      <Text size="1" color="red" className="error-message">
                        {errors[index].nameEs.message}
                      </Text>
                    )}
                  </Box>

                  {/* Catalan translation */}
                  <Box>
                    <Text size="1" weight="medium">
                      Català
                    </Text>
                    <input
                      {...register(`${fieldName}.${index}.nameCat`)}
                      placeholder={t('ui.forms.placeholders.enterText')}
                      className="form-input"
                    />
                    {errors?.[index]?.nameCat && (
                      <Text size="1" color="red" className="error-message">
                        {errors[index].nameCat.message}
                      </Text>
                    )}
                  </Box>

                  {/* Hidden fields */}
                  <Box>
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
                  </Box>
                </Grid>
              </Box>
            ))}
          </Flex>
        </Flex>
      </Box>
    );
  },
);
