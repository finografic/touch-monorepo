import React from 'react';
import type { UseFormRegister, UseFormWatch } from 'react-hook-form';
import clsx from 'clsx';
import { Input } from 'forms/Input/Input';
import type { RegionLocale } from '@workspace/config/i18n.config';
import { languagesCodeToKey } from 'admin/utils/languages.utils';
import { EMPTY_ROW_PLACEHOLDER } from '../constants/translationsTable.constants';

interface TranslationsRowCellProps {
  fieldPath: string;
  lang: RegionLocale;
  rowDirtyFields?: any;
  register: UseFormRegister<any>;
  watch: UseFormWatch<any>;
}

/**
 * Shared component for rendering a language input cell in translations tables
 * Used by both TranslationsPage and TranslationsProductPage
 */
export const TranslationsRowCell: React.FC<TranslationsRowCellProps> = ({
  fieldPath,
  lang,
  rowDirtyFields,
  register,
  watch,
}) => {
  const fieldKey = languagesCodeToKey(lang); // esEs, enGb, caEs
  const fieldName = `${fieldPath}.${fieldKey}` as const;
  const value = watch(fieldName);

  return (
    <td key={lang} className="col-value">
      <Input
        {...register(fieldName)}
        placeholder={EMPTY_ROW_PLACEHOLDER}
        className={clsx({
          'input-dirty': rowDirtyFields?.[fieldKey],
          'input-empty': !value,
        })}
      />
    </td>
  );
};
