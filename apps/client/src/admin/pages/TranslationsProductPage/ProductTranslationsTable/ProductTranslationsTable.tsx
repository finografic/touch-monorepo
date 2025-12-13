import { useMemo, useState } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { TranslationsRow } from './TranslationsRow';
// import { useTranslationsTableForm } from './useTranslationsTableForm';
// import type { LanguageInfo } from 'types/models/supported-language.model';
import type { RegionLocale } from '@workspace/config/i18n.config';
import { styles } from './ProductTranslationsTable.styles';
import { Flex } from '@radix-ui/themes';
import { TableFormButtons } from 'admin/pages/TranslationsProductPage/TableFormButtons/TableFormButtons';
import type { TranslationFormItem } from 'admin/pages/TranslationsProductPage/TranslationsPage.types';
import { languagesCodeToKey } from 'admin/pages/TranslationsProductPage/utils/language.utils';

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

  const isItemEmpty = (item: TranslationFormItem, languageKeys: RegionLocale[]) =>
    languageKeys.every((lang) => !item[lang]?.trim());

  // const {
  //   fields,
  //   addEmpty,
  //   remove,
  //   formState,
  //   formState: { isDirty },
  //   onSubmit,
  //   hasEmptyRow,
  //   ...methods
  // } = useTranslationsTableForm(items);

  const methods = useForm({
    mode: 'onChange',
    defaultValues: { items },
  });

  const { fields, remove, append } = useFieldArray({
    control: methods.control,
    name: 'items',
    keyName: 'fieldId', // 🔑 CRITICAL: use fieldId instead of index
  });

  // ======================================================================== //

  const languageKeys = useMemo(() => supportedLanguages.map(languagesCodeToKey), [supportedLanguages]);

  const watchedItems = methods.watch('items');

  const hasEmptyRow = useMemo(() => {
    return watchedItems?.some((item: TranslationFormItem) =>
      languageKeys.every((key) => !item?.[key]?.trim()),
    );
  }, [watchedItems, languageKeys]);

  // ======================================================================== //

  const handleSave = methods.handleSubmit(async (clean) => {
    // await onSave?.({ sectionKey, items: clean });
  });

  const handleAddNew = () => {
    // addEmpty();
  };

  const handleReset = () => {
    methods.reset();
  };

  return (
    <section css={styles} className="table-container">
      <FormProvider {...methods} formState={methods.formState}>
        <Flex justify="end" align="center" mb="4" gap="2">
          <TableFormButtons
            onReset={handleReset}
            onSave={handleSave}
            onAddNew={handleAddNew}
            isDirty={methods.formState.isDirty}
            isAddNewDisabled={false} // TODO: implement hasEmptyRow
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
            {fields.map((field, index) => (
              <TranslationsRow
                key={field.id} // IMPORTANT: field.id, not index
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
