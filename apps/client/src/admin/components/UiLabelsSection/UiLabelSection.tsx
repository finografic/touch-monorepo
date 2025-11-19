import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Flex, Grid, Text, TextField } from '@radix-ui/themes';
import { AdminSection } from 'admin/components/AdminSection/AdminSection';
import { useUiSectionForm } from 'admin/pages/TranslationsUiPage/hooks/useUiSectionForm';
import { FieldWrapper } from 'forms/FieldWrapper';
import { Button } from 'components/Button';

import { styles } from './UiLabelSection.styles';

interface SupportedLanguage {
  isoCode: string;
  displayName: string;
  nativeName: string;
}

interface UiLabelItem {
  key: string;
  values: Record<string, string>; // languageCode -> translation
}

interface UiLabelSectionProps {
  title: string;
  description: string;
  items: UiLabelItem[];
  supportedLanguages: SupportedLanguage[];
  sectionKey: string;
  onItemChange?: (sectionKey: string, itemKey: string, languageCode: string, value: string) => void;
  onReset?: () => void;
  onSave?: () => Promise<any>;
  isDirty?: boolean;
  readOnly?: boolean;
  hasError?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const UiLabelSection: React.FC<UiLabelSectionProps> = memo(
  ({
    title,
    description,
    items,
    supportedLanguages,
    sectionKey,
    onItemChange,
    onReset,
    onSave,
    isDirty = false,
    readOnly = false,
    hasError = false,
    className = '',
    children,
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

    // Calculate grid columns based on number of languages (key + languages)
    const gridColumns = String(1 + supportedLanguages.length);

    const handleInputChange = (itemKey: string, languageCode: string, value: string) => {
      if (onItemChange && !readOnly) {
        onItemChange(sectionKey, itemKey, languageCode, value);
      }
    };

    const content = (
      <Box className={`ui-label-section ${className}`} css={styles}>
        <AdminSection
          title={title}
          description={description}
          variant="border-solid"
          hasError={hasError || statusType === 'error'}
        >
          {/* Data rows - similar to TranslationSection */}
          {items.map((item) => (
            <Box key={item.key} className="translation-item">
              <Grid columns={gridColumns} gap="3" align="center">
                {/* Key column (readonly) */}

                <FieldWrapper label=" ">
                  <TextField.Root
                    value={item.key}
                    readOnly
                    variant="soft"
                    color="gray"
                    size="3"
                    className="key-field"
                    style={{ pointerEvents: 'none', userSelect: 'none' }}
                  />
                </FieldWrapper>

                {/* Language value columns */}
                {supportedLanguages.map((language) => (
                  <FieldWrapper
                    key={language.isoCode}
                    // name={`${fieldName}.${index}.${filterKey}`}
                    label={language.displayName}
                    // error={errors?.[index]?.[filterKey] && errors[index][filterKey].message}
                  >
                    <TextField.Root
                      value={item.values[language.isoCode] || ''}
                      onChange={(e) => handleInputChange(item.key, language.isoCode, e.target.value)}
                      placeholder={t('ui.forms.placeholders.enterText')}
                      readOnly={readOnly}
                      size="3"
                      className="translation-field"
                    />
                  </FieldWrapper>
                ))}
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
          ) : (
            children
          )}
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

UiLabelSection.displayName = 'UiLabelSection';
