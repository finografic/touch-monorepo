import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Flex, Spinner, Tabs, Text } from '@radix-ui/themes';

import { AdminPageLayout, AdminSection } from '../..';

import { useUiTranslationData } from './hooks/useUiTranslationData';
import { useSaveUiTranslations } from './hooks/useSaveUiTranslations';
import { useDeleteUiTranslation } from './hooks/useDeleteUiTranslation';
import { TranslationsTable } from './TranslationsTable';
import type { SectionKey } from './translations.types';
import { styles } from './TranslationsPage.styles';

export const TranslationsPage: React.FC = () => {
  const { t } = useTranslation();

  const { isLoading, supportedLanguages, sections } = useUiTranslationData();

  const [activeTab, setActiveTab] = useState<SectionKey>('buttons');

  const activeSection = useMemo(
    () => sections.find((section) => section.key === activeTab),
    [sections, activeTab],
  );

  // mutations
  const { save, isLoading: isSaving } = useSaveUiTranslations(supportedLanguages);
  const { deleteItem, isDeleting } = useDeleteUiTranslation();

  if (isLoading || isSaving || isDeleting || !activeSection) {
    return (
      <AdminPageLayout
        title={t('admin.pages.translationsUi.content.editTables')}
        subtitle="Admin"
        description="Manage UI translations"
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
      title={t('admin.pages.translationsUi.content.editTables')}
      subtitle="Admin"
      styles={styles}
    >
      <Tabs.Root value={activeTab} onValueChange={(value) => setActiveTab(value as SectionKey)}>
        <Tabs.List>
          <Tabs.Trigger value="buttons">{t('admin.pages.translationsUi.content.buttons.title')}</Tabs.Trigger>
          <Tabs.Trigger value="tables">{t('admin.pages.translationsUi.content.tables.title')}</Tabs.Trigger>
          <Tabs.Trigger value="time">{t('admin.pages.translationsUi.content.time.title')}</Tabs.Trigger>
        </Tabs.List>

        {sections.map((section) => (
          <Tabs.Content key={section.key} value={section.key}>
            <AdminSection title={t(section.title)} description={t(section.description)}>
              <TranslationsTable
                sectionKey={section.key}
                items={section.items}
                supportedLanguages={supportedLanguages}
                onSave={async ({ items }) => {
                  const result = await save({ items });
                  return result; // 🔑 REQUIRED
                }}
                onDelete={async (itemId) => {
                  const result = await deleteItem(itemId);
                  return {
                    success: true,
                    deletedId: result?.deletedId,
                  };
                }}
                isSaving={isSaving}
                isDeleting={isDeleting}
              />
            </AdminSection>
          </Tabs.Content>
        ))}
      </Tabs.Root>
    </AdminPageLayout>
  );
};
