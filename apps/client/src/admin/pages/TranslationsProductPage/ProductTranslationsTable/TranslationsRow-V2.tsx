import { useEffect, useMemo } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import clsx from 'clsx';
import { TrashIcon } from '@radix-ui/react-icons';
import { Button } from 'components/Button';
import type { RegionLocale } from '@workspace/config/i18n.config';
import { languagesCodeToKey, regenerateSlug } from 'admin/pages/TranslationsProductPage/utils/language.utils';
import { Input } from 'forms/Input/Input';

/* ============================================================
   COMPONENT
   ============================================================ */

interface TranslationsRowProps {
  index: number;
  remove: (index: number) => void;
  isEditing: boolean;
  onEditingChange: (isEditing: boolean) => void;
  supportedLanguages: RegionLocale[]; // ["es-ES","en-GB","ca-ES"]
  slugPriority?: RegionLocale[]; // defaults to availableLanguages
}

export const TranslationsRow: React.FC<TranslationsRowProps> = ({
  index,
  remove,
  isEditing,
  onEditingChange,
  supportedLanguages,
  slugPriority,
}) => {
  const { control, formState, watch, setValue } = useFormContext();

  /* -----------------------------
     Controllers
  ------------------------------ */

  const { field: nameField } = useController({
    name: `items.${index}.name`,
    control,
  });

  const rowDirtyFields = formState.dirtyFields?.items?.[index];
  const values = watch(`items.${index}`);

  /* -----------------------------
     Slug auto-sync (THE FIX)
  ------------------------------ */

  useEffect(() => {
    if (!values) return;

    // rebuild translation map: { "es-ES": "Cerveza", ... }
    const translations: Record<string, string> = {};
    for (const lang of supportedLanguages) {
      translations[lang] = values[languagesCodeToKey(lang)];
    }

    const nextSlug = regenerateSlug(translations, slugPriority ?? supportedLanguages);

    if (nextSlug && nextSlug !== nameField.value) {
      setValue(`items.${index}.name`, nextSlug, {
        shouldDirty: true,
        shouldTouch: false,
      });
    }
  }, [values, supportedLanguages, slugPriority, index, nameField.value, setValue]);

  /* -----------------------------
     Row state
  ------------------------------ */

  // const isEmpty = languageControllers.every((l) => !l.controller.value?.trim());

  const isDirty = Boolean(rowDirtyFields);

  const rowClasses = clsx({
    'row-editing': isEditing,
    'row-dirty': isDirty,
    // 'row-empty': isEmpty,
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
      {/* DEBUG COLUMN */}
      <td className="TEST">
        <pre>{JSON.stringify(values, null, 2)}</pre>
      </td>

      {/* KEY / SLUG */}
      <td className="col-key">
        <Input
          value={nameField.value || ''}
          readOnly
          className={clsx({
            'input-dirty': rowDirtyFields?.name,
          })}
        />
      </td>

      {/* DYNAMIC LANGUAGE COLUMNS */}
      {/* {supportedLanguages.map((lang) => (
        <td key={lang}>
          <Input
            name={`items.${index}.${languagesCodeToKey(lang)}`}
            control={control}
            placeholder="--"
            className={clsx({
              'input-dirty': rowDirtyFields?.[languagesCodeToKey(lang)],
              'input-empty': !watch(`items.${index}.${languagesCodeToKey(lang)}`),
            })}
          />
        </td>
      ))} */}

      {/* DELETE */}
      <td>
        <Button
          className="button button-delete"
          aria-label="Delete"
          variant="ghost"
          size="md"
          color="danger"
          onClick={() => remove(index)}
        >
          <TrashIcon />
        </Button>
      </td>
    </tr>
  );
};
