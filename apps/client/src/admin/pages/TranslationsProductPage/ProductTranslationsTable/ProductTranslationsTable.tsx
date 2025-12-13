import { useMemo, useState } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { useDebouncedCallback } from 'use-debounce';
import { Flex } from '@radix-ui/themes';

import { TranslationsRow } from './TranslationsRow';
import { TableFormButtons } from 'admin/pages/TranslationsProductPage/TableFormButtons/TableFormButtons';
import { languagesCodeToKey } from 'admin/pages/TranslationsProductPage/utils/language.utils';
import { styles } from './ProductTranslationsTable.styles';

import type { RegionLocale } from '@workspace/config/i18n.config';
import type { TranslationFormItem } from 'admin/pages/TranslationsProductPage/TranslationsPage.types';

interface ProductTranslationsTableProps {
  sectionKey: string;
  items: TranslationFormItem[];
  supportedLanguages: RegionLocale[];
  onSave?: (params: { sectionKey: string; items: any[] }) => Promise<void>;
}

export const ProductTranslationsTable: React.FC<ProductTranslationsTableProps> = ({
  sectionKey,
  items,
  supportedLanguages,
  onSave,
}) => {
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);

  // Helper: check if item is empty (all language fields empty)
  const isItemEmpty = (item: TranslationFormItem, languageKeys: string[]) =>
    languageKeys.every((key) => !item[key]?.trim());

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
    keyName: 'fieldId', // 🔑 CRITICAL: preserves item.id from DB
  });

  // ======================================================================== //
  // Empty Row Detection
  // ======================================================================== //

  const languageKeys = useMemo(() => supportedLanguages.map(languagesCodeToKey), [supportedLanguages]);

  const watchedItems = watch('items');

  const hasEmptyRow = useMemo(() => {
    return watchedItems?.some((item: TranslationFormItem) =>
      languageKeys.every((key) => !item?.[key]?.trim()),
    );
  }, [watchedItems, languageKeys]);

  // ======================================================================== //
  // Handlers
  // ======================================================================== //

  const addEmptyRow = useDebouncedCallback(
    () => {
      if (hasEmptyRow) return;

      append({
        id: `temp-${crypto.randomUUID()}`, // temp ID, replaced on save
        name: '',
        ...Object.fromEntries(languageKeys.map((k) => [k, ''])),
      } as TranslationFormItem);
    },
    250,
    { leading: true, trailing: false },
  );

  const handleSave = methods.handleSubmit(async (data) => {
    // Filter out empty rows before saving
    const cleanedItems = data.items.filter((item) => !isItemEmpty(item, languageKeys));
    await onSave?.({ sectionKey, items: cleanedItems });
  });

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
            onAddNew={addEmptyRow}
            isDirty={methods.formState.isDirty}
            isAddNewDisabled={hasEmptyRow}
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
                remove={remove}
                supportedLanguages={supportedLanguages}
                isEditing={editingRowIndex === index}
                onEditingChange={(isEditing) => {
                  setEditingRowIndex(isEditing ? index : null);
                }}
              />
            ))}
          </tbody>
        </table>
      </FormProvider>
    </section>
  );
};
