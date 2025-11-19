import React from 'react';
import { useTranslation } from 'react-i18next';

import { SectionedTranslationPage } from 'admin/components/SectionedTranslationPage';

import { ProductTranslationSectionForm } from './components/ProductTranslationSectionForm';
import { useProductTranslationSections } from './hooks/useProductTranslationSections';
import { styles } from './TranslationsProductPage.styles';

export const TranslationsProductPage: React.FC = () => {
  const { t } = useTranslation();
  const {
    sections,
    supportedLanguages,
    isLoading,
    handleValueChange,
    resetSection,
    saveSection,
    isSectionDirty,
  } = useProductTranslationSections();

  return (
    <SectionedTranslationPage
      subtitle={t('admin.pages.translations.content.editTables')}
      sections={sections}
      supportedLanguages={supportedLanguages}
      isLoading={isLoading}
      handleValueChange={handleValueChange}
      resetSection={resetSection}
      saveSection={saveSection}
      isSectionDirty={isSectionDirty}
      renderSection={(props) => (
        <ProductTranslationSectionForm
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
