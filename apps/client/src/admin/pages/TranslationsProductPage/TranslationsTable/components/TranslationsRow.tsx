import { useCallback, useEffect } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import clsx from 'clsx';
import { TrashIcon } from 'styles/icons';
import { Button } from 'components/Button';
import type { RegionLocale } from '@workspace/config/i18n.config';
import { languagesCodeToKey, regenerateSlug } from 'admin/utils/languages.utils';
import { Input } from 'forms/Input/Input';

interface TranslationsRowProps {
  index: number;
  onDelete: (index: number) => Promise<void>;
  isEditing: boolean;
  onEditingChange: (isEditing: boolean) => void;
  supportedLanguages: RegionLocale[]; // ["es-ES","en-GB","ca-ES"]
  slugPriority?: RegionLocale[]; // ["es-ES","en-GB",...rest]
  isSaving?: boolean;
  isDeleting?: boolean;
}

export const TranslationsRow: React.FC<TranslationsRowProps> = ({
  index,
  onDelete,
  isEditing,
  onEditingChange,
  supportedLanguages,
  slugPriority,
  isSaving = false,
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

  const updateSlug = useCallback(
    (translations: Record<string, string>) => {
      if (isSaving || isDeleting) return;

      const nextSlug = regenerateSlug(translations, slugPriority ?? supportedLanguages);
      if (nextSlug !== nameField.value) {
        setValue(`items.${index}.name`, nextSlug, { shouldDirty: false, shouldTouch: false });
      }
    },
    [nameField.value, setValue, slugPriority, supportedLanguages],
  );

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
