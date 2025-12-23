import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { useDebouncedCallback } from 'use-debounce';
import { Flex } from '@radix-ui/themes';
import createCuid from '@bugsnag/cuid';
import { TranslationsRow } from './components/TranslationsRow';
import { PageDividerRow } from './components/PageDividerRow';
import { TableFormButtons } from '../TableFormButtons/TableFormButtons';
import { styles } from './TranslationsTable.styles';
import { useTranslationsTableForm } from './hooks/useTranslationsTableForm';
import { useTranslationsTableHandlers } from './hooks/useTranslationsTableHandlers';

import type { RegionLocale } from '@workspace/config/i18n.config';
import type { TranslationsFormItem } from '../translations.types';
import type { I18nTranslationsDomain } from '@workspace/i18n/types';

interface TranslationsTableProps {
  group: string;
  items: TranslationsFormItem[];
  supportedLanguages: RegionLocale[];
  domain?: I18nTranslationsDomain;
  onSave?: ({ items }: { items: TranslationsFormItem[] }) => Promise<{ savedItems: TranslationsFormItem[] }>;
  onDelete?: (itemId: string) => Promise<{ success: boolean; deletedId: string }>;
  isSaving?: boolean;
  isDeleting?: boolean;
}

export const TranslationsTable: React.FC<TranslationsTableProps> = ({
  group,
  items,
  supportedLanguages,
  domain,
  onSave,
  onDelete,
  isSaving = false,
  isDeleting = false,
}) => {
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);

  // ======================================================================== //
  // Shared Form Logic
  // ======================================================================== //

  const {
    methods,
    fields,
    remove,
    append,
    watchedItems,
    languageKeys,
    hasEmptyRow,
    isDirtyLastItem,
    isItemEmpty,
  } = useTranslationsTableForm({ items, supportedLanguages });

  log('group:', 'lime', group);
  // Track initial items for DELETE detection
  const initialItemsRef = useRef<TranslationsFormItem[]>(items);
  useEffect(() => {
    initialItemsRef.current = items;
  }, [items]);

  // Group items by page when group is 'pages'
  // Keys are in format: domain.pages.{pageName}.{rest}
  // We extract {pageName} to group items and track which field indices belong to which page
  const pageGrouping = useMemo(() => {
    if (group !== 'pages' || !domain) {
      return null; // Not a pages section, no grouping needed
    }

    // Map field index to page name
    const fieldIndexToPage = new Map<number, string>();

    items.forEach((item) => {
      // Find the corresponding field index
      const fieldIndex = fields.findIndex((field) => field.id === item.id || field.key === item.key);
      if (fieldIndex === -1) return;

      // Extract page name from key: "admin.pages.dashboard.title" -> "dashboard"
      const keyParts = item.key.split('.');
      const pagesIndex = keyParts.indexOf('pages');
      if (pagesIndex >= 0 && pagesIndex < keyParts.length - 1) {
        const pageName = keyParts[pagesIndex + 1];
        fieldIndexToPage.set(fieldIndex, pageName);
      }
    });

    return fieldIndexToPage;
  }, [group, domain, items, fields]);

  // ======================================================================== //
  // Shared Handlers
  // ======================================================================== //

  const { handleDelete, handleSave, handleReset } = useTranslationsTableHandlers({
    methods,
    watchedItems,
    remove,
    languageKeys,
    isItemEmpty,
    onSave,
    onDelete,
    initialItemsRef,
  });

  // ======================================================================== //
  // Add New Handler (table-specific)
  // ======================================================================== //

  const handleAddNewRow = useDebouncedCallback(
    () => {
      if (hasEmptyRow) return;

      append({
        id: `temp-${createCuid()}`, // temp ID, replaced on save
        key: '',
        ...Object.fromEntries(languageKeys.map((k) => [k, ''])),
      } as TranslationsFormItem);
    },
    250,
    { leading: true, trailing: false },
  );

  // ======================================================================== //
  // Render
  // ======================================================================== //

  return (
    <section css={styles} className="table-container">
      <FormProvider {...methods} formState={methods.formState}>
        <Flex justify="end" align="center" mb="4" gap="2">
          <TableFormButtons
            onReset={handleReset}
            onSave={handleSave}
            onAddNew={handleAddNewRow}
            isDirty={methods.formState.isDirty}
            isAddNewDisabled={!isDirtyLastItem}
            isSaving={isSaving}
          />
        </Flex>

        <table className="translations-table">
          <thead>
            <tr>
              <th></th>
              {supportedLanguages.map((lang) => (
                <th key={lang}>{lang}</th>
              ))}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {fields.map((field, index) => {
              const rows: React.ReactNode[] = [];

              // Insert page divider before first item of each new page group
              if (group === 'pages' && domain && pageGrouping) {
                const currentPage = pageGrouping.get(index);
                const previousPage = index > 0 ? pageGrouping.get(index - 1) : null;

                // If this is the first item of a new page group, add a divider
                if (currentPage && currentPage !== previousPage && currentPage !== '_other') {
                  rows.push(
                    <PageDividerRow
                      key={`divider-${currentPage}-${index}`}
                      pageName={currentPage}
                      domain={domain}
                      supportedLanguages={supportedLanguages}
                    />,
                  );
                }
              }

              // Add the actual row
              rows.push(
                <TranslationsRow
                  key={field.fieldId}
                  index={index}
                  onDelete={handleDelete}
                  supportedLanguages={supportedLanguages}
                  isEditing={editingRowIndex === index}
                  onEditingChange={(isEditing) => {
                    setEditingRowIndex(isEditing ? index : null);
                  }}
                  isSaving={isSaving}
                  isDeleting={isDeleting}
                />,
              );

              return <React.Fragment key={field.fieldId}>{rows}</React.Fragment>;
            })}
          </tbody>
        </table>
      </FormProvider>
    </section>
  );
};
