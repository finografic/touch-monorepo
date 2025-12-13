import { useEffect, useMemo, useRef, useState } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { useDebouncedCallback } from 'use-debounce';
import { Flex } from '@radix-ui/themes';
import createCuid from '@bugsnag/cuid';

import { TranslationsRow } from './TranslationsRow';
import { TableFormButtons } from 'admin/pages/TranslationsProductPage/TableFormButtons/TableFormButtons';
import { languagesCodeToKey } from 'admin/pages/TranslationsProductPage/utils/language.utils';
import { styles } from './ProductTranslationsTable.styles';

import type { RegionLocale } from '@workspace/config/i18n.config';
import type { TranslationFormItem } from 'admin/pages/TranslationsProductPage/translations.types';

interface ProductTranslationsTableProps {
  sectionKey: string;
  items: TranslationFormItem[];
  supportedLanguages: RegionLocale[];
  // onSave?: (params: {
  //   sectionKey: string;
  //   items: any[];
  //   deletedItems?: string[];
  //   allItems?: any[];
  // }) => Promise<any[] | void>;
  onSave?: (params: {
    sectionKey: string;
    items: TranslationFormItem[];
  }) => Promise<{ success: boolean; savedItems: TranslationFormItem[] }>;
  // onDelete?: (itemId: string) => Promise<void>;
  onDelete?: (itemId: string) => Promise<{ success: boolean; deletedId: string }>;
  isSaving?: boolean;
  isDeleting?: boolean;
}

export const ProductTranslationsTable: React.FC<ProductTranslationsTableProps> = ({
  sectionKey,
  items,
  supportedLanguages,
  onSave,
  onDelete,
  isSaving = false,
  isDeleting = false,
}) => {
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);

  // ======================================================================== //
  // RHF Setup
  // ======================================================================== //

  const methods = useForm({
    mode: 'onChange',
    defaultValues: { items },
  });

  const { control, watch } = methods;

  const { fields, remove, append } = useFieldArray({
    control,
    name: 'items',
    keyName: 'fieldId', // 🔑 CRITICAL: This tells RHF to use 'fieldId' for its internal tracking
    //                    //             leaving 'id' free for our actual database CUID
    //                    //
    //                    // Without this:
    //                    //   field.id = RHF's auto-generated ID (wrong!)
    //                    //   item.id = our CUID (correct!)
    //                    //
    //                    // With keyName: 'fieldId':
    //                    //   field.fieldId = RHF's auto-generated ID
    //                    //   field.id = our CUID ✅
    //                    //   item.id = our CUID ✅
  });

  // Track initial items for DELETE detection
  const initialItemsRef = useRef<TranslationFormItem[]>(items);

  // Update ref when items prop changes (after successful save/delete)
  useEffect(() => {
    initialItemsRef.current = items;
  }, [items]);

  // Reset form when items prop changes from parent (after refetch)
  // useEffect(() => {
  //   methods.reset({ items }, { keepValues: false });
  // }, [items, methods]);

  // ======================================================================== //
  // Empty Row Detection
  // ======================================================================== //

  const languageKeys = useMemo(() => supportedLanguages.map(languagesCodeToKey), [supportedLanguages]);

  const watchedItems = watch('items');
  const isDirtyLastItem = Boolean(watchedItems.at(-1)?.name);

  // Helper: check if item is empty (all language fields empty)
  const isItemEmpty = (item: TranslationFormItem, languageKeys: string[]) =>
    languageKeys.every((key) => !item[key]?.trim());

  const hasEmptyRow = useMemo(() => {
    // Check if there's any empty row (all language fields empty)
    return watchedItems?.some((item: TranslationFormItem) =>
      languageKeys.every((key) => !item?.[key]?.trim()),
    );
  }, [watchedItems, languageKeys, watchedItems.at(-1)?.name]);

  // ======================================================================== //
  // Handlers
  // ======================================================================== //

  const handleDelete = async (index: number) => {
    const item = watchedItems[index];

    // If it's a temp item (not saved yet), just remove from form
    if (item.id.startsWith('temp-')) {
      remove(index);
      return;
    }

    const itemName = item.name || 'this item';
    const confirmed = window.confirm(
      `Are you sure you want to delete "${itemName}"?\n\nThis action cannot be undone.`,
    );

    if (!confirmed) return;

    if (!onDelete) {
      remove(index);
      return;
    }

    try {
      const result = await onDelete(item.id);

      // ✅ Optional safety check
      if (result?.success) {
        remove(index);

        // Update initial tracking to reflect deletion
        initialItemsRef.current = initialItemsRef.current.filter((i) => i.id !== result.deletedId);
      }
    } catch (error) {
      console.error('[Delete] Failed:', error);
      // UI remains unchanged on failure
    }
  };

  // ======================================================================== //

  const handleAddNewRow = useDebouncedCallback(
    () => {
      if (hasEmptyRow) return;

      append({
        id: `temp-${createCuid()}`, // temp ID, replaced on save
        name: '',
        ...Object.fromEntries(languageKeys.map((k) => [k, ''])),
      } as TranslationFormItem);
    },
    250,
    { leading: true, trailing: false },
  );

  const handleSave = methods.handleSubmit(async (data) => {
    const cleanedItems = data.items.filter((item) => !isItemEmpty(item, languageKeys));

    const result = await onSave?.({
      sectionKey,
      items: cleanedItems,
    });

    if (result?.savedItems) {
      methods.reset(
        { items: result.savedItems },
        {
          keepErrors: false,
          keepDirty: false,
          keepTouched: false,
        },
      );
    }
  });

  // ======================================================================== //

  const handleReset = () => {
    methods.reset();
  };

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
            {fields.map((field, index) => (
              <TranslationsRow
                key={field.fieldId} // IMPORTANT: field.fieldId, not field.id
                index={index}
                onDelete={handleDelete}
                supportedLanguages={supportedLanguages}
                isEditing={editingRowIndex === index}
                onEditingChange={(isEditing) => {
                  setEditingRowIndex(isEditing ? index : null);
                }}
                isDeleting={isDeleting}
              />
            ))}
          </tbody>
        </table>
      </FormProvider>
    </section>
  );
};
