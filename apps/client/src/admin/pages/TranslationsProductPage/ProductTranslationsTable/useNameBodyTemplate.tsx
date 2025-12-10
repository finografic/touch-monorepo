import React, { useMemo } from 'react';
import { Text } from '@radix-ui/themes';

type IsFieldDirtyFn = (id: string, field: string) => boolean;

type CommonOptions = {
  shouldHideRow?: (rowData: any) => boolean;
};

type NameTemplateOptions = CommonOptions & {
  isFieldDirty: IsFieldDirtyFn;
  extractSubtypeName?: boolean;
};

export const useNameBodyTemplate = (options: NameTemplateOptions) => {
  const { isFieldDirty, extractSubtypeName = false, shouldHideRow } = options;

  return useMemo(() => {
    return (rowData: any) => {
      if (shouldHideRow?.(rowData)) return null;

      const isDirty = isFieldDirty(rowData.id, 'name');
      const displayName =
        extractSubtypeName && typeof rowData.name === 'string' && rowData.name.includes('--')
          ? rowData.name.split('--')[1]
          : rowData.name;

      return (
        <Text size="2" weight="bold" className={isDirty ? 'td-name field-dirty' : 'td-name'}>
          {displayName}
        </Text>
      );
    };
  }, [isFieldDirty, extractSubtypeName, shouldHideRow]);
};

