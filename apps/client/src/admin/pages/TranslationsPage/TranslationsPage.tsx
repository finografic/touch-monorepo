import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Flex, Spinner, Tabs, Text } from '@radix-ui/themes';

import { AdminPageLayout, AdminSection } from '../..';

import { useGetTranslations } from './hooks/useGetTranslations';
import type { TranslationDomain } from './hooks/useGetTranslations';
import { useSaveTranslations } from './hooks/useSaveTranslations';
import { useDeleteTranslations } from './hooks/useDeleteTranslations';
import { TranslationsTable } from './TranslationsTable';
import type { SectionKey } from './translations.types';
import { styles } from './TranslationsPage.styles';

export interface TranslationsPageProps {
  domain: TranslationDomain;
  groups?: string[];
}

export const TranslationsPage: React.FC<TranslationsPageProps> = ({
  domain = 'ui',
  groups = ['buttons', 'tables', 'time'],
}) => {
  const { t } = useTranslation();

  const { isLoading, supportedLanguages, sections } = useGetTranslations({ domain, groups });

  // Initialize activeTab with first group, update when groups change
  const [activeTab, setActiveTab] = useState<SectionKey>(() => (groups?.[0] || 'buttons') as SectionKey);

  // Update activeTab when groups change or when sections become available
  React.useEffect(() => {
    if (groups && groups.length > 0 && !groups.includes(activeTab)) {
      setActiveTab(groups[0] as SectionKey);
    }
  }, [groups, activeTab]);

  const activeSection = useMemo(
    () => sections.find((section) => section.key === activeTab),
    [sections, activeTab],
  );

  // mutations
  const { save, isLoading: isSaving } = useSaveTranslations({ domain, supportedLanguages });
  const { deleteItem, isDeleting } = useDeleteTranslations({ domain });

  const domainKey = domain.charAt(0).toUpperCase() + domain.slice(1);
  const pageTitleKey = `admin.pages.translations${domainKey}.content.editTables`;

  // Show loading if: data is loading, mutations are pending, or we don't have sections yet
  if (isLoading || isSaving || isDeleting || sections.length === 0 || !activeSection) {
    return (
      <AdminPageLayout
        title={t(pageTitleKey)}
        subtitle="Admin"
        description={`Manage ${domain} translations`}
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
    <AdminPageLayout title={t(pageTitleKey)} subtitle="Admin" styles={styles}>
      <Tabs.Root value={activeTab} onValueChange={(value) => setActiveTab(value as SectionKey)}>
        <Tabs.List>
          {sections.map((section) => (
            <Tabs.Trigger key={section.key} value={section.key}>
              {t(section.title)}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        {sections.map((section) => (
          <Tabs.Content key={section.key} value={section.key}>
            <AdminSection title={t(section.title)} description={t(section.description)}>
              <TranslationsTable
                sectionKey={section.key}
                items={section.items}
                supportedLanguages={supportedLanguages}
                onSave={async ({ items }) => await save({ items })}
                onDelete={async (itemId) => {
                  const result = await deleteItem(itemId);
                  return { success: true, deletedId: result?.deletedId };
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
