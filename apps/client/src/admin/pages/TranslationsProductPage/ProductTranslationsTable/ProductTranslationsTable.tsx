import { FormProvider } from 'react-hook-form';
import type { TranslationItem } from '../TranslationsPage.types';
import { TranslationsRow } from './TranslationsRow';
import { useTranslationsTableForm } from './useTranslationsTableForm';
import { styles } from './ProductTranslationsTable.styles';

interface ProductTranslationsTableProps {
  sectionKey: string;
  items: TranslationItem[];
  onSave?: (params: { sectionKey: string; items: TranslationItem[] }) => Promise<void>;
}

export const ProductTranslationsTable: React.FC<ProductTranslationsTableProps> = ({
  sectionKey,
  items,
  onSave,
}) => {
  const {
    fields,
    addEmpty,
    remove,
    formState,
    formState: { isDirty },
    onSubmit,
    ...methods
  } = useTranslationsTableForm(items);

  return (
    <div css={styles}>
      <FormProvider {...methods} formState={formState}>
        <form
          onSubmit={onSubmit(async (clean) => {
            await onSave?.({ sectionKey, items: clean });
          })}
        >
          <table>
            <thead>
              <tr>
                <th>Key</th>
                <th>es-ES</th>
                <th>en-GB</th>
                <th>ca-ES</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index) => (
                <TranslationsRow key={field.fId} index={index} remove={remove} />
              ))}
            </tbody>
          </table>

          <div className="flex gap-2 justify-end mt-4">
            <button
              type="button"
              onClick={() => methods.reset()}
              disabled={!isDirty}
              className="btn-secondary"
            >
              Cancel
            </button>

            <button type="button" onClick={addEmpty} className="btn-blue">
              + Add
            </button>

            <button type="submit" className="btn-primary" disabled={!isDirty}>
              Save
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};
