import { useCallback, useEffect } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import clsx from 'clsx';
import { TrashIcon } from 'styles/icons';
import { Button } from 'components/Button';
import type { RegionLocale } from '@workspace/config/i18n.config';
import {
  languagesCodeToKey,
  regenerateSegment,
  encodeRHFKey,
  decodeRHFKey,
} from 'admin/utils/languages.utils';
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
  slugPriority?: RegionLocale[]; // ["es-ES","en-GB",...rest]
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
  slugPriority,
  isSaving = false,
  isDeleting = false,
}) => {
  const { control, register, formState, watch, setValue, getValues } = useFormContext();

  // Encode the translation key for RHF (replace dots with __DOT__)
  const encodedKey = encodeRHFKey(translationKey);
  // Use encoded key for RHF field path (RHF uses dots for nesting, so we encode them)
  const fieldPath = `items.${encodedKey}`;

  /* -----------------------------
     Key field (controlled)
  ------------------------------ */

  const { field: keyField } = useController({
    name: `${fieldPath}.key`,
    control,
  });

  const values = watch(fieldPath);

  /* -----------------------------
     Segment auto-sync (only final segment)
  ------------------------------ */

  const updateSegment = useCallback(
    (translations: Record<RegionLocale, string>, currentKey: string) => {
      if (isSaving || isDeleting || !currentKey) return;

      // Only regenerate the final segment of the key
      const keyParts = currentKey.split('.');
      if (keyParts.length === 0) return;

      const prefix = keyParts.slice(0, -1).join('.'); // Everything except the last segment
      const newSegment = regenerateSegment(translations, slugPriority ?? supportedLanguages);

      if (newSegment) {
        const newKey = prefix ? `${prefix}.${newSegment}` : newSegment;
        if (newKey !== currentKey) {
          // Get current form values from old location
          const currentValues = getValues(fieldPath) || values || {};

          // Encode new key for RHF
          const newEncodedKey = encodeRHFKey(newKey);
          const newFieldPath = `items.${newEncodedKey}`;

          // Move form data to new key location
          setValue(
            newFieldPath,
            { ...currentValues, key: newKey },
            { shouldDirty: false, shouldTouch: false },
          );

          // Remove old key location if it's different
          if (newKey !== currentKey && currentKey !== translationKey) {
            // Clear old location (setValue with undefined removes it)
            setValue(fieldPath, undefined, { shouldDirty: false, shouldTouch: false });
          }
        }
      }
    },
    [
      setValue,
      getValues,
      slugPriority,
      supportedLanguages,
      fieldPath,
      isSaving,
      isDeleting,
      values,
      translationKey,
    ],
  );

  useEffect(() => {
    if (!values || !keyField.value) return;

    const translations: Record<RegionLocale, string> = {} as Record<RegionLocale, string>;

    for (const lang of supportedLanguages) {
      const key = languagesCodeToKey(lang);
      translations[lang] = values[key] || '';
    }

    updateSegment(translations, keyField.value);
  }, [
    values?.esEs,
    values?.enGb,
    values?.caEs,
    supportedLanguages,
    slugPriority,
    updateSegment,
    keyField.value,
  ]);

  /* -----------------------------
     Row state
  ------------------------------ */

  // Access dirty fields using encoded key (RHF stores dirty fields with encoded keys)
  const rowDirtyFields = formState.dirtyFields?.items?.[encodedKey];
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
