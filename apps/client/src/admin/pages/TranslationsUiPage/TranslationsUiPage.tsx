import React from 'react';
import { useTranslation } from 'react-i18next';

import { SectionedTranslationPage } from 'admin/components/SectionedTranslationPage';
import { UiLabelSection } from 'admin/components/UiLabelsSection/UiLabelSection';

import { useUiLabelSections } from './hooks/useUiLabelSections';
import { styles } from './TranslationsUiPage.styles';

export const TranslationsUiPage: React.FC = () => {
  const { t } = useTranslation();
  const {
    sections,
    supportedLanguages,
    isLoading,
    handleValueChange,
    resetSection,
    saveSection,
    isSectionDirty,
  } = useUiLabelSections();

  return (
    <SectionedTranslationPage
      subtitle="UI Labels / Translations"
      sections={sections}
      supportedLanguages={supportedLanguages}
      isLoading={isLoading}
      handleValueChange={handleValueChange}
      resetSection={resetSection}
      saveSection={saveSection}
      isSectionDirty={isSectionDirty}
      renderSection={(props) => (
        <UiLabelSection
          key={props.sectionKey}
          sectionKey={props.sectionKey}
          title={props.title}
          description={props.description}
          items={props.items}
          supportedLanguages={props.supportedLanguages}
          onItemChange={props.onItemChange}
          onReset={props.onReset}
          onSave={props.onSave}
          isDirty={props.isDirty}
        />
      )}
      styles={styles}
    />
  );
};
