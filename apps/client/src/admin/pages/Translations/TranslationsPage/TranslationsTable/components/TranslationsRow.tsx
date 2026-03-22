import React from 'react';
import { useController, useFormContext } from 'react-hook-form';
import type { RegionLocale } from '@workspace/config/i18n.config';
import clsx from 'clsx';
import { Input } from 'forms/Input/Input';

import { TranslationsDeleteButton } from '../../../shared/components/TranslationsDeleteButton';
import { TranslationsRowCell } from '../../../shared/components/TranslationsRowCell';

interface TranslationsRowProps {
  translationKey: string;
  index: number;
  onDelete: (key: string) => Promise<void>;
  isEditing: boolean;
  onEditingChange: (isEditing: boolean) => void;
  supportedLanguages: RegionLocale[];
  canAddNew: boolean;
  showKeyColumn: boolean;
  isSaving?: boolean;
  isDeleting?: boolean;
}

export const TranslationsRow: React.FC<TranslationsRowProps> = ({
  translationKey,
  index,
  onDelete,
  isEditing,
  onEditingChange,
  supportedLanguages,
  canAddNew,
  showKeyColumn,
  isSaving = false,
  isDeleting = false,
}) => {
  const { control, register, formState, watch } = useFormContext();

  const fieldPath = `items.${index}`;
  const { field: keyField } = useController({ name: `${fieldPath}.key`, control });

  const rowDirtyFields = formState.dirtyFields?.items?.[index];
  const isDirty = Boolean(rowDirtyFields);

  // Display the path tail only; role labels live on the page group header.
  const keyFragment = String(keyField.value).split('.').slice(3).join('.')
    || String(keyField.value).split('.').slice(2).join('.');

  return (
    <tr
      className={clsx({ 'row-editing': isEditing, 'row-dirty': isDirty })}
      onFocus={() => onEditingChange(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          onEditingChange(false);
        }
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          (e.target as HTMLElement).blur();
        }
      }}
    >
      <td className="col-key">
        <pre>{keyFragment}</pre>
        <Input
          value={keyField.value || ''}
          type="hidden"
          readOnly
          className={clsx({ 'input-dirty': rowDirtyFields?.key })}
        />
      </td>

      {supportedLanguages.map((lang) => (
        <TranslationsRowCell
          key={lang}
          fieldPath={fieldPath}
          lang={lang}
          rowDirtyFields={rowDirtyFields}
          register={register}
          watch={watch}
        />
      ))}

      <td className="col-actions">
        {canAddNew && (
          <TranslationsDeleteButton
            onDelete={() => onDelete(translationKey)}
            isDeleting={isDeleting}
          />
        )}
      </td>
    </tr>
  );
};
