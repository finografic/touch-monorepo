import React from 'react';
import { useTranslation } from 'react-i18next';

import { Flex, Text } from '@radix-ui/themes';
import { UiLabelSection } from 'admin/components/UiLabelsSection/UiLabelSection';
import { useUiSectionForm } from 'admin/pages/TranslationsUiPage/hooks/useUiSectionForm';
import type {
  SupportedLanguage,
  UiLabelSectionData,
} from 'admin/pages/TranslationsUiPage/TranslationsUiPage.types';
import { Button } from 'components/Button';

interface UiSectionFormCardProps {
  section: UiLabelSectionData;
  supportedLanguages: SupportedLanguage[];
  onValueChange: (sectionKey: string, itemKey: string, languageCode: string, value: string) => void;
  onReset: () => void;
  onSave: () => Promise<any>;
  isDirty: boolean;
}

export const UiSectionFormCard: React.FC<UiSectionFormCardProps> = ({
  section,
  supportedLanguages,
  onValueChange,
  onReset,
  onSave,
  isDirty,
}) => {
  const { t } = useTranslation();

  const {
    handleReset,
    handleSubmit,
    isDirty: dirty,
    isSaving,
    statusMessage,
    statusType,
  } = useUiSectionForm({
    sectionKey: section.key,
    isDirty,
    onReset,
    onSubmit: onSave,
  });

  const handleSectionChange = (itemKey: string, languageCode: string, value: string) => {
    onValueChange(section.key, itemKey, languageCode, value);
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        handleSubmit();
      }}
    >
      <UiLabelSection
        title={section.title}
        description={section.description}
        items={section.items}
        supportedLanguages={supportedLanguages}
        onItemChange={handleSectionChange}
      >
        <Flex justify="end" align="center" mt="6" gap="2">
          {statusMessage && (
            <Text color={statusType === 'error' ? 'red' : 'green'} size="2">
              {statusMessage}
            </Text>
          )}
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
      </UiLabelSection>
    </form>
  );
};
