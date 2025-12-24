import { useController, useFormContext } from 'react-hook-form';
import clsx from 'clsx';
import { TrashIcon } from 'styles/icons';
import { Button } from 'components/Button';
import type { RegionLocale } from '@workspace/config/i18n.config';
import { languagesCodeToKey } from 'admin/utils/languages.utils';
import { Input } from 'forms/Input/Input';
import type { I18nTranslationsDomain } from '@workspace/i18n/types';

interface TranslationsRowProps {
  domain: I18nTranslationsDomain;
  group: string;
  translationKey: string; // The dot-notation key (e.g., "admin.pages.dashboard.title")
  index: number; // Keep for rendering/display purposes
  onDelete: (key: string) => Promise<void>;
  isEditing: boolean;
  onEditingChange: (isEditing: boolean) => void;
  supportedLanguages: RegionLocale[]; // ["es-ES","en-GB","ca-ES"]
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
  showKeyColumn,
  isSaving = false,
  isDeleting = false,
}) => {
  const { control, register, formState, watch, setValue } = useFormContext();

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
      {supportedLanguages.map((lang) => {
        const fieldKey = languagesCodeToKey(lang); // esEs, enGb, caEs
        const fieldName = `${fieldPath}.${fieldKey}` as const;
        const value = watch(fieldName);

        return (
          <td key={lang} className="col-value">
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
      <td className="col-actions">
        <Button
          className="button button-delete"
          aria-label="Delete"
          variant="ghost"
          size="md"
          color="danger"
          onClick={() => onDelete(translationKey)}
          disabled={isDeleting}
        >
          <TrashIcon />
        </Button>
      </td>
    </tr>
  );
};
