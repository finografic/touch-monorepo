import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Flex, Grid, Text, TextField } from '@radix-ui/themes';
import { AdminSection } from 'admin/components/AdminSection/AdminSection';
import { useUiSectionForm } from 'admin/pages/TranslationsUiPage/hooks/useUiSectionForm';
import { FieldWrapper } from 'forms/FieldWrapper';
import { Button } from 'components/Button';

import type { LanguageInfo } from 'types/models/supported-language.model';
import { getLanguageFieldName } from '../utils/translation-helpers';

interface TranslationItem {
  id: string;
  name: string;
  [key: string]: any; // For language fields and other properties
}

interface ProductTranslationSectionFormProps {
  sectionKey: string;
  title: string;
  description: string;
  items: TranslationItem[];
  supportedLanguages: LanguageInfo[];
  onItemChange: (sectionKey: string, itemId: string, fieldName: string, value: string) => void;
  onReset?: () => void;
  onSave?: () => Promise<any>;
  isDirty?: boolean;
  hasError?: boolean;
  className?: string;
}

export const ProductTranslationSectionForm: React.FC<ProductTranslationSectionFormProps> = memo(
  ({
    sectionKey,
    title,
    description,
    items,
    supportedLanguages,
    onItemChange,
    onReset,
    onSave,
    isDirty = false,
    hasError = false,
    className = '',
  }) => {
    const { t } = useTranslation();

    // Form logic (only used if onSave and onReset are provided)
    const isFormMode = !!onSave && !!onReset;
    const {
      handleReset,
      handleSubmit,
      isDirty: dirty,
      isSaving,
      statusMessage,
      statusType,
    } = useUiSectionForm({
      sectionKey,
      isDirty: isDirty || false,
      onReset: onReset || (() => {}),
      onSubmit: onSave || (async () => ({})),
    });

    // Calculate grid columns based on number of languages (name + languages)
    const gridColumns = String(1 + supportedLanguages.length);

    const handleInputChange = (itemId: string, fieldName: string, value: string) => {
      if (onItemChange) {
        onItemChange(sectionKey, itemId, fieldName, value);
      }
    };

    const content = (
      <Box className={`product-translation-section ${className}`}>
        <AdminSection
          title={title}
          description={description}
          variant="border-solid"
          hasError={hasError || statusType === 'error'}
        >
          {items.map((item) => (
            <Box key={item.id} className="translation-item">
              <Grid columns={gridColumns} gap="3" align="center">
                {/* Base name (readonly) */}
                <FieldWrapper label=" ">
                  <TextField.Root
                    value={item.name}
                    readOnly
                    variant="soft"
                    color="gray"
                    size="3"
                    className="key-field"
                    style={{ pointerEvents: 'none', userSelect: 'none' }}
                  />
                </FieldWrapper>

                {/* Dynamic language fields */}
                {supportedLanguages.map((language) => {
                  const fieldName = getLanguageFieldName(language.isoCode);
                  const value = item[fieldName] || '';

                  return (
                    <FieldWrapper key={language.isoCode} label={language.displayName}>
                      <TextField.Root
                        value={value}
                        onChange={(e) => handleInputChange(item.id, fieldName, e.target.value)}
                        placeholder={t('ui.forms.placeholders.enterText')}
                        size="3"
                        className="translation-field"
                      />
                    </FieldWrapper>
                  );
                })}
              </Grid>
            </Box>
          ))}
          {isFormMode ? (
            <Flex justify="between" align="center" mt="6" gap="2">
              <Flex>
                {statusMessage && (
                  <Text
                    weight="bold"
                    size="3"
                    style={{ textTransform: 'capitalize' }}
                    color={statusType === 'error' ? 'red' : 'green'}
                  >
                    {statusMessage}
                  </Text>
                )}
              </Flex>
              <Flex justify="end" gap="3">
                <Button
                  type="button"
                  variant="outline"
                  color="warning"
                  onClick={handleReset}
                  disabled={!dirty || isSaving}
                >
                  {t('ui.buttons.reset')}
                </Button>
                <Button type="submit" variant="solid" color="success" disabled={!dirty || isSaving}>
                  {isSaving ? t('ui.states.saving') : t('ui.buttons.save')}
                </Button>
              </Flex>
            </Flex>
          ) : null}
        </AdminSection>
      </Box>
    );

    // Wrap in form if form mode is enabled
    if (isFormMode) {
      return (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleSubmit();
          }}
        >
          {content}
        </form>
      );
    }

    return content;
  },
);

ProductTranslationSectionForm.displayName = 'ProductTranslationSectionForm';
