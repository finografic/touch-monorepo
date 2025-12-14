import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Flex, Spinner, Tabs, Text } from '@radix-ui/themes';

import { AdminPageLayout, AdminSection } from '../..';

import { useProductTranslationData } from './hooks/useProductTranslationData';
import { useSaveProductTranslations } from './hooks/useSaveProductTranslations';
import { useDeleteProductTranslation } from './hooks/useDeleteProductTranslation';
import { TranslationsTable } from './TranslationsTable';
import type { SectionKey } from './translations.types';
import { styles } from './TranslationsPage.styles';
import { invalidateReferenceDataQueries } from 'queries/invalidateReferenceData';
import { useQueryClient } from '@tanstack/react-query';

export const TranslationsPage: React.FC = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { isLoading, supportedLanguages, sections } = useProductTranslationData();

  const [activeTab, setActiveTab] = useState<SectionKey>('drinkTypes');

  const activeSection = useMemo(
    () => sections.find((section) => section.key === activeTab),
    [sections, activeTab],
  );

  // mutations
  const { save, isLoading: isSaving } = useSaveProductTranslations(activeTab, supportedLanguages);
  const { deleteItem, isDeleting } = useDeleteProductTranslation(activeTab);

  if (isLoading || isSaving || isDeleting || !activeSection) {
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
      // isLoading={isLoading || isSaving || isDeleting}
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
                  await invalidateReferenceDataQueries(queryClient);
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
