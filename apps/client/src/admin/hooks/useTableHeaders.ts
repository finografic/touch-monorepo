import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Hook to get translated table headers
 * Supports es-ES, en-GB, and ca-ES locales
 */
export const useTableHeaders = () => {
  const { t } = useTranslation();

  const headers = useMemo(() => {
    // Map of field names to translation keys
    const headerKeys: Record<string, string> = {
      displayIndex: 'ui.tables.headers.displayIndex',
      index: 'ui.tables.headers.index',
      mode: 'ui.tables.headers.mode',
      drinkType: 'ui.tables.headers.drinkType',
      drinkSubtype: 'ui.tables.headers.drinkSubtype',
      subtype: 'ui.tables.headers.subtype',
      volume: 'ui.tables.headers.volume',
      containerType: 'ui.tables.headers.containerType',
      container: 'ui.tables.headers.container',
      defaultTempConsume: 'ui.tables.headers.temperature',
      temperature: 'ui.tables.headers.temperature',
      actions: 'ui.tables.headers.actions',
      name: 'ui.tables.headers.name',
      'db key': 'ui.tables.headers.dbKey',
      dbKey: 'ui.tables.headers.dbKey',
    };

    // Get translated headers
    const translated: Record<string, string> = {};
    Object.entries(headerKeys).forEach(([field, key]) => {
      const translatedValue = t(key);
      // Only use translation if it exists (not the same as the key)
      translated[field] = translatedValue !== key ? translatedValue : field;
    });

    return translated;
  }, [t]);

  /**
   * Get translated header for a field
   * Falls back to the field name if translation doesn't exist
   */
  const getHeader = (field: string): string => {
    return headers[field] || field;
  };

  return {
    headers,
    getHeader,
  };
};

