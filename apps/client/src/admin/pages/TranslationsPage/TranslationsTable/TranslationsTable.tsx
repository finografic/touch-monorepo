import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { useDebouncedCallback } from 'use-debounce';
import { Flex } from '@radix-ui/themes';
import createCuid from '@bugsnag/cuid';
import { TranslationsRow } from './components/TranslationsRow';
import { TableFormButtons } from '../TableFormButtons/TableFormButtons';
import { styles } from '../../TranslationsSHARED/TranslationsTable.styles';
import { useTranslationsTableForm } from './hooks/useTranslationsTableForm';
import { useTranslationsTableHandlers } from './hooks/useTranslationsTableHandlers';
import { addTranslationsGroupRow, computePageGrouping } from './components/TranslationsGroupRow';

import type { RegionLocale } from '@workspace/config/i18n.config';
import type { TranslationsFormItem } from '../../TranslationsSHARED/translations.types';
import type { I18nTranslationsDomain } from '@workspace/i18n/types';

interface TranslationsTableProps {
  domain: I18nTranslationsDomain;
  group: string;
  items: TranslationsFormItem[];
  supportedLanguages: RegionLocale[];
  onSave?: ({ items }: { items: TranslationsFormItem[] }) => Promise<{ savedItems: TranslationsFormItem[] }>;
  onDelete?: (itemId: string) => Promise<{ success: boolean; deletedId: string }>;
  isSaving?: boolean;
  isDeleting?: boolean;
}

export const TranslationsTable: React.FC<TranslationsTableProps> = ({
  domain,
  group,
  items,
  supportedLanguages,
  onSave,
  onDelete,
  isSaving = false,
  isDeleting = false,
}) => {
  const initialItemsRef = useRef<TranslationsFormItem[]>(items);
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);
  const [showKeyColumn, setShowKeyColumn] = useState<boolean>(false);
  const hasGrouping = group === 'pages' && domain;

  useEffect(
    function initialItemsState() {
      initialItemsRef.current = items;
    },
    [items],
  );

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

  // Group items by page when group is 'pages'
  // Keys are in format: domain.pages.{pageName}.{rest}
  // We extract {pageName} to group items and track which field indices belong to which page
  const pageGrouping = useMemo(() => {
    return computePageGrouping(Boolean(hasGrouping), items, fields);
  }, [hasGrouping, items, fields]);

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
            onToggleKeyColumn={() => setShowKeyColumn(!showKeyColumn)}
            isDirty={methods.formState.isDirty}
            isAddNewDisabled={!isDirtyLastItem}
            isSaving={isSaving}
          />
        </Flex>

        <table
          className={`translations-table ${showKeyColumn ? 'is-visible-key-column' : 'is-hidden-key-column'}`}
        >
          <thead>
            <tr>
              <th className="col-key"></th>
              {supportedLanguages.map((lang) => (
                <th key={lang}>{hasGrouping ? <></> : <>{lang}</>}</th>
              ))}
              <th className="col-actions"></th>
            </tr>
          </thead>

          <tbody>
            {fields.map((field, index) => {
              const rows: React.ReactNode[] = [];
              const fieldKey = field.id || field.fieldId || `field-${index}`;
              const itemKey = field.key || field.id || ''; // translation key from the field (use the actual key, not encoded)

              // Add page divider row if needed (centralized logic)
              addTranslationsGroupRow({
                domain,
                group,
                items,
                fields,
                index,
                fieldKey,
                supportedLanguages,
                showKeyColumn,
                pageGrouping,
                rows,
              });

              rows.push(
                <TranslationsRow
                  key={`row-${fieldKey}`}
                  translationKey={itemKey}
                  domain={domain}
                  group={group}
                  index={index}
                  onDelete={handleDelete}
                  supportedLanguages={supportedLanguages}
                  showKeyColumn={showKeyColumn}
                  isEditing={editingRowIndex === index}
                  onEditingChange={(isEditing) => {
                    setEditingRowIndex(isEditing ? index : null);
                  }}
                  isSaving={isSaving}
                  isDeleting={isDeleting}
                />,
              );

              return <React.Fragment key={fieldKey}>{rows}</React.Fragment>;
            })}
          </tbody>
        </table>
      </FormProvider>
    </section>
  );
};
