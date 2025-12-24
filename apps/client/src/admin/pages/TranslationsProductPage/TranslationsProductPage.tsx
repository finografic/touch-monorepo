import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Flex, Spinner, Tabs, Text } from '@radix-ui/themes';

import { AdminPageLayout, AdminSection } from '../..';

import { useProductTranslationData } from './hooks/useProductTranslationData';
import { useSaveProductTranslations } from './hooks/useSaveProductTranslations';
import { useDeleteProductTranslation } from './hooks/useDeleteProductTranslation';
import { TranslationsTable } from './TranslationsTable';
import type { SectionKey } from './translationsProduct.types';
import { styles } from '../TranslationPages/TranslationsPage.styles';
import { TranslationsTableExpandable } from './TranslationsTable';
import { invalidateReferenceDataQueries } from 'queries/invalidateReferenceData';
import { useQueryClient } from '@tanstack/react-query';

const TABS_SORT_ORDER: readonly SectionKey[] = [
  'drinkTypes',
  'drinkSubtypes',
  'volumes',
  'containerTypes',
] as const;

export const TranslationsProductPage: React.FC = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { isLoading, supportedLanguages, sections } = useProductTranslationData({
    domain: 'product',
    groups: [...TABS_SORT_ORDER],
  });

  const sortedSections = useMemo(() => {
    const order = new Map<SectionKey, number>(TABS_SORT_ORDER.map((key, idx) => [key, idx]));
    return [...sections].sort((a, b) => {
      const aOrder = order.get(a.group) ?? Number.MAX_SAFE_INTEGER;
      const bOrder = order.get(b.group) ?? Number.MAX_SAFE_INTEGER;
      return aOrder - bOrder;
    });
  }, [sections]);

  const [activeTab, setActiveTab] = useState<SectionKey>(
    (sortedSections[0]?.group as SectionKey) ?? 'drinkTypes',
  );

  useEffect(() => {
    if (!sortedSections.find((section) => section.group === activeTab)) {
      const fallback = sortedSections[0]?.group;
      if (fallback) {
        setActiveTab(fallback);
      }
    }
  }, [activeTab, sortedSections]);

  const activeSection = useMemo(
    () => sections.find((section) => section.group === activeTab),
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
    >
      <Tabs.Root value={activeTab} onValueChange={(value) => setActiveTab(value as SectionKey)}>
        <Tabs.List>
          {sortedSections.map((section) => (
            <Tabs.Trigger key={section.group} value={section.group}>
              {t(`admin.pages.translations.tabs.${section.group}`, { defaultValue: section.group })}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        {sortedSections.map((section) => (
          <Tabs.Content key={section.group} value={section.group}>
            <AdminSection title={t(section.title)} description={t(section.description)}>
              {section.group === 'drinkSubtypes' ? (
                <TranslationsTableExpandable
                  sectionKey={section.group}
                  items={section.items}
                  supportedLanguages={supportedLanguages}
                  onSave={async ({ items }) => {
                    const result = await save({ items });
                    return result; // 🔑 REQUIRED
                  }}
                  onDelete={async (itemId, drinkTypeId) => {
                    const result = await deleteItem(itemId, drinkTypeId);
                    await invalidateReferenceDataQueries(queryClient);
                    return {
                      success: true,
                      deletedId: result?.deletedId,
                    };
                  }}
                  isSaving={isSaving}
                  isDeleting={isDeleting}
                />
              ) : (
                <TranslationsTable
                  sectionKey={section.group}
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
              )}
            </AdminSection>
          </Tabs.Content>
        ))}
      </Tabs.Root>
    </AdminPageLayout>
  );
};
