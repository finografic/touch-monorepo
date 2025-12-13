import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Flex, Spinner, Tabs, Text } from '@radix-ui/themes';

import { AdminPageLayout, AdminSection } from '../..';

import { useProductTranslationData } from './hooks/useProductTranslationData';
import { ProductTranslationsTable } from './ProductTranslationsTable/ProductTranslationsTable';
import type { SectionKey } from './TranslationsPage.types';
import { styles } from './TranslationsProductPage.styles';

export const TranslationsProductPage: React.FC = () => {
  const { t } = useTranslation();

  const { isLoading, supportedLanguages, sections } = useProductTranslationData();

  const [activeTab, setActiveTab] = useState<SectionKey>('drinkTypes');

  const activeSection = useMemo(
    () => sections.find((section) => section.key === activeTab),
    [sections, activeTab],
  );

  if (isLoading || !activeSection) {
    return (
      <AdminPageLayout
        title={t('admin.pages.translations.content.editTables')}
        subtitle="Admin"
        description="Manage product translations"
        styles={styles}
      >
        <Flex direction="column" gap="4" align="center" justify="center" p="6">
          <Spinner size="3" />
          <Text>Loading translations...</Text>
        </Flex>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout
      title={t('admin.pages.translations.content.editTables')}
      subtitle="Admin"
      styles={styles}
    >
      <Tabs.Root value={activeTab} onValueChange={(value) => setActiveTab(value as SectionKey)}>
        <Tabs.List>
          <Tabs.Trigger value="drinkTypes">
            {t('admin.pages.translations.content.drinkTypes.title')}
          </Tabs.Trigger>
          <Tabs.Trigger value="drinkSubtypes">
            {t('admin.pages.translations.content.drinkSubtypes.title')}
          </Tabs.Trigger>
          <Tabs.Trigger value="volumes">{t('admin.pages.translations.content.volumes.title')}</Tabs.Trigger>
          <Tabs.Trigger value="containerTypes">
            {t('admin.pages.translations.content.containerTypes.title')}
          </Tabs.Trigger>
        </Tabs.List>

        {sections.map((section) => (
          <Tabs.Content key={section.key} value={section.key}>
            <AdminSection title={t(section.title)} description={t(section.description)}>
              <ProductTranslationsTable
                sectionKey={section.key}
                items={section.items}
                supportedLanguages={supportedLanguages}
                /* onSave will be added later */
              />
            </AdminSection>
          </Tabs.Content>
        ))}
      </Tabs.Root>
    </AdminPageLayout>
  );
};
