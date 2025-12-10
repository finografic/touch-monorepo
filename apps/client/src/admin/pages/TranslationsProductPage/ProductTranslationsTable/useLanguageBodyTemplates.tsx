import React, { useMemo } from 'react';
import { Input } from 'forms/Input/Input';
import { getLanguageFieldName } from '../utils/translation-helpers';

type IsFieldDirtyFn = (id: string, field: string) => boolean;

type CommonOptions = {
  shouldHideRow?: (rowData: any) => boolean;
};

type LanguageTemplatesOptions = CommonOptions & {
  isFieldDirty: IsFieldDirtyFn;
  supportedLanguages: Array<{ isoCode: string }>;
};

export const useLanguageBodyTemplates = (options: LanguageTemplatesOptions) => {
  const { isFieldDirty, supportedLanguages, shouldHideRow } = options;

  return useMemo(() => {
    const templates: Record<string, (rowData: any) => React.ReactNode> = {};

    supportedLanguages.forEach((lang) => {
      const fieldName = getLanguageFieldName(lang.isoCode);
      templates[fieldName] = (rowData: any) => {
        if (shouldHideRow?.(rowData)) return null;

        const value = rowData[fieldName] || '';
        const dirty = isFieldDirty(rowData.id, fieldName);

        return <Input value={value || '-'} className={dirty ? 'field-dirty' : ''} />;
      };
    });

    return templates;
  }, [isFieldDirty, supportedLanguages, shouldHideRow]);
};

