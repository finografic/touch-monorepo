import React from 'react';
import { useTranslation } from 'react-i18next';

import { UiLabelSection } from 'admin/components/UiLabelsSection/UiLabelSection';

import { AdminPageLayout } from '../..';
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
    <AdminPageLayout
      title={t('admin.title')}
      subtitle="UI Labels / Translations"
      isLoading={isLoading}
      styles={styles}
    >
      {sections.map((section) => (
        <UiLabelSection
          key={section.key}
          sectionKey={section.key}
          title={section.title}
          description={section.description}
          items={section.items}
          supportedLanguages={supportedLanguages}
          onItemChange={handleValueChange}
          onReset={() => resetSection(section.key)}
          onSave={() => saveSection(section.key)}
          isDirty={isSectionDirty(section.key)}
        />
      ))}
    </AdminPageLayout>
  );
};
