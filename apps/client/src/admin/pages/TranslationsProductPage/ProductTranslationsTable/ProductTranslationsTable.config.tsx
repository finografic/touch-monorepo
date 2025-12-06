import type { CSSProperties } from 'react';

import type { LanguageInfo } from 'types/models/supported-language.model';
import { getLanguageFieldName } from '../utils/translation-helpers';

export const PAGINATOR_NUM_ENTRIES = 50;

export interface ProductTranslationsTableColumnConfig {
  field: string;
  header: string;
  sortable?: boolean;
  filter?: boolean;
  filterPlaceholder?: string;
  style?: CSSProperties;
  headerStyle?: CSSProperties;
}

// Generate columns dynamically based on supported languages
export const getProductTranslationsTableColumns = (
  supportedLanguages: LanguageInfo[],
): ProductTranslationsTableColumnConfig[] => {
  const columns: ProductTranslationsTableColumnConfig[] = [
    {
      field: 'name',
      header: 'Name (Key)',
      filterPlaceholder: 'Search',
      style: { minWidth: '150px', maxWidth: '200px' },
      headerStyle: { width: '150px' },
    },
  ];

  // Add language columns dynamically
  supportedLanguages.forEach((lang) => {
    const fieldName = getLanguageFieldName(lang.isoCode);
    columns.push({
      field: fieldName,
      header: `${lang.displayName} (${lang.isoCode})`,
      filterPlaceholder: 'Search',
      style: { minWidth: '150px', maxWidth: '200px' },
    });
  });

  // Add actions column
  columns.push({
    field: 'actions',
    header: 'Actions',
    style: { minWidth: '80px', maxWidth: '100px' },
    headerStyle: { width: '80px' },
  });

  return columns;
};

// Default columns for static use (fallback)
export const PRODUCT_TRANSLATIONS_TABLE_COLUMNS: ProductTranslationsTableColumnConfig[] = [
  {
    field: 'name',
    header: 'Name (Key)',
    filterPlaceholder: 'Search',
    style: { minWidth: '150px', maxWidth: '200px' },
    headerStyle: { width: '150px' },
  },
  {
    field: 'name_en_gb',
    header: 'English (en-GB)',
    filterPlaceholder: 'Search',
    style: { minWidth: '150px', maxWidth: '200px' },
  },
  {
    field: 'name_es_es',
    header: 'Spanish (es-ES)',
    filterPlaceholder: 'Search',
    style: { minWidth: '150px', maxWidth: '200px' },
  },
  {
    field: 'name_ca_es',
    header: 'Catalan (ca-ES)',
    filterPlaceholder: 'Search',
    style: { minWidth: '150px', maxWidth: '200px' },
  },
  {
    field: 'actions8',
    header: 'Actions8',
    style: { minWidth: '80px', maxWidth: '100px' },
    headerStyle: { width: '80px' },
  },
];
