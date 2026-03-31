import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

/** Matches `admin.pages.items.table.headers` in `packages/i18n/translations/admin/*.json` */
const ITEMS_TABLE_HEADER_PREFIX = 'admin.pages.items.table.headers';

/**
 * Translated column titles for the admin items / orders DataTable.
 * Keys under {@link ITEMS_TABLE_HEADER_PREFIX} match accessor ids (e.g. `displayIndex`, `mode`).
 */
export const useTableHeaders = () => {
  const { t } = useTranslation();

  const getHeader = useCallback(
    (field: string): string =>
      t(`${ITEMS_TABLE_HEADER_PREFIX}.${field}`, { defaultValue: field }),
    [t],
  );

  return {
    getHeader,
  };
};
