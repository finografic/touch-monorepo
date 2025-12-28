import { useController, useFormContext } from 'react-hook-form';
import type { RegionLocale } from '@workspace/config/i18n.config';
import type { I18nTranslationsDomain } from '@workspace/i18n/types';

import clsx from 'clsx';
import { Input } from 'forms/Input/Input';

import { TranslationsDeleteButton } from '../../../shared/components/TranslationsDeleteButton';
import { TranslationsRowCell } from '../../../shared/components/TranslationsRowCell';

interface TranslationsRowProps {
  domain: I18nTranslationsDomain;
  group: string;
  translationKey: string; // The dot-notation key (e.g., "admin.pages.dashboard.title")
  index: number; // Keep for rendering/display purposes
  onDelete: (key: string) => Promise<void>;
  isEditing: boolean;
  onEditingChange: (isEditing: boolean) => void;
  supportedLanguages: RegionLocale[]; // ["es-ES","en-GB","ca-ES"]
  canAddNew: boolean;
  showKeyColumn: boolean;
  isSaving?: boolean;
  isDeleting?: boolean;
}

export const TranslationsRow: React.FC<TranslationsRowProps> = ({
  domain,
  group,
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

  // Use index for RHF field path (array-based)
  const fieldPath = `items.${index}`;

  /* -----------------------------
     Key field (controlled)
  ------------------------------ */

  const { field: keyField } = useController({
    name: `${fieldPath}.key`,
    control,
  });

  /* -----------------------------
     Row state
  ------------------------------ */

  // Access dirty fields using index (array-based)
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
      {/* KEY */}
      <td className="col-key">
        <pre>
          {String(keyField.value).split('.').slice(3).join('.') ||
            String(keyField.value).split('.').slice(2).join('.')}
        </pre>
        <Input
          value={keyField.value || ''}
          type="hidden"
          readOnly
          className={clsx({ 'input-dirty': rowDirtyFields?.key })}
        />
      </td>

      {/* DYNAMIC LANGUAGE COLUMNS */}
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

      {/* DELETE */}
      <td className="col-actions">
        {canAddNew ? (
          <TranslationsDeleteButton onDelete={() => onDelete(translationKey)} isDeleting={isDeleting} />
        ) : (
          <></>
        )}
      </td>
    </tr>
  );
};
