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
import { convertLegacyToRHFFormat, convertRHFToLegacyFormat } from './translation-converters';

type FormValues = { items: TranslationItem[] };

interface UseTranslationsTableReturn extends UseFormReturn<FormValues> {
  fields: FieldArrayWithId<FormValues, 'items', 'fId'>[];
  addEmpty: () => void;
  remove: UseFieldArrayRemove;
  onSubmit: (fn: (clean: any[]) => Promise<void>) => (e?: React.BaseSyntheticEvent) => Promise<void>;
}

export const useTranslationsTableForm = (initial: any[]): UseTranslationsTableReturn => {
  // Convert legacy format to RHF format
  const rhfItems = initial.map(convertLegacyToRHFFormat);

  const methods = useForm<FormValues>({
    defaultValues: { items: rhfItems },
    mode: 'onChange',
  });

  const { control, watch, reset, setValue } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
    keyName: 'fId',
  });

  const values = watch('items');
  const [debounced] = useDebounce(values, 200);

  // Sync form when parent items change
  useEffect(() => {
    const rhfItems = initial.map(convertLegacyToRHFFormat);
    reset({ items: rhfItems }, { keepDirty: true });
  }, [initial, reset]);

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
          setValue(`items.${idx}.name`, slug, {
            shouldDirty: true,
            shouldTouch: false,
          });
        }
      });
    },
    [debounced, setValue],
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

  const onSubmit = (fn: (clean: any[]) => Promise<void>) =>
    methods.handleSubmit(async (data) => {
      const cleaned = removeBlank(data.items);
      // Convert back to legacy format for the parent hook
      const legacyFormat = cleaned.map(convertRHFToLegacyFormat);
      await fn(legacyFormat);
      reset({ items: cleaned });
    });

  return { ...methods, fields, addEmpty, remove, onSubmit };
};
