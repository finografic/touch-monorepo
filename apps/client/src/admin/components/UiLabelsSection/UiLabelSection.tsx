import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Flex, Grid, Heading, Text, TextField } from '@radix-ui/themes';
import { AdminSection } from 'admin/components/AdminSection/AdminSection';
import { FieldWrapper } from 'forms/FieldWrapper';
import { SectionHeader } from 'components/SectionHeader/SectionHeader';

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
  onItemChange?: (itemKey: string, languageCode: string, value: string) => void;
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
    onItemChange,
    readOnly = false,
    hasError = false,
    className = '',
    children,
  }) => {
    const { t } = useTranslation();

    // Calculate grid columns based on number of languages (key + languages)
    const gridColumns = String(1 + supportedLanguages.length);

    const handleInputChange = (itemKey: string, languageCode: string, value: string) => {
      if (onItemChange && !readOnly) {
        onItemChange(itemKey, languageCode, value);
      }
    };

    return (
      <Box className={`ui-label-section ${className}`} css={styles}>
        <AdminSection title={title} description={description} variant="border-solid" hasError={hasError}>
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
          {children}
        </AdminSection>
      </Box>
    );
  },
);

UiLabelSection.displayName = 'UiLabelSection';
