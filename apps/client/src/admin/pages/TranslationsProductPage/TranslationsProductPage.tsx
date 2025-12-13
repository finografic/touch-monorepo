import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Flex, Spinner, Tabs, Text } from '@radix-ui/themes';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from 'components/Toast';
import { invalidateReferenceDataQueries } from 'queries/invalidateReferenceData';
import { GET_ORDERS_READABLE_QUERYKEY } from 'queries/orders';
import type { RegionLocale } from '@workspace/config/i18n.config';
import { AdminPageLayout, AdminSection } from '../..';
import { useProductTranslationSections } from './hooks/useProductTranslationSections';
import { ProductTranslationsTable } from './ProductTranslationsTable/ProductTranslationsTable';
import { ProductTranslationsTableExpandable } from './ProductTranslationsTable/ProductTranslationsTableExpandable';
import { styles } from './TranslationsProductPage.styles';
import type { LanguageInfo } from '@workspace/i18n';

type SectionKey = 'drinkSubtypes' | 'volumes' | 'drinkTypes' | 'containerTypes';

export const TranslationsProductPage: React.FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Callback for additional processes after deletion
  const handleDeleteCallback = useCallback(
    async (context: { sectionKey: SectionKey; itemId: string; drinkTypeId?: string; itemName?: string }) => {
      // TODO: Add your additional cleanup/processes here
      // Examples:
      // - Clean up related data in other tables
      // - Update other caches
      // - Send notifications
      // - Audit logging
      // - Cascading deletes for related entities

      console.log('Delete callback executed:', context);

      // Example: If deleting a drink type, you might want to handle subtypes cleanup
      // (though DB cascade should handle this, you might need UI updates)
      if (context.sectionKey === 'drinkTypes') {
        // Additional processes for drink type deletion
        // e.g., invalidate related queries, update UI state, etc.
      }

      // Invalidate orders-readable query since orders reference drink types, subtypes, volumes, and container types
      // When these are deleted, any orders using them need to be refreshed
      await queryClient.invalidateQueries({ queryKey: GET_ORDERS_READABLE_QUERYKEY });

      // Also invalidate reference data used by product flow dropdowns
      await invalidateReferenceDataQueries(queryClient);
    },
    [queryClient],
  );

  const {
    sections,
    initialSections,
    supportedLanguages: supportedLanguagesData,
    isLoading,
    handleValueChange,
    resetSection,
    saveSection,
    isSectionDirty,
    addNewItem,
    deleteItem,
    deleteItemImmediate,
    updateSectionItems,
  } = useProductTranslationSections({
    onDeleteCallback: handleDeleteCallback,
  });

  const supportedLanguages = useMemo(() => {
    if (!isLoading && !supportedLanguagesData) return [] as RegionLocale[];
    return (
      supportedLanguagesData ? supportedLanguagesData.map((lang) => lang.isoCode) : []
    ) as RegionLocale[];
  }, [supportedLanguagesData]);

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

  // Handler for RHF-based table to update section state before saving
  const handleRHFSave = useCallback(
    async (sectionKey: SectionKey, items: any[]) => {
      try {
        // Update the section state with the new items (synchronous)
        updateSectionItems(sectionKey, items);

        // Small delay to ensure state is updated before save
        await new Promise((resolve) => setTimeout(resolve, 50));

        // Then save via the hook (this makes the API call)
        const result = await saveSection(sectionKey);
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
    },
    [updateSectionItems, saveSection, toast],
  );

  const handleAddNew = useCallback(
    (drinkTypeIdForSubtype?: string) => {
      addNewItem(activeTab, drinkTypeIdForSubtype);
    },
    [activeTab, addNewItem],
  );

  const handleDelete = useCallback(
    (itemId: string) => {
      deleteItem(activeTab, itemId);
    },
    [activeTab, deleteItem],
  );

  const handleDeleteImmediate = useCallback(
    async (itemId: string, drinkTypeId?: string) => {
      await deleteItemImmediate(activeTab, itemId, drinkTypeId);
      toast({
        variant: 'success',
        message: 'Item deleted',
      });
    },
    [activeTab, deleteItemImmediate, toast],
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
              {section.key === 'drinkSubtypes' ? (
                <ProductTranslationsTableExpandable
                  sectionKey={section.key}
                  items={section.items}
                  initialItems={initialSections.find((s) => s.key === section.key)?.items || []}
                  supportedLanguages={supportedLanguages}
                  onItemChange={handleItemChange}
                  onAddNew={handleAddNew}
                  onSave={handleSave}
                  onReset={handleReset}
                  onDelete={handleDelete}
                  onDeleteImmediate={handleDeleteImmediate}
                  isDirty={isSectionDirty(section.key)}
                />
              ) : (
                <ProductTranslationsTable
                  sectionKey={section.key}
                  items={section.items}
                  supportedLanguages={supportedLanguages}
                  onSave={async ({ sectionKey, items }) => {
                    await handleRHFSave(sectionKey as SectionKey, items);
                  }}
                />
              )}
            </AdminSection>
          </Tabs.Content>
        ))}
      </Tabs.Root>
    </AdminPageLayout>
  );
};
