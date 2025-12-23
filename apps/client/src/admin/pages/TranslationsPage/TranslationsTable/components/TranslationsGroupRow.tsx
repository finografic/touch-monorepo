import React from 'react';
import { DividerRowByPage } from './DividerRowByPage';
import { camelCase } from 'utils/string-case.utils';
import type { RegionLocale } from '@workspace/config/i18n.config';
import type { TranslationsFormItem } from '../../translations.types';
import type { I18nTranslationsDomain } from '@workspace/i18n/types';

/**
 * Normalizes a word to plural form.
 * Simple pluralization: adds 's' if not already plural, handles 'y' -> 'ies'.
 */
const toPlural = (word: string): string => {
  if (!word) return word;

  // Already plural (ends with 's' or 'es')
  if (word.endsWith('s') || word.endsWith('es')) {
    return word;
  }

  // Words ending in 'y' -> 'ies' (e.g., category -> categories)
  if (word.endsWith('y')) {
    return word.slice(0, -1) + 'ies';
  }

  // Default: add 's'
  return word + 's';
};

interface TranslationsGroupRowOptions {
  domain: I18nTranslationsDomain;
  group: string;
  items: TranslationsFormItem[];
  fields: TranslationsFormItem[];
  index: number;
  fieldKey: string;
  supportedLanguages: RegionLocale[];
  showKeyColumn: boolean;
  pageGrouping: Map<number, string> | null;
  rows: React.ReactNode[];
}

/**
 * Passive function that pushes a divider row into the rows array when a new page group starts.
 * Centralizes all the logic for determining when to show page dividers.
 * Used within the translations table to visually separate page sections.
 */
export const addTranslationsGroupRow = ({
  domain,
  group,
  items,
  fields,
  index,
  fieldKey,
  supportedLanguages,
  showKeyColumn,
  pageGrouping,
  rows,
}: TranslationsGroupRowOptions): void => {
  const hasGrouping = group === 'pages' && domain;

  if (!hasGrouping || !pageGrouping) {
    return;
  }

  const currentPage = pageGrouping.get(index);
  const previousPage = index > 0 ? pageGrouping.get(index - 1) : null;

  // If this is the first item of a new page group, push a divider row
  if (currentPage && currentPage !== previousPage && currentPage !== '_other') {
    rows.push(
      <DividerRowByPage
        key={`divider-${currentPage}-${fieldKey}`}
        pageName={currentPage}
        domain={domain}
        supportedLanguages={supportedLanguages}
        showKeyColumn={showKeyColumn}
      />,
    );
  }
};

/**
 * Computes the page grouping map from items and fields.
 * Centralizes the logic for extracting page names from translation keys.
 * Converts kebab-case segments to camelCase and ensures deduplication.
 */
export const computePageGrouping = (
  hasGrouping: boolean,
  items: TranslationsFormItem[],
  fields: TranslationsFormItem[],
): Map<number, string> | null => {
  if (!hasGrouping) {
    return null;
  }

  // Map field index to page name (deduplicated)
  const fieldIndexToPage = new Map<number, string>();

  items.forEach((item) => {
    const fieldIndex = fields.findIndex((field) => field.id === item.id || field.key === item.key);
    if (fieldIndex === -1) return;

    // Extract page name from key: "admin.pages.dashboard.title" -> "dashboard"
    // or "admin.pages.container-type.title" -> "containerTypes" (kebab-case to camelCase, normalized to plural)
    const keyParts = item.key.split('.');
    const pagesIndex = keyParts.indexOf('pages');
    if (pagesIndex >= 0 && pagesIndex < keyParts.length - 1) {
      const rawPageName = keyParts[pagesIndex + 1];
      // Convert kebab-case to camelCase (e.g., "container-type" -> "containerType")
      const camelCaseName = camelCase(rawPageName);
      // Normalize to plural form to ensure consistency (e.g., "containerType" -> "containerTypes")
      const pageName = toPlural(camelCaseName);
      // Only set if not already set for this index (deduplication)
      if (!fieldIndexToPage.has(fieldIndex)) {
        fieldIndexToPage.set(fieldIndex, pageName);
      }
    }
  });

  return fieldIndexToPage;
};
