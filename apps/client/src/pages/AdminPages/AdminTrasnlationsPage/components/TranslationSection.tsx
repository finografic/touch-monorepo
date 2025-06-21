import React, { memo } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import type { FieldError } from 'react-hook-form';
import { Box, Flex, Grid, Heading, Text, TextField } from '@radix-ui/themes';
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
            <Heading as="h2">{title}</Heading>
            <Text size="2" color="gray">
              {description}
            </Text>
          </Box>

          <Flex direction="column" gap="4">
            {fields.map((field, index) => (
              <Box key={field.id} className="translation-item">
                <Grid columns="4" gap="3" align="center">
                  {/* Base name (readonly) */}
                  <Box>
                    <Text size="1" weight="medium" color="gray" mb="1">
                      {t('ui.forms.labels.name')}
                    </Text>
                    <TextField.Root
                      {...register(`${fieldName}.${index}.name`)}
                      readOnly
                      variant="soft"
                      color="gray"
                      size="3"
                    />
                  </Box>

                  {/* English translation */}
                  <Box>
                    <Text size="1" weight="medium" mb="1">
                      English
                    </Text>
                    <TextField.Root
                      {...register(`${fieldName}.${index}.nameEn`)}
                      placeholder={t('ui.forms.placeholders.enterText')}
                      size="3"
                    />
                    {errors?.[index]?.nameEn && (
                      <Text size="1" color="red" mt="1">
                        {errors[index].nameEn.message}
                      </Text>
                    )}
                  </Box>

                  {/* Spanish translation */}
                  <Box>
                    <Text size="1" weight="medium" mb="1">
                      Español
                    </Text>
                    <TextField.Root
                      {...register(`${fieldName}.${index}.nameEs`)}
                      placeholder={t('ui.forms.placeholders.enterText')}
                      size="3"
                    />
                    {errors?.[index]?.nameEs && (
                      <Text size="1" color="red" mt="1">
                        {errors[index].nameEs.message}
                      </Text>
                    )}
                  </Box>

                  {/* Catalan translation */}
                  <Box>
                    <Text size="1" weight="medium" mb="1">
                      Català
                    </Text>
                    <TextField.Root
                      {...register(`${fieldName}.${index}.nameCat`)}
                      placeholder={t('ui.forms.placeholders.enterText')}
                      size="3"
                    />
                    {errors?.[index]?.nameCat && (
                      <Text size="1" color="red" mt="1">
                        {errors[index].nameCat.message}
                      </Text>
                    )}
                  </Box>

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
