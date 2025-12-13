import { useEffect } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import clsx from 'clsx';
import { TrashIcon } from 'styles/icons';
import { Button } from 'components/Button';
import { useDebouncedCallback } from 'use-debounce';
import type { RegionLocale } from '@workspace/config/i18n.config';
import { languagesCodeToKey, regenerateSlug } from 'admin/pages/TranslationsProductPage/utils/language.utils';
import { Input } from 'forms/Input/Input';

interface TranslationsRowProps {
  index: number;
  onDelete: (index: number) => Promise<void>;
  isEditing: boolean;
  onEditingChange: (isEditing: boolean) => void;
  supportedLanguages: RegionLocale[]; // ["es-ES","en-GB","ca-ES"]
  slugPriority?: RegionLocale[];
  isDeleting?: boolean;
}

export const TranslationsRow: React.FC<TranslationsRowProps> = ({
  index,
  onDelete,
  isEditing,
  onEditingChange,
  supportedLanguages,
  slugPriority,
  isDeleting = false,
}) => {
  const { control, register, formState, watch, setValue } = useFormContext();

  /* -----------------------------
     Slug field (controlled)
  ------------------------------ */

  const { field: nameField } = useController({
    name: `items.${index}.name`,
    control,
  });

  const values = watch(`items.${index}`);

  /* -----------------------------
     Slug auto-sync
  ------------------------------ */

  const updateSlug = useDebouncedCallback((translations: Record<string, string>) => {
    const nextSlug = regenerateSlug(translations, slugPriority ?? supportedLanguages);
    // log('>>>', 'red', { nextSlug, value: nameField.value });

    // Always update if slug is different (including empty string)
    if (nextSlug !== nameField.value) {
      setValue(`items.${index}.name`, nextSlug, { shouldDirty: true, shouldTouch: true });
    }
  }, 100);

  useEffect(() => {
    if (!values) return;

    const translations: Record<string, string> = {};

    for (const lang of supportedLanguages) {
      const key = languagesCodeToKey(lang);
      translations[lang] = values[key];
    }

    updateSlug(translations);
  }, [values?.esEs, values?.enGb, values?.caEs, supportedLanguages, slugPriority, setValue]);

  /* -----------------------------
     Row state
  ------------------------------ */

  const rowDirtyFields = formState.dirtyFields?.items?.[index];
  const isDirty = Boolean(rowDirtyFields);

  const rowClasses = clsx({
    'row-editing': isEditing,
    'row-dirty': isDirty,
  });

  /* -----------------------------
     Render
  ------------------------------ */

  // log('>>>', 'orange', { isDirty: rowDirtyFields?.name });

  return (
    <tr
      className={rowClasses}
      onFocus={() => onEditingChange(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          onEditingChange(false);
        }
      }}
    >
      {/* SLUG / KEY */}
      <td className="col-key">
        {/* <pre>{JSON.stringify({ isDirty: rowDirtyFields?.name }, null, 2)}</pre> */}
        <Input
          value={nameField.value || ''}
          readOnly
          className={clsx({ 'input-dirty': rowDirtyFields?.name })}
        />
      </td>

      {/* DYNAMIC LANGUAGE COLUMNS */}
      {supportedLanguages.map((lang) => {
        const fieldKey = languagesCodeToKey(lang); // esEs, enGb, caEs
        const fieldName = `items.${index}.${fieldKey}` as const;
        const value = watch(`items.${index}.${fieldKey}`);

        return (
          <td key={lang}>
            <Input
              {...register(fieldName)}
              placeholder="--"
              className={clsx({
                'input-dirty': rowDirtyFields?.[fieldKey],
                'input-empty': !value,
              })}
            />
          </td>
        );
      })}

      {/* DELETE */}
      <td>
        <Button
          className="button button-delete"
          aria-label="Delete"
          variant="ghost"
          size="md"
          color="danger"
          onClick={() => onDelete(index)}
          disabled={isDeleting}
        >
          <TrashIcon />
        </Button>
      </td>
    </tr>
  );
};
