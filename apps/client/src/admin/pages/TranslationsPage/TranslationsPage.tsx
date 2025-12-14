import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Flex, Spinner, Text } from '@radix-ui/themes';

import { AdminPageLayout, AdminSection } from '../..';

import { useUiTranslationData } from './hooks/useUiTranslationData';
import { useSaveUiTranslations } from './hooks/useSaveUiTranslations';
import { useDeleteUiTranslation } from './hooks/useDeleteUiTranslation';
import { TranslationsTable } from './TranslationsTable';
import { styles } from './TranslationsPage.styles';

export const TranslationsPage: React.FC = () => {
  const { t } = useTranslation();

  const { isLoading, supportedLanguages, sections } = useUiTranslationData();

  const activeSection = useMemo(() => sections[0], [sections]);

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
      <AdminSection title={t(activeSection.title)} description={t(activeSection.description)}>
        <TranslationsTable
          sectionKey={activeSection.key}
          items={activeSection.items}
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
    </AdminPageLayout>
  );
};
