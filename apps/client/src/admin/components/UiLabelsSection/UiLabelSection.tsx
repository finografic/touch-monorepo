import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Flex, Grid, Heading, Text, TextField } from '@radix-ui/themes';
import { AdminSection } from 'admin/components/AdminSection/AdminSection';
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
  className?: string;
}

export const UiLabelSection: React.FC<UiLabelSectionProps> = memo(
  ({ title, description, items, supportedLanguages, onItemChange, readOnly = false, className = '' }) => {
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
        <AdminSection title={title} description={description} variant="border-solid">
          {/* Data rows - similar to TranslationSection */}
          <Flex direction="column" gap="4" className="labels-grid-content">
            {items.map((item) => (
              <Box key={item.key} className="translation-item">
                <Grid columns={gridColumns} gap="3" align="center">
                  {/* Key column (readonly) */}
                  <Box>
                    <Text size="1" weight="medium" color="gray" mb="1">
                      {t('ui.forms.labels.name')}
                    </Text>
                    <TextField.Root
                      value={item.key}
                      readOnly
                      variant="soft"
                      color="gray"
                      size="3"
                      className="key-field"
                    />
                  </Box>

                  {/* Language value columns */}
                  {supportedLanguages.map((language) => (
                    <Box key={language.isoCode}>
                      <Text size="1" weight="medium" mb="1">
                        {language.displayName}
                      </Text>
                      <TextField.Root
                        value={item.values[language.isoCode] || ''}
                        onChange={(e) => handleInputChange(item.key, language.isoCode, e.target.value)}
                        placeholder={t('ui.forms.placeholders.enterText')}
                        readOnly={readOnly}
                        size="3"
                        className="translation-field"
                      />
                    </Box>
                  ))}
                </Grid>
              </Box>
            ))}
          </Flex>
        </AdminSection>
      </Box>
    );
  },
);

UiLabelSection.displayName = 'UiLabelSection';
