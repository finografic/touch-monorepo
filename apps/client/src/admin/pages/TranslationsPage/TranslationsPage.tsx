import React, { useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Flex, Spinner, Tabs, Text } from '@radix-ui/themes';

import { AdminPageLayout, AdminSection } from '../..';

import { useGetTranslations } from './hooks/useGetTranslations';
import { useSaveTranslations } from './hooks/useSaveTranslations';
import { useDeleteTranslations } from './hooks/useDeleteTranslations';
import { TranslationsTable } from './TranslationsTable';
import type { I18nTranslationsDomain } from '@workspace/i18n/types';
import type { I18nDomainGroupKey } from './translations.types';
import { styles } from './TranslationsPage.styles';
import { useParams } from 'react-router-dom';
import { translations } from '@workspace/i18n';
import { flattenTranslations } from 'utils/flatten-translations';

export const TranslationsPage: React.FC = () => {
  const { t } = useTranslation();
  const { domain } = useParams<{ domain: I18nTranslationsDomain }>();

  const groups = [...new Set(flattenTranslations(domain, translations).map(({ key }) => key.split('.')[1]))];
  log('translations:', 'lime', domain);

  const [activeTab, setActiveTab] = useState<I18nDomainGroupKey>(() => groups[0]);
  const { isLoading, supportedLanguages, sections } = useGetTranslations({ domain, groups });

  useEffect(
    function updateActiveTab() {
      if (groups && groups.length > 0 && !groups.includes(activeTab)) {
        setActiveTab(groups[0] as I18nDomainGroupKey);
      }
    },
    [groups, activeTab],
  );

  const activeSection = useMemo(
    () => sections.find((section) => section.group === activeTab),
    [sections, activeTab],
  );

  // mutations
  const { save, isLoading: isSaving } = useSaveTranslations({ domain, supportedLanguages });
  const { deleteItem, isDeleting } = useDeleteTranslations({ domain });

  // const domainKey = domain.charAt(0).toUpperCase() + domain.slice(1);
  // const pageTitleKey = `admin.pages.translations${domainKey}.content.editTables`;
  const pageTitleKey = `admin.pages.translations.domains.${domain}.title`;

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
    <AdminPageLayout title={t(pageTitleKey)} styles={styles}>
      <Tabs.Root value={activeTab} onValueChange={(value) => setActiveTab(value as I18nDomainGroupKey)}>
        <Tabs.List>
          {sections.map((section) => (
            <Tabs.Trigger key={section.group} value={section.group}>
              {section.group}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        {sections.map((section) => (
          <Tabs.Content key={section.group} value={section.group}>
            <AdminSection title={section.title} description={t(section.description)}>
              <TranslationsTable
                group={section.group}
                items={section.items}
                supportedLanguages={supportedLanguages}
                domain={domain}
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
