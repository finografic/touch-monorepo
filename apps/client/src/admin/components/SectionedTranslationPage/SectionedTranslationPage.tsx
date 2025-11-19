import React from 'react';
import { useTranslation } from 'react-i18next';

import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';

export interface TranslationSection<TItem = any> {
  key: string;
  title: string;
  description: string;
  items: TItem[];
}

export interface SectionedTranslationPageProps<
  TItem = any,
  TLanguage = any,
  TValueChangeHandler = (sectionKey: string, itemKey: string, languageCode: string, value: string) => void,
> {
  title?: string; // Optional, defaults to t('admin.title')
  subtitle: string;
  sections: TranslationSection<TItem>[];
  supportedLanguages: TLanguage[];
  isLoading: boolean;
  handleValueChange: TValueChangeHandler;
  resetSection: (sectionKey: string) => void;
  saveSection: (sectionKey: string) => Promise<any>;
  isSectionDirty: (sectionKey: string) => boolean;
  renderSection: (props: {
    section: TranslationSection<TItem>;
    sectionKey: string;
    title: string;
    description: string;
    items: TItem[];
    supportedLanguages: TLanguage[];
    onItemChange: TValueChangeHandler;
    onReset: () => void;
    onSave: () => Promise<any>;
    isDirty: boolean;
  }) => React.ReactNode;
  styles?: any;
}

/**
 * Reusable component for translation pages with sectioned forms
 *
 * This component provides a consistent pattern for pages that:
 * - Display multiple translation sections
 * - Each section has its own form with save/reset buttons
 * - Track dirty state per section
 * - Integrate toast notifications
 *
 * Business logic remains in custom hooks, while this component
 * handles the common layout and rendering pattern.
 */
export const SectionedTranslationPage = <
  TItem = any,
  TLanguage = any,
  TValueChangeHandler = (sectionKey: string, itemKey: string, languageCode: string, value: string) => void,
>({
  title,
  subtitle,
  sections,
  supportedLanguages,
  isLoading,
  handleValueChange,
  resetSection,
  saveSection,
  isSectionDirty,
  renderSection,
  styles,
}: SectionedTranslationPageProps<TItem, TLanguage, TValueChangeHandler>) => {
  const { t } = useTranslation();

  return (
    <AdminPageLayout
      title={title || t('admin.title')}
      subtitle={subtitle}
      isLoading={isLoading}
      styles={styles}
    >
      {sections.map((section) =>
        renderSection({
          section,
          sectionKey: section.key,
          title:
            typeof section.title === 'string' && section.title.includes('.')
              ? t(section.title)
              : section.title,
          description:
            typeof section.description === 'string' && section.description.includes('.')
              ? t(section.description)
              : section.description,
          items: section.items,
          supportedLanguages,
          onItemChange: handleValueChange,
          onReset: () => resetSection(section.key),
          onSave: () => saveSection(section.key),
          isDirty: isSectionDirty(section.key),
        }),
      )}
    </AdminPageLayout>
  );
};
