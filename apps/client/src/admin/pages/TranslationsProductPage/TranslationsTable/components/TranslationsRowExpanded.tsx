import React, { useCallback, useEffect } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import clsx from 'clsx';
import { Input } from 'forms/Input/Input';

import { languagesCodeToKey, regenerateSlug } from 'admin/utils/languages.utils';

import type { RegionLocale } from '@workspace/config/i18n.config';
import { TranslationsRowCell } from '../../../TranslationPages/components/TranslationsRowCell';
import { TranslationsDeleteButton } from '../../../TranslationPages/components/TranslationsDeleteButton';

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
      {/* SLUG / KEY */}
      <td className="col-key">
        <Input value={nameField.value || ''} readOnly />
      </td>

      {/* DYNAMIC LANGUAGE COLUMNS */}
      {supportedLanguages.map((lang) => (
        <TranslationsRowCell
          key={lang}
          fieldPath={`items.${index}`}
          lang={lang}
          rowDirtyFields={rowDirtyFields}
          register={register}
          watch={watch}
        />
      ))}

      {/* DELETE */}
      <TranslationsDeleteButton onDelete={() => onDelete(index)} isDeleting={isDeleting} />
    </tr>
  );
};
