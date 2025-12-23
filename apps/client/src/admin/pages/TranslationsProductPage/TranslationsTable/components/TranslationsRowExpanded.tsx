import React, { useCallback, useEffect } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import clsx from 'clsx';
import { TrashIcon } from 'styles/icons';
import { Button } from 'components/Button';
import { Input } from 'forms/Input/Input';

import { languagesCodeToKey, regenerateSlug } from 'admin/utils/languages.utils';

import type { RegionLocale } from '@workspace/config/i18n.config';
import { COL_CHEVRON_WIDTH, COL_SLUG_WIDTH } from '../../translations-table.config';

interface ExpandedSubtypeRowProps {
  className?: string;
  index: number;
  onDelete: (index: number) => Promise<void>;
  supportedLanguages: RegionLocale[];
  slugPriority?: RegionLocale[]; // ["es-ES","en-GB",...rest]
  isEditing: boolean;
  onEditingChange: (isEditing: boolean) => void;
  isSaving?: boolean;
  isDeleting?: boolean;
}

export const ExpandedSubtypeRow: React.FC<ExpandedSubtypeRowProps> = ({
  index,
  onDelete,
  supportedLanguages,
  slugPriority,
  isEditing,
  onEditingChange,
  isSaving = false,
  isDeleting = false,
}) => {
  const { control, register, formState, watch, setValue } = useFormContext();

  const { field: nameField } = useController({
    name: `items.${index}.name`,
    control,
  });

  const values = watch(`items.${index}`);

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
  }, [values?.esEs, values?.enGb, values?.caEs, supportedLanguages, setValue]);

  const rowDirtyFields = formState.dirtyFields?.items?.[index];
  const isDirty = Boolean(rowDirtyFields);

  const rowClasses = clsx({
    'row-editing': isEditing,
    'row-dirty': isDirty,
  });

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
      {/* Empty cell for chevron column alignment */}
      <td style={{ width: COL_CHEVRON_WIDTH }} />

      <td className="col-key" style={{ width: COL_SLUG_WIDTH }}>
        <Input value={nameField.value || ''} readOnly />
      </td>

      {/* DYNAMIC LANGUAGE COLUMNS */}
      {supportedLanguages.map((lang) => {
        const fieldKey = languagesCodeToKey(lang);
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
