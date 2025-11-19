import React from 'react';
import { useTranslation } from 'react-i18next';

import { AdminPageLayout } from '../..';
import { UiSectionFormCard } from './components/UiSectionFormCard';
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
        <UiSectionFormCard
          key={section.key}
          section={section}
          supportedLanguages={supportedLanguages}
          onValueChange={handleValueChange}
          onReset={() => resetSection(section.key)}
          onSave={() => saveSection(section.key)}
          isDirty={isSectionDirty(section.key)}
        />
      ))}
    </AdminPageLayout>
  );
};
