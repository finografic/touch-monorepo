import { useEffect, useRef, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { useDebouncedCallback } from 'use-debounce';
import { Flex } from '@radix-ui/themes';
import createCuid from '@bugsnag/cuid';

import { TranslationsRow } from './components/TranslationsRow';
// import { TableFormButtons } from 'admin/pages/TranslationsProductPage/TableFormButtons/TableFormButtons';
import { TableFormButtons } from '../../TranslationPages/components/TableFormButtons';

import { styles } from '../../TranslationPages/TranslationsTable.styles';
import { useTranslationsTableForm } from './hooks/useTranslationsTableForm';
import { useTranslationsTableHandlers } from './hooks/useTranslationsTableHandlers';

import type { RegionLocale } from '@workspace/config/i18n.config';
import type { TranslationsFormItem } from '../../TranslationsProductPage/translationsProduct.types';
import { DEFAULT_SHOW_KEY_COLUMN_PRODUCT } from '../../TranslationPages/constants/translationsTable.constants';

interface TranslationsTableProps {
  sectionKey: string;
  items: TranslationsFormItem[];
  supportedLanguages: RegionLocale[];
  onSave?: ({ items }: { items: TranslationsFormItem[] }) => Promise<{ savedItems: TranslationsFormItem[] }>;
  onDelete?: (itemId: string) => Promise<{ success: boolean; deletedId: string }>;
  isSaving?: boolean;
  isDeleting?: boolean;
}

export const TranslationsTable: React.FC<TranslationsTableProps> = ({
  sectionKey,
  items,
  supportedLanguages,
  onSave,
  onDelete,
  isSaving = false,
  isDeleting = false,
}) => {
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);
  const [showKeyColumn, setShowKeyColumn] = useState<boolean>(DEFAULT_SHOW_KEY_COLUMN_PRODUCT);

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

  // Track initial items for DELETE detection
  const initialItemsRef = useRef<TranslationsFormItem[]>(items);
  useEffect(() => {
    initialItemsRef.current = items;
  }, [items]);

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
        name: '',
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

        <table
          className={`translations-table ${showKeyColumn ? 'is-visible-key-column' : 'is-hidden-key-column'}`}
        >
          <thead>
            <tr>
              <th className="col-key"></th>
              {supportedLanguages.map((lang) => (
                <th key={lang}>{lang}</th>
              ))}
              <th className="col-actions"></th>
            </tr>
          </thead>

          <tbody>
            {fields.map((field, index) => (
              <TranslationsRow
                key={field.fieldId} // IMPORTANT: field.fieldId (RHF internal), NOT field.id (entity CUID)
                index={index}
                onDelete={handleDelete}
                supportedLanguages={supportedLanguages}
                isEditing={editingRowIndex === index}
                onEditingChange={(isEditing) => {
                  setEditingRowIndex(isEditing ? index : null);
                }}
                isSaving={isSaving}
                isDeleting={isDeleting}
              />
            ))}
          </tbody>
        </table>
      </FormProvider>
    </section>
  );
};
