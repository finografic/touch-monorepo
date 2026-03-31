import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Spinner, Tabs } from '@finografic/design-system/components';
import { translations } from '@workspace/i18n';
import type { I18nTranslationsDomain } from '@workspace/i18n/types';

import { AdminPageLayout, AdminSection } from 'admin/components';
import { DEFAULT_SHOW_KEY_COLUMN } from 'admin/pages/Translations/shared/constants/translationsTable.constants';
import { Flex } from 'styled-system/jsx';

import { flattenTranslations } from 'utils/flatten-translations';
import type { I18nDomainGroupKey } from '../shared/types/translations.types';
import { useDeleteTranslations } from './hooks/useDeleteTranslations';
import { useGetTranslations } from './hooks/useGetTranslations';
import { useSaveTranslations } from './hooks/useSaveTranslations';
import { splitPagesIntoTopLevelSections } from './utils/page-sections.utils';
import { TranslationsTable } from './TranslationsTable';
import { styles } from '../shared/styles/TranslationsPage.styles';
import { translationsTabLabel } from 'admin/pages/Translations/TranslationsPage/utils/tabs.utils';

export const TranslationsPage: React.FC = () => {
  const { t } = useTranslation();
  const { domain } = useParams<{ domain: I18nTranslationsDomain }>();
  const pageTitleKey = `admin.pages.translations.domains.${domain}.title`;

  // Extract groups and deduplicate
  const groups = [
    ...new Set(flattenTranslations(domain, translations).map(({ key }) => key.split('.')[1])),
  ];
  const [activeTab, setActiveTab] = useState<I18nDomainGroupKey>();
  const [showKeyColumn, setShowKeyColumn] = useState<boolean>(DEFAULT_SHOW_KEY_COLUMN);

  const { isLoading, supportedLanguages, sections: sectionsRaw } = useGetTranslations({
    domain,
    groups,
  });

  const sections = useMemo(
    () => splitPagesIntoTopLevelSections(sectionsRaw, domain),
    [sectionsRaw, domain],
  );

  useEffect(
    function updateActiveTab() {
      if (
        sections.length > 0 && !sections.some((section) => section.group === activeTab)
      ) {
        setActiveTab(sections[0].group as I18nDomainGroupKey);
      }
    },
    [sections, activeTab],
  );

  const activeSection = useMemo(
    () => sections.find((section) => section.group === activeTab),
    [sections, activeTab],
  );

  const { save, isLoading: isSaving } = useSaveTranslations({ domain, supportedLanguages });
  const { deleteItem, isDeleting } = useDeleteTranslations({ domain });

  if (isLoading || sections.length === 0 || !activeSection) {
    return (
      <AdminPageLayout
        title={t(pageTitleKey)}
        subtitle="Admin"
        description={`Manage ${domain} translations`}
        styles={styles}
      >
        <Flex direction="column" gap={4} align="center" justify="center" p={6}>
          <Spinner />
          <span>Loading translations...</span>
        </Flex>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout title={t(pageTitleKey)} styles={styles}>
      <Tabs.Root
        value={activeTab}
        variant="line"
        onValueChange={(details) => setActiveTab(details.value as I18nDomainGroupKey)}
      >
        <Tabs.List>
          {sections.map((section) => (
            <Tabs.Trigger key={section.group} value={section.group}>
              {translationsTabLabel(section, t)}
            </Tabs.Trigger>
          ))}
          <Tabs.Indicator />
        </Tabs.List>
        {sections.map((section) => (
          <Tabs.Content key={section.group} value={section.group}>
            <AdminSection title={section.title} description={t(section.description)}>
              <TranslationsTable
                domain={domain}
                group={section.group}
                items={section.items}
                supportedLanguages={supportedLanguages}
                userRole={section.group === 'pages_admin'
                  ? { display: true, default: 'admin' }
                  : section.group === 'pages_public'
                  ? { display: true }
                  : undefined}
                canAddNew={false}
                onSave={async ({ items }) => await save({ items })}
                onDelete={async (itemId) => {
                  const result = await deleteItem(itemId);
                  return { success: true, deletedId: result?.deletedId };
                }}
                isSaving={isSaving}
                isDeleting={isDeleting}
                showKeyColumn={showKeyColumn}
                setShowKeyColumn={() => setShowKeyColumn(!showKeyColumn)}
              />
            </AdminSection>
          </Tabs.Content>
        ))}
      </Tabs.Root>
    </AdminPageLayout>
  );
};
