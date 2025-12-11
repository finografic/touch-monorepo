import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import type {
  FieldArrayWithId,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFormReturn,
} from 'react-hook-form';
import { useDebounce } from 'use-debounce';
import { slugify } from 'utils/string.utils';
import type { TranslationItem } from '../TranslationsPage.types';

type FormValues = { items: TranslationItem[] };

interface UseTranslationsTableReturn extends UseFormReturn<FormValues> {
  fields: FieldArrayWithId<FormValues, 'items', 'fId'>[];
  addEmpty: () => void;
  remove: UseFieldArrayRemove;
  onSubmit: (
    fn: (clean: TranslationItem[]) => Promise<void>,
  ) => (e?: React.BaseSyntheticEvent) => Promise<void>;
}

export const useTranslationsTableForm = (initial: TranslationItem[]): UseTranslationsTableReturn => {
  const methods = useForm<FormValues>({
    defaultValues: { items: initial },
    mode: 'onChange',
  });

  const { control, watch, reset } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
    keyName: 'fId',
  });

  const values = watch('items');
  const [debounced] = useDebounce(values, 350);

  useEffect(
    function generateSlug() {
      debounced?.forEach((row, idx) => {
        if (!row) return;
        const base = row.esEs || row.enGb || row.caEs || '';
        if (!base) return;

        const slug = slugify(base, {
          lower: true,
          strict: true,
          trim: true,
        });

        if (slug && slug !== row.name) {
          methods.setValue(`items.${idx}.name`, slug, {
            shouldDirty: true,
            shouldTouch: false,
          });
        }
      });
    },
    [debounced, methods],
  );

  const addEmpty = () =>
    append({
      id: null,
      name: '',
      esEs: '',
      enGb: '',
      caEs: '',
    });

  const removeBlank = (rows: TranslationItem[]) => rows.filter((r) => r.esEs || r.enGb || r.caEs);

  const onSubmit = (fn: (clean: TranslationItem[]) => Promise<void>) =>
    methods.handleSubmit(async (data) => {
      const cleaned = removeBlank(data.items);
      await fn(cleaned);
      reset({ items: cleaned });
    });

  return { ...methods, fields, addEmpty, remove, onSubmit };
};
