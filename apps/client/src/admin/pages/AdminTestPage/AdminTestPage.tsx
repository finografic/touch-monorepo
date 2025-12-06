import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Flex, Spinner, Tabs, Text } from '@radix-ui/themes';
import { useToast } from 'components/Toast';

import { AdminPageLayout, AdminSection } from '../..';
import { useProductTranslationSections } from '../TranslationsProductPage/hooks/useProductTranslationSections';
import { ProductTranslationsTable } from './ProductTranslationsTable/ProductTranslationsTable';
import { styles } from './AdminTestPage.styles';

type SectionKey = 'drinkSubtypes' | 'volumes' | 'drinkTypes' | 'containerTypes';

export const AdminTestPage: React.FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();

  const {
    sections,
    supportedLanguages,
    isLoading,
    handleValueChange,
    resetSection,
    saveSection,
    isSectionDirty,
    addNewItem,
  } = useProductTranslationSections();

  const [activeTab, setActiveTab] = useState<SectionKey>('drinkTypes');

  // Get the active section based on the selected tab
  const activeSection = useMemo(() => {
    return sections.find((section) => section.key === activeTab);
  }, [sections, activeTab]);

  const handleItemChange = useCallback(
    (itemId: string, fieldName: string, value: string) => {
      handleValueChange(activeTab, itemId, fieldName, value);
    },
    [activeTab, handleValueChange],
  );

  const handleSave = useCallback(async () => {
    try {
      const result = await saveSection(activeTab);
      toast({
        variant: 'success',
        message: result.message || 'Changes saved successfully',
      });
    } catch (error) {
      console.error('Failed to save translations:', error);
      toast({
        variant: 'error',
        message: 'Failed to save translations',
        subText: 'Please try again',
      });
    }
  }, [activeTab, saveSection, toast]);

  const handleReset = useCallback(() => {
    resetSection(activeTab);
    toast({
      variant: 'info',
      message: 'Changes reset',
    });
  }, [activeTab, resetSection, toast]);

  const handleAddNew = useCallback(() => {
    addNewItem(activeTab);
  }, [activeTab, addNewItem]);

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
      description="Manage product translations"
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
            <AdminSection
              title={t(section.title)}
              description={t(section.description)}
              variant="border-solid"
            >
              <ProductTranslationsTable
                sectionKey={section.key}
                items={section.items}
                supportedLanguages={supportedLanguages}
                onItemChange={handleItemChange}
                onAddNew={handleAddNew}
                onSave={handleSave}
                onReset={handleReset}
                isDirty={isSectionDirty(section.key)}
              />
            </AdminSection>
          </Tabs.Content>
        ))}
      </Tabs.Root>
    </AdminPageLayout>
  );
};
