import { useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { TranslationsRow } from './TranslationsRow';
import { useTranslationsTableForm } from './useTranslationsTableForm';
import type { LanguageInfo } from 'types/models/supported-language.model';
import type { RegionLocale } from '@workspace/config/i18n.config';
import { styles } from './ProductTranslationsTable.styles';
import { Flex } from '@radix-ui/themes';
import { TableFormButtons } from 'admin/pages/TranslationsProductPage/TableFormButtons/TableFormButtons';

interface ProductTranslationsTableProps {
  sectionKey: string;
  items: any[]; // Legacy format from parent hook
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

  const {
    fields,
    addEmpty,
    remove,
    formState,
    formState: { isDirty },
    onSubmit,
    hasEmptyRow,
    ...methods
  } = useTranslationsTableForm(items);

  const handleSave = onSubmit(async (clean) => {
    await onSave?.({ sectionKey, items: clean });
  });

  const handleAddNew = () => {
    addEmpty();
  };

  const handleReset = () => {
    methods.reset();
  };

  return (
    <section css={styles} className="table-container">
      <FormProvider {...methods} formState={formState}>
        <Flex justify="end" align="center" mb="4" gap="2">
          <TableFormButtons
            onReset={handleReset}
            onSave={handleSave}
            onAddNew={handleAddNew}
            isDirty={isDirty}
            isAddNewDisabled={hasEmptyRow}
          />
        </Flex>

        <table className="translations-table">
          <thead>
            <tr>
              <th></th>
              <th></th>
              {supportedLanguages.map((lang) => (
                <th key={lang}>{lang}</th>
              ))}
              <th></th>
            </tr>
          </thead>
          <tbody>
            <pre>{JSON.stringify(supportedLanguages, null, 2)}</pre>
            <pre>{JSON.stringify(fields, null, 2)}</pre>
            {fields?.map((field, index) => (
              <TranslationsRow
                key={field.fId}
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
