import { useEffect, useMemo } from 'react';
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
  hasEmptyRow: boolean;
}

// Priority order for slug generation: es-ES > en-GB > ca-ES
const SLUG_PRIORITY_ORDER = ['esEs', 'enGb', 'caEs'] as const;

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

  // Check if there's an empty row (all language fields are empty)
  const hasEmptyRow = useMemo(() => {
    return values?.some((row) => !row?.esEs?.trim() && !row?.enGb?.trim() && !row?.caEs?.trim()) || false;
  }, [values]);

  // Sync form when parent items change
  useEffect(() => {
    const rhfItems = initial.map(convertLegacyToRHFFormat);
    reset({ items: rhfItems }, { keepDirty: true });
  }, [initial, reset]);

  // Auto-generate slug from first populated language field (priority: es-ES > en-GB > ca-ES)
  useEffect(
    function generateSlug() {
      debounced?.forEach((row, index) => {
        if (!row) return;

        // Find first populated field in priority order
        let sourceValue = '';
        for (const langKey of SLUG_PRIORITY_ORDER) {
          const value = row[langKey];
          if (value && value.trim()) {
            sourceValue = value.trim();
            break;
          }
        }

        // Generate slug from source value
        const slug = sourceValue
          ? slugify(sourceValue, {
              lower: true,
              strict: true,
              trim: true,
            })
          : '';

        // DEBUG: Log the slug generation
        console.log(`[Slug Gen] Row ${index}: "${sourceValue}" → "${slug}" (current: "${row.name}")`);

        // Always update if slug is different from current name
        // This ensures the UI stays in sync as the user types
        if (slug !== row.name) {
          console.log(`[Slug Gen] Setting items.${index}.name to "${slug}"`);
          setValue(`items.${index}.name`, slug, {
            shouldDirty: true,
            shouldTouch: false,
            shouldValidate: false,
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

  return { ...methods, fields, addEmpty, remove, onSubmit, hasEmptyRow };
};
